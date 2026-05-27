import axios from 'axios';

// Default to local backend during development, allow override with VITE_API_URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
console.log('🌐 API Base URL:', API_URL);

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  console.log(`📤 [${config.method.toUpperCase()}] ${config.url}${token ? ' [WITH TOKEN]' : ''}`);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    console.log(`📥 [${response.status}] ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error(`⚠️ [${error.response?.status || 'ERROR'}] ${error.config?.url}:`, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosClient;
