import './Navbar.scss';
import logo from '../../assets/logo.png';
import Button from '../Button/Button';

function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar__container">
        <a href="/" className="navbar__brand">
          <img src={logo} alt="Trockenbau Prima Vista Logo" className="navbar__logo" />
          <div className="navbar__brand-text">
            <span className="navbar__name">Trockenbau Prima Vista</span>
            <span className="navbar__tagline">Sanierung und Renovierung</span>
          </div>
        </a>

        <nav className="navbar__nav">
          <a href="#leistungen" className="navbar__link">Leistungen</a>
          <a href="#referenzen" className="navbar__link">Referenzen</a>
          <a href="#ueber-uns" className="navbar__link">Über uns</a>
          <a href="#kontakt" className="navbar__link">Kontakt</a>
        </nav>

        <div className="navbar__cta">
          <Button variant="primary">Jetzt anfragen</Button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;