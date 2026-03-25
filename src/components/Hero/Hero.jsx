import './Hero.scss';
import Button from '../Button/Button';
import heroMainImage from '../../assets/images/projects/PHOTO-2026-03-12-15-08-40.jpg';
import heroDetailImageOne from '../../assets/images/projects/PHOTO-2026-03-12-15-08-39 4.jpg';
import heroDetailImageTwo from '../../assets/images/projects/PHOTO-2026-03-07-07-14-48.jpg';
import useScrollReveal from '../../hooks/useScrollReveal';

function Hero() {
  const { sectionRef: heroRef, isVisible } = useScrollReveal({
    threshold: 0.25,
    rootMargin: '0px 0px -10% 0px',
    once: false,
  });

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
          <div className="hero__showcase">
            <div className="hero__photo-frame hero__photo-frame--main">
              <img
                src={heroMainImage}
                alt="Innenausbau-Projekt mit präziser Trockenbau-Ausfuehrung"
                className="hero__photo"
              />
            </div>

            <div className="hero__overlay hero__overlay--quality hero__reveal">
              <span className="hero__overlay-label">Prima Vista</span>
              <strong>Saubere Ausführung</strong>
              <span>Trockenbau, Sanierung und Innenausbau aus einer Hand.</span>
            </div>

            <div className="hero__detail-stack">
              <div className="hero__photo-frame hero__photo-frame--detail hero__reveal">
                <img
                  src={heroDetailImageOne}
                  alt="Detailansicht eines hochwertigen Innenausbau-Projekts"
                  className="hero__photo"
                />
              </div>

              <div className="hero__photo-frame hero__photo-frame--detail hero__reveal">
                <img
                  src={heroDetailImageTwo}
                  alt="Modern sanierter Innenraum mit klaren Linien"
                  className="hero__photo"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
