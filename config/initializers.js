const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();





const initializeSuperAdmin = async () => {
  try {
    const existingSuperAdmin = await User.findOne({ role: 'SUPERADMIN' });
    
    if (!existingSuperAdmin) {

     const superAdmin = new User({
  email: process.env.SUPERADMIN_EMAIL || 'superadmin@example.com',
  password: process.env.SUPERADMIN_PASSWORD || 'superadmin123', // STRING
  role: 'SUPERADMIN',
  fullName: 'SUPER ADMIN', // use fullName, not name
  isActive: true
});
      await superAdmin.save();
      console.log('Superadmin created successfully');
    }
  } catch (err) {
    console.error('Error initializing superadmin:', err.message);
  }
};

const initializeDefaults = async () => {
  await initializeSuperAdmin();
};

module.exports = { initializeDefaults };
