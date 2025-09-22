const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
  name: String,
  dosage: String,
  duration: String
}, { _id: false });

const PrescriptionSchema = new mongoose.Schema({
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symptoms: String,
  diagnosis: String,
  medicines: [MedicineSchema],
  notes: String,
  image: String
}, { timestamps: true });

module.exports = mongoose.model('Prescription', PrescriptionSchema);
