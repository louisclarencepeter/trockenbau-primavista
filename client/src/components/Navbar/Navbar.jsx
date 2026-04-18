import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import './Navbar.scss';
import { logoSmall } from '../../assets/responsiveImages';
import Button from '../Button/Button';
import HashLink from '../HashLink/HashLink';
import { getScrollBehavior, scrollToHashTarget } from '../../utils/hashNavigation';

const navItems = [
  { id: 'leistungen', label: 'Leistungen' },
  { id: 'kostenrechner', label: 'Kalkulator', pagePath: '/kalkulator' },
  { id: 'ueber-uns', label: 'Über uns' },
  { id: 'referenzen', label: 'Referenzen' },
  { id: 'kontakt', label: 'Kontakt' },
];

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

  const handleNavClick = (id) => (event) => {
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
      event.button === 0 &&
      !event.metaKey &&
      !event.altKey &&
      !event.ctrlKey &&
      !event.shiftKey
    ) {
      event.preventDefault();
      scrollToHashTarget(`#${id}`, {
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
  const getItemHref = (item) => {
    if (item.pagePath && !isHomePage) {
      return item.pagePath;
    }

    return item.href ?? getNavHref(item.id);
  };
  const homeHref = '/';
  const visibleActiveSection = isHomePage ? activeSection : '';
  const isPageItemActive = (item) => Boolean(item.pagePath && currentPath === item.pagePath);

  useEffect(() => {
    if (!isHomePage) {
      return undefined;
    }

    const sections = navItems
      .map((item) => {
        const element = document.getElementById(item.id);

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
        <HashLink to={homeHref} className="navbar__brand" onClick={handleNavClick('top')}>
          <img src={logoSmall} alt="Trockenbau Prima Vista Logo" className="navbar__logo" />
          <div className="navbar__brand-text">
            <span className="navbar__name">Trockenbau Prima Vista</span>
            <span className="navbar__tagline">Decken, Wände und Ausbau</span>
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
                onClick={handleNavClick(item.id)}
              >
                {item.label}
              </HashLink>
            );
          })}
        </nav>

        <div className="navbar__utilities">
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
          type="button"
        >
          <span className="navbar__toggle-line"></span>
          <span className="navbar__toggle-line"></span>
          <span className="navbar__toggle-line"></span>
        </button>
      </div>

      <div className={`navbar__mobile ${menuOpen ? 'is-open' : ''}${isInstantClosing ? ' is-instant' : ''}`}>
        <nav className="navbar__mobile-nav">
          {navItems.map((item) => {
            const className = `navbar__mobile-link${
              visibleActiveSection === item.id || isPageItemActive(item) ? ' is-active' : ''
            }`;

            return (
              <HashLink
                key={item.id}
                to={getItemHref(item)}
                className={className}
                onClick={handleNavClick(item.id)}
              >
                {item.label}
              </HashLink>
            );
          })}

          <div className="navbar__mobile-cta">
            <Button href="/anfrage" variant="primary">
              Jetzt Anfrage stellen
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
