import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import './Navbar.scss';
import logo from '../../assets/logo.png';
import Button from '../Button/Button';

const navItems = [
  { id: 'leistungen', label: 'Leistungen' },
  { id: 'referenzen', label: 'Referenzen' },
  { id: 'ueber-uns', label: 'Warum wir' },
  { id: 'kontakt', label: 'Kontakt' },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isInstantClosing, setIsInstantClosing] = useState(false);

  const scrollToSection = (id) => {
    const target = document.getElementById(id);

    if (!target) {
      return;
    }

    const navbarElement = document.querySelector('.navbar');
    const navbarHeight = navbarElement ? navbarElement.offsetHeight : 0;
    const extraOffset = 16;
    const targetTop =
      target.getBoundingClientRect().top + window.scrollY - navbarHeight - extraOffset;

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: 'smooth',
    });

    window.history.replaceState(null, '', `#${id}`);
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

    scrollToSection(id);

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

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length > 0) {
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      {
        threshold: [0.2, 0.35, 0.5, 0.65],
        rootMargin: '-20% 0px -45% 0px',
      }
    );

    sections.forEach((section) => observer.observe(section));

    const firstSection = sections[0];

    const handleScroll = () => {
      if (!firstSection) {
        return;
      }

      const activationOffset = 160;

      if (window.scrollY < firstSection.offsetTop - activationOffset) {
        setActiveSection('');
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className="navbar">
      <div className="container navbar__container">
        <a href="#top" className="navbar__brand" onClick={handleNavClick('top')}>
          <img src={logo} alt="Trockenbau Prima Vista Logo" className="navbar__logo" />
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

        <div className="navbar__cta">
          <Button href="#kontakt" onClick={handleNavClick('kontakt')} variant="primary">
            Jetzt anfragen
          </Button>
        </div>

        <button
          className={`navbar__toggle ${menuOpen ? 'is-active' : ''}`}
          onClick={toggleMenu}
          aria-label="Menü öffnen"
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
