const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['doctor', 'patient'], required: true },
  specialization: String, // doctor only
  phone: String,
  age: Number,            // patient only
  gender: String,         // patient only
  avatar: String,
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
