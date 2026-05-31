import { createContext, useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { getProfileService } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [authLoading, setAuthLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('authToken');
      const saved = localStorage.getItem('user');

      if (token && saved) {
        try {
          const response = await getProfileService();
          const profileUser = response.data;
          setUser({ ...profileUser, token });
        } catch (err) {
          console.warn('Unable to verify token on startup, using stored user data.', err.message);
          setUser(JSON.parse(saved));
        }
      }
      setAuthLoading(false);
    };

    initializeAuth();
  }, []);

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
      const response = await axiosClient.post('/auth/login', data);
      setUser(response.data);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      setError(errorMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
  };

  const register = async (path, data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosClient.post(`/auth/register/${path}`, data);
      setUser(response.data);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      setError(errorMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, authLoading, login, logout, register, loading, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
};
