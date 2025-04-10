const News = require('../schemas/News');
const ApiResponse = require('../utils/ApiResponse');

// Add news
exports.addNews = async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    const news = new News({ title, content, author, imageUrl });
    await news.save();

    res.status(201).json(new ApiResponse(201, 'News added successfully', news));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, 'Error adding news', error.message));
  }
};

// Get all news
exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find();
    res.status(200).json(new ApiResponse(200, 'Success', news));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, 'Error fetching news', error.message));
  }
};

// Get news by ID
exports.getNewsById = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findById(id);
    if (!news) {
      return res.status(404).json(new ApiResponse(404, 'News not found'));
    }
    res.status(200).json(new ApiResponse(200, 'Success', news));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, 'Error fetching news', error.message));
  }
};

// Update news
exports.updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, author } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    const news = await News.findByIdAndUpdate(
      id,
      { title, content, author, imageUrl },
      { new: true }
    );
    if (!news) {
      return res.status(404).json(new ApiResponse(404, 'News not found'));
    }
    res.status(200).json(new ApiResponse(200, 'News updated successfully', news));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, 'Error updating news', error.message));
  }
};

// Delete news
exports.deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findByIdAndDelete(id);
    if (!news) {
      return res.status(404).json(new ApiResponse(404, 'News not found'));
    }
    res.status(200).json(new ApiResponse(200, 'News deleted successfully'));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, 'Error deleting news', error.message));
  }
};