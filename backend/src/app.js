const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const authRouter = require('./routes/auth');
const appointmentsRouter = require("./routes/appointments");
const prescriptionsRouter = require("./routes/prescriptions");
const patientsRouter = require("./routes/patients");
const doctorsRouter = require("./routes/doctors");

const app = express();

// CORS
app.use(cors({
  origin: "https://hospitalintern-frontend.onrender.com",
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Prevent caching
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Serve uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', authRouter);
app.use("/api/appointments", appointmentsRouter);
app.use("/api/prescriptions", prescriptionsRouter);
app.use("/api/patients", patientsRouter);
app.use("/api/doctors", doctorsRouter);

// Serve React frontend
app.use(express.static(path.join(__dirname, '../dist')));
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
  }
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

module.exports = app;
