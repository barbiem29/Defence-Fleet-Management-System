const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["A", "B", "C", "D"], // your original logic preserved
      default: "A",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // link with User model
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);