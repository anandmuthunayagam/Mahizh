const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
  {
    homeNumber: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    month: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

// 🚫 Prevent duplicate entries
collectionSchema.index(
  { homeNumber: 1, month: 1, year: 1 },
  { unique: true }
);

module.exports = mongoose.model("Collection", collectionSchema);
