const mongoose = require('mongoose');
const userModel = require('./models/userModel');
require('dotenv').config();

// Email of the user you want to make admin
const userEmail = 'user@example.com'; // This is the email of the user we want to make admin

async function makeAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find the user by email
    const user = await userModel.findOne({ email: userEmail });
    
    if (!user) {
      console.log(`User with email ${userEmail} not found`);
      return;
    }
    
    // Update the user's role to ADMIN
    user.role = 'ADMIN';
    await user.save();
    
    console.log(`User ${userEmail} has been updated to ADMIN role`);
    
    // List all users and their roles
    const allUsers = await userModel.find({});
    console.log('\nAll users:');
    allUsers.forEach(u => {
      console.log(`Email: ${u.email}, Role: ${u.role}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

makeAdmin(); 