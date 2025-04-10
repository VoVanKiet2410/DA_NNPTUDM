import axios from "axios";
import { API_URL } from "../constants/api";

const DONATION_UNITS_URL = `${API_URL}/donation-units`;

const donationUnitService = {
  // Lấy danh sách đơn vị
  getAllUnits: async () => {
    try {
      const response = await axios.get(DONATION_UNITS_URL);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Lấy chi tiết một đơn vị
  getUnitById: async (id) => {
    try {
      const response = await axios.get(`${DONATION_UNITS_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Tạo đơn vị mới
  createUnit: async (unitData) => {
    try {
      const response = await axios.post(DONATION_UNITS_URL, unitData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Cập nhật đơn vị
  updateUnit: async (id, unitData) => {
    try {
      const response = await axios.put(`${DONATION_UNITS_URL}/${id}`, unitData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Xóa đơn vị
  deleteUnit: async (id) => {
    try {
      const response = await axios.delete(`${DONATION_UNITS_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default donationUnitService;
