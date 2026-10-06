import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export default function ArchitectureDiagram({ layers }) {
  const reduce = useReducedMotion();
  return (
    <ol className="mx-auto flex max-w-2xl flex-col items-stretch" aria-label="Architecture layers from client to data">
      {layers.map((l, i) => (
        <li key={l.label} className="flex flex-col items-center">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="glass w-full rounded-2xl p-4"
          >
            <p className="mb-2 font-mono text-xs text-primary-ink">{l.label}</p>
            <ul className="flex flex-wrap gap-2">
              {l.items.map((it) => <li key={it} className="chip-tech">{it}</li>)}
            </ul>
          </motion.div>
          {i < layers.length - 1 && (
            <span className="my-1.5 flex flex-col items-center text-primary-ink/70" aria-hidden="true">
              <span className="h-3 w-px bg-primary/40" />
              <ArrowDown size={14} />
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
