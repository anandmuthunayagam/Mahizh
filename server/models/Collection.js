// models/Collection.js
const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
  {
    homeNo: { type: String, required: true },
    amount: { type: Number, required: true },
    month: String,
    year: Number,
    
    // NEW FIELD: Categorizes the type of payment
    category: { 
      type: String, 
      required: true, 
      enum: ["Maintenance", "Water", "Corpus Fund","Others"],
      default: "Maintenance" 
    },

    // SNAPSHOT FIELDS
    residentName: String, 
    residentPhone: String,
    ownerName: String,
    ownerPhone: String,

    status: { type: String, default: "PAID" }
  },
  { timestamps: true }
);

// UPDATE INDEX: To allow a home to have different categories in the same month
// (e.g., paying both Maintenance AND Owners Fund in January)
collectionSchema.index({ homeNo: 1, month: 1, year: 1, category: 1 }, { unique: true });

module.exports = mongoose.model("Collection", collectionSchema);