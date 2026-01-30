const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const auth = require("../middleware/auth");
const {
  addExpense,
  getExpenses
} = require("../controllers/expenseControllers.js");


/**
 * GET all expenses
 */
router.get("/", auth(), async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    return res.status(200).json(expenses);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch expenses",
    });
  }
});

/**
 * POST create expense (ADMIN)
 */
router.post("/", auth(["admin"]), async (req, res) => {
  try {
    const { title, amount, date } = req.body;

    if (!title || !amount || !date) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const expense = new Expense({
      title,
      amount,
      date,
    });

    await expense.save();

    // ✅ CRITICAL FIX
    return res.status(201).json({
      success: true,
      message: "Expense added successfully",
      data: expense,
    });
  } catch (err) {
    console.error("Expense POST error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to add expense",
    });
  }
});

//Protect APIs
router.post("/", auth(["admin"]), addExpense);
router.get("/", auth(["admin", "user"]), getExpenses);

module.exports = router;
