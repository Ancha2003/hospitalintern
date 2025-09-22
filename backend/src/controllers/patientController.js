const Patient = require("../models/Patient");

const createPatient = async (req, res) => {
  try {
    const newPatient = await Patient.create(req.body);
    res.status(201).json(newPatient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create patient" });
  }
};

module.exports = { createPatient };
