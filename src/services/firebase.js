import { env } from '../config/env';

let cached;

/** Lazy-loads the Firebase SDK only when a feature actually needs it. */
export function getFirebase() {
  if (!cached) {
    cached = (async () => {
      const [{ initializeApp, getApps }, { getFirestore }, { getAuth }] = await Promise.all([
        import('firebase/app'),
        import('firebase/firestore'),
        import('firebase/auth'),
      ]);
      const app = getApps()[0] || initializeApp(env.firebaseConfig);
      return { app, db: getFirestore(app), auth: getAuth(app) };
    })();
  }
  return cached;
}

export const fsdk = () => import('firebase/firestore');
export const authsdk = () => import('firebase/auth');
export const storagesdk = () => import('firebase/storage');
