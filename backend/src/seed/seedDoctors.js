require('dotenv').config();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const connectDB = require('../config/db');

// Seed data for doctors
const doctorsSeed = [
  { name: 'Dr. Asha Verma', email: 'asha.verma@clinix.com', password: 'doctor123', role: 'doctor', specialization: 'General Physician', phone: '9999000001' },
  { name: 'Dr. Rajesh Kumar', email: 'rajesh.kumar@clinix.com', password: 'doctor123', role: 'doctor', specialization: 'Pediatrics', phone: '9999000002' },
  { name: 'Dr. Meera Singh', email: 'meera.singh@clinix.com', password: 'doctor123', role: 'doctor', specialization: 'Dermatology', phone: '9999000003' }
];

// Seed data for patients
const patientsSeed = [
  { name: 'Test Patient 1', email: 'patient1@example.com', password: 'patient123', role: 'patient', phone: '9000000001' },
  { name: 'Test Patient 2', email: 'patient2@example.com', password: 'patient123', role: 'patient', phone: '9000000002' },
  { name: 'Test Patient 3', email: 'patient3@example.com', password: 'patient123', role: 'patient', phone: '9000000003' },
  { name: 'Test Patient 4', email: 'patient4@example.com', password: 'patient123', role: 'patient', phone: '9000000004' }
];

// Function to seed users
const seedUsers = async (users) => {
  for (const u of users) {
    const existing = await User.findOne({ email: u.email });
    if (!existing) {
      const hashedPassword = await bcrypt.hash(u.password, 10);
      const user = new User({ ...u, password: hashedPassword });
      await user.save();
      console.log(`✅ Created user: ${u.email}`);
    } else {
      console.log(`⚠ User already exists: ${u.email}`);
    }
  }
};

// Main seeding function
const seed = async () => {
  try {
    await connectDB();
    console.log('Connected to DB');

    // Seed doctors
    await seedUsers(doctorsSeed);

    // Seed patients
    await seedUsers(patientsSeed);

    console.log('🎉 Seeding finished');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seed();
