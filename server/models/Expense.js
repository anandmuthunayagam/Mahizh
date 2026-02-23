const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    // New fields for easier filtering
    month: {
      type: String, // e.g., "January"
      required: true
    },
    year: {
      type: Number, // e.g., 2025
      required: true
    },
    hasAttachment: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Optional: Add an index to make filtering by month/year faster
expenseSchema.index({ year: -1, month: 1 });

module.exports = mongoose.model("Expense", expenseSchema);