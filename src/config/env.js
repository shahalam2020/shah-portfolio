const e = import.meta.env;

const firebaseConfig = {
  apiKey: e.VITE_FIREBASE_API_KEY,
  authDomain: e.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: e.VITE_FIREBASE_PROJECT_ID,
  storageBucket: e.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: e.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: e.VITE_FIREBASE_APP_ID,
};

const firebaseReady = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);
const apiBaseUrl = (e.VITE_API_BASE_URL || '').replace(/\/$/, '');

// firebase | api | local — explicit VITE_BACKEND wins, otherwise auto-detect.
const requested = (e.VITE_BACKEND || '').toLowerCase();
let backend = 'local';
if (requested === 'firebase' && firebaseReady) backend = 'firebase';
else if (requested === 'api' && apiBaseUrl) backend = 'api';
else if (!requested) backend = firebaseReady ? 'firebase' : apiBaseUrl ? 'api' : 'local';

const emailjs = {
  serviceId: e.VITE_EMAILJS_SERVICE_ID,
  templateId: e.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: e.VITE_EMAILJS_PUBLIC_KEY,
};

export const env = {
  isDev: e.DEV,
  backend,
  apiBaseUrl,
  firebaseConfig,
  firebaseReady,
  emailjs,
  emailjsReady: Boolean(emailjs.serviceId && emailjs.templateId && emailjs.publicKey),
  googleClientId: e.VITE_GOOGLE_CLIENT_ID || '',
  adminEmails: (e.VITE_ADMIN_EMAILS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean),
  remoteContent: e.VITE_REMOTE_CONTENT === 'true' && backend !== 'local',
  githubUsername: e.VITE_GITHUB_USERNAME || '',
};
