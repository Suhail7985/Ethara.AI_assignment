const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
      heartbeatFrequencyMS: 10000,
    });
  } catch (error) {
    process.exit(1);
  }
};

module.exports = connectDB;
