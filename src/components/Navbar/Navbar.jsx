import { useState } from 'react';
import './Navbar.scss';
import logo from '../../assets/logo.png';
import Button from '../Button/Button';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationLinks = [
    { href: '#leistungen', label: 'Leistungen' },
    { href: '#referenzen', label: 'Referenzen' },
    { href: '#ueber-uns', label: 'Uber uns' },
    { href: '#kontakt', label: 'Kontakt' },
  ];

  const closeMenu = () => setIsMenuOpen(false);

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
          {navigationLinks.map((link) => (
            <a key={link.href} href={link.href} className="navbar__link">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="navbar__cta">
          <Button variant="primary">Jetzt anfragen</Button>
        </div>

        <button
          type="button"
          className="navbar__toggle"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Navigationsmenu schliessen' : 'Navigationsmenu offnen'}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span className="navbar__toggle-line" />
          <span className="navbar__toggle-line" />
          <span className="navbar__toggle-line" />
        </button>
      </div>

      <div className={`navbar__mobile-menu${isMenuOpen ? ' navbar__mobile-menu--open' : ''}`}>
        <nav className="container navbar__mobile-nav" aria-label="Mobile Navigation">
          {navigationLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="navbar__mobile-link"
              onClick={closeMenu}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
