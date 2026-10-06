import { useEffect, useRef, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Chrome, Loader2, ShieldCheck, Eye } from 'lucide-react';
import { authService, loadGoogleIdentity } from '../../services/authService';
import { setAuthError, setForbidden, setSession } from '../../store/authSlice';
import { env } from '../../config/env';
import Logo from '../../components/Logo';

export default function AdminLogin() {
  const dispatch = useDispatch();
  const { status, error } = useSelector((s) => s.auth);
  const location = useLocation();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({ email: '', password: '' });
  const gsi = useRef(null);

  const finish = (session) => {
    if (session.role !== 'admin') dispatch(setForbidden(session.user));
    else dispatch(setSession(session));
  };
  const run = async (fn) => {
    setBusy(true); setMsg('');
    try { finish(await fn()); } catch (e) { setMsg(e.message); dispatch(setAuthError(e.message)); } finally { setBusy(false); }
  };

  useEffect(() => {
    if (env.backend !== 'api' || !env.googleClientId || !gsi.current) return;
    loadGoogleIdentity().then((google) => {
      google.accounts.id.initialize({ client_id: env.googleClientId, callback: (r) => run(() => authService.signInWithGoogleIdToken(r.credential)) });
      google.accounts.id.renderButton(gsi.current, { theme: 'outline', size: 'large', width: 280 });
    }).catch((e) => setMsg(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === 'authenticated') return <Navigate to={location.state?.from?.startsWith('/admin') ? location.state.from : '/admin'} replace />;

  return (
    <section className="container-x grid min-h-[100svh] place-items-center pb-16 pt-28">
      <div className="card w-full max-w-md p-8">
        <Logo />
        <h1 className="mt-8 flex items-center gap-2 text-2xl font-bold"><ShieldCheck size={22} className="text-primary-ink" aria-hidden="true" /> Admin sign in</h1>
        <p className="mt-2 text-sm text-muted">Restricted area. Only accounts with the Admin role can continue.</p>

        {(msg || error || location.state?.denied) && (
          <p role="alert" className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-300">{msg || error || 'This account does not have admin access.'}</p>
        )}

        <div className="mt-6 grid gap-3">
          {env.backend === 'firebase' && (
            <button type="button" disabled={busy} className="btn btn-primary w-full" onClick={() => run(() => authService.signInWithGoogle())}>
              {busy ? <Loader2 size={17} className="animate-spin" /> : <Chrome size={17} aria-hidden="true" />} Continue with Google
            </button>
          )}

          {env.backend === 'api' && (
            <>
              {env.googleClientId && <div ref={gsi} className="flex justify-center" />}
              <form className="grid gap-3" onSubmit={(e) => { e.preventDefault(); run(() => authService.signInWithPassword(form.email, form.password)); }}>
                <label className="text-sm font-medium" htmlFor="a-email">Email</label>
                <input id="a-email" className="input" type="email" autoComplete="username" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <label className="text-sm font-medium" htmlFor="a-pass">Password</label>
                <input id="a-pass" className="input" type="password" autoComplete="current-password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <button className="btn btn-primary" disabled={busy}>{busy ? <Loader2 size={17} className="animate-spin" /> : null} Sign in</button>
              </form>
            </>
          )}

          {env.backend === 'local' && (
            <p className="rounded-2xl border border-line/20 p-4 text-sm text-muted">
              No backend is configured yet. Add Firebase or <code className="font-mono text-primary-ink">VITE_API_BASE_URL</code> to <code className="font-mono">.env</code> to enable sign-in.
            </p>
          )}

          {env.isDev && (
            <button type="button" className="btn btn-ghost w-full" onClick={() => dispatch(setSession({ user: { name: 'Demo admin', email: 'demo@local' }, role: 'admin', demo: true }))}>
              <Eye size={17} aria-hidden="true" /> Preview dashboard (demo data, dev only)
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
