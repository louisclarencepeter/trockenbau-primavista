import './Hero.scss';
import Button from '../Button/Button';
import logo from '../../assets/logo.png';

function Hero() {
  return (
    <section className="hero">
      <div className="container hero__container">
        <div className="hero__content">
          <span className="hero__eyebrow">SANIERUNG UND RENOVIERUNG</span>

          <h1 className="hero__title">
            Präziser Trockenbau für hochwertige Innenräume
          </h1>

          <p className="hero__text">
            Professionelle Lösungen für Trockenbau, Sanierung und Renovierung.
            Saubere Ausführung, klare Kommunikation und zuverlässige Ergebnisse
            für Privat- und Geschäftskunden.
          </p>

          <div className="hero__actions">
            <Button variant="primary">Kontakt aufnehmen</Button>
            <Button variant="secondary">Unsere Leistungen</Button>
          </div>
        </div>

        <div className="hero__visual">
          <div className="hero__card">
            <img src={logo} alt="Trockenbau Prima Vista Logo" className="hero__logo" />

            <div className="hero__points">
              <div className="hero__point">Saubere Ausführung</div>
              <div className="hero__point">Termintreue</div>
              <div className="hero__point">Professionelles Ergebnis</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;