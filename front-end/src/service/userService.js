import axios from "axios";

// Cập nhật URL API cho đúng với backend
const API_URL = "http://localhost:5000/api";

// Tạo một instance axios với cấu hình cơ bản
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm interceptor để tự động gắn token vào mỗi request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const UserService = {
  /**
   * Lấy danh sách tất cả người dùng (cho Admin)
   */
  getAllUsers: async () => {
    try {
      console.log("Gọi API lấy danh sách người dùng");

      // Thử các endpoint có thể
      const possibleEndpoints = ["/users", "/admin/get-all-users"];

      let response = null;
      let errorMessages = [];

      for (const endpoint of possibleEndpoints) {
        try {
          console.log(`Đang thử endpoint: ${endpoint}`);
          response = await axiosInstance.get(endpoint);
          console.log(`Thành công với endpoint ${endpoint}:`, response.data);
          break;
        } catch (err) {
          const errorMsg = `Lỗi với endpoint ${endpoint}: ${err.message}`;
          console.error(errorMsg);
          errorMessages.push(errorMsg);
        }
      }

      if (!response) {
        throw new Error(
          `Tất cả endpoint đều thất bại: ${errorMessages.join("; ")}`
        );
      }

      // Kiểm tra dữ liệu trả về
      console.log("Dữ liệu API trả về:", response.data);

      return {
        success: true,
        userList: response.data.userList || [],
        message: response.data.message || "Tải danh sách người dùng thành công",
      };
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
      console.error(
        "Chi tiết lỗi:",
        error.response?.data || "Không có dữ liệu phản hồi"
      );

      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Không thể tải danh sách người dùng",
      };
    }
  },

  /**
   * Lấy thông tin chi tiết người dùng theo CCCD/username
   */
  getUserById: async (username) => {
    try {
      console.log("Lấy thông tin người dùng:", username);

      const response = await axiosInstance.get(`/users/${username}`);

      console.log("Phản hồi thông tin người dùng:", response.data);

      return {
        success: true,
        user: response.data.user,
        message: response.data.message || "Tải thông tin người dùng thành công",
      };
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      console.error(
        "Chi tiết lỗi:",
        error.response?.data || "Không có dữ liệu phản hồi"
      );

      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Không thể tải thông tin người dùng",
      };
    }
  },

  /**
   * Cập nhật thông tin người dùng
   */
  updateUser: async (username, userData) => {
    try {
      console.log("Cập nhật thông tin người dùng:", username, userData);

      const response = await axiosInstance.put(`/users/${username}`, userData);

      console.log("Phản hồi cập nhật người dùng:", response.data);

      return {
        success: true,
        user: response.data.user,
        message: response.data.message || "Cập nhật thông tin thành công",
      };
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin người dùng:", error);
      console.error(
        "Chi tiết lỗi:",
        error.response?.data || "Không có dữ liệu phản hồi"
      );

      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Không thể cập nhật thông tin người dùng",
      };
    }
  },

  /**
   * Cập nhật vai trò người dùng
   */
  updateUserRole: async (username, role) => {
    try {
      console.log("Cập nhật vai trò người dùng:", username, "thành", role);

      const response = await axiosInstance.patch(`/users/${username}/role`, {
        role,
      });

      console.log("Phản hồi cập nhật vai trò:", response.data);

      return {
        success: true,
        user: response.data.user,
        message: response.data.message || "Cập nhật vai trò thành công",
      };
    } catch (error) {
      console.error("Lỗi khi cập nhật vai trò người dùng:", error);
      console.error(
        "Chi tiết lỗi:",
        error.response?.data || "Không có dữ liệu phản hồi"
      );

      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Không thể cập nhật vai trò người dùng",
      };
    }
  },

  /**
   * Xóa người dùng
   */
  deleteUser: async (username) => {
    try {
      console.log("Xóa người dùng:", username);

      const response = await axiosInstance.delete(`/users/${username}`);

      console.log("Phản hồi xóa người dùng:", response.data);

      return {
        success: true,
        message: response.data.message || "Xóa người dùng thành công",
      };
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
      console.error(
        "Chi tiết lỗi:",
        error.response?.data || "Không có dữ liệu phản hồi"
      );

      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Không thể xóa người dùng",
      };
    }
  },

  // Các chức năng xác thực
  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    return !!token;
  },

  isAdmin: () => {
    const role = localStorage.getItem("role");
    return role === "ADMIN";
  },

  getAuthToken: () => {
    return localStorage.getItem("token");
  },
};

export default UserService;
