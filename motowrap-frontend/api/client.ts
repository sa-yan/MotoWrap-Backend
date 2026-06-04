import axios from 'axios';
import { API_BASE_URL } from '@/utils/constants';
import { storage } from '@/utils/storage';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await storage.getToken();
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      await Promise.all([storage.clearToken(), storage.clearUser()]);
    }
    return Promise.reject(error);
  },
);
