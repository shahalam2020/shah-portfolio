import { configureStore } from '@reduxjs/toolkit';
import theme, { THEME_KEY } from './themeSlice';
import auth from './authSlice';

export const store = configureStore({ reducer: { theme, auth } });

let first = true;
const applyTheme = (mode) => {
  const root = document.documentElement;
  if (!first) {
    root.classList.add('theme-anim');
    window.setTimeout(() => root.classList.remove('theme-anim'), 550);
  }
  first = false;
  root.classList.toggle('dark', mode === 'dark');
  root.style.colorScheme = mode;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', mode === 'dark' ? '#050914' : '#f4f8ff');
  try { localStorage.setItem(THEME_KEY, mode); } catch { /* ignore */ }
};

let current = store.getState().theme.mode;
applyTheme(current);
store.subscribe(() => {
  const next = store.getState().theme.mode;
  if (next !== current) { current = next; applyTheme(next); }
});
