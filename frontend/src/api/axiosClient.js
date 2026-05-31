import axios from 'axios';

const isDevelopment = import.meta.env.MODE === 'development';
const API_URL = import.meta.env.VITE_API_URL || (isDevelopment ? 'http://localhost:5000/api' : '/api');

if (!import.meta.env.VITE_API_URL && !isDevelopment) {
  console.warn('⚠️ VITE_API_URL is not defined in production. Falling back to relative /api. Set VITE_API_URL to your backend API URL in Render env vars.');
}

console.log('🌐 API Base URL:', API_URL);

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

axiosClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  console.log(`📤 [${config.method?.toUpperCase() || 'REQUEST'}] ${config.url}${token ? ' [WITH TOKEN]' : ''}`);
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
