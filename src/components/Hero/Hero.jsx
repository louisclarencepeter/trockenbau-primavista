import { useEffect, useState } from 'react';
import './Hero.scss';
import Button from '../Button/Button';
import heroMainImageOne from '../../assets/images/projects/project-featured-modernization.jpg';
import heroMainImageTwo from '../../assets/images/services/service-drywall.jpg';
import heroMainImageThree from '../../assets/images/hero/hero-detail-accent.jpg';
import heroMainImageFour from '../../assets/images/projects/project-detail-ceiling.jpg';
import heroMainImageFive from '../../assets/images/services/service-interior.jpg';
import heroDetailTopOne from '../../assets/images/projects/project-ceiling-drywall.jpg';
import heroDetailTopTwo from '../../assets/images/projects/project-existing-space-renovation.jpg';
import heroDetailTopThree from '../../assets/images/projects/project-detail-ceiling.jpg';
import heroDetailBottomOne from '../../assets/images/services/service-interior.jpg';
import heroDetailBottomTwo from '../../assets/images/services/service-drywall.jpg';
import heroDetailBottomThree from '../../assets/images/hero/hero-detail-accent.jpg';
import heroDetailBottomFour from '../../assets/images/projects/project-finish.jpg';
import heroDetailBottomFive from '../../assets/images/services/service-renovation.jpg';
import useScrollReveal from '../../hooks/useScrollReveal';

const heroSlides = [
  {
    image: heroMainImageOne,
    alt: 'Innenausbau-Projekt mit präziser Trockenbau-Ausführung',
  },
  {
    image: heroMainImageTwo,
    alt: 'Trockenbau-Projekt mit sauber vorbereiteten Wand- und Deckenflächen',
  },
  {
    image: heroMainImageThree,
    alt: 'Sanierungsprojekt mit hochwertiger handwerklicher Ausführung',
  },
  {
    image: heroMainImageFour,
    alt: 'Innenausbau mit präzise ausgeführten Deckenarbeiten',
  },
  {
    image: heroMainImageFive,
    alt: 'Modern ausgebauter Wohnraum mit sauberem Finish',
  },
];

const heroDetailTopSlides = [
  {
    image: heroDetailTopOne,
    alt: 'Detailansicht eines hochwertigen Innenausbau-Projekts',
  },
  {
    image: heroDetailTopTwo,
    alt: 'Modern sanierter Innenraum mit klaren Linien',
  },
  {
    image: heroDetailTopThree,
    alt: 'Innenausbau mit präzise ausgeführten Deckenarbeiten',
  },
  {
    image: heroMainImageOne,
    alt: 'Wohnraum-Modernisierung mit klarer Trockenbau-Struktur',
  },
  {
    image: heroMainImageTwo,
    alt: 'Trockenbau-Flächen mit sauberer handwerklicher Umsetzung',
  },
];

const heroDetailBottomSlides = [
  {
    image: heroDetailBottomOne,
    alt: 'Innenausbau mit klaren Linien und hochwertigem Finish',
  },
  {
    image: heroDetailBottomTwo,
    alt: 'Trockenbau-Projekt mit sauber vorbereiteten Wandflächen',
  },
  {
    image: heroDetailBottomThree,
    alt: 'Sanierungsprojekt mit hochwertiger Ausführung',
  },
  {
    image: heroDetailBottomFour,
    alt: 'Innenausbau mit vorbereiteten Wand- und Deckenflächen',
  },
  {
    image: heroDetailBottomFive,
    alt: 'Modern sanierter Innenraum mit heller Raumwirkung',
  },
];

function Hero() {
  const { sectionRef: heroRef, isVisible } = useScrollReveal({
    threshold: 0.25,
    rootMargin: '0px 0px -10% 0px',
    once: false,
  });
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % heroSlides.length);
    }, 4800);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section
      id="top"
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
            <Button href="#kontakt" variant="primary">Kontakt aufnehmen</Button>
            <Button href="#leistungen" variant="secondary">Unsere Leistungen</Button>
          </div>
        </div>

        <div className="hero__visual hero__reveal">
          <div className="hero__showcase">
            <div className="hero__photo-frame hero__photo-frame--main">
              {heroSlides.map((slide, index) => (
                <img
                  key={slide.alt}
                  src={slide.image}
                  alt={slide.alt}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  className={`hero__photo hero__photo--main${
                    index === activeSlide ? ' hero__photo--active' : ''
                  }`}
                />
              ))}

              <div className="hero__overlay hero__overlay--quality hero__reveal">
                <span className="hero__overlay-label">Prima Vista</span>
                <strong>Saubere Ergebnisse</strong>
                <span>Präzise Ausführung und ein hochwertiges Finish bis ins Detail.</span>
              </div>
            </div>

            <div className="hero__detail-stack">
              <div className="hero__photo-frame hero__photo-frame--detail hero__reveal">
                {heroDetailTopSlides.map((slide, index) => (
                  <img
                    key={slide.alt}
                    src={slide.image}
                    alt={slide.alt}
                    loading="lazy"
                    className={`hero__photo hero__photo--detail-slide${
                      index === activeSlide ? ' hero__photo--active' : ''
                    }`}
                  />
                ))}
              </div>

              <div className="hero__photo-frame hero__photo-frame--detail hero__reveal">
                {heroDetailBottomSlides.map((slide, index) => (
                  <img
                    key={slide.alt}
                    src={slide.image}
                    alt={slide.alt}
                    loading="lazy"
                    className={`hero__photo hero__photo--detail-slide${
                      index === activeSlide ? ' hero__photo--active' : ''
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
