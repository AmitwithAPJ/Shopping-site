/*
This script helps create a Cloudinary upload preset.
To use it:
1. Install the cloudinary package: npm install cloudinary
2. Add your Cloudinary credentials below
3. Run the script: node createCloudinaryPreset.js
*/

require('dotenv').config();
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'ddwo8iuhl',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function createUploadPreset() {
  try {
    // Check if we have the required credentials
    if (!cloudinary.config().api_secret) {
      console.error('Error: Cloudinary API secret is required.');
      console.log('Please set CLOUDINARY_API_SECRET in your .env file or directly in this script.');
      return;
    }

    // Create the upload preset
    const result = await cloudinary.api.create_upload_preset({
      name: "ml_default", // This is the default preset name
      unsigned: true,
      folder: "products",
      allowed_formats: "jpg,png,gif,webp,jpeg"
    });

    console.log('Upload preset created successfully:');
    console.log(result);
    
    console.log('\nNow you can use this preset in your frontend code:');
    console.log('formData.append("upload_preset", "ml_default");');
    
  } catch (error) {
    console.error('Error creating upload preset:', error);
    
    // If the preset already exists, let's try to get its details
    if (error.error && error.error.message.includes('already exists')) {
      try {
        console.log('\nTrying to get details of existing preset...');
        const presets = await cloudinary.api.upload_presets();
        const existingPreset = presets.find(p => p.name === 'ml_default');
        
        if (existingPreset) {
          console.log('Existing preset details:');
          console.log(existingPreset);
          
          if (!existingPreset.unsigned) {
            console.log('\nWARNING: This preset is not set to unsigned mode.');
            console.log('You may need to update it in the Cloudinary dashboard.');
          }
        }
      } catch (err) {
        console.error('Error getting preset details:', err);
      }
    }
  }
}

createUploadPreset(); 