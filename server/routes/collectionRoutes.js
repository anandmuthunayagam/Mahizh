const express = require("express");
const router = express.Router();
const Collection = require("../models/Collection");
const auth = require("../middleware/auth");
const OwnerResident = require("../models/OwnerResident");

router.get("/", auth(), async (req, res) => {
  try {
    const { month, year, startDate, endDate } = req.query;
    let query = {};

    if (month && month !== "All") query.month = month;
    if (year && year !== "All") query.year = Number(year);

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
    
    // 1. Find the LIVE details for this home right now
    const currentInfo = await OwnerResident.findOne({ homeNo });
    if (!currentInfo) {
      return res.status(404).json({ success: false, message: "Home details not found" });
    }

    // 2. Save payment with the SNAPSHOT of current names
    const collection = new Collection({ 
      homeNo, 
      amount, 
      month, 
      year,
      residentName: currentInfo.resident.name,
      residentPhone: currentInfo.resident.phone,
      ownerName: currentInfo.owner.name,
      ownerPhone: currentInfo.owner.phone
    });

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