import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchApi } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('vendorBridge_token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verify token and fetch profile
  const verifyToken = useCallback(async (jwtToken) => {
    try {
      setLoading(true);
      const data = await fetchApi('/auth/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      setUser(data.user);
      setError(null);
    } catch (err) {
      console.error('Failed to verify token:', err);
      // Clean up invalid session
      localStorage.removeItem('vendorBridge_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize session
  useEffect(() => {
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, [token, verifyToken]);

  // Log in user
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const data = await fetchApi('/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      
      localStorage.setItem('vendorBridge_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const register = async (name, email, password, role) => {
    try {
      setError(null);
      setLoading(true);
      const data = await fetchApi('/auth/register', {
        method: 'POST',
        body: { name, email, password, role },
      });
      
      localStorage.setItem('vendorBridge_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Log out user
  const logout = useCallback(() => {
    localStorage.removeItem('vendorBridge_token');
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    loading,
    error,
    login,
    register,
    logout,
    clearError: () => setError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
