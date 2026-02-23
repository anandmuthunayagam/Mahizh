const express = require("express");
const router = express.Router();
const OwnerResident = require("../models/OwnerResident");
const auth = require("../middleware/auth");
const Collection = require("../models/Collection");



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
router.get("/", auth(), async (req, res) => {
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

// ADMIN-ONLY (optional but recommended)
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

/* ===============================
   GET ALL HOMES (Formatted)
================================ */
router.get("/homes", auth(), adminOnly, async (req, res) => {
  try {
    const data = await OwnerResident.find({}).lean();

    const homes = data.map(item => ({
      homeNo: item.homeNo,
      ownerName: item.owner?.name || "",
      ownerPhone: item.owner?.phone || "",
      residentName: item.resident?.name || "",
      residentPhone: item.resident?.phone || "",
    }));

    res.json(homes);
    
    
  } catch (err) {
    console.error("Fetch homes error:", err);
    res.status(500).json({ message: "Failed to fetch homes" });
  }
      
  
});

router.get("/home-status", auth(), async (req, res) => {
  try {
    const { month, year } = req.query;
    const homes = await OwnerResident.find({}).lean();
    const collections = await Collection.find({ month, year: Number(year) }).lean();

    const result = homes.map((home) => {
      // Find the specific collection record for this month/year
      const paymentRecord = collections.find((c) => c.homeNo === home.homeNo);

      return {
        homeNo: home.homeNo,
        // IF PAID: Use the names frozen in time
        // IF PENDING: Use current names from OwnerResident
        owner: paymentRecord ? { 
          name: paymentRecord.ownerName, 
          phone: paymentRecord.ownerPhone 
        } : home.owner,
        resident: paymentRecord ? { 
          name: paymentRecord.residentName, 
          phone: paymentRecord.residentPhone 
        } : home.resident,
        status: paymentRecord ? "PAID" : "PENDING",
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch home status" });
  }
});

router.post("/:id", auth(), async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    await OwnerResident.findByIdAndUpdate(req.params.id, req.body, { new: true });  
    res.json({ message: "Owner & Resident updated" });
  } catch (err) {
    console.error("Update owner/resident error:", err);
    res.status(500).json({ message: "Failed to update owner & resident" });
  }   
}); 
module.exports = router;
