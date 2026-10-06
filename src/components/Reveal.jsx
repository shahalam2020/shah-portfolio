import { motion, useReducedMotion } from 'framer-motion';
import { ease } from '../utils/motion';

export default function Reveal({ children, className, delay = 0, y = 22, as = 'div', once = true, amount = 0.2, ...rest }) {
  const reduce = useReducedMotion();
  if (reduce) {
    const T = as;
    return <T className={className} {...rest}>{children}</T>;
  }
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.7, delay, ease }}
      {...rest}
    >
      {children}
    </M>
  );
}
