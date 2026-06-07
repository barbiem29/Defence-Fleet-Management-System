const express = require("express");
const router = express.Router();
const Issue = require("../models/Issue");

// CREATE ISSUE - public for testing
router.post("/", async (req, res) => {
  try {
    const {
      vehicleId,
      description,
      currentState,
      requiredParts,
      estimatedBill,
    } = req.body;

    const issue = await Issue.create({
      vehicleId,
      description,
      currentState,
      requiredParts,
      estimatedBill,
    });

    res.status(201).json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to create issue" });
  }
});

// GET COUNTS - keep above /:id
router.get("/dashboard/counts", async (req, res) => {
  try {
    const total = await Issue.countDocuments();
    const pending = await Issue.countDocuments({ approvalByJEE: "pending" });
    const approved = await Issue.countDocuments({ approvalByJEE: "approved" });
    const rejected = await Issue.countDocuments({ approvalByJEE: "rejected" });

    res.json({
      total,
      pending,
      approved,
      rejected,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to fetch counts" });
  }
});

// GET ALL ISSUES
router.get("/", async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to fetch issues" });
  }
});

// GET MY REQUESTS
router.get("/my-requests", async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to fetch my requests" });
  }
});

// JEE PENDING
router.get("/jr-executive/pending", async (req, res) => {
  try {
    const issues = await Issue.find({ approvalByJEE: "pending" }).sort({
      createdAt: -1,
    });
    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to fetch pending issues" });
  }
});

// JEE APPROVE
router.put("/:id/jr-executive/approve", async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      {
        approvalByJEE: "approved",
        jeeComment: req.body.comment || "",
      },
      { new: true }
    );

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to approve issue" });
  }
});

// JEE REJECT
router.put("/:id/jr-executive/reject", async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      {
        approvalByJEE: "rejected",
        jeeComment: req.body.comment || "",
      },
      { new: true }
    );

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to reject issue" });
  }
});

// OIC PENDING
router.get("/oic/pending", async (req, res) => {
  try {
    const issues = await Issue.find({
      approvalByJEE: "approved",
      approvalByOIC: "pending",
    }).sort({ createdAt: -1 });

    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to fetch OIC pending issues" });
  }
});

// OIC APPROVE
router.put("/:id/oic/approve", async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      {
        approvalByOIC: "approved",
        oicComment: req.body.comment || "",
      },
      { new: true }
    );

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to approve issue by OIC" });
  }
});

// OIC REJECT
router.put("/:id/oic/reject", async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      {
        approvalByOIC: "rejected",
        oicComment: req.body.comment || "",
      },
      { new: true }
    );

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to reject issue by OIC" });
  }
});

// SUPPLIER APPROVED LIST
router.get("/supplier/approved", async (req, res) => {
  try {
    const issues = await Issue.find({
      approvalByJEE: "approved",
      approvalByOIC: "approved",
    }).sort({ createdAt: -1 });

    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to fetch supplier issues" });
  }
});

// SUPPLIER UPDATE
router.put("/:id/supplier/update", async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      {
        supplierStatus: req.body.status || "supplied",
        supplierComment: req.body.comment || "",
      },
      { new: true }
    );

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to update supplier status" });
  }
});

// GET SINGLE ISSUE - keep last
router.get("/:id", async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to fetch issue" });
  }
});

module.exports = router;