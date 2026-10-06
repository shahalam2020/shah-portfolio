/**
 * Portfolio view counter.
 *
 * What counts as a "view": ONE visit per browser per 24 hours (identified by an
 * anonymous random id stored locally). Reloading the page never inflates the number,
 * and automated browsers are ignored.
 *
 * Backends (see config/env.js):
 *   firebase → Firestore doc  stats/portfolio  { views, projectViews }
 *   api      → POST {API}/analytics/visit   GET {API}/analytics/views
 *   local    → localStorage counter (device-only; shown honestly as such)
 */
import { env } from '../config/env';
import { site } from '../config/site';
import { api } from './api';
import { getFirebase, fsdk } from './firebase';

const DAY = 24 * 60 * 60 * 1000;
const K = { visitor: 'portfolio-visitor-id', counted: 'portfolio-last-counted', local: 'portfolio-local-views' };

const read = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const write = (k, v) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } };

const visitorId = () => {
  let id = read(K.visitor);
  if (!id) {
    id = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    write(K.visitor, id);
  }
  return id;
};

const isBot = () => typeof navigator !== 'undefined' && navigator.webdriver === true;
const shouldCount = () => !isBot() && Date.now() - Number(read(K.counted) || 0) > DAY;
const markCounted = () => write(K.counted, String(Date.now()));

const providers = {
  async firebase() {
    const { db } = await getFirebase();
    const { doc, setDoc, getDoc, increment, serverTimestamp } = await fsdk();
    const ref = doc(db, 'stats', 'portfolio');
    if (shouldCount()) {
      await setDoc(ref, { views: increment(1), updatedAt: serverTimestamp() }, { merge: true });
      markCounted();
    }
    const snap = await getDoc(ref);
    return { count: snap.exists() ? snap.data().views || 0 : 0, scope: 'global' };
  },
  async api() {
    if (shouldCount()) {
      const { data } = await api.post('/analytics/visit', { visitorId: visitorId(), path: window.location.pathname });
      markCounted();
      return { count: data.totalViews ?? data.total ?? 0, scope: 'global' };
    }
    const { data } = await api.get('/analytics/views');
    return { count: data.totalViews ?? data.total ?? 0, scope: 'global' };
  },
  async local() {
    let n = Number(read(K.local) || 0);
    if (shouldCount()) { n += 1; write(K.local, String(n)); markCounted(); }
    return { count: n, scope: 'device' };
  },
};

let pending;

/** Registers the visit (if meaningful) and resolves with the current total. Safe to call many times. */
export function getViewCount() {
  if (!pending) {
    pending = providers[env.backend]()
      .then((r) => ({ ...r, count: r.count + (site.viewCounter.baseline || 0) }))
      .catch(() => null);
  }
  return pending;
}

/** Counts a project page view (once per browser session per project). */
export async function trackProjectView(slug) {
  if (isBot() || env.backend === 'local') return;
  const key = `portfolio-pv-${slug}`;
  try { if (sessionStorage.getItem(key)) return; sessionStorage.setItem(key, '1'); } catch { /* ignore */ }
  try {
    if (env.backend === 'firebase') {
      const { db } = await getFirebase();
      const { doc, updateDoc, setDoc, increment } = await fsdk();
      const ref = doc(db, 'stats', 'portfolio');
      try { await updateDoc(ref, { [`projectViews.${slug}`]: increment(1) }); }
      catch { await setDoc(ref, { projectViews: { [slug]: increment(1) } }, { merge: true }); }
    } else if (env.backend === 'api') {
      await api.post('/analytics/project-view', { slug, visitorId: visitorId() });
    }
  } catch { /* analytics must never break the page */ }
}
