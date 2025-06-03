const BannerModel = require('../../models/bannerModel');
const uploadProductPermission = require("../../helpers/permission");

async function deleteBanner(req, res) {
  try {
    const sessionUserId = req.userId;

    // Check if the user has admin permissions
    if (!uploadProductPermission(sessionUserId)) {
      throw new Error("Permission denied");
    }

    const { bannerId } = req.body;

    // Validate banner ID
    if (!bannerId) {
      return res.status(400).json({
        message: "Banner ID is required",
        error: true,
        success: false
      });
    }

    // Delete the banner
    const deletedBanner = await BannerModel.findByIdAndDelete(bannerId);

    if (!deletedBanner) {
      return res.status(404).json({
        message: "Banner not found",
        error: true,
        success: false
      });
    }

    res.status(200).json({
      message: "Banner deleted successfully",
      error: false,
      success: true
    });

  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false
    });
  }
}

module.exports = deleteBanner; 