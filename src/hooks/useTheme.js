import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../store/themeSlice';

export default function useTheme() {
  const mode = useSelector((s) => s.theme.mode);
  const dispatch = useDispatch();
  return { mode, isDark: mode === 'dark', toggle: () => dispatch(toggleTheme()) };
}
