import { useEffect, useState } from 'react';
import './Hero.scss';
import Button from '../Button/Button';
import ResponsivePicture from '../ResponsivePicture/ResponsivePicture';
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
import { businessProfile } from '../../config/businessProfile';

const heroSlides = [
  {
    image: projectFeaturedModernizationImage,
    alt: 'Trockenbau-Projekt mit moderner Unterkonstruktion und sauberer Ausführung',
    label: businessProfile.publicName,
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
  return (
    <section
      id="top"
      ref={heroRef}
      className={`hero${isVisible ? ' hero--visible' : ''}`}
    >
      <div className="hero__bg-slideshow" aria-hidden="true">
        <ResponsivePicture
          key={`${mainSlide.alt}-bg`}
          image={mainSlide.image}
          sizes={responsiveImageSizes.heroMain}
          alt=""
          loading="eager"
          decoding="sync"
          fetchPriority="high"
          className="hero__bg-image"
        />
        <span className="hero__bg-overlay" />
      </div>

      <div className="hero__inner">
        <div className="hero__topline hero__reveal" aria-hidden="true">
          <span><span className="dot" />{businessProfile.publicName}</span>
          <span>{businessProfile.serviceLine}</span>
          <span>N° 01 / Emmenbrücke</span>
        </div>

        <h1 className="hero__headline hero__reveal">
          <span className="hero__headline-line"><em>Trockenbau</em> für</span>
          <span className="hero__headline-line">Decken, Wände</span>
          <span className="hero__headline-line">und Dachschrägen.</span>
        </h1>

        <div className="hero__meta hero__reveal">
          <div>
            <div className="hero__meta-num">01 — Trockenbau für Decken & Wände</div>
            <p className="hero__lede">
              <strong>{businessProfile.slogan}</strong> Abgehängte Decken,
              Trennwände, Estrich-Boden, Dachschrägen und Sonderlösungen mit
              direkter Anfrageoption über den Kalkulator.
            </p>
          </div>
          <div />
          <div className="hero__cta">
            <small>Erste Einschätzung sofort</small>
            <div className="hero__actions">
              <Button href="/anfrage" variant="primary">Jetzt Anfrage stellen</Button>
              <Button href="/kalkulator" variant="secondary">Kosten kalkulieren</Button>
              <Button href="#leistungen" variant="secondary">Leistungen</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
