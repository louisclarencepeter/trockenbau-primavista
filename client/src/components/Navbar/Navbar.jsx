import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import './Navbar.scss';
import { logoImage, projectFeaturedModernizationImage } from '../../assets/responsiveImages';
import Button from '../Button/Button';
import HashLink from '../HashLink/HashLink';
import PageLink from '../PageLink/PageLink';
import ResponsivePicture from '../ResponsivePicture/ResponsivePicture';
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher';
import { getScrollBehavior, scrollToHashTarget } from '../../utils/hashNavigation';
import { businessProfile } from '../../config/businessProfile';

const navItems = [
  { id: 'leistungen', label: 'Leistungen' },
  {
    id: 'kalkulator',
    label: 'Kalkulator',
    pagePath: '/kalkulator',
    sectionId: 'kostenrechner',
  },
  { id: 'ueber-uns', label: 'Über uns' },
  { id: 'referenzen', label: 'Referenzen' },
  { id: 'kontakt', label: 'Kontakt' },
];

const mobileFeature = {
  image: projectFeaturedModernizationImage,
  eyebrow: 'Im Fokus · Trockenbau',
  title: 'Decken, Wände',
  accent: 'und Ausbau.',
  meta: 'Emmenbrücke · Schweiz',
};

function Navbar({ isHomePage = true, currentPath = '/' }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isInstantClosing, setIsInstantClosing] = useState(false);

  const toggleMenu = () => {
    setIsInstantClosing(false);
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsInstantClosing(false);
    setMenuOpen(false);
  };

  const handleNavClick = (item) => (event) => {
    const shouldCloseInstantly = menuOpen;

    if (shouldCloseInstantly) {
      flushSync(() => {
        setIsInstantClosing(true);
        setMenuOpen(false);
      });
    } else {
      closeMenu();
    }

    if (
      isHomePage &&
      !item.pagePath &&
      event.button === 0 &&
      !event.metaKey &&
      !event.altKey &&
      !event.ctrlKey &&
      !event.shiftKey
    ) {
      event.preventDefault();
      scrollToHashTarget(`#${item.id}`, {
        behavior: getScrollBehavior(),
      });
    }

    if (shouldCloseInstantly) {
      window.requestAnimationFrame(() => {
        setIsInstantClosing(false);
      });
    }
  };

  const getNavHref = (id) => (isHomePage ? `#${id}` : `/#${id}`);
  const getItemHref = (item) => item.pagePath ?? item.href ?? getNavHref(item.id);
  const homeHref = '/';
  const visibleActiveSection = isHomePage ? activeSection : '';
  const isPageItemActive = (item) => {
    if (!item.pagePath) {
      return false;
    }

    const itemPath = item.pagePath.split('#')[0].replace(/\/+$/, '') || '/';

    return currentPath === itemPath;
  };

  useEffect(() => {
    if (!isHomePage) {
      return undefined;
    }

    const sections = navItems
      .map((item) => {
        const element = document.getElementById(item.sectionId ?? item.id);

        if (!element) {
          return null;
        }

        return {
          navId: item.id,
          element,
        };
      })
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
        const rect = section.element.getBoundingClientRect();

        return rect.top <= probeY && rect.bottom > probeY;
      });

      if (activeMatch) {
        setActiveSection(activeMatch.navId);
        return;
      }

      const firstSection = sections[0]?.element;

      if (firstSection) {
        const activationOffset = 160;

        if (window.scrollY < firstSection.offsetTop - activationOffset) {
          setActiveSection('');
          return;
        }
      }

      const lastSection = sections[sections.length - 1];

      if (lastSection?.navId) {
        setActiveSection(lastSection.navId);
      }
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, [isHomePage, menuOpen]);

  return (
    <header className="navbar">
      <div className="container navbar__container">
        <HashLink to={homeHref} className="navbar__brand" onClick={handleNavClick({ id: 'top' })}>
          <ResponsivePicture
            image={logoImage}
            alt={`${businessProfile.publicName} Logo`}
            loading="eager"
            decoding="sync"
            className="navbar__logo"
          />
          <div className="navbar__brand-text">
            <span className="navbar__name">Trockenbau</span>
            <span className="navbar__tagline">PrimaVista Schweiz</span>
          </div>
        </HashLink>

        <nav className="navbar__nav">
          {navItems.map((item) => {
            const className = `navbar__link${
              visibleActiveSection === item.id || isPageItemActive(item) ? ' is-active' : ''
            }`;

            return (
              <HashLink
                key={item.id}
                to={getItemHref(item)}
                className={className}
                onClick={handleNavClick(item)}
              >
                {item.label}
              </HashLink>
            );
          })}
        </nav>

        <div className="navbar__utilities">
          <ThemeSwitcher />
          <div className="navbar__cta">
            <Button href="/anfrage" variant="primary">
              Jetzt Anfrage stellen
            </Button>
          </div>
        </div>

        <button
          className={`navbar__toggle ${menuOpen ? 'is-active' : ''}`}
          onClick={toggleMenu}
          aria-label={menuOpen ? 'Menü schließen' : 'Menü öffnen'}
          aria-expanded={menuOpen}
          aria-controls="navbar-mobile-menu"
          type="button"
        >
          <span className="navbar__toggle-line"></span>
          <span className="navbar__toggle-line"></span>
          <span className="navbar__toggle-line"></span>
        </button>
      </div>

      <div
        id="navbar-mobile-menu"
        className={`navbar__mobile ${menuOpen ? 'is-open' : ''}${isInstantClosing ? ' is-instant' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Hauptnavigation"
        hidden={!menuOpen}
      >
        <PageLink to="/kalkulator" className="navbar__mobile-feature" onClick={closeMenu}>
          <ResponsivePicture
            image={mobileFeature.image}
            alt=""
            loading="lazy"
            decoding="async"
            className="navbar__mobile-feature-image"
          />
          <span className="navbar__mobile-feature-overlay" aria-hidden="true" />
          <span className="navbar__mobile-feature-eyebrow">{mobileFeature.eyebrow}</span>
          <span className="navbar__mobile-feature-body">
            <span className="navbar__mobile-feature-title">
              {mobileFeature.title} <em>{mobileFeature.accent}</em>
            </span>
            <span className="navbar__mobile-feature-meta">{mobileFeature.meta}</span>
          </span>
        </PageLink>

        <nav className="navbar__mobile-nav">
          {navItems.map((item, index) => {
            const className = `navbar__mobile-link${
              visibleActiveSection === item.id || isPageItemActive(item) ? ' is-active' : ''
            }`;

            return (
              <HashLink
                key={item.id}
                to={getItemHref(item)}
                className={className}
                onClick={handleNavClick(item)}
                style={{ '--i': index }}
              >
                <span>{item.label}</span>
                <span className="navbar__mobile-num">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </HashLink>
            );
          })}

          <div className="navbar__mobile-actions">
            <Button href="/anfrage" variant="primary">
              Jetzt Anfrage stellen
            </Button>
            <Button href="/kalkulator" variant="secondary">
              Kosten kalkulieren
            </Button>
          </div>

          <a href="tel:+41782659332" className="navbar__mobile-phone">
            oder direkt anrufen · +41 78 265 93 32
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
