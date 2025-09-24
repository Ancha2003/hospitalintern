const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI; // MongoDB Atlas URI from .env
  if (!uri) {
    console.error('❌ MONGO_URI not set in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri); // Mongoose 6+ no options needed
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
};

module.exports = connectDB;
