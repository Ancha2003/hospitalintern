const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  age: { type: Number },
  gender: { type: String, enum: ['Male','Female','Other'], default: 'Other' },
  avatar: { type: String, default: "https://img.freepik.com/free-photo/young-happy-man-standing-isolated_171337-1127.jpg?semt=ais_incoming&w=740&q=80" },
  problem: { type: String } // Added this field
}, { timestamps: true });

module.exports = mongoose.model('Patient', PatientSchema);
