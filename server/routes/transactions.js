const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction');

// GET /api/transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 }).populate('customer_id');
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/transactions
router.post('/', async (req, res) => {
  try {
    const { customer_id, date, description, credit, debit } = req.body;
    const tx = new Transaction({ customer_id, date, description, credit, debit });
    await tx.save();
    res.status(201).json(tx);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
