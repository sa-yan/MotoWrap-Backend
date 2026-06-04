import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'motowrap_token';
const USER_KEY = 'motowrap_user';

export const storage = {
  async setToken(token: string): Promise<void> {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  },
  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem(TOKEN_KEY);
  },
  async clearToken(): Promise<void> {
    await AsyncStorage.removeItem(TOKEN_KEY);
  },
  async setUser(userJson: string): Promise<void> {
    await AsyncStorage.setItem(USER_KEY, userJson);
  },
  async getUser(): Promise<string | null> {
    return AsyncStorage.getItem(USER_KEY);
  },
  async clearUser(): Promise<void> {
    await AsyncStorage.removeItem(USER_KEY);
  },
};
