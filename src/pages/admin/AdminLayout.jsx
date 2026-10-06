import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authService } from '../../services/authService';
import { clearSession, setForbidden, setSession } from '../../store/authSlice';
import useSEO from '../../hooks/useSEO';

/** Subscribes to auth state — only mounted on /admin routes, so public visitors never load auth code. */
export default function AdminLayout() {
  const dispatch = useDispatch();
  const demo = useSelector((s) => s.auth.demo);
  useSEO({ title: 'Admin', noindex: true, path: '/admin' });

  useEffect(() => {
    if (demo) return undefined;
    let unsub = () => {};
    let alive = true;
    authService.subscribe((session) => {
      if (!alive) return;
      if (!session) dispatch(clearSession());
      else if (session.role !== 'admin') dispatch(setForbidden(session.user));
      else dispatch(setSession(session));
    }).then((u) => { unsub = u; }).catch(() => dispatch(clearSession()));
    return () => { alive = false; unsub?.(); };
  }, [dispatch, demo]);

  return <Outlet />;
}
