const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const Collection = require("../models/Collection");
const Expense = require("../models/Expense");
const OwnerResident = require("../models/OwnerResident");

router.get("/monthly-summary", auth(), async (req, res) => {
  try {
    const { month, year } = req.query;

    // 1️⃣ Total Collection
    const collections = await Collection.find({ month, year });
    const totalCollection = collections.reduce(
      (sum, c) => sum + Number(c.amount),
      0
    );

    // 2️⃣ Total Expense (filter by month/year from date)
    const expenses = await Expense.find();
    const filteredExpenses = expenses.filter(e => {
      const d = new Date(e.date);
      return (
        d.toLocaleString("default", { month: "long" }) === month &&
        d.getFullYear() === Number(year)
      );
    });

    const totalExpense = filteredExpenses.reduce(
      (sum, e) => sum + Number(e.amount),
      0
    );

    // 3️⃣ Paid & Pending Homes
    const allHomes = await OwnerResident.find();
    const paidHomes = collections.map(c => c.homeNumber);

    const paid = [];
    const pending = [];

    allHomes.forEach(h => {
      if (paidHomes.includes(h.homeNo)) {
        paid.push(h);
      } else {
        pending.push(h);
      }
    });

    res.json({
      month,
      year,
      totalCollection,
      totalExpense,
      balance: totalCollection - totalExpense,
      paidHomes: paid,
      pendingHomes: pending,
      collections
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Monthly summary failed" });
  }
});

module.exports = router;
