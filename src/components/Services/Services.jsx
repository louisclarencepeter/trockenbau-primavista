import { ArrowRight, Calculator } from 'lucide-react';
import './Services.scss';
import {
  responsiveImageSizes,
  serviceDrywallImage,
  serviceInteriorImage,
  serviceRenovationImage,
  serviceWindowsImage,
} from '../../assets/responsiveImages';
import useScrollReveal from '../../hooks/useScrollReveal';

const services = [
  {
    title: 'Trockenbau',
    text: 'Moderne Innenausbau-Lösungen mit hoher Präzision und sauberer Ausführung.',
    image: serviceDrywallImage,
    alt: 'Trockenbau-Arbeiten in einem modernen Innenraum',
  },
  {
    title: 'Sanierung & Renovierung',
    text: 'Fachgerechte Sanierungs- und Renovierungsarbeiten für bestehende Räume mit neuer Qualität und Funktionalität.',
    image: serviceRenovationImage,
    alt: 'Sanierungs- und Renovierungsprojekt mit sauber ausgeführten Wand- und Deckenarbeiten',
  },
  {
    title: 'Innenausbau',
    text: 'Individuelle Gestaltung und Ausbau von Innenräumen nach hohen Standards.',
    image: serviceInteriorImage,
    alt: 'Innenausbau mit klaren Linien und hochwertigem Finish',
  },
  {
    title: 'Fenster',
    text: 'Saubere Lösungen rund um Fenster mit präziser Ausführung und passender Integration in den Innenausbau.',
    image: serviceWindowsImage,
    alt: 'Fensterarbeiten in einem Innenausbau-Projekt mit sauberer Vorbereitung',
  },
];

function Services() {
  const { sectionRef: servicesRef, isVisible } = useScrollReveal({
    once: false,
  });

  return (
    <section
      ref={servicesRef}
      className={`services section${isVisible ? ' services--visible' : ''}`}
      id="leistungen"
    >
      <div className="container">
        <div className="services__header">
          <span className="services__eyebrow services__reveal">WAS WIR ANBIETEN</span>
          <h2 className="services__title services__reveal">Unsere Leistungen</h2>
          <p className="services__text services__reveal">
            Wir bieten professionelle Lösungen in den Bereichen Trockenbau,
            Sanierung & Renovierung, Fenster und Innenausbau - zuverlässig,
            präzise und termingerecht.
          </p>
        </div>

        <div className="services__grid">
          {services.map((service) => (
            <article className="services__card services__reveal" key={service.title}>
              <div className="services__image-wrap">
                <img
                  src={service.image.src}
                  srcSet={service.image.srcSet}
                  sizes={responsiveImageSizes.services}
                  alt={service.alt}
                  loading="lazy"
                  decoding="async"
                  className="services__image"
                />
              </div>

              <div className="services__card-content">
                <h3 className="services__card-title">{service.title}</h3>
                <p className="services__card-text">{service.text}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="services__footer services__reveal">
          <span className="services__footer-text">
            Sie möchten eine erste Kostenspanne für Ihr Projekt sehen?
          </span>
          <a className="services__footer-link" href="/kalkulator">
            <Calculator size={18} strokeWidth={2.1} aria-hidden="true" />
            Mehr erfahren im Kalkulator
            <ArrowRight size={18} strokeWidth={2.1} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

export default Services;
