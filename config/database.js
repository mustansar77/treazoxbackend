const mongoose = require('mongoose');
const { initializeDefaults } = require('./initializers');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
    
    // Initialize superadmin after connection
    await initializeDefaults();
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;