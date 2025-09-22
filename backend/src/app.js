const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRouter = require('./routes/auth');
const appointmentsRouter = require("./routes/appointments");
const prescriptionsRouter = require("./routes/prescriptions");
const patientsRouter = require("./routes/patients");
const doctorsRouter = require("./routes/doctors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRouter);
app.use("/api/appointments", appointmentsRouter);
app.use("/api/prescriptions", prescriptionsRouter);
app.use("/api/patients", patientsRouter);
app.use("/api/doctors", doctorsRouter);


app.get("/", (req, res) => {
  res.send("Hospital API is running");
});

app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

module.exports = app;