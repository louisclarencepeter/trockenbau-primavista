import { MoonStar, SunMedium } from 'lucide-react';
import './ThemeSwitcher.scss';
import { useTheme } from '../../hooks/useTheme';

const themeOptions = [
  {
    value: 'light',
    label: 'Hell',
    icon: SunMedium,
  },
  {
    value: 'dark',
    label: 'Dunkel',
    icon: MoonStar,
  },
];

function ThemeSwitcher() {
  const { themePreference, resolvedTheme, setThemePreference } = useTheme();
  const statusLabel = themePreference
    ? `Manuell · ${themePreference === 'dark' ? 'Dunkel' : 'Hell'}`
    : `Automatisch · ${resolvedTheme === 'dark' ? 'Dunkel' : 'Hell'}`;

  return (
    <aside className="theme-switcher" aria-label="Darstellungsmodus">
      <div className="theme-switcher__content">
        <div className="theme-switcher__header">
          <span className="theme-switcher__eyebrow">Darstellung</span>
          <span className="theme-switcher__status">{statusLabel}</span>
        </div>

        <div className="theme-switcher__controls" role="group" aria-label="Darstellung auswählen">
          {themeOptions.map((option) => {
            const Icon = option.icon;

            return (
              <button
                key={option.value}
                type="button"
                className={`theme-switcher__button${
                  (themePreference ?? resolvedTheme) === option.value ? ' is-active' : ''
                }`}
                onClick={() => setThemePreference(option.value)}
                aria-pressed={(themePreference ?? resolvedTheme) === option.value}
                title={option.label}
              >
                <Icon size={16} strokeWidth={2.1} />
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

export default ThemeSwitcher;
