// src/service/appointmentService.js
import axiosInstance from 'C:\\NguoiDung\\E\\NodeJS\\DACK-S2\\front-end\\src\\axiosConfig.js'; // Giả sử bạn đã có tệp này cho cấu hình axios

const appointmentService = {
  // Lấy tất cả appointments của user hiện tại
  getUserAppointments: async () => {
    try {
      const response = await axiosInstance.get('/appointments/by-user');
      return response.data;
    } catch (error) {
      console.error('Error fetching user appointments:', error);
      throw error;
    }
  },

  // Tạo appointment mới
  createAppointment: async (eventId, healthMetrics) => {
    try {
      const response = await axiosInstance.post('/appointments/save', {
        eventId,
        healthMetrics
      });
      return response.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },

  // Xóa appointment
  deleteAppointment: async (appointmentId) => {
    try {
      const response = await axiosInstance.delete(`/appointments/delete/${appointmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  }
};

export default appointmentService;