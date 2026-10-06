import { motion, useReducedMotion } from 'framer-motion';
import { ease } from '../utils/motion';

/** Word-by-word masked reveal. Screen readers get the full sentence via aria-label. */
export default function SplitText({ text, className = '', delay = 0, wordClass = '' }) {
  const reduce = useReducedMotion();
  const words = text.split(' ');
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`} aria-hidden="true" className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            className={`inline-block ${wordClass}`}
            initial={reduce ? false : { y: '110%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease, delay: delay + i * 0.07 }}
          >
            {w}
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
