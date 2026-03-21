import { useEffect, useRef, useState } from 'react';
import './Hero.scss';
import Button from '../Button/Button';
import logo from '../../assets/logo.png';

function Hero() {
  const heroRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const heroElement = heroRef.current;

    if (!heroElement) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.25,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    observer.observe(heroElement);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={heroRef}
      className={`hero${isVisible ? ' hero--visible' : ''}`}
    >
      <div className="container hero__container">
        <div className="hero__content">
          <span className="hero__eyebrow hero__reveal">SANIERUNG UND RENOVIERUNG</span>

          <h1 className="hero__title hero__reveal">
            Präziser Trockenbau für hochwertige Innenräume
          </h1>

          <p className="hero__text hero__reveal">
            Professionelle Lösungen für Trockenbau, Sanierung und Renovierung.
            Saubere Ausführung, klare Kommunikation und zuverlässige Ergebnisse
            für Privat- und Geschäftskunden.
          </p>

          <div className="hero__actions hero__reveal">
            <Button variant="primary">Kontakt aufnehmen</Button>
            <Button variant="secondary">Unsere Leistungen</Button>
          </div>
        </div>

        <div className="hero__visual hero__reveal">
          <div className="hero__card">
            <img src={logo} alt="Trockenbau Prima Vista Logo" className="hero__logo" />

            <div className="hero__points">
              <div className="hero__point hero__reveal">Saubere Ausführung</div>
              <div className="hero__point hero__reveal">Termintreue</div>
              <div className="hero__point hero__reveal">Professionelles Ergebnis</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
