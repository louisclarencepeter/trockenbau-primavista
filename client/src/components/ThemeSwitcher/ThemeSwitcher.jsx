import { MoonStar, SunMedium } from 'lucide-react';
import './ThemeSwitcher.scss';
import { useTheme } from '../../hooks/useTheme';

function ThemeSwitcher() {
  const { resolvedTheme, setThemePreference } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const nextTheme = isDark ? 'light' : 'dark';
  const Icon = isDark ? MoonStar : SunMedium;
  const label = isDark ? 'Zu hellem Modus wechseln' : 'Zu dunklem Modus wechseln';

  return (
    <button
      type="button"
      className="theme-switcher"
      onClick={() => setThemePreference(nextTheme)}
      aria-label={label}
      title={label}
    >
      <Icon size={18} strokeWidth={2.1} aria-hidden="true" />
    </button>
  );
}

export default ThemeSwitcher;
