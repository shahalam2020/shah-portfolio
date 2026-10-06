import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import useSEO from '../hooks/useSEO';
import CssCube from '../components/CssCube';

export default function NotFound({ what = 'page' }) {
  useSEO({ title: 'Not found', noindex: true });
  return (
    <section className="container-x grid min-h-[80svh] place-items-center pt-28 text-center">
      <div>
        <div className="mx-auto mb-10 w-fit"><CssCube size={96} /></div>
        <p className="font-mono text-sm text-primary-ink">404</p>
        <h1 className="mt-2 text-4xl font-bold">That {what} doesn’t exist.</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">The link may be old or mistyped. Head back home and pick up from there.</p>
        <Link to="/" className="btn btn-primary mt-8"><Home size={17} aria-hidden="true" /> Back to home</Link>
      </div>
    </section>
  );
}
