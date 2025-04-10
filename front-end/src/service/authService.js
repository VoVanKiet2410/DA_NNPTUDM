import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

const authService = {
  // Đăng ký tài khoản
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      if (response.data.code === 200) {
        // Lưu token và thông tin user vào localStorage
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("username", response.data.data.user.cccd);
        localStorage.setItem("role", response.data.data.user.role);
        return response.data;
      }
      throw new Error(response.data.message);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Đăng nhập
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      if (response.data.code === 200) {
        // Lưu token và thông tin user vào localStorage
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("username", response.data.data.user.cccd);
        localStorage.setItem("role", response.data.data.user.role);
        return response.data;
      }
      throw new Error(response.data.message);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Đăng xuất
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
  },

  // Kiểm tra đăng nhập
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  // Kiểm tra quyền admin
  isAdmin: () => {
    return localStorage.getItem("role") === "admin";
  },

  // Lấy thông tin profile người dùng
  getProfile: async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default authService;
