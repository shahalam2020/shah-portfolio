/**
 * Projects / skills / site settings.
 * By default everything comes from src/data + config/site.js.
 * With VITE_REMOTE_CONTENT=true it is loaded from the backend and gracefully
 * falls back to the bundled data when the backend is empty or unreachable.
 */
import { env } from '../config/env';
import { site } from '../config/site';
import { projects as staticProjects } from '../data/projects';
import { skills as staticSkills } from '../data/skills';
import { api } from './api';
import { getFirebase, fsdk } from './firebase';

export const defaultSettings = { resumePath: site.resumePath, profileImage: site.profileImage };

const normalizeProject = (p) => ({
  categories: [p.category].filter(Boolean),
  technologies: [], features: [], screenshots: [], mockScreens: [], mock: 'expenses',
  accent: ['#22d3ee', '#6366f1'], details: {}, ...p, slug: p.slug || p.id,
});

const fromFirebase = async (name) => {
  const { db } = await getFirebase();
  const { collection, getDocs } = await fsdk();
  const snap = await getDocs(collection(db, name));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

const sortByOrder = (list) => [...list].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

async function fetchList(name) {
  if (env.backend === 'firebase') return fromFirebase(name);
  if (env.backend === 'api') return (await api.get(`/${name}`)).data;
  return [];
}

async function fetchSettings() {
  if (env.backend === 'firebase') {
    const { db } = await getFirebase();
    const { doc, getDoc } = await fsdk();
    const snap = await getDoc(doc(db, 'settings', 'site'));
    return snap.exists() ? snap.data() : {};
  }
  if (env.backend === 'api') return (await api.get('/settings')).data || {};
  return {};
}

let pending;

export function loadContent() {
  if (!env.remoteContent) {
    return Promise.resolve({ projects: staticProjects, skills: staticSkills, settings: defaultSettings });
  }
  if (!pending) {
    pending = Promise.allSettled([fetchList('projects'), fetchList('skills'), fetchSettings()]).then(([p, s, st]) => {
      const rp = p.status === 'fulfilled' && p.value.length ? sortByOrder(p.value).map(normalizeProject) : staticProjects;
      const rs = s.status === 'fulfilled' && s.value.length ? sortByOrder(s.value) : staticSkills;
      const settings = { ...defaultSettings, ...(st.status === 'fulfilled' ? st.value : {}) };
      return { projects: rp, skills: rs, settings };
    });
  }
  return pending;
}
