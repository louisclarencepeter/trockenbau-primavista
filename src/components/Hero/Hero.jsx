import { useEffect, useState } from 'react';
import './Hero.scss';
import Button from '../Button/Button';
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
import useScrollReveal from '../../hooks/useScrollReveal';

const heroSlides = [
  {
    image: projectFeaturedModernizationImage,
    alt: 'Innenausbau-Projekt mit präziser Trockenbau-Ausführung',
    label: 'Prima Vista',
    title: 'Saubere Ergebnisse',
    text: 'Präzise Ausführung und ein hochwertiges Finish bis ins Detail.',
  },
  {
    image: serviceDrywallImage,
    alt: 'Trockenbau-Projekt mit sauber vorbereiteten Wand- und Deckenflächen',
    label: 'Trockenbau',
    title: 'Klare Konstruktion',
    text: 'Stabile Unterkonstruktionen, saubere Beplankung und durchdachte Anschlüsse.',
  },
  {
    image: heroDetailAccentImage,
    alt: 'Sanierungsprojekt mit hochwertiger handwerklicher Ausführung',
    label: 'Sanierung',
    title: 'Sorgfältige Modernisierung',
    text: 'Bestehende Räume werden präzise vorbereitet und Schritt für Schritt erneuert.',
  },
  {
    image: projectDetailCeilingImage,
    alt: 'Innenausbau mit präzise ausgeführten Deckenarbeiten',
    label: 'Deckenarbeiten',
    title: 'Details mit Struktur',
    text: 'Decken, Kanten und Übergänge werden sauber geplant und ausgeführt.',
  },
  {
    image: serviceInteriorImage,
    alt: 'Modern ausgebauter Wohnraum mit sauberem Finish',
    label: 'Innenausbau',
    title: 'Hochwertiges Finish',
    text: 'Oberflächen und Raumwirkung bleiben bis zum Abschluss im Blick.',
  },
  {
    image: projectCeilingDrywallImage,
    alt: 'Detailansicht eines hochwertigen Innenausbau-Projekts',
    label: 'Montage',
    title: 'Exakte Ausführung',
    text: 'Jeder Arbeitsschritt wird mit ruhiger Hand und fachlicher Routine umgesetzt.',
  },
  {
    image: projectExistingSpaceRenovationImage,
    alt: 'Modern sanierter Innenraum mit klaren Linien',
    label: 'Renovierung',
    title: 'Neue Raumqualität',
    text: 'Aus alten Flächen entstehen funktionale und hochwertige Innenräume.',
  },
  {
    image: serviceRenovationImage,
    alt: 'Modern sanierter Innenraum mit heller Raumwirkung',
    label: 'Projektplanung',
    title: 'Verlässlicher Ablauf',
    text: 'Klare Absprachen und saubere Arbeit sorgen für planbare Ergebnisse.',
  },
  {
    image: projectFinishImage,
    alt: 'Innenausbau mit vorbereiteten Wand- und Deckenflächen',
    label: 'Finish',
    title: 'Bereit für den Abschluss',
    text: 'Spachtelung, Vorbereitung und Übergänge werden sorgfältig fertiggestellt.',
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
    }, 4200);

    return () => window.clearInterval(intervalId);
  }, []);

  const mainSlide = heroSlides[activeSlide];
  const detailSlides = [
    heroSlides[(activeSlide + 1) % heroSlides.length],
    heroSlides[(activeSlide + 2) % heroSlides.length],
  ];

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
                  key={`${slide.alt}-main`}
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

              <div className="hero__overlay hero__overlay--quality hero__reveal">
                <span className="hero__overlay-label">{mainSlide.label}</span>
                <strong>{mainSlide.title}</strong>
                <span>{mainSlide.text}</span>
              </div>
            </div>

            <div className="hero__detail-stack">
              {detailSlides.map((detailSlide, detailIndex) => (
                <div
                  className="hero__photo-frame hero__photo-frame--detail hero__reveal"
                  key={`detail-frame-${detailIndex}`}
                >
                  {heroSlides.map((slide) => (
                    <img
                      key={`${slide.alt}-detail-${detailIndex}`}
                      src={slide.image.src}
                      srcSet={slide.image.srcSet}
                      sizes={responsiveImageSizes.heroDetail}
                      alt={slide.alt}
                      loading="lazy"
                      decoding="async"
                      className={`hero__photo hero__photo--detail-slide${
                        slide === detailSlide ? ' hero__photo--active' : ''
                      }`}
                    />
                  ))}
                  <span className="hero__detail-label">{detailSlide.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
