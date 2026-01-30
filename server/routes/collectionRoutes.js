const express = require("express");
const router = express.Router();
const Collection = require("../models/Collection");
const auth = require("../middleware/auth");

/**
 * GET all collections
 */
router.get("/", auth(), async (req, res) => {
  try {
    const collections = await Collection.find().sort({ createdAt: -1 });
    return res.status(200).json(collections);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch collections",
    });
  }
});

/**
 * POST create collection (ADMIN)
 */
router.post("/", auth(["admin"]), async (req, res) => {
  try {
    const { homeNumber, amount, month, year } = req.body;

    if (!homeNumber || !amount || !month || !year) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const collection = new Collection({
      homeNumber,
      amount,
      month,
      year,
    });

    await collection.save();

    // ✅ VERY IMPORTANT: RETURN JSON
    return res.status(201).json({
      success: true,
      message: "Collection added successfully",
      data: collection,
    });
  } catch (err) {
    console.error("Collection POST error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to add collection",
    });
  }
});

module.exports = router;
