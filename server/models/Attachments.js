const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema({
  expenseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Expense", 
    required: true 
  },
  fileData: { type: Buffer, required: true },
  fileName: String,
  contentType: String,
}, { timestamps: true });

module.exports = mongoose.model("Attachments", attachmentSchema);