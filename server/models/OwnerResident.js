const mongoose = require("mongoose");

const ownerResidentSchema = new mongoose.Schema(
  {
    homeNo: {
      type: String,
      enum: ["G1", "F1", "F2", "S1", "S2"],
      required: true,
      unique: true,
    },

    owner: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
    },

    resident: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OwnerResident", ownerResidentSchema);
