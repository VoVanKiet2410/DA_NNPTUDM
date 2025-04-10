import axios from "axios";
import { API_URL } from "../constants/api";

const FAQ_URL = `${API_URL}/faq`;
const faqService = {
  // Lấy danh sách FAQ
  getAllFAQs: async () => {
    try {
      const response = await axios.get(FAQ_URL);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Tạo FAQ mới
  createFAQs: async (faqData) => {
    try {
      const response = await axios.post(FAQ_URL, faqData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Cập nhật FAQ
  updateFAQs: async (id, faqData) => {
    try {
      const response = await axios.put(`${FAQ_URL}/${id}`, faqData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Xóa FAQ
  deleteFAQs: async (id) => {
    try {
      const response = await axios.delete(`${FAQ_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default faqService;