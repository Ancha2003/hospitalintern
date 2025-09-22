const express = require("express"); 
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Appointment = require("../models/Appointment"); // make sure this model exists
const { auth, requireRole } = require("../middlewares/auth");

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads/patients";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Register Patient
router.post(
  "/",
  upload.single("avatar"),
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password, phone, age, gender } = req.body;
    const avatar = req.file ? `/uploads/patients/${req.file.filename}` : undefined;

    try {
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ error: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        name,
        email,
        password: hashedPassword,
        role: "patient",
        phone,
        age,
        gender,
        avatar,
      });

      await user.save();

      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.json({ token, user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Patient Login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user || user.role !== "patient")
        return res.status(404).json({ error: "Patient not found" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.json({ token, user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// GET current patient
router.get("/me", auth, requireRole("patient"), async (req, res) => {
  try {
    const patient = await User.findById(req.user._id).select("-password");
    if (!patient) return res.status(404).json({ error: "Patient not found" });
    res.json(patient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update patient profile
router.put("/:id", auth, requireRole("patient"), upload.single("avatar"), async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id)
      return res.status(403).json({ error: "Unauthorized" });

    const patient = await User.findById(req.params.id);
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    const { name, phone, age, gender, problem } = req.body;
    if (name) patient.name = name;
    if (phone) patient.phone = phone;
    if (age) patient.age = age;
    if (gender) patient.gender = gender;
    if (problem) patient.problem = problem;
    if (req.file) patient.avatar = `/uploads/patients/${req.file.filename}`;

    await patient.save();
    res.json(patient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /send - send details to doctor
router.post("/send", auth, requireRole("patient"), async (req, res) => {
  try {
    const { doctorId, problem } = req.body;
    if (!doctorId || !problem)
      return res.status(400).json({ error: "Doctor and problem are required" });

    // Create a new appointment
    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      datetime: new Date(),
      status: "pending",
      reason: problem,
    });

    res.status(200).json({ message: "✅ Details sent to doctor", appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
