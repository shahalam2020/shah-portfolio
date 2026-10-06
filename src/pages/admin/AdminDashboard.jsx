import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Eye, FileText, FolderKanban, Inbox, LayoutDashboard, Loader2, LogOut, Mail, MailOpen, Pencil, Plus, Settings, Trash2, Upload, Users, Wrench, X } from 'lucide-react';
import { getAdminApi } from '../../services/adminService';
import { authService } from '../../services/authService';
import { clearSession } from '../../store/authSlice';
import { projectCategories, projects as seedProjects } from '../../data/projects';
import { skillCategories, skills as seedSkills } from '../../data/skills';
import Logo from '../../components/Logo';
import ThemeToggle from '../../components/ThemeToggle';

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'skills', label: 'Skills', icon: Wrench },
  { id: 'messages', label: 'Messages', icon: Inbox },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const lines = (v) => v.split('\n').map((s) => s.trim()).filter(Boolean);
const csv = (v) => v.split(',').map((s) => s.trim()).filter(Boolean);

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="card p-5">
      <Icon size={18} className="text-primary-ink" aria-hidden="true" />
      <p className="mt-3 font-display text-3xl font-bold">{value ?? '—'}</p>
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);
  return (
    <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="card my-8 w-full max-w-3xl p-6 sm:p-8">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">{title}</h2>
          <button type="button" className="icon-btn h-9 w-9 rounded-xl" onClick={onClose} aria-label="Close"><X size={16} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

const Label = ({ id, children }) => <label htmlFor={id} className="mb-1 block text-xs font-medium text-muted">{children}</label>;

function ProjectForm({ initial, api, onSave, onCancel }) {
  const p = initial || {};
  const [f, setF] = useState({
    title: p.title || '', slug: p.slug || '', tagline: p.tagline || '', category: p.category || 'Full Stack',
    categories: (p.categories || []).join(', '), year: p.year || String(new Date().getFullYear()), role: p.role || 'Full Stack Developer', status: p.status || 'In development',
    description: p.description || '', image: p.image || '', technologies: (p.technologies || []).join(', '), features: (p.features || []).join('\n'),
    screenshots: (p.screenshots || []).map((s) => (typeof s === 'string' ? s : s.src)).join('\n'), github: p.github || '', liveDemo: p.liveDemo || '',
    details: JSON.stringify(p.details || {}, null, 2),
  });
  const [busy, setBusy] = useState('');
  const [err, setErr] = useState('');
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  const upload = async (files, target) => {
    setBusy('upload'); setErr('');
    try {
      const urls = [];
      for (const file of files) urls.push(await api.upload('projects', file));
      setF((s) => ({ ...s, [target]: target === 'image' ? urls[0] : [s.screenshots, ...urls].filter(Boolean).join('\n') }));
    } catch (e) { setErr(e.message); } finally { setBusy(''); }
  };

  const submit = async (e) => {
    e.preventDefault();
    let details;
    try { details = JSON.parse(f.details || '{}'); } catch { setErr('“Case study details” must be valid JSON.'); return; }
    setBusy('save'); setErr('');
    try {
      const cats = csv(f.categories);
      await onSave({
        ...p, title: f.title, slug: f.slug || undefined, tagline: f.tagline, category: f.category, categories: cats.length ? cats : [f.category],
        year: f.year, role: f.role, status: f.status, description: f.description, image: f.image, technologies: csv(f.technologies), features: lines(f.features),
        screenshots: lines(f.screenshots), github: f.github, liveDemo: f.liveDemo, details,
        mock: p.mock || 'expenses', accent: p.accent || ['#22d3ee', '#6366f1'], mockScreens: p.mockScreens || [],
      });
    } catch (e2) { setErr(e2.message); setBusy(''); }
  };

  return (
    <form onSubmit={submit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label id="p-title">Title</Label><input id="p-title" required className="input" value={f.title} onChange={set('title')} /></div>
        <div><Label id="p-slug">URL slug (auto if empty)</Label><input id="p-slug" className="input" value={f.slug} onChange={set('slug')} placeholder="my-project" /></div>
      </div>
      <div><Label id="p-tag">Tagline</Label><input id="p-tag" className="input" value={f.tagline} onChange={set('tagline')} /></div>
      <div><Label id="p-desc">Short description</Label><textarea id="p-desc" rows={2} className="input" value={f.description} onChange={set('description')} /></div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div><Label id="p-cat">Main category</Label><select id="p-cat" className="input" value={f.category} onChange={set('category')}>{projectCategories.filter((c) => c !== 'All').map((c) => <option key={c}>{c}</option>)}</select></div>
        <div className="sm:col-span-2"><Label id="p-cats">All categories (comma separated)</Label><input id="p-cats" className="input" value={f.categories} onChange={set('categories')} placeholder="Full Stack, API, Mobile" /></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div><Label id="p-year">Year</Label><input id="p-year" className="input" value={f.year} onChange={set('year')} /></div>
        <div><Label id="p-role">Role</Label><input id="p-role" className="input" value={f.role} onChange={set('role')} /></div>
        <div><Label id="p-status">Status</Label><input id="p-status" className="input" value={f.status} onChange={set('status')} /></div>
      </div>
      <div><Label id="p-tech">Technologies (comma separated)</Label><input id="p-tech" className="input" value={f.technologies} onChange={set('technologies')} /></div>
      <div><Label id="p-feat">Key features (one per line)</Label><textarea id="p-feat" rows={4} className="input" value={f.features} onChange={set('features')} /></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label id="p-gh">GitHub URL</Label><input id="p-gh" className="input" value={f.github} onChange={set('github')} /></div>
        <div><Label id="p-live">Live demo URL</Label><input id="p-live" className="input" value={f.liveDemo} onChange={set('liveDemo')} /></div>
      </div>
      <div>
        <Label id="p-img">Cover image URL</Label>
        <div className="flex gap-2">
          <input id="p-img" className="input" value={f.image} onChange={set('image')} placeholder="https://…" />
          <label className="btn btn-ghost btn-sm shrink-0 cursor-pointer"><Upload size={14} aria-hidden="true" /> Upload<input type="file" accept="image/*" hidden onChange={(e) => e.target.files[0] && upload([e.target.files[0]], 'image')} /></label>
        </div>
      </div>
      <div>
        <Label id="p-shots">Screenshots (one URL per line)</Label>
        <textarea id="p-shots" rows={3} className="input font-mono text-xs" value={f.screenshots} onChange={set('screenshots')} />
        <label className="btn btn-ghost btn-sm mt-2 cursor-pointer"><Upload size={14} aria-hidden="true" /> Upload screenshots<input type="file" accept="image/*" multiple hidden onChange={(e) => e.target.files.length && upload([...e.target.files], 'screenshots')} /></label>
      </div>
      <details className="rounded-2xl border border-line/20 p-4">
        <summary className="cursor-pointer text-sm font-medium">Case study details (JSON)</summary>
        <textarea aria-label="Case study details JSON" rows={10} className="input mt-3 font-mono text-xs" value={f.details} onChange={set('details')} />
      </details>
      {err && <p role="alert" className="text-sm text-red-500">{err}</p>}
      <div className="flex justify-end gap-2">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary" disabled={Boolean(busy)}>{busy && <Loader2 size={16} className="animate-spin" />} Save project</button>
      </div>
    </form>
  );
}

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { user, demo } = useSelector((s) => s.auth);
  const api = useMemo(() => getAdminApi(demo), [demo]);
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [data, setData] = useState({ projects: [], skills: [], messages: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); // project | {} (new) | null
  const [skillForm, setSkillForm] = useState({ name: '', category: 'Frontend', level: 3, description: '' });
  const [settings, setSettings] = useState({});
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [s, projects, skills, messages, st] = await Promise.all([api.stats(), api.list('projects'), api.list('skills'), api.list('messages'), api.getSettings()]);
      setStats(s); setData({ projects, skills, messages }); setSettings(st || {});
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  }, [api]);
  useEffect(() => { load(); }, [load]);

  const flash = (m) => { setNotice(m); window.setTimeout(() => setNotice(''), 2500); };
  const act = async (fn, ok) => { try { await fn(); flash(ok); await load(); } catch (e) { setError(e.message); } };

  const signOut = async () => { await authService.signOut(); dispatch(clearSession()); };

  // One-click import of the bundled projects (src/data/projects.js) into the backend.
  const importBundled = () => act(async () => {
    for (const [i, p] of seedProjects.entries()) {
      await api.save('projects', { ...p, order: i });
    }
  }, 'Bundled projects imported');

  // One-click import of the bundled skills (src/data/skills.js) into the backend.
  const importSkills = () => act(async () => {
    const existing = new Set(data.skills.map((s) => s.name));
    for (const [i, s] of seedSkills.entries()) {
      if (existing.has(s.name)) continue; // skip duplicates
      await api.save('skills', { ...s, order: i });
    }
  }, 'Bundled skills imported');

  return (
    <div className="container-x pb-16 pt-24">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4"><Link to="/" aria-label="Back to site"><Logo /></Link><span className="chip">Admin{demo ? ' · demo data' : ''}</span></div>
        <div className="flex items-center gap-2">
          <span className="hidden text-sm text-muted sm:block">{user?.email}</span>
          <ThemeToggle />
          <button type="button" className="btn btn-ghost btn-sm" onClick={signOut}><LogOut size={14} aria-hidden="true" /> Sign out</button>
        </div>
      </header>

      <div role="tablist" aria-label="Admin sections" className="glass mb-8 flex gap-1 overflow-x-auto rounded-2xl p-1.5">
        {TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} type="button" className={`inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition ${tab === t.id ? 'bg-primary/15 text-ink' : 'text-muted hover:text-ink'}`}>
            <t.icon size={15} aria-hidden="true" /> {t.label}
            {t.id === 'messages' && stats?.unread > 0 && <span className="rounded-full bg-primary px-1.5 text-[10px] font-bold text-bg">{stats.unread}</span>}
          </button>
        ))}
      </div>

      {error && <p role="alert" className="mb-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-300">{error}</p>}
      {notice && <p role="status" className="mb-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-300">{notice}</p>}
      {loading && <p className="text-sm text-muted" role="status"><Loader2 size={14} className="mr-2 inline animate-spin" />Loading…</p>}

      {!loading && tab === 'overview' && (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
            <Stat icon={Users} label="Total visitors" value={stats?.visitors} />
            <Stat icon={Eye} label="Project views" value={stats?.projectViews} />
            <Stat icon={Mail} label="Contact messages" value={stats?.messages} />
            <Stat icon={FolderKanban} label="Projects" value={stats?.projects} />
            <Stat icon={Wrench} label="Skills" value={stats?.skills} />
          </div>
          {stats?.projectViewsBySlug && Object.keys(stats.projectViewsBySlug).length > 0 && (
            <div className="card mt-6 p-6">
              <h2 className="mb-4 font-semibold">Views by project</h2>
              <ul className="space-y-3">
                {Object.entries(stats.projectViewsBySlug).sort((a, b) => b[1] - a[1]).map(([slug, n]) => {
                  const max = Math.max(...Object.values(stats.projectViewsBySlug));
                  return (
                    <li key={slug} className="grid grid-cols-[8rem_1fr_3rem] items-center gap-3 text-sm">
                      <span className="truncate font-mono text-xs">{slug}</span>
                      <span className="h-2 overflow-hidden rounded-full bg-line/15"><span className="block h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${(n / max) * 100}%` }} /></span>
                      <span className="text-right text-muted">{n}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </>
      )}

      {!loading && tab === 'projects' && (
        <div>
          <div className="mb-4 flex justify-between"><h2 className="text-xl font-bold">Projects</h2><button type="button" className="btn btn-primary btn-sm" onClick={() => setEditing({})}><Plus size={14} aria-hidden="true" /> Create project</button></div>
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="text-xs text-muted"><tr><th className="p-4 font-medium">Title</th><th className="p-4 font-medium">Category</th><th className="p-4 font-medium">Year</th><th className="p-4 text-right font-medium">Actions</th></tr></thead>
              <tbody>
                {data.projects.map((p) => (
                  <tr key={p.id} className="border-t border-line/10">
                    <td className="p-4 font-medium">{p.title}<span className="block font-mono text-xs text-muted">/{p.slug}</span></td>
                    <td className="p-4 text-muted">{p.category}</td><td className="p-4 text-muted">{p.year}</td>
                    <td className="p-4 text-right">
                      <button type="button" className="icon-btn mr-1 h-9 w-9 rounded-xl" aria-label={`Edit ${p.title}`} onClick={() => setEditing(p)}><Pencil size={14} /></button>
                      <button type="button" className="icon-btn h-9 w-9 rounded-xl hover:!text-red-500" aria-label={`Delete ${p.title}`} onClick={() => window.confirm(`Delete “${p.title}”? This cannot be undone.`) && act(() => api.remove('projects', p.id), 'Project deleted')}><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
                {data.projects.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-muted">
                      No projects yet.{' '}
                      <button type="button" className="btn btn-primary btn-sm ml-2" onClick={importBundled}>
                        Import my {seedProjects.length} projects
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && tab === 'skills' && (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="card h-fit divide-y divide-line/10">
            {data.skills.map((s) => (
              <div key={s.id || s.name} className="flex items-center justify-between gap-3 p-4">
                <div><p className="text-sm font-medium">{s.name}</p><p className="text-xs text-muted">{s.category} · level {s.level}</p></div>
                <button type="button" className="icon-btn h-9 w-9 rounded-xl hover:!text-red-500" aria-label={`Delete ${s.name}`} onClick={() => act(() => api.remove('skills', s.id || s.name), 'Skill deleted')}><Trash2 size={14} /></button>
              </div>
            ))}
            {data.skills.length === 0 && (
              <div className="p-8 text-center text-muted">
                No skills yet.{' '}
                <button type="button" className="btn btn-primary btn-sm ml-2" onClick={importSkills}>
                  Import my {seedSkills.length} skills
                </button>
              </div>
            )}
          </div>
          <form className="card h-fit grid gap-3 p-5" onSubmit={(e) => { e.preventDefault(); act(async () => { await api.save('skills', { ...skillForm, level: Number(skillForm.level), icon: { mark: skillForm.name.slice(0, 2).toUpperCase(), color: '#38bdf8' } }); setSkillForm({ name: '', category: 'Frontend', level: 3, description: '' }); }, 'Skill saved'); }}>
            <h2 className="font-semibold">Add skill</h2>
            <div><Label id="s-name">Name</Label><input id="s-name" required className="input" value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} /></div>
            <div><Label id="s-cat">Category</Label><select id="s-cat" className="input" value={skillForm.category} onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}>{skillCategories.map((c) => <option key={c.id}>{c.id}</option>)}</select></div>
            <div><Label id="s-lvl">Level (1–4)</Label><input id="s-lvl" type="number" min="1" max="4" className="input" value={skillForm.level} onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value })} /></div>
            <div><Label id="s-desc">Description</Label><textarea id="s-desc" rows={2} className="input" value={skillForm.description} onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })} /></div>
            <button className="btn btn-primary btn-sm"><Plus size={14} aria-hidden="true" /> Add skill</button>
          </form>
        </div>
      )}

      {!loading && tab === 'messages' && (
        <ul className="grid gap-3">
          {data.messages.map((m) => (
            <li key={m.id} className={`card p-5 ${m.read ? 'opacity-80' : 'border-primary/40'}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><p className="font-semibold">{m.subject || '(no subject)'}</p><p className="text-sm text-muted">{m.name} · <a className="text-primary-ink hover:underline" href={`mailto:${m.email}`}>{m.email}</a> · {m.createdAt ? new Date(m.createdAt).toLocaleString() : ''}</p></div>
                <div className="flex gap-1">
                  <button type="button" className="icon-btn h-9 w-9 rounded-xl" aria-label={m.read ? 'Mark unread' : 'Mark read'} onClick={() => act(() => api.save('messages', { ...m, read: !m.read }), 'Updated')}>{m.read ? <Mail size={14} /> : <MailOpen size={14} />}</button>
                  <button type="button" className="icon-btn h-9 w-9 rounded-xl hover:!text-red-500" aria-label="Delete message" onClick={() => act(() => api.remove('messages', m.id), 'Message deleted')}><Trash2 size={14} /></button>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-muted">{m.message}</p>
            </li>
          ))}
          {data.messages.length === 0 && <li className="card p-10 text-center text-muted">No messages yet. They will appear here when someone uses the contact form.</li>}
        </ul>
      )}

      {!loading && tab === 'settings' && (
        <div className="grid gap-5 md:grid-cols-2">
          {[['resumePath', 'Resume (PDF)', 'application/pdf', 'resume', FileText], ['profileImage', 'Profile image', 'image/*', 'profile', Users]].map(([key, label, accept, folder, Icon]) => (
            <div key={key} className="card p-6">
              <h2 className="mb-1 flex items-center gap-2 font-semibold"><Icon size={16} className="text-primary-ink" aria-hidden="true" />{label}</h2>
              <p className="mb-4 break-all font-mono text-xs text-muted">{settings[key] || 'Using the default from config/site.js'}</p>
              <label className="btn btn-ghost btn-sm cursor-pointer"><Upload size={14} aria-hidden="true" /> Upload new<input type="file" accept={accept} hidden onChange={(e) => { const file = e.target.files[0]; if (file) act(async () => { const url = await api.upload(folder, file); await api.saveSettings({ [key]: url }); }, `${label} updated`); }} /></label>
            </div>
          ))}
          <p className="text-xs text-muted md:col-span-2">Remote settings are used by the public site when <code className="font-mono">VITE_REMOTE_CONTENT=true</code>.</p>
        </div>
      )}

      {editing && (
        <Modal title={editing.id ? `Edit ${editing.title}` : 'Create project'} onClose={() => setEditing(null)}>
          <ProjectForm initial={editing.id ? editing : null} api={api} onCancel={() => setEditing(null)} onSave={async (item) => { await api.save('projects', item); setEditing(null); flash('Project saved'); await load(); }} />
        </Modal>
      )}
    </div>
  );
}