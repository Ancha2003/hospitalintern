const express = require('express');
const { body, validationResult } = require('express-validator');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const { auth, requireRole } = require('../middlewares/auth');

const router = express.Router();

// Create appointment (patient)
router.post(
  '/',
  auth,
  requireRole('patient'),
  [
    body('doctor').notEmpty(),
    body('datetime').notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { doctor, datetime, reason } = req.body;
      const appt = new Appointment({
        patient: req.user._id,
        doctor,
        datetime: new Date(datetime),
        reason,
        status: "pending"
      });
      await appt.save();
      res.json(appt);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Get appointments (patient or doctor)
router.get('/', auth, async (req, res) => {
  try {
    const query = req.user.role === 'doctor' ? { doctor: req.user._id } : { patient: req.user._id };

    const appts = await Appointment.find(query)
      .populate('patient', 'name email avatar phone age gender problem')
      .populate('doctor', 'name email')
      .sort({ datetime: -1 });

    res.json(appts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update appointment status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ error: 'Appointment not found' });

    if (req.user.role === 'doctor' && !appt.doctor.equals(req.user._id))
      return res.status(403).json({ error: 'Forbidden' });
    if (req.user.role === 'patient' && !appt.patient.equals(req.user._id))
      return res.status(403).json({ error: 'Forbidden' });

    appt.status = req.body.status;
    await appt.save();

    // Create prescription automatically when completed
    if (req.body.status === 'completed') {
      const existing = await Prescription.findOne({ appointment: appt._id });
      if (!existing) {
        const pres = new Prescription({
          appointment: appt._id,
          doctor: appt.doctor,
          patient: appt.patient,
          symptoms: "",
          diagnosis: "",
          medicines: [],
          notes: ""
        });
        await pres.save();
      }
    }

    res.json(appt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
