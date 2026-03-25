const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  vehicleId: String,
  description: String,
  requiredParts: String,

  approvalByJEE: {
    type: String,
    default: "pending"
  },

  approvalByOIC: {
    type: String,
    default: "pending"
  },

  supplierStatus: {
    type: String,
    default: "pending"
  }
});

module.exports = mongoose.model("Issue", issueSchema);
