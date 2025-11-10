const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  date: { type: Date, default: Date.now },
  description: { type: String, required: true },
  credit: { type: Number, default: 0 },
  debit: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
