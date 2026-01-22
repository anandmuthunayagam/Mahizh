const express = require("express");
const router = express.Router();
const Collection = require("../models/Collection");

// Add collection
router.post("/", async (req, res) => {
  try {
    const { homeNumber, amount, month, year } = req.body;

    const newCollection = new Collection({
      homeNumber,
      amount,
      month,
      year
    });

    await newCollection.save();
    res.status(201).json(newCollection);
  } catch (error) {
  if (error.code === 11000) {
    return res.status(400).json({
      message: "Collection already exists for this home, month, and year"
    });
  }
  res.status(500).json({ message: error.message });
}
});

// Get all collections
router.get("/", async (req, res) => {
  try {
    const collections = await Collection.find().sort({ createdAt: -1 });
    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
