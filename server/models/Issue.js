const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    currentState: {
      type: String,
      default: "",
    },
    requiredParts: {
      type: [String],
      default: [],
    },
    estimatedBill: {
      type: Number,
      default: 0,
    },

    approvalByJEE: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    approvalByOIC: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    supplierStatus: {
      type: String,
      enum: ["pending", "supplied", "not available"],
      default: "pending",
    },

    jeeComment: {
      type: String,
      default: "",
    },

    oicComment: {
      type: String,
      default: "",
    },

    supplierComment: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Issue", issueSchema);