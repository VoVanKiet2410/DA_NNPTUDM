import axios from 'axios';
import { API_URL } from '../constants/api';

const NEWS_URL = `${API_URL}/news`;

const NewsService = {
  // Lấy tất cả tin tức
  getAllNews: async () => {
    try {
      const response = await axios.get(NEWS_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  },

  // Lấy tin tức theo ID
  getNewsById: async (id) => {
    try {
      const response = await axios.get(`${NEWS_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Thêm tin tức mới
  createNews: async (newsData) => {
    try {
      // Xử lý ảnh nếu có
      if (newsData.photo && newsData.photo.length > 0) {
        const imageUrl = await this.convertFileToBase64(newsData.photo[0].originFileObj);
        
        // Tạo data object mới với imageUrl
        const postData = {
          title: newsData.title,
          content: newsData.content,
          imageUrl: imageUrl
        };
        
        const response = await axios.post(NEWS_URL, postData);
        return response.data;
      } else {
        // Không có ảnh
        const postData = {
          title: newsData.title,
          content: newsData.content,
          author: newsData.author || 'ChiTin'
        };
        
        const response = await axios.post(NEWS_URL, postData);
        return response.data;
      }
    } catch (error) {
      console.error('Error adding news:', error);
      throw error;
    }
  },

  // Cập nhật tin tức
  updateNews: async (id, newsData) => {
    try {
      // Xử lý ảnh nếu có ảnh mới
      let updateData = {
        title: newsData.title,
        content: newsData.content,
      };

      if (newsData.photo && newsData.photo.length > 0) {
        const imageUrl = await this.convertFileToBase64(newsData.photo[0].originFileObj);
        updateData.imageUrl = imageUrl;
      } else if (newsData.imageUrl) {
        // Giữ nguyên ảnh cũ nếu có
        updateData.imageUrl = newsData.imageUrl;
      }
      
      const response = await axios.put(`${NEWS_URL}/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error(`Error updating news with id ${id}:`, error);
      throw error;
    }
  },

  // Xóa tin tức
  deleteNews: async (id) => {
    try {
      const response = await axios.delete(`${NEWS_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting news with id ${id}:`, error);
      throw error;
    }
  },

  // Tiện ích: Chuyển đổi file sang Base64
  convertFileToBase64: async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  },
}

export default NewsService;