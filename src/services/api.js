import axios from 'axios';
import { env } from '../config/env';

const TOKEN_KEY = 'portfolio-admin-token';

/** JWT lives in sessionStorage (cleared when the tab closes). */
export const tokenStore = {
  get: () => { try { return sessionStorage.getItem(TOKEN_KEY); } catch { return null; } },
  set: (t) => { try { sessionStorage.setItem(TOKEN_KEY, t); } catch { /* ignore */ } },
  clear: () => { try { sessionStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ } },
};

export const normalizeError = (err) => {
  const data = err?.response?.data;
  const message =
    (typeof data === 'string' && data) || data?.message || data?.title || err?.message || 'Something went wrong. Please try again.';
  const e = new Error(message);
  e.status = err?.response?.status;
  return e;
};

/** Shared Axios instance — base URL always comes from VITE_API_BASE_URL. */
export const api = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 12000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) tokenStore.clear();
    return Promise.reject(normalizeError(err));
  },
);
