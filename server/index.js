const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const customersRouter = require('./routes/customers');
const transactionsRouter = require('./routes/transactions');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/customers', customersRouter);
app.use('/api/transactions', transactionsRouter);

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('MONGODB_URI not set in environment. Please add it to .env');
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB Atlas:', err.message);
    process.exit(1);
  });

module.exports = app;
