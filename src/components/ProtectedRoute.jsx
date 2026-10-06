import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/** Blocks a route unless the user is signed in AND has the required role (JWT claim / Firebase admin check). */
export default function ProtectedRoute({ role = 'admin', children }) {
  const { status, role: userRole } = useSelector((s) => s.auth);
  const location = useLocation();
  if (status === 'loading') return <div className="grid min-h-[60svh] place-items-center text-muted" role="status">Checking access…</div>;
  if (status !== 'authenticated') return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  if (userRole !== role) return <Navigate to="/admin/login" replace state={{ denied: true }} />;
  return children;
}
