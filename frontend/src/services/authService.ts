import axios from 'axios';
import type { AuthResponse, UserResponse } from '../types';

// 🌐 Backend API URL
const API_URL = 'http://localhost:5000/api/auth';

// 📝 REGISTER - Yeni kullanıcı kaydı
export const register = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/register`, {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      const errorData = error.response.data as AuthResponse;
      return {
        success: false,
        message: errorData.message || 'Kayıt başarısız'
      };
    }
    return {
      success: false,
      message: 'Kayıt sırasında bir hata oluştu'
    };
  }
};

// 🔑 LOGIN - Kullanıcı girişi
export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      const errorData = error.response.data as AuthResponse;
      return {
        success: false,
        message: errorData.message || 'Giriş başarısız'
      };
    }
    return {
      success: false,
      message: 'Giriş sırasında bir hata oluştu'
    };
  }
};

// 👤 GET ME - Oturum açık kullanıcının bilgilerini getir
export const getMe = async (token: string): Promise<UserResponse> => {
  try {
    const response = await axios.get<UserResponse>(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      const errorData = error.response.data as UserResponse;
      return {
        success: false,
        data: errorData.data
      };
    }
    throw new Error('Kullanıcı bilgileri alınamadı');
  }
};