export const ease = [0.22, 1, 0.36, 1];

export const staggerContainer = (stagger = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren } },
});

export const staggerItem = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease } },
};

export const spring = { type: 'spring', stiffness: 260, damping: 24, mass: 0.7 };
