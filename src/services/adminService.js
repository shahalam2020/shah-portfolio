/**
 * Admin data layer. Same interface for Firebase, ASP.NET Core and the in-memory demo,
 * so the dashboard UI never cares which backend is behind it.
 *
 *   stats()                   → { visitors, projectViews, messages, unread, projects, skills }
 *   list(kind)                → kind: 'projects' | 'skills' | 'messages'
 *   save(kind, item)          → create or update
 *   remove(kind, id)
 *   upload(folder, file)      → public URL
 *   getSettings()/saveSettings(obj)
 */
import { env } from '../config/env';
import { api } from './api';
import { getFirebase, fsdk, storagesdk } from './firebase';
import { projects as seedProjects } from '../data/projects';
import { skills as seedSkills } from '../data/skills';
import { site } from '../config/site';

const slugify = (s = '') => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const idFor = (kind, item) => item.id || slugify(item.slug || item.title || item.name) || `${kind}-${Date.now()}`;

/* ───────────── Firebase ───────────── */
const firebaseAdmin = () => ({
  async stats() {
    const { db } = await getFirebase();
    const { doc, getDoc, collection, getCountFromServer, query, where } = await fsdk();
    const [statsSnap, p, s, m, u] = await Promise.all([
      getDoc(doc(db, 'stats', 'portfolio')),
      getCountFromServer(collection(db, 'projects')),
      getCountFromServer(collection(db, 'skills')),
      getCountFromServer(collection(db, 'messages')),
      getCountFromServer(query(collection(db, 'messages'), where('read', '==', false))),
    ]);
    const d = statsSnap.exists() ? statsSnap.data() : {};
    return {
      visitors: d.views || 0,
      projectViews: Object.values(d.projectViews || {}).reduce((a, b) => a + b, 0),
      projectViewsBySlug: d.projectViews || {},
      projects: p.data().count || 0, skills: s.data().count || 0, messages: m.data().count || 0, unread: u.data().count || 0,
    };
  },
  async list(kind) {
    const { db } = await getFirebase();
    const { collection, getDocs, query, orderBy } = await fsdk();
    const ref = kind === 'messages' ? query(collection(db, kind), orderBy('createdAt', 'desc')) : collection(db, kind);
    const snap = await getDocs(ref);
    return snap.docs.map((d) => {
      const data = d.data();
      return { id: d.id, ...data, createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt };
    });
  },
  async save(kind, item) {
    const { db } = await getFirebase();
    const { doc, setDoc } = await fsdk();
    const id = idFor(kind, item);
    const { id: _omit, ...data } = { ...item, id };
    await setDoc(doc(db, kind, id), JSON.parse(JSON.stringify(data)), { merge: true });
    return { ...item, id };
  },
  async remove(kind, id) {
    const { db } = await getFirebase();
    const { doc, deleteDoc } = await fsdk();
    await deleteDoc(doc(db, kind, id));
  },
  async upload(folder, file) {
    const { app } = await getFirebase();
    const { getStorage, ref, uploadBytes, getDownloadURL } = await storagesdk();
    const storage = getStorage(app);
    const path = folder === 'resume' ? 'resume/resume.pdf' : `${folder}/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const r = ref(storage, path);
    await uploadBytes(r, file, { contentType: file.type });
    return getDownloadURL(r);
  },
  async getSettings() {
    const { db } = await getFirebase();
    const { doc, getDoc } = await fsdk();
    const snap = await getDoc(doc(db, 'settings', 'site'));
    return snap.exists() ? snap.data() : {};
  },
  async saveSettings(values) {
    const { db } = await getFirebase();
    const { doc, setDoc } = await fsdk();
    await setDoc(doc(db, 'settings', 'site'), values, { merge: true });
  },
});

/* ───────────── ASP.NET Core API ───────────── */
const apiAdmin = () => ({
  stats: async () => (await api.get('/admin/stats')).data,
  list: async (kind) => (await api.get(`/admin/${kind}`)).data,
  save: async (kind, item) => (await (item.id ? api.put(`/admin/${kind}/${item.id}`, item) : api.post(`/admin/${kind}`, item))).data,
  remove: async (kind, id) => { await api.delete(`/admin/${kind}/${id}`); },
  upload: async (folder, file) => {
    const form = new FormData();
    form.append('file', file);
    form.append('folder', folder);
    return (await api.post('/admin/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })).data.url;
  },
  getSettings: async () => (await api.get('/admin/settings')).data,
  saveSettings: async (values) => { await api.put('/admin/settings', values); },
});

/* ───────────── In-memory demo (dev preview only) ───────────── */
const demoAdmin = () => {
  const db = {
    projects: structuredClone(seedProjects).map((p, i) => ({ ...p, order: i })),
    skills: structuredClone(seedSkills).map((s) => ({ ...s, id: slugify(s.name) })),
    messages: [
      { id: 'm1', name: 'Aarav Mehta', email: 'aarav@example.com', subject: 'Freelance project', message: 'Loved your LoopBook case study — are you free for a 6 week project?', read: false, createdAt: new Date(Date.now() - 36e5).toISOString() },
      { id: 'm2', name: 'Priya Sharma', email: 'priya@example.com', subject: 'Hello', message: 'Great portfolio! The 3D cube is beautiful.', read: true, createdAt: new Date(Date.now() - 864e5).toISOString() },
    ],
    settings: { resumePath: site.resumePath, profileImage: site.profileImage },
  };
  return {
    stats: async () => ({
      visitors: 128, projectViews: 342, projectViewsBySlug: { loopbook: 140, remindme: 112, 'salesman-app': 60, 'book-management': 30 },
      projects: db.projects.length, skills: db.skills.length, messages: db.messages.length, unread: db.messages.filter((m) => !m.read).length,
    }),
    list: async (kind) => structuredClone(db[kind]),
    save: async (kind, item) => {
      const id = idFor(kind, item);
      const next = { ...item, id };
      const i = db[kind].findIndex((x) => x.id === id);
      if (i >= 0) db[kind][i] = next; else db[kind].unshift(next);
      return next;
    },
    remove: async (kind, id) => { db[kind] = db[kind].filter((x) => x.id !== id); },
    upload: async (_folder, file) => URL.createObjectURL(file),
    getSettings: async () => ({ ...db.settings }),
    saveSettings: async (v) => { Object.assign(db.settings, v); },
  };
};

export const getAdminApi = (demo) => {
  if (demo) return demoAdmin();
  if (env.backend === 'firebase') return firebaseAdmin();
  if (env.backend === 'api') return apiAdmin();
  return demoAdmin();
};
