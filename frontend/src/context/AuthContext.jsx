import { createContext, useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.token) {
      localStorage.setItem('authToken', user.token);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (data) => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔐 Attempting login with email:', data.email);
      const response = await axiosClient.post('/auth/login', data);
      console.log('✅ Login successful:', response.data);
      setUser(response.data);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      console.error('❌ Login error:', errorMsg);
      setError(errorMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('🚪 Logging out');
    setUser(null);
    setError(null);
  };

  const register = async (path, data) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`📝 Attempting ${path} registration for:`, data.email);
      const response = await axiosClient.post(`/auth/register/${path}`, data);
      console.log(`✅ ${path} registration successful:`, response.data);
      setUser(response.data);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      console.error(`❌ ${path} registration error:`, errorMsg);
      setError(errorMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading, setLoading, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
};
