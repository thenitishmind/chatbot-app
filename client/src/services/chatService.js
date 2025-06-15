import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const chatService = {
  sendMessage: async (content) => {
    try {
      const response = await axiosInstance.post('/chat/message', { content });
      return response.data;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      throw error;
    }
  },

  getChatHistory: async () => {
    try {
      const response = await axiosInstance.get('/chat/history');
      return response.data;
    } catch (error) {
      console.error('Error in getChatHistory:', error);
      throw error;
    }
  },

  clearChat: async () => {
    try {
      const response = await axiosInstance.delete('/chat/clear');
      return response.data;
    } catch (error) {
      console.error('Error in clearChat:', error);
      throw error;
    }
  },
}; 