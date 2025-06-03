const BannerModel = require('../../models/bannerModel');
const uploadProductPermission = require("../../helpers/permission");

async function updateBanner(req, res) {
  try {
    const sessionUserId = req.userId;

    // Check if the user has admin permissions
    if (!uploadProductPermission(sessionUserId)) {
      throw new Error("Permission denied");
    }

    const { bannerId, title, imageUrl, mobileImageUrl, link, isActive, order } = req.body;

    // Validate banner ID
    if (!bannerId) {
      return res.status(400).json({
        message: "Banner ID is required",
        error: true,
        success: false
      });
    }

    // Create update object with only provided fields
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (mobileImageUrl !== undefined) updateData.mobileImageUrl = mobileImageUrl;
    if (link !== undefined) updateData.link = link;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (order !== undefined) updateData.order = order;

    // Update the banner
    const updatedBanner = await BannerModel.findByIdAndUpdate(
      bannerId,
      updateData,
      { new: true } // Return the updated document
    );

    if (!updatedBanner) {
      return res.status(404).json({
        message: "Banner not found",
        error: true,
        success: false
      });
    }

    res.status(200).json({
      message: "Banner updated successfully",
      error: false,
      success: true,
      data: updatedBanner
    });

  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false
    });
  }
}

module.exports = updateBanner; 