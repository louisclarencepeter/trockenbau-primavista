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
  serviceRoofDetailImage,
  serviceWallsImage,
} from '../../assets/responsiveImages';
import useScrollReveal from '../../hooks/useScrollReveal';

const heroSlides = [
  {
    image: projectFeaturedModernizationImage,
    alt: 'Trockenbau-Projekt mit moderner Unterkonstruktion und sauberer Ausführung',
    label: 'Prima Vista',
    title: 'Trockenbau mit System',
    text: 'Von der ersten Konstruktion bis zur sauberen Oberfläche bleibt der Ablauf klar kalkulierbar.',
  },
  {
    image: serviceWallsImage,
    alt: 'Metallständerwände im Aufbau mit Platten und Unterkonstruktion',
    label: 'Wände',
    title: 'Wände stellen und verkleiden',
    text: 'Trennwände, Vorsatzschalen und Beplankungen werden passgenau aufgebaut und vorbereitet.',
  },
  {
    image: heroDetailAccentImage,
    alt: 'Ausbau-Detail mit präziser handwerklicher Ausführung',
    label: 'Details',
    title: 'Saubere Anschlüsse',
    text: 'Kanten, Übergänge und Anschlüsse werden ordentlich vorbereitet und fachgerecht geschlossen.',
  },
  {
    image: projectDetailCeilingImage,
    alt: 'Trockenbau mit präzise ausgeführten Deckenarbeiten',
    label: 'Decken',
    title: 'Decken abhängen',
    text: 'Abgehängte Decken schaffen Platz für Licht, Akustik, Technik und einen ruhigen Abschluss.',
  },
  {
    image: serviceRoofDetailImage,
    alt: 'Ausbauarbeit an Dachschrägen mit Trockenbauprofilen und Beplankung',
    label: 'Ausbau',
    title: 'Dachschrägen und Flächen',
    text: 'Auch schwierige Geometrien unter dem Dach lassen sich sauber ausbauen und sinnvoll nutzen.',
  },
  {
    image: projectCeilingDrywallImage,
    alt: 'Trockenbau-Projekt mit Decken- und Wandmontage',
    label: 'Montage',
    title: 'Exakte Ausführung',
    text: 'Unterkonstruktion, Beplankung und Ausbau werden sauber aufeinander abgestimmt.',
  },
  {
    image: projectExistingSpaceRenovationImage,
    alt: 'Bestandsraum in der Trockenbau-Modernisierung',
    label: 'Bestand',
    title: 'Ausbau im Bestand',
    text: 'Bestehende Räume lassen sich mit Trockenbau schnell an neue Nutzungen anpassen.',
  },
  {
    image: serviceDrywallImage,
    alt: 'Rohbau-Innenraum mit vorbereitetem Boden für den weiteren Ausbau',
    label: 'Boden',
    title: 'Estrich und Bodenaufbau',
    text: 'Trockene Systeme schaffen ebene Flächen und eine gute Basis für den weiteren Ausbau.',
  },
  {
    image: projectFinishImage,
    alt: 'Trockenbau-Projekt mit vorbereiteten Wand- und Deckenflächen',
    label: 'Finish',
    title: 'Bereit für den Abschluss',
    text: 'Spachtelung, Feinbearbeitung und letzte Details machen aus Konstruktion eine fertige Fläche.',
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
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

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
          <span className="hero__eyebrow hero__reveal">TROCKENBAU FÜR DECKEN & WÄNDE</span>

          <h1 className="hero__title hero__reveal">
            Trockenbau für Decken, Wände und Dachschrägen
          </h1>

          <p className="hero__text hero__reveal">
            Wir planen und realisieren abgehängte Decken, Trennwände,
            Estrich-Boden, Dachschrägen und Sonderlösungen sauber,
            nachvollziehbar und mit direkter Anfrageoption über den Kalkulator.
          </p>

          <div className="hero__actions hero__reveal">
            <Button href="/anfrage" variant="primary">Jetzt Anfrage stellen</Button>
            <Button href="/kalkulator" variant="secondary">Kosten kalkulieren</Button>
            <Button href="#leistungen" variant="secondary">Unsere Leistungen</Button>
          </div>
        </div>

        <div className="hero__visual hero__reveal">
          <div className="hero__showcase">
            <div className="hero__photo-frame hero__photo-frame--main">
              <img
                key={`${mainSlide.alt}-main`}
                src={mainSlide.image.src}
                srcSet={mainSlide.image.srcSet}
                sizes={responsiveImageSizes.heroMain}
                alt={mainSlide.alt}
                width={mainSlide.image.width}
                height={mainSlide.image.height}
                loading="eager"
                decoding="sync"
                fetchPriority="high"
                className="hero__photo hero__photo--main hero__photo--active"
              />

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
                  <img
                    key={`${detailSlide.alt}-detail-${detailIndex}`}
                    src={detailSlide.image.src}
                    srcSet={detailSlide.image.srcSet}
                    sizes={responsiveImageSizes.heroDetail}
                    alt={detailSlide.alt}
                    width={detailSlide.image.width}
                    height={detailSlide.image.height}
                    loading="lazy"
                    decoding="async"
                    className="hero__photo hero__photo--detail-slide hero__photo--active"
                  />
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
