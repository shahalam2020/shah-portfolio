import { createSlice } from '@reduxjs/toolkit';

// status: loading | anonymous | authenticated | forbidden
const slice = createSlice({
  name: 'auth',
  initialState: { user: null, role: null, status: 'loading', error: null, demo: false },
  reducers: {
    setSession: (s, a) => {
      s.user = a.payload.user;
      s.role = a.payload.role;
      s.demo = Boolean(a.payload.demo);
      s.status = 'authenticated';
      s.error = null;
    },
    clearSession: (s) => { s.user = null; s.role = null; s.demo = false; s.status = 'anonymous'; },
    setForbidden: (s, a) => { s.user = a.payload || null; s.role = null; s.status = 'forbidden'; s.error = 'This account does not have admin access.'; },
    setAuthError: (s, a) => { s.error = a.payload; s.status = 'anonymous'; },
  },
});

export const { setSession, clearSession, setForbidden, setAuthError } = slice.actions;
export default slice.reducer;
