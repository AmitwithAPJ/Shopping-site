const mongoose = require('mongoose');
const userModel = require('./models/userModel');
require('dotenv').config();

async function listUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // List all users and their roles
    const allUsers = await userModel.find({});
    console.log('\nAll users:');
    allUsers.forEach(u => {
      console.log(`ID: ${u._id}, Email: ${u.email}, Name: ${u.name}, Role: ${u.role}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

listUsers(); 