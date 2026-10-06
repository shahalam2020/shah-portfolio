import { createSlice } from '@reduxjs/toolkit';

export const THEME_KEY = 'portfolio-theme';

const readInitial = () => {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch { /* storage blocked */ }
  return 'dark';
};

const slice = createSlice({
  name: 'theme',
  initialState: { mode: readInitial() },
  reducers: {
    setTheme: (s, a) => { s.mode = a.payload; },
    toggleTheme: (s) => { s.mode = s.mode === 'dark' ? 'light' : 'dark'; },
  },
});

export const { setTheme, toggleTheme } = slice.actions;
export default slice.reducer;
