/**
 * Admin authentication.
 *   firebase → Google sign-in; admin = email in VITE_ADMIN_EMAILS OR a Firestore doc admins/{uid}
 *   api      → JWT from ASP.NET Core (/auth/login, /auth/google) with role claim "Admin"
 * Public visitors never touch this — it is only loaded on /admin routes.
 */
import { env } from '../config/env';
import { api, tokenStore } from './api';
import { getFirebase, fsdk, authsdk } from './firebase';

const toSession = (user, isAdmin) => ({ user, role: isAdmin ? 'admin' : null });

const checkFirebaseAdmin = async (fbUser) => {
  const email = (fbUser.email || '').toLowerCase();
  if (env.adminEmails.includes(email)) return true;
  try {
    const { db } = await getFirebase();
    const { doc, getDoc } = await fsdk();
    return (await getDoc(doc(db, 'admins', fbUser.uid))).exists();
  } catch { return false; }
};

const fbUserShape = (u) => ({ id: u.uid, name: u.displayName || u.email, email: u.email, photo: u.photoURL });

const parseJwt = (token) => {
  try { return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))); } catch { return null; }
};
const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
const sessionFromToken = (token, user) => {
  const claims = parseJwt(token) || {};
  const roles = [].concat(claims.role || claims[ROLE_CLAIM] || []);
  if (claims.exp && claims.exp * 1000 < Date.now()) return null;
  return toSession(user || { id: claims.sub, name: claims.name || claims.email, email: claims.email }, roles.map((r) => String(r).toLowerCase()).includes('admin'));
};

export const authService = {
  /** Subscribe to auth state. Calls back with { user, role } or null. Returns unsubscribe. */
  async subscribe(callback) {
    if (env.backend === 'firebase') {
      const { auth } = await getFirebase();
      const { onAuthStateChanged } = await authsdk();
      return onAuthStateChanged(auth, async (u) => {
        if (!u) return callback(null);
        callback(toSession(fbUserShape(u), await checkFirebaseAdmin(u)));
      });
    }
    if (env.backend === 'api') {
      const token = tokenStore.get();
      callback(token ? sessionFromToken(token) : null);
    } else {
      callback(null);
    }
    return () => {};
  },

  async signInWithGoogle() {
    if (env.backend !== 'firebase') throw new Error('Google sign-in through Firebase is not configured.');
    const { auth } = await getFirebase();
    const { GoogleAuthProvider, signInWithPopup } = await authsdk();
    const cred = await signInWithPopup(auth, new GoogleAuthProvider());
    return toSession(fbUserShape(cred.user), await checkFirebaseAdmin(cred.user));
  },

  /** ASP.NET Core: exchange a Google ID token (from Google Identity Services) for our JWT. */
  async signInWithGoogleIdToken(idToken) {
    const { data } = await api.post('/auth/google', { idToken });
    tokenStore.set(data.token);
    return sessionFromToken(data.token, data.user);
  },

  async signInWithPassword(email, password) {
    if (env.backend !== 'api') throw new Error('Email sign-in needs the ASP.NET Core API (VITE_API_BASE_URL).');
    const { data } = await api.post('/auth/login', { email, password });
    tokenStore.set(data.token);
    return sessionFromToken(data.token, data.user);
  },

  async signOut() {
    tokenStore.clear();
    if (env.backend === 'firebase') {
      const { auth } = await getFirebase();
      const { signOut } = await authsdk();
      await signOut(auth);
    }
  },
};

let gsiPromise;
export const loadGoogleIdentity = () => {
  if (!gsiPromise) {
    gsiPromise = new Promise((resolve, reject) => {
      if (window.google?.accounts?.id) return resolve(window.google);
      const s = document.createElement('script');
      s.src = 'https://accounts.google.com/gsi/client';
      s.async = true;
      s.onload = () => resolve(window.google);
      s.onerror = () => reject(new Error('Could not load Google sign-in.'));
      document.head.appendChild(s);
    });
  }
  return gsiPromise;
};
