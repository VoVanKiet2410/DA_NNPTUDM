import axios from 'axios';
import { API_URL } from '../constants/api';

const APPOINTMENTS_URL = `${API_URL}/appointments`;
const appointmentService = {

  getAllAppointments: async () => {
    try {
      const response = await axios.get(APPOINTMENTS_URL);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

};

export default appointmentService;