const mongoose = require('mongoose');
const Faq = require('../schemas/Faq');
const ApiResponse = require('../utils/ApiResponse');

exports.getAllFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find();
    res.status(200).json(new ApiResponse(200, 'Success', faqs));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, 'Error fetching FAQs', error.message));
  }
};

exports.addFaq = async (req, res) => {
  try {
    const { title, description } = req.body;
    const faq = new Faq({ title, description });
    await faq.save();
    res.status(201).json(new ApiResponse(201, 'FAQ added successfully', faq));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, 'Error adding FAQ', error.message));
  }
};

exports.updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const faq = await Faq.findByIdAndUpdate(id, { title, description }, { new: true });
    if (!faq) {
      return res.status(404).json(new ApiResponse(404, 'FAQ not found'));
    }
    res.status(200).json(new ApiResponse(200, 'FAQ updated successfully', faq));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, 'Error updating FAQ', error.message));
  }
};

exports.deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await Faq.findByIdAndDelete(id);
    if (!faq) {
      return res.status(404).json(new ApiResponse(404, 'FAQ not found'));
    }
    res.status(200).json(new ApiResponse(200, 'FAQ deleted successfully'));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, 'Error deleting FAQ', error.message));
  }
};