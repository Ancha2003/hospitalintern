const express = require("express");
const User = require("../models/User");
const { auth, requireRole } = require("../middlewares/auth");

const router = express.Router();

// GET /api/doctors - list all doctors
router.get("/", auth, requireRole("patient"), async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("-password");
    res.json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
