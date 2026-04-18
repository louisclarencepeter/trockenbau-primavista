import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import './Navbar.scss';
import { logoSmall } from '../../assets/responsiveImages';
import Button from '../Button/Button';

const navItems = [
  { id: 'leistungen', label: 'Leistungen' },
  { id: 'ueber-uns', label: 'Über uns' },
  { id: 'referenzen', label: 'Referenzen' },
  { id: 'kalkulator', label: 'Kalkulator', href: '/kalkulator', homeSectionId: 'kostenrechner' },
  { id: 'kontakt', label: 'Kontakt' },
];

function Navbar({ isHomePage = true, currentPath = '/' }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isInstantClosing, setIsInstantClosing] = useState(false);

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
    if (!isHomePage) {
      closeMenu();
      return;
    }

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

  const getNavHref = (id) => (isHomePage ? `#${id}` : `/#${id}`);
  const getItemHref = (item) => item.href ?? getNavHref(item.id);
  const homeHref = isHomePage ? '#top' : '/';
  const visibleActiveSection = isHomePage ? activeSection : '';
  const isPageItemActive = (item) => Boolean(item.href && currentPath === item.href);

  useEffect(() => {
    if (!isHomePage) {
      return undefined;
    }

    const sections = navItems
      .map((item) => {
        const sectionId = item.homeSectionId ?? item.id;
        const element = document.getElementById(sectionId);

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
        <a href={homeHref} className="navbar__brand" onClick={handleNavClick('top')}>
          <img src={logoSmall} alt="Trockenbau Prima Vista Logo" className="navbar__logo" />
          <div className="navbar__brand-text">
            <span className="navbar__name">Trockenbau Prima Vista</span>
            <span className="navbar__tagline">Decken, Wände und Ausbau</span>
          </div>
        </a>

        <nav className="navbar__nav">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={getItemHref(item)}
              className={`navbar__link${
                visibleActiveSection === item.id || isPageItemActive(item) ? ' is-active' : ''
              }`}
              onClick={item.href ? closeMenu : handleNavClick(item.id)}
            >
              {item.label}
            </a>
          ))}
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
          {navItems.map((item) => (
            <a
              key={item.id}
              href={getItemHref(item)}
              className={`navbar__mobile-link${
                visibleActiveSection === item.id || isPageItemActive(item) ? ' is-active' : ''
              }`}
              onClick={item.href ? closeMenu : handleNavClick(item.id)}
            >
              {item.label}
            </a>
          ))}

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
