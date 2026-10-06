import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { getViewCount } from '../services/analyticsService';
import { site } from '../config/site';
import useCountUp from '../hooks/useCountUp';

const fmt = new Intl.NumberFormat('en-US');

export default function ViewCounter({ className = '' }) {
  const [data, setData] = useState(undefined);
  useEffect(() => {
    let alive = true;
    getViewCount().then((d) => alive && setData(d));
    return () => { alive = false; };
  }, []);
  const value = useCountUp(data?.count ?? null);

  if (data === null) return null; // analytics unavailable — hide instead of faking a number
  return (
    <p className={`inline-flex items-center gap-2 text-sm text-muted ${className}`} aria-live="polite">
      <Eye size={16} className="text-primary-ink" aria-hidden="true" />
      <span>{site.viewCounter.label}:</span>
      {data === undefined ? (
        <span className="skeleton inline-block h-4 w-14 rounded" aria-label="Loading" />
      ) : (
        <strong className="font-mono font-semibold text-ink" title={data.scope === 'device' ? 'Counted on this device (connect a backend for global totals)' : 'Total visits'}>
          {fmt.format(value)}
        </strong>
      )}
    </p>
  );
}
