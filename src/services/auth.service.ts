import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const { data } = await axios.post(`${API_URL}/auth/login`, credentials);
  return data;
};

export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  const { data } = await axios.post(`${API_URL}/auth/register`, userData);
  return data;
};