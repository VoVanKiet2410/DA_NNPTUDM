import axios from "axios";
import { API_URL } from "../constants/api";

const EVENT_URL = `${API_URL}/events`;

const eventService = {
  // Lấy danh sách sự kiện
  getAllEvents: async () => {
    try {
      const response = await axios.get(EVENT_URL);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Lấy chi tiết một sự kiện
  getEventById: async (id) => {
    try {
      const response = await axios.get(`${EVENT_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Tạo sự kiện mới
  addEvent: async (eventData) => {
    try {
      const response = await axios.post(EVENT_URL, eventData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Cập nhật sự kiện
  updateEvent: async (id, eventData) => {
    try {
      const response = await axios.put(`${EVENT_URL}/${id}`, eventData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Xóa sự kiện
  deleteEvent: async (id) => {
    try {
      const response = await axios.delete(`${EVENT_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Lấy sự kiện theo đơn vị hiến máu
  getEventsByDonationUnit: async (donationUnitId) => {
    try {
      const response = await axios.get(
        `${EVENT_URL}/donation-unit/${donationUnitId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getUpcomingEvents: async () => {
    try {
      const response = await axios.get(`${API_URL}/events/upcoming`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default eventService;
