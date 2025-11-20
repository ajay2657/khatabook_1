const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const customersRouter = require('./routes/customers');
const transactionsRouter = require('./routes/transactions');
const authRouter = require('./routes/auth');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

// Database Connection Logic
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('MONGODB_URI not set in environment.');
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    isConnected = true;
    console.log('Connected to MongoDB Atlas');

    // Seed Admin User (Only runs once per connection, which is fine for serverless cold starts)
    await seedAdmin();
  } catch (err) {
    console.error('Failed to connect to MongoDB Atlas:', err.message);
  }
};

const seedAdmin = async () => {
  try {
    // 1. Delete old default admin if exists
    await User.deleteOne({ username: 'admin' });

    // 2. Create new admin if not exists
    const adminExists = await User.findOne({ username: 'nikhil7058' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('Nikhil@3730', 10);
      const adminUser = new User({
        username: 'nikhil7058',
        password: hashedPassword,
      });
      await adminUser.save();
      console.log('Admin user created: nikhil7058');
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
};

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Routes
app.use('/api/customers', customersRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/auth', authRouter);

// Root route for health check
app.get('/', (req, res) => {
  res.send('Ravi Udhary API is running');
});

// Only listen if running locally (not in Vercel)
if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  });
}

module.exports = app;
