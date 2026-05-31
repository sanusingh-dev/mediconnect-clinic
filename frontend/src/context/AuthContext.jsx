import { createContext, useContext, useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { getProfileService } from '../services/authService';

const safeJsonParse = (value) => {
  try {
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.warn('Unable to parse localStorage JSON:', error);
    return null;
  }
};

const safeLocalStorageGet = (key) => {
  try {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(key);
  } catch (error) {
    console.warn('Unable to read from localStorage:', key, error);
    return null;
  }
};

const safeLocalStorageRemove = (key) => {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(key);
  } catch (error) {
    console.warn('Unable to remove localStorage key:', key, error);
  }
};

const defaultAuthContext = {
  user: null,
  authLoading: false,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  loading: false,
  error: null,
  setError: () => {},
  refreshProfile: async () => {},
};

export const AuthContext = createContext(defaultAuthContext);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => safeJsonParse(safeLocalStorageGet('user')));
  const [authLoading, setAuthLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = safeLocalStorageGet('authToken');
      const storedUser = safeJsonParse(safeLocalStorageGet('user'));

      if (token && storedUser) {
        try {
          const response = await getProfileService();
          const profileUser = response?.data;

          if (profileUser) {
            setUser({ ...profileUser, token });
          } else {
            throw new Error('Profile verification returned no user data');
          }
        } catch (err) {
          console.warn('Unable to verify token on startup, clearing stored auth data.', err?.message || err);
          safeLocalStorageRemove('authToken');
          safeLocalStorageRemove('user');
          setUser(null);
        }
      } else {
        safeLocalStorageRemove('authToken');
        safeLocalStorageRemove('user');
        setUser(null);
      }

      setAuthLoading(false);
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    if (user?.token) {
      try {
        localStorage.setItem('authToken', user.token);
        localStorage.setItem('user', JSON.stringify(user));
      } catch (err) {
        console.warn('Unable to persist auth data:', err);
      }
    } else {
      safeLocalStorageRemove('authToken');
      safeLocalStorageRemove('user');
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
      console.error('Login request failed:', {
        url: '/auth/login',
        payload: data,
        status: error.response?.status,
        response: error.response?.data,
        message: error.message,
      });
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
      console.error('Register request failed:', {
        url: `/auth/register/${path}`,
        payload: data,
        status: error.response?.status,
        response: error.response?.data,
        message: error.message,
      });
      setError(errorMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    try {
      const response = await getProfileService();
      const profileUser = response?.data;
      if (profileUser) {
        setUser((current) => ({ ...current, ...profileUser }));
      }
    } catch (err) {
      console.warn('refreshProfile failed:', err?.message || err);
      setUser(null);
      safeLocalStorageRemove('authToken');
      safeLocalStorageRemove('user');
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, authLoading, login, logout, register, loading, error, setError, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};
