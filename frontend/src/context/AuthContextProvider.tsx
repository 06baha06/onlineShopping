import React, { useState, useEffect } from 'react';
import type { User, AuthContextType } from '../types';
import * as authService from '../services/authService';
import { AuthContext } from './AuthContext';

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState<boolean>(true);

  // 🔐 LOGIN fonksiyonu
  const login = async (email: string, password: string): Promise<void> => {
  const response = await authService.login(email, password);
  
  if (response.success && response.data) {
    setUser(response.data.user);
    setToken(response.data.token);
    localStorage.setItem('token', response.data.token);
  } else {
    throw new Error(response.message || 'Giriş başarısız');
  }
};

  // 📝 REGISTER fonksiyonu
  const register = async (name: string, email: string, password: string): Promise<void> => {
  const response = await authService.register(name, email, password);
  
  if (response.success && response.data) {
    setUser(response.data.user);
    setToken(response.data.token);
    localStorage.setItem('token', response.data.token);
  } else {
    throw new Error(response.message || 'Kayıt başarısız');
  }
};

  // 🚪 LOGOUT fonksiyonu
  const logout = (): void => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  // ✅ Token kontrol et (sayfa yüklendiğinde)
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('token');
      
      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await authService.getMe(savedToken);
        
        if (response.success && response.data) {
          setUser(response.data.user);
          setToken(savedToken);
        } else {
          logout();
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};