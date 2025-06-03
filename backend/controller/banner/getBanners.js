const BannerModel = require('../../models/bannerModel');

async function getBanners(req, res) {
  try {
    // Get only active banners for public view
    const onlyActive = req.query.active === 'true';
    
    let query = {};
    if (onlyActive) {
      query = { isActive: true };
    }

    // Get banners sorted by order
    const banners = await BannerModel.find(query).sort({ order: 1 });

    res.status(200).json({
      message: "Banners retrieved successfully",
      error: false,
      success: true,
      data: banners
    });

  } catch (err) {
    res.status(500).json({
      message: err.message || err,
      error: true,
      success: false
    });
  }
}

module.exports = getBanners; 