const c = (v) => `rgb(var(--${v}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: c('bg'),
        'bg-2': c('bg-2'),
        surface: c('surface'),
        ink: c('text'),
        muted: c('muted'),
        line: c('border'),
        primary: c('primary'),
        'primary-ink': c('primary-ink'),
        secondary: c('secondary'),
        accent: c('accent'),
      },
      fontFamily: {
        display: ['"Space Grotesk Variable"', '"Inter Variable"', 'system-ui', 'sans-serif'],
        sans: ['"Inter Variable"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['"JetBrains Mono Variable"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgb(var(--primary) / .28), 0 12px 44px -12px rgb(var(--primary) / .5)',
        card: 'var(--shadow-card)',
      },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        'marquee-rev': { from: { transform: 'translateX(-50%)' }, to: { transform: 'translateX(0)' } },
        pulseDot: { '0%,100%': { opacity: 1, transform: 'scale(1)' }, '50%': { opacity: 0.45, transform: 'scale(0.8)' } },
        spin3d: { from: { transform: 'rotateX(-24deg) rotateY(0deg)' }, to: { transform: 'rotateX(-24deg) rotateY(360deg)' } },
        shimmer: { from: { backgroundPosition: '200% 0' }, to: { backgroundPosition: '-200% 0' } },
      },
      animation: {
        marquee: 'marquee 38s linear infinite',
        'marquee-rev': 'marquee-rev 44s linear infinite',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        spin3d: 'spin3d 22s linear infinite',
        shimmer: 'shimmer 2.4s linear infinite',
      },
    },
  },
  plugins: [],
};
