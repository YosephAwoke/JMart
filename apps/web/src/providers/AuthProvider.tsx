import { createContext, useContext, useEffect, useState, useMemo, ReactNode } from 'react';
import type { UserProfile } from '@jmart/shared';
import * as authService from '../services/auth';

type AuthContext = {
  user: UserProfile | null;
  favorites: string[];
  token: string | null;
  login: (phone: string, password: string) => Promise<void>;
  register: (payload: { fullName: string; email?: string; phone: string; password: string }) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
  updateProfile: (patch: Partial<UserProfile>) => Promise<void>;
  addFavorite: (productId: string) => Promise<void>;
  removeFavorite: (productId: string) => Promise<void>;
};

const AuthContext = createContext<AuthContext | undefined>(undefined);
const STORAGE_KEY = 'jmart-auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [token, setToken] = useState<string | null>(() => window.localStorage.getItem(STORAGE_KEY));

  async function hydrateUser(currentToken: string) {
    const [meResponse, favoritesResponse] = await Promise.all([authService.me(currentToken), authService.getFavorites(currentToken).catch(() => ({ data: { favorites: [] as string[] } }))]);
    setUser(meResponse.data.user);
    setFavorites(favoritesResponse.data.favorites ?? meResponse.data.user.favorites ?? []);
  }

  useEffect(() => {
    if (!token) return;
    let mounted = true;
    hydrateUser(token)
      .then(() => {
        if (!mounted) return;
      })
      .catch(() => {
        setToken(null);
        window.localStorage.removeItem(STORAGE_KEY);
      });
    return () => {
      mounted = false;
    };
  }, [token]);

  async function login(phone: string, password: string) {
    const res = await authService.login({ phone, password });
    setToken(res.data.token);
    window.localStorage.setItem(STORAGE_KEY, res.data.token);
    setUser(res.data.user);
    setFavorites(res.data.user.favorites ?? []);
    await hydrateUser(res.data.token).catch(() => undefined);
  }

  async function register(payload: { fullName: string; email?: string; phone: string; password: string }) {
    const res = await authService.register(payload);
    setToken(res.data.token);
    window.localStorage.setItem(STORAGE_KEY, res.data.token);
    setUser(res.data.user);
    setFavorites(res.data.user.favorites ?? []);
    await hydrateUser(res.data.token).catch(() => undefined);
  }

  function logout() {
    setUser(null);
    setToken(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }

  async function refresh() {
    if (!token) return;
    await hydrateUser(token);
  }

  async function updateProfile(patch: Partial<UserProfile>) {
    if (!token) throw new Error('Not authenticated');
    const res = await authService.updateProfile(token, patch);
    setUser(res.data.user);
    setFavorites(res.data.user.favorites ?? favorites);
  }

  async function addFavorite(productId: string) {
    if (!token) throw new Error('Not authenticated');
    const res = await authService.addFavorite(token, productId);
    setFavorites(res.data.favorites);
    setUser((u) => (u ? { ...u, favorites: res.data.favorites } : u));
  }

  async function removeFavorite(productId: string) {
    if (!token) throw new Error('Not authenticated');
    const res = await authService.removeFavorite(token, productId);
    setFavorites(res.data.favorites);
    setUser((u) => (u ? { ...u, favorites: res.data.favorites } : u));
  }

  const value = useMemo(() => ({ user, favorites, token, login, register, logout, refresh, updateProfile, addFavorite, removeFavorite }), [user, favorites, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
