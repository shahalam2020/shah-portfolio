import { simpleIcons, lucideIcons } from '../utils/iconMap';
import { adaptIconColor } from '../utils/color';
import useTheme from '../hooks/useTheme';

/** Resolves the brand colour of an icon spec for the current theme. */
export const useIconColor = (icon) => {
  const { isDark } = useTheme();
  if (icon?.si) {
    const d = simpleIcons[icon.si];
    return d ? adaptIconColor(`#${d.hex}`, isDark) : '#38bdf8';
  }
  return adaptIconColor(icon?.color || '#38bdf8', isDark);
};

export default function TechIcon({ icon, size = 28, label, className = '' }) {
  const color = useIconColor(icon);
  if (!icon) return null;

  if (icon.si) {
    const d = simpleIcons[icon.si];
    if (!d) return null;
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill={color} role="img" aria-label={label || d.title} className={className}>
        <path d={d.path} />
      </svg>
    );
  }
  if (icon.lucide) {
    const L = lucideIcons[icon.lucide];
    return L ? <L size={size} color={color} strokeWidth={1.7} aria-label={label} className={className} /> : null;
  }
  return (
    <span
      className={`font-mono font-bold leading-none ${className}`}
      style={{ color, fontSize: size * (icon.mark.length > 2 ? 0.5 : 0.62) }}
      aria-label={label}
    >
      {icon.mark}
    </span>
  );
}
