const express = require("express");
const router = express.Router();
const OwnerResident = require("../models/OwnerResident");
const auth = require("../middleware/auth");

router.post("/", (req, res, next) => {
  console.log("Owner-resident route HIT");
  next();
});

// ✅ Create or Update owner/resident (Admin only)
router.post("/", auth(), async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { homeNo, owner, resident } = req.body;

    const record = await OwnerResident.findOneAndUpdate(
      { homeNo },
      { owner, resident },
      { upsert: true, new: true }
    );

    res.json({
      message: "Owner & Resident saved successfully",
      record,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get all (Admin only)
router.get("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const data = await OwnerResident.find().sort({ homeNo: 1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
