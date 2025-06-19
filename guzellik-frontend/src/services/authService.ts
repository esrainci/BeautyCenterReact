// services/authService.ts

import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Ortam değişkeninden okunur; yoksa default local IP kullanılır
const BASE_URL = process.env.API_URL || 'http://192.168.1.197:5000/api/auth';

// Request veri tipleri
export interface AuthForm {
  email: string;
  password: string;
}

export interface RegisterForm extends AuthForm {
  name: string;
  phone: string;
}

// Response tipi
export interface AuthResponse {
  token: string;
}

// Axios örneği oluştur
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Uygulama başlangıcında token varsa header'a ekle
export const initAuth = async (): Promise<void> => {
  const token = await SecureStore.getItemAsync('userToken');
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

// Login fonksiyonu
export const loginUser = async (
  formData: AuthForm
): Promise<AuthResponse> => {
  try {
    const { data } = await api.post<AuthResponse>('/login', formData);
    // Token'ı SecureStore'a kaydet
    await SecureStore.setItemAsync('userToken', data.token);
    // Header'ı da default olarak ayarla
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    return data;
  } catch (err: any) {
    const message = err.response?.data?.message || err.message;
    throw new Error(message);
  }
};

// Kayıt fonksiyonu
export const registerUser = async (
  formData: RegisterForm
): Promise<AuthResponse> => {
  try {
    const { data } = await api.post<AuthResponse>('/register', formData);
    return data;
  } catch (err: any) {
    const message = err.response?.data?.message || err.message;
    throw new Error(message);
  }
};
