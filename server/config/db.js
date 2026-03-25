const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/defenceDB");

    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.log("❌ DB Error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
