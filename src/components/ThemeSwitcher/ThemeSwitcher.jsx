import { Monitor, MoonStar, SunMedium } from 'lucide-react';
import './ThemeSwitcher.scss';

const themeOptions = [
  {
    value: 'system',
    label: 'Auto',
    icon: Monitor,
  },
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

function ThemeSwitcher({ themePreference = 'system', resolvedTheme = 'light', onChange }) {
  const statusLabel = themePreference === 'system'
    ? `Automatisch · folgt ${resolvedTheme === 'dark' ? 'Dunkel' : 'Hell'}`
    : `Manuell · ${themePreference === 'dark' ? 'Dunkel' : 'Hell'}`;

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
                className={`theme-switcher__button${themePreference === option.value ? ' is-active' : ''}`}
                onClick={() => onChange(option.value)}
                aria-pressed={themePreference === option.value}
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
