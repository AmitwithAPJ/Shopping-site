const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'ddwo8iuhl',
  api_key: process.env.CLOUDINARY_API_KEY || '272215654481934',
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Route to handle image uploads
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded',
        error: true,
        success: false
      });
    }

    // Convert buffer to base64
    const fileStr = Buffer.from(req.file.buffer).toString('base64');
    const fileType = req.file.mimetype;
    
    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(
      `data:${fileType};base64,${fileStr}`,
      {
        folder: 'products'
      }
    );

    res.status(200).json({
      message: 'Image uploaded successfully',
      error: false,
      success: true,
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id
    });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    res.status(500).json({
      message: error.message || 'Error uploading image',
      error: true,
      success: false
    });
  }
});

module.exports = router; 