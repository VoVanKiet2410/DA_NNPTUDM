const News = require('../schemas/News');
const ApiResponse = require('../utils/ApiResponse');

exports.createNews = async (req, res) => {
  try {
    
    const { title, content, imageUrl } = req.body;
    const news = await News.create({
      title,
      content,
      imageUrl,
    });

    res.status(201).json(new ApiResponse(201, 'News added successfully', news));
  } catch (error) {
    console.error("Error adding news:", error);
    res.status(500).json(new ApiResponse(500, 'Error adding news', error.message));
  }
};

exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find();
    res.status(200).json(new ApiResponse(200, 'Success', news));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, 'Error fetching news', error.message));
  }
};

exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json(new ApiResponse(404, 'News not found'));
    }
    res.status(200).json(new ApiResponse(200, 'Success', news));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, 'Error fetching news', error.message));
  }
};

exports.updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, imageUrl } = req.body;

    const news = await News.findByIdAndUpdate(
      id,
      { title, content, imageUrl },
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