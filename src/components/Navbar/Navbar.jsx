import { useEffect, useState } from 'react';
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
  const [activeSection, setActiveSection] = useState('leistungen');

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
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

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <header className="navbar">
      <div className="container navbar__container">
        <a href="/" className="navbar__brand" onClick={closeMenu}>
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
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="navbar__cta">
          <Button variant="primary">Jetzt anfragen</Button>
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

      <div className={`navbar__mobile ${menuOpen ? 'is-open' : ''}`}>
        <nav className="navbar__mobile-nav">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`navbar__mobile-link${activeSection === item.id ? ' is-active' : ''}`}
              onClick={closeMenu}
            >
              {item.label}
            </a>
          ))}

          <div className="navbar__mobile-cta">
            <Button variant="primary">Jetzt anfragen</Button>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
