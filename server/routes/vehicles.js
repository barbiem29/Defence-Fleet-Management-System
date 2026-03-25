const express = require("express");
const router = express.Router();
const Vehicle = require("../models/Vehicle");
const protect = require("../middleware/protect");

// All vehicle routes require login
router.use(protect);

// ─── Add Vehicle ────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const { vehicleId, description, status } = req.body;

    if (!vehicleId) {
      return res.status(400).json({ error: "Vehicle ID is required" });
    }

    const existingVehicle = await Vehicle.findOne({ vehicleId });
    if (existingVehicle) {
      return res.status(409).json({ error: "Vehicle ID already exists" });
    }

    const vehicle = await Vehicle.create({
      vehicleId,
      description,
      status,
      createdBy: req.user.id,
    });

    res.status(201).json(vehicle);
  } catch (err) {
    res.status(400).json({ error: err.message || "Failed to create vehicle" });
  }
});

// ─── Get All Vehicles ───────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate("createdBy", "name email role");
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to fetch vehicles" });
  }
});

// ─── Delete Vehicle ─────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    res.json({ message: "Vehicle deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to delete vehicle" });
  }
});

module.exports = router;