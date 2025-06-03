const BannerModel = require('../../models/bannerModel');
const uploadProductPermission = require("../../helpers/permission");

async function createBanner(req, res) {
  try {
    const sessionUserId = req.userId;

    // Check if the user has admin permissions
    if (!uploadProductPermission(sessionUserId)) {
      throw new Error("Permission denied");
    }

    const { title, imageUrl, mobileImageUrl, link, isActive, order } = req.body;

    // Validate required fields
    if (!title || !imageUrl || !mobileImageUrl) {
      return res.status(400).json({
        message: "Title, desktop image and mobile image are required",
        error: true,
        success: false
      });
    }

    // Create new banner
    const newBanner = new BannerModel({
      title,
      imageUrl,
      mobileImageUrl,
      link: link || '',
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0
    });

    const savedBanner = await newBanner.save();

    res.status(201).json({
      message: "Banner created successfully",
      error: false,
      success: true,
      data: savedBanner
    });

  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false
    });
  }
}

module.exports = createBanner; 