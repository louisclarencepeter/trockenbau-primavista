import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { MoonStar, SunMedium } from 'lucide-react';
import './Navbar.scss';
import { logoSmall } from '../../assets/responsiveImages';
import Button from '../Button/Button';

const navItems = [
  { id: 'leistungen', label: 'Leistungen' },
  { id: 'ueber-uns', label: 'Über uns' },
  { id: 'referenzen', label: 'Referenzen' },
  { id: 'kontakt', label: 'Kontakt' },
];

function Navbar({ theme = 'light', onToggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isInstantClosing, setIsInstantClosing] = useState(false);
  const ThemeIcon = theme === 'dark' ? SunMedium : MoonStar;
  const themeLabel = theme === 'dark' ? 'Hell' : 'Dunkel';
  const themeActionLabel =
    theme === 'dark'
      ? 'Zum hellen Modus wechseln'
      : 'Zum dunklen Modus wechseln';

  const scrollToSection = (id) => {
    const target = document.getElementById(id);

    if (!target) {
      return;
    }

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    window.history.replaceState(null, '', `#${id}`);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const toggleMenu = () => {
    setIsInstantClosing(false);
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsInstantClosing(false);
    setMenuOpen(false);
  };

  const handleNavClick = (id) => (event) => {
    event.preventDefault();
    const shouldCloseInstantly = menuOpen;

    if (shouldCloseInstantly) {
      flushSync(() => {
        setIsInstantClosing(true);
        setMenuOpen(false);
      });
    } else {
      closeMenu();
    }

    if (id === 'top') {
      scrollToTop();
    } else {
      scrollToSection(id);
    }

    if (shouldCloseInstantly) {
      window.requestAnimationFrame(() => {
        setIsInstantClosing(false);
      });
    }
  };

  useEffect(() => {
    const sections = navItems
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) {
      return undefined;
    }

    const updateActiveSection = () => {
      const navbarElement = document.querySelector('.navbar');
      const mobileMenuElement = document.querySelector('.navbar__mobile');
      const navbarHeight = navbarElement ? navbarElement.offsetHeight : 0;
      const mobileMenuHeight =
        menuOpen && mobileMenuElement ? mobileMenuElement.offsetHeight : 0;
      const headerOffset = navbarHeight + mobileMenuHeight;
      const viewportProbe = Math.round(window.innerHeight * 0.32);
      const probeY = Math.max(headerOffset + 24, viewportProbe);

      const activeMatch = sections.find((section) => {
        const rect = section.getBoundingClientRect();

        return rect.top <= probeY && rect.bottom > probeY;
      });

      if (activeMatch) {
        setActiveSection(activeMatch.id);
        return;
      }

      const firstSection = sections[0];

      if (firstSection) {
        const activationOffset = 160;

        if (window.scrollY < firstSection.offsetTop - activationOffset) {
          setActiveSection('');
          return;
        }
      }

      const lastSection = sections[sections.length - 1];

      if (lastSection) {
        setActiveSection(lastSection.id);
      }
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, [menuOpen]);

  const renderThemeToggle = (modifierClass = '') => (
    <button
      className={`navbar__theme-toggle${modifierClass ? ` ${modifierClass}` : ''}`}
      onClick={onToggleTheme}
      type="button"
      aria-label={themeActionLabel}
      aria-pressed={theme === 'dark'}
      title={themeActionLabel}
    >
      <ThemeIcon size={17} strokeWidth={2.2} />
      <span className="navbar__theme-toggle-label">{themeLabel}</span>
    </button>
  );

  return (
    <header className="navbar">
      <div className="container navbar__container">
        <a href="#top" className="navbar__brand" onClick={handleNavClick('top')}>
          <img src={logoSmall} alt="Trockenbau Prima Vista Logo" className="navbar__logo" />
          <div className="navbar__brand-text">
            <span className="navbar__name">Trockenbau Prima Vista</span>
            <span className="navbar__tagline">Sanierung und Renovierung</span>
          </div>
        </a>

        <nav className="navbar__nav">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`navbar__link${activeSection === item.id ? ' is-active' : ''}`}
              onClick={handleNavClick(item.id)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="navbar__utilities">
          {renderThemeToggle()}
          <div className="navbar__cta">
            <Button href="#kontakt" onClick={handleNavClick('kontakt')} variant="primary">
              Jetzt anfragen
            </Button>
          </div>
        </div>

        <button
          className={`navbar__toggle ${menuOpen ? 'is-active' : ''}`}
          onClick={toggleMenu}
          aria-label={menuOpen ? 'Menü schließen' : 'Menü öffnen'}
          aria-expanded={menuOpen}
          type="button"
        >
          <span className="navbar__toggle-line"></span>
          <span className="navbar__toggle-line"></span>
          <span className="navbar__toggle-line"></span>
        </button>
      </div>

      <div className={`navbar__mobile ${menuOpen ? 'is-open' : ''}${isInstantClosing ? ' is-instant' : ''}`}>
        <nav className="navbar__mobile-nav">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`navbar__mobile-link${activeSection === item.id ? ' is-active' : ''}`}
              onClick={handleNavClick(item.id)}
            >
              {item.label}
            </a>
          ))}

          <div className="navbar__mobile-utility">
            {renderThemeToggle('navbar__theme-toggle--mobile')}
          </div>

          <div className="navbar__mobile-cta">
            <Button href="#kontakt" onClick={handleNavClick('kontakt')} variant="primary">
              Jetzt anfragen
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
