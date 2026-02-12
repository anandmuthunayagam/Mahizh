const express = require("express");
const router = express.Router();
const Collection = require("../models/Collection");
const auth = require("../middleware/auth");

router.get("/", auth(), async (req, res) => {
  try {
    const { month, year, startDate, endDate } = req.query;
    let query = {};

    if (month) query.month = month;
    if (year) query.year = Number(year);

    // Backward compatibility for date range
    if (startDate && endDate && !month) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const collections = await Collection.find(query).sort({ createdAt: -1 });
    return res.status(200).json(collections);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Fetch failed" });
  }
});

router.post("/", auth(["admin"]), async (req, res) => {
  try {
    const { homeNo, amount, month, year } = req.body;
    if (!homeNo || !amount || !month || !year) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }
    // FIXED: Changed homeNumber to homeNo to match your updated model
    const collection = new Collection({ homeNo, amount, month, year });
    await collection.save();
    return res.status(201).json({ success: true, data: collection });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to add" });
  }
});

/**
 * PUT update expense (Includes month/year update support)
 */
router.put("/:id", auth(["admin"]), async (req, res) => {
  try {
    const { homeNo, amount, month, year } = req.body;
    const updatedCollection = await Collection.findByIdAndUpdate(
      req.params.id,
      {homeNo, amount, month, year },
      { new: true }
    );
    res.status(200).json({ success: true, data: updatedCollection });
  } catch (err) {
    res.status(500).json({ success: false, message: "Update failed" });
  }
});

router.delete("/:id", auth(["admin"]), async (req, res) => {
  try {
    await Collection.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Delete failed" });
  } });
  
module.exports = router;