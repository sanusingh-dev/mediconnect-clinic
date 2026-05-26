import { createContext, useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

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
    const response = await axiosClient.post('/auth/login', data);
    setUser(response.data);
    return response.data;
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (path, data) => {
    const response = await axiosClient.post(`/auth/register/${path}`, data);
    setUser(response.data);
    return response.data;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
