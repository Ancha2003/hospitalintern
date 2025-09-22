require('dotenv').config();
const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const connectDB = require('../config/db');

const seed = async () => {
  try {
    await connectDB();
    console.log('MongoDB connected');

    // Fetch existing doctors and patient
    const doctors = await User.find({ role: 'doctor' });
    const patient = await User.findOne({ role: 'patient' });

    if (!doctors.length || !patient) {
      console.log('⚠ Need at least 1 doctor and 1 patient in DB');
      process.exit(1);
    }

    // Optional: clear old appointments
    await Appointment.deleteMany({});
    console.log('Cleared old appointments');

    const appointmentsSeed = [
      {
        patient: patient._id,
        doctor: doctors[0]._id,
        datetime: new Date(Date.now() + 3600 * 1000), // 1 hour from now
        status: 'pending',
        reason: 'Regular checkup'
      },
      {
        patient: patient._id,
        doctor: doctors[1]._id,
        datetime: new Date(Date.now() + 24 * 3600 * 1000), // tomorrow
        status: 'confirmed',
        reason: 'Fever and cold'
      },
      {
        patient: patient._id,
        doctor: doctors[2]._id,
        datetime: new Date(Date.now() - 2 * 3600 * 1000), // 2 hours ago
        status: 'completed',
        reason: 'Skin rash',
        hasPrescription: true
      }
    ];

    for (const a of appointmentsSeed) {
      const appt = new Appointment(a);
      await appt.save();
      console.log(`✅ Created appointment with Dr. ${doctors.find(d => d._id.equals(a.doctor)).name}`);
    }

    console.log('🎉 Appointments seeding finished');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seed();
