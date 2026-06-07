require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/vehicles", require("./routes/vehicles"));
app.use("/api/maintenance", require("./routes/issues"));

// Health Route
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// TEST DATABASE INSERT ROUTE
const Vehicle = require("./models/Vehicle");

app.get("/test", async (req, res) => {
  try {
   const newVehicle = new Vehicle({
  vehicleId: "VH001",
  vehicleName: "Army Truck",
  vehicleNumber: "DEF123",
  vehicleClass: "A",
  status: "A",
});

    await newVehicle.save();

    res.send("Vehicle Saved Successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error Saving Vehicle");
  }
});

// 404 Handler
app.use((_req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

// Error Handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    error: err.message || "Server error",
  });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});