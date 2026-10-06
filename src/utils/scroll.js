export const scrollToId = (id, behavior) => {
  const el = document.getElementById(id);
  if (!el) return false;
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: behavior || (reduce ? 'auto' : 'smooth'), block: 'start' });
  // move focus for keyboard / screen-reader users without scrolling again
  el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
  return true;
};
