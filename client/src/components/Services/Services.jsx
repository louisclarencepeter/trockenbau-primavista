import { Link } from 'react-router-dom';
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
    title: 'Decken abhängen',
    text: 'Abgehängte Decken für Licht, Akustik, Installationen und eine saubere Raumwirkung.',
    image: serviceDrywallImage,
    alt: 'Trockenbau-Arbeiten an einer abgehängten Decke',
  },
  {
    title: 'Wände stellen',
    text: 'Trennwände, Vorsatzschalen und Verkleidungen für flexible Grundrisse und klare Anschlüsse.',
    image: serviceRenovationImage,
    alt: 'Trockenbau-Projekt mit sauber ausgeführten Wand- und Deckenarbeiten',
  },
  {
    title: 'Estrich-Boden',
    text: 'Trockene Bodenaufbauten und ebene Flächen als solide Basis für den weiteren Ausbau.',
    image: serviceInteriorImage,
    alt: 'Trockenbau-Projekt mit vorbereitetem Boden- und Flächenaufbau',
  },
  {
    title: 'Dachschrägen',
    text: 'Dachschrägen verkleiden und ausbauen, damit ungenutzte Flächen sauber nutzbar werden.',
    image: serviceWindowsImage,
    alt: 'Ausbauarbeit an einer geneigten Innenraumfläche',
  },
  {
    title: 'Sonstiges',
    text: 'Dämmung, Brandschutz, Türen, Leitungen und weitere Trockenbauleistungen auf Anfrage.',
    image: serviceDrywallImage,
    alt: 'Trockenbau-Leistungen für Sonderarbeiten und Detailausbau',
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
            Unser Fokus liegt auf den zentralen Trockenbau-Leistungen:
            Decken abhängen, Wände stellen, Estrich-Boden, Dachschrägen
            und weitere Sonderarbeiten, sauber geplant und fachgerecht umgesetzt.
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
          <Link className="services__footer-link" to="/kalkulator">
            <Calculator size={18} strokeWidth={2.1} aria-hidden="true" />
            Mehr erfahren im Kalkulator
            <ArrowRight size={18} strokeWidth={2.1} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Services;
