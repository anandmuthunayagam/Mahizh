// models/Collection.js
const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
  {
    homeNo: { type: String, required: true },
    amount: Number,
    month: String,
    year: Number,
    
    // SNAPSHOT FIELDS: These store the names as they were THIS month
    // Even if you delete the User, these strings remain in the history
    residentName: String, 
    residentPhone: String,
    ownerName: String,
    ownerPhone: String,

    status: { type: String, default: "PAID" }
  },
  { timestamps: true }
);

// Prevent duplicate records for the same home/month/year
collectionSchema.index({ homeNo: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model("Collection", collectionSchema);