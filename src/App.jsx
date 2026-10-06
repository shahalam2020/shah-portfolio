import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';

// Code splitting: case-study pages and the admin area load on demand.
const ProjectDetails = lazy(() => import('./pages/ProjectDetails'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

const Fallback = () => <div className="grid min-h-[60svh] place-items-center text-sm text-muted" role="status">Loading…</div>;

export default function App() {
  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="projects/:slug" element={<ProjectDetails />} />
          <Route path="admin" element={<AdminLayout />}>
            <Route path="login" element={<AdminLogin />} />
            <Route index element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
