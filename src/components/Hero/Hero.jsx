import { useEffect, useState } from 'react';
import './Hero.scss';
import Button from '../Button/Button';
import ResponsiveVideo from '../ResponsiveVideo/ResponsiveVideo';
import {
  heroDetailAccentImage,
  projectCeilingDrywallImage,
  projectDetailCeilingImage,
  projectExistingSpaceRenovationImage,
  projectFeaturedModernizationImage,
  projectFinishImage,
  responsiveImageSizes,
  serviceDrywallImage,
  serviceInteriorImage,
  serviceRenovationImage,
} from '../../assets/responsiveImages';
import { heroMainVideo } from '../../assets/videoManifest';
import useScrollReveal from '../../hooks/useScrollReveal';

const heroSlides = [
  {
    image: projectFeaturedModernizationImage,
    alt: 'Innenausbau-Projekt mit präziser Trockenbau-Ausführung',
  },
  {
    image: serviceDrywallImage,
    alt: 'Trockenbau-Projekt mit sauber vorbereiteten Wand- und Deckenflächen',
  },
  {
    image: heroDetailAccentImage,
    alt: 'Sanierungsprojekt mit hochwertiger handwerklicher Ausführung',
  },
  {
    image: projectDetailCeilingImage,
    alt: 'Innenausbau mit präzise ausgeführten Deckenarbeiten',
  },
  {
    image: serviceInteriorImage,
    alt: 'Modern ausgebauter Wohnraum mit sauberem Finish',
  },
];

const heroDetailTopSlides = [
  {
    image: projectCeilingDrywallImage,
    alt: 'Detailansicht eines hochwertigen Innenausbau-Projekts',
  },
  {
    image: projectExistingSpaceRenovationImage,
    alt: 'Modern sanierter Innenraum mit klaren Linien',
  },
  {
    image: projectDetailCeilingImage,
    alt: 'Innenausbau mit präzise ausgeführten Deckenarbeiten',
  },
  {
    image: projectFeaturedModernizationImage,
    alt: 'Wohnraum-Modernisierung mit klarer Trockenbau-Struktur',
  },
  {
    image: serviceDrywallImage,
    alt: 'Trockenbau-Flächen mit sauberer handwerklicher Umsetzung',
  },
];

const heroDetailBottomSlides = [
  {
    image: serviceInteriorImage,
    alt: 'Innenausbau mit klaren Linien und hochwertigem Finish',
  },
  {
    image: serviceDrywallImage,
    alt: 'Trockenbau-Projekt mit sauber vorbereiteten Wandflächen',
  },
  {
    image: heroDetailAccentImage,
    alt: 'Sanierungsprojekt mit hochwertiger Ausführung',
  },
  {
    image: projectFinishImage,
    alt: 'Innenausbau mit vorbereiteten Wand- und Deckenflächen',
  },
  {
    image: serviceRenovationImage,
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
            <Button href="/kalkulator" variant="primary">Kosten kalkulieren</Button>
            <Button href="#kontakt" variant="secondary">Kontakt aufnehmen</Button>
            <Button href="#leistungen" variant="secondary">Unsere Leistungen</Button>
          </div>
        </div>

        <div className="hero__visual hero__reveal">
          <div className="hero__showcase">
            <div className="hero__photo-frame hero__photo-frame--main">
              <ResponsiveVideo
                media={heroMainVideo}
                posterAlt=""
                isActive={isVisible}
                className="hero__photo hero__photo--main hero__photo--active hero__photo--video"
                posterClassName="hero__photo hero__photo--main hero__photo--active hero__photo--poster"
                fallback={heroSlides.map((slide, index) => (
                  <img
                    key={`${slide.alt}-fallback`}
                    src={slide.image.src}
                    srcSet={slide.image.srcSet}
                    sizes={responsiveImageSizes.heroMain}
                    alt={slide.alt}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding={index === 0 ? 'sync' : 'async'}
                    className={`hero__photo hero__photo--main${
                      index === activeSlide ? ' hero__photo--active' : ''
                    }`}
                  />
                ))}
              />

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
                    src={slide.image.src}
                    srcSet={slide.image.srcSet}
                    sizes={responsiveImageSizes.heroDetail}
                    alt={slide.alt}
                    loading="lazy"
                    decoding="async"
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
                    src={slide.image.src}
                    srcSet={slide.image.srcSet}
                    sizes={responsiveImageSizes.heroDetail}
                    alt={slide.alt}
                    loading="lazy"
                    decoding="async"
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
