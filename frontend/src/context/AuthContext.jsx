import React, { createContext, useState, useEffect, useContext } from 'react';
import API, { setAccessToken } from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const initAuth = async () => {
    try {
      const response = await API.post('/auth/refresh-token');
      const { accessToken: token } = response.data.data;
      setAccessToken(token);

      const userResponse = await API.get('/protected');
      setUser(userResponse.data.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const response = await API.post('/auth/login', { email, password });
      const { accessToken, user: userData } = response.data.data;
      setAccessToken(accessToken);
      setUser(userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await API.post('/auth/register', { name, email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    setLoading(true);
    try {
      await API.post('/auth/logout');
    } catch (error) {
    } finally {
      setAccessToken('');
      setUser(null);
      setLoading(false);
    }
  };

  const verifyEmailUser = async (token) => {
    try {
      const response = await API.get(`/auth/verify-email?token=${token}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  const forgotPasswordUser = async (email) => {
    try {
      const response = await API.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  const resetPasswordUser = async (token, password) => {
    try {
      const response = await API.post('/auth/reset-password', { token, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: loginUser,
        register: registerUser,
        logout: logoutUser,
        verifyEmail: verifyEmailUser,
        forgotPassword: forgotPasswordUser,
        resetPassword: resetPasswordUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
