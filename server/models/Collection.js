// models/Collection.js
const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
  {
    homeNo: String, // Changed from homeNumber
    amount: Number,
    month: String,
    year: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Collection", collectionSchema);