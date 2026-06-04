import { createContext, useContext, useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { login as loginApi, register as registerApi } from '@/api/auth';
import { storage } from '@/utils/storage';
import type { LoginRequest, RegisterRequest, User } from '@/types';

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [storedToken, storedUser] = await Promise.all([storage.getToken(), storage.getUser()]);
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser) as User);
      }
      setLoading(false);
    })();
  }, []);

  const login = async (payload: LoginRequest): Promise<void> => {
    const data = await loginApi(payload);
    const nextUser = { userId: data.userId, email: data.email, name: data.name };

    await Promise.all([storage.setToken(data.token), storage.setUser(JSON.stringify(nextUser))]);
    setToken(data.token);
    setUser(nextUser);
  };

  const register = async (payload: RegisterRequest): Promise<void> => {
    await registerApi(payload);
    await login({ email: payload.email, password: payload.password });
  };

  const logout = async (): Promise<void> => {
    await Promise.all([storage.clearToken(), storage.clearUser()]);
    setToken(null);
    setUser(null);
  };

  const value = { user, token, loading, isAuthenticated: Boolean(token), login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return ctx;
}
