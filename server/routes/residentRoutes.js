const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const Collection = require("../models/Collection");
const Expense = require("../models/Expense");
const OwnerResident = require("../models/OwnerResident");

/* ===============================
   ROLE GUARD
================================ */
const residentOnly = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

/* ===============================
   1. RESIDENT PROFILE
================================ */
router.get("/profile", auth(), residentOnly, async (req, res) => {
  try {
    const record = await OwnerResident.findOne({
      homeNo: req.user.homeNo,
    });

    if (!record) {
      return res.json({ homeNo: req.user.homeNo });
    }

    res.json(record);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

/* ===============================
   2. PAYMENT HISTORY
================================ */
router.get("/payments", auth(), residentOnly, async (req, res) => {
    
  try {
    const payments = await Collection.find({
      homeNo: req.user.homeNo,
    }).sort({ year: -1, month: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch payments" });
  }
});

/* ===============================
   3. CURRENT MONTH STATUS
================================ */
router.get("/current-status", auth(), residentOnly, async (req, res) => {
  const date = new Date(); // Today's date
  date.setMonth(date.getMonth() - 1); // Subtract 1 month
  const month = date.toLocaleString("default", { month: "long" });
  const year = new Date().getFullYear();

  try {
    const paid = await Collection.findOne({
      homeNo: req.user.homeNo,
      month,
      year,
    });

    res.json({
      homeNo: req.user.homeNo,
      month,
      year,
      status: paid ? "PAID" : "PENDING",
      amount: paid?.amount || 0,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch status" });
  }
});

/* ===============================
   4. EXPENSE SUMMARY (READ ONLY)
================================ */
router.get("/expenses", auth(), residentOnly, async (req, res) => {
  const { month, year } = req.query;

  try {
    const expenses = await Expense.find({ month, year });
    const total = expenses.reduce((s, e) => s + e.amount, 0);

    res.json({ total, expenses });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
});

module.exports = router;
