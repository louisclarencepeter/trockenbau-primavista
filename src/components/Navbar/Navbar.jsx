import { useState } from 'react';
import './Navbar.scss';
import logo from '../../assets/logo.png';
import Button from '../Button/Button';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

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
          <a href="#leistungen" className="navbar__link">Leistungen</a>
          <a href="#referenzen" className="navbar__link">Referenzen</a>
          <a href="#ueber-uns" className="navbar__link">Warum wir</a>
          <a href="#kontakt" className="navbar__link">Kontakt</a>
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
          <a href="#leistungen" className="navbar__mobile-link" onClick={closeMenu}>
            Leistungen
          </a>
          <a href="#referenzen" className="navbar__mobile-link" onClick={closeMenu}>
            Referenzen
          </a>
          <a href="#ueber-uns" className="navbar__mobile-link" onClick={closeMenu}>
            Warum wir
          </a>
          <a href="#kontakt" className="navbar__mobile-link" onClick={closeMenu}>
            Kontakt
          </a>

          <div className="navbar__mobile-cta">
            <Button variant="primary">Jetzt anfragen</Button>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
