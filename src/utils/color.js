// Makes dark brand colours (GitHub, Next, Express…) readable on dark cards and vice-versa.
const luminance = (hex) => {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const adaptIconColor = (hex, isDark) => {
  const l = luminance(hex);
  if (isDark && l < 0.12) return '#e2e8f0';
  if (!isDark && l > 0.55) return '#334155';
  return hex;
};
