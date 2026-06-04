import { apiClient } from '@/api/client';
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/types';

export const login = async (payload: LoginRequest): Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>('/api/auth/login', payload);
  return data;
};

export const register = async (payload: RegisterRequest): Promise<{ message: string }> => {
  const { data } = await apiClient.post<{ message: string }>('/api/auth/register', payload);
  return data;
};
