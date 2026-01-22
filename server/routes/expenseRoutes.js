const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");


// Add expense
router.post("/", async (req, res) => {
  try {
    const { title, amount, date } = req.body;

    const newExpense = new Expense({
      title,
      amount,
      date
    });

    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all expenses
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
