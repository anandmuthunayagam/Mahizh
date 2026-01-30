const express = require("express");
const router = express.Router();
const Collection = require("../models/Collection");
const Expense = require("../models/Expense");
const auth = require("../middleware/auth");

// helper: month number → month name
const monthMap = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};

// GET dashboard summary
router.get("/", auth(), async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: "Month and Year required" });
    }

    const monthName = monthMap[Number(month)];

    if (!monthName) {
      return res.status(400).json({ message: "Invalid month" });
    }

    // COLLECTION TOTAL
    const totalCollection = await Collection.aggregate([
      {
        $match: {
          month: monthName,
          year: Number(year),
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    // EXPENSE TOTAL
    const totalExpense = await Expense.aggregate([
  {
    $match: {
      $expr: {
        $and: [
          { $eq: [{ $year: "$date" }, Number(year)] },
          { $eq: [{ $month: "$date" }, Number(month)] },
        ],
      },
    },
  },
  {
    $group: {
      _id: null,
      total: { $sum: "$amount" },
    },
  },
]);

    const collectionTotal = totalCollection[0]?.total || 0;
    const expenseTotal = totalExpense[0]?.total || 0;

    res.json({
      totalCollection: collectionTotal,
      totalExpense: expenseTotal,
      balance: collectionTotal - expenseTotal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Dashboard error" });
  }
});

// Static home-owner mapping (can be DB later)
const homes = [
  { homeNumber: "G1", ownerName: "Ramesh", ownerPhone: "9876543210" },
  { homeNumber: "F1", ownerName: "Suresh", ownerPhone: "9845011223" },
  { homeNumber: "F2", ownerName: "Anitha", ownerPhone: "9900177889" },
  { homeNumber: "S1", ownerName: "Prakash", ownerPhone: "9988766554" },
  { homeNumber: "S2", ownerName: "Lakshmi", ownerPhone: "9734522110" },
];

router.get("/home-status", auth(), async (req, res) => {
  try {
    const { month, year } = req.query;

    const collections = await Collection.find({ month, year });

    const result = homes.map((home) => {
      const paid = collections.some(
        (c) => c.homeNumber === home.homeNumber
      );

      return {
        ...home,
        status: paid ? "PAID" : "PENDING",
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unable to load home status" });
  }
});

module.exports = router;


