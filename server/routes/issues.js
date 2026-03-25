const express = require("express");
const router = express.Router();
const Issue = require("../models/Issue");

// create issue
router.post("/", async (req, res) => {
  try {
    const issue = await Issue.create(req.body);
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// get all issues
router.get("/", async (req, res) => {
  try {
    const issues = await Issue.find();
    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// get my requests
router.get("/my-requests", async (req, res) => {
  try {
    const issues = await Issue.find();
    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Jr Executive
router.get("/jr-executive/pending", async (req, res) => {
  try {
    const issues = await Issue.find({ approvalByJEE: "pending" });
    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id/jr-executive/approve", async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { approvalByJEE: "approved" },
      { new: true }
    );
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id/jr-executive/reject", async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { approvalByJEE: "rejected" },
      { new: true }
    );
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// OIC
router.get("/oic/pending", async (req, res) => {
  try {
    const issues = await Issue.find({ approvalByOIC: "pending" });
    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id/oic/approve", async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { approvalByOIC: "approved" },
      { new: true }
    );
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id/oic/reject", async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { approvalByOIC: "rejected" },
      { new: true }
    );
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Supplier
router.get("/supplier/approved", async (req, res) => {
  try {
    const issues = await Issue.find({ approvalByOIC: "approved" });
    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id/supplier/update", async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { supplierStatus: req.body.status || req.body.supplierStatus || "supplied" },
      { new: true }
    );
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// counts and filter
router.get("/dashboard/counts", async (req, res) => {
  try {
    const total = await Issue.countDocuments();
    const pending = await Issue.countDocuments({ approvalByJEE: "pending" });
    const approved = await Issue.countDocuments({ approvalByOIC: "approved" });
    const supplied = await Issue.countDocuments({ supplierStatus: "supplied" });
    res.json({ total, pending, approved, supplied });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/vehicle/:vehicleId", async (req, res) => {
  try {
    const issues = await Issue.find({ vehicleId: req.params.vehicleId });
    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// compatibility endpoints
router.put("/jee/:id", async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { approvalByJEE: req.body.status },
      { new: true }
    );
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/oic/:id", async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { approvalByOIC: req.body.status },
      { new: true }
    );
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/supplier/:id", async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { supplierStatus: req.body.supplierStatus },
      { new: true }
    );
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// param route last
router.get("/:id", async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
