const express = require('express');
const mongoose = require('mongoose');
const Prescription = require('../models/Prescription');
const { auth, requireRole } = require('../middlewares/auth');

const router = express.Router();

// Get prescription by appointment ID
router.get('/appointment/:id', auth, async (req, res) => {
  try {
    const prescription = await Prescription.findOne({ appointment: req.params.id })
      .populate('doctor', 'name email')
      .populate('patient', 'name email avatar age gender problem');

    if (!prescription)
      return res.status(404).json({ error: 'Prescription not found for this appointment' });

    res.json(prescription);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create prescription
router.post('/', auth, requireRole('doctor'), async (req, res) => {
  try {
    const { appointment, patient, symptoms, diagnosis, medicines, notes } = req.body;
    const pres = new Prescription({
      appointment,
      doctor: req.user._id,
      patient,
      symptoms,
      diagnosis,
      medicines,
      notes,
    });
    await pres.save();
    res.json(pres);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update prescription (PUT)
router.put('/appointment/:id', auth, requireRole('doctor'), async (req, res) => {
  try {
    const pres = await Prescription.findOne({ appointment: req.params.id });
    if (!pres) return res.status(404).json({ error: 'Prescription not found' });
    if (!pres.doctor.equals(req.user._id)) return res.status(403).json({ error: 'Forbidden' });

    const { symptoms, diagnosis, medicines, notes } = req.body;
    if (symptoms !== undefined) pres.symptoms = symptoms;
    if (diagnosis !== undefined) pres.diagnosis = diagnosis;
    if (medicines !== undefined) pres.medicines = medicines;
    if (notes !== undefined) pres.notes = notes;

    await pres.save();
    res.json(pres);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update prescription (PATCH) → For frontend compatibility
router.patch('/appointment/:id', auth, requireRole('doctor'), async (req, res) => {
  try {
    const pres = await Prescription.findOne({ appointment: req.params.id });
    if (!pres) return res.status(404).json({ error: 'Prescription not found' });
    if (!pres.doctor.equals(req.user._id)) return res.status(403).json({ error: 'Forbidden' });

    const { symptoms, diagnosis, medicines, notes } = req.body;
    if (symptoms !== undefined) pres.symptoms = symptoms;
    if (diagnosis !== undefined) pres.diagnosis = diagnosis;
    if (medicines !== undefined) pres.medicines = medicines;
    if (notes !== undefined) pres.notes = notes;

    await pres.save();
    res.json(pres);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
