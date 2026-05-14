import Banner from "../model/banner.model.js";

// Add new banner (Admin only)
export const addBanner = async (req, res) => {
  try {
    const { imageUrl, altText } = req.body;
    const newBanner = new Banner({ imageUrl, altText });
    await newBanner.save();
    res.status(201).json({ message: "Banner added successfully", banner: newBanner });
  } catch (error) {
    res.status(500).json({ message: "Error adding banner", error: error.message });
  }
};

// Get all active banners (Public)
export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true });
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ message: "Error fetching banners", error: error.message });
  }
};

// Delete banner (Admin only)
export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    await Banner.findByIdAndDelete(id);
    res.status(200).json({ message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting banner", error: error.message });
  }
};
