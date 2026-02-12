const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const auth = require("../middleware/auth");

router.get("/", auth(), async (req, res) => {
  try {
    const { month, year, startDate, endDate } = req.query;
    let query = {};

    if (month) query.month = month;
    if (year) query.year = Number(year);

    if (startDate && endDate && !month) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const expenses = await Expense.find(query).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
});

router.post("/", auth(["admin"]), async (req, res) => {
  try {
    const { title, amount, date, month, year } = req.body;
    if (!title || !amount || !date || !month || !year) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }
    const expense = new Expense({ title, amount, date, month, year });
    await expense.save();
    return res.status(201).json({ success: true, data: expense });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Add failed" });
  }
});


/**
 * PUT update expense (Includes month/year update support)
 */
router.put("/:id", auth(["admin"]), async (req, res) => {
  try {
    const { title, amount, date, month, year } = req.body;
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      { title, amount, date, month, year },
      { new: true }
    );
    res.status(200).json({ success: true, data: updatedExpense });
  } catch (err) {
    res.status(500).json({ success: false, message: "Update failed" });
  }
});

router.delete("/:id", auth(["admin"]), async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
});


module.exports = router;