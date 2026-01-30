// models/Collection.js
const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
  {
    homeNumber: String,
    amount: Number,
    month: String,
    year: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Collection", collectionSchema);
