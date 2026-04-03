import './Services.scss';
import drywallImage from '../../assets/images/services/service-drywall.jpg';
import renovationImage from '../../assets/images/services/service-renovation.jpg';
import interiorImage from '../../assets/images/services/service-interior.jpg';
import windowImage from '../../assets/images/services/service-windows.jpg';
import useScrollReveal from '../../hooks/useScrollReveal';

const services = [
  {
    title: 'Trockenbau',
    text: 'Moderne Innenausbau-Lösungen mit hoher Präzision und sauberer Ausführung.',
    image: drywallImage,
    alt: 'Trockenbau-Arbeiten in einem modernen Innenraum',
  },
  {
    title: 'Sanierung & Renovierung',
    text: 'Fachgerechte Sanierungs- und Renovierungsarbeiten für bestehende Räume mit neuer Qualität und Funktionalität.',
    image: renovationImage,
    alt: 'Sanierungs- und Renovierungsprojekt mit sauber ausgeführten Wand- und Deckenarbeiten',
  },
  {
    title: 'Innenausbau',
    text: 'Individuelle Gestaltung und Ausbau von Innenräumen nach hohen Standards.',
    image: interiorImage,
    alt: 'Innenausbau mit klaren Linien und hochwertigem Finish',
  },
  {
    title: 'Fenster',
    text: 'Saubere Lösungen rund um Fenster mit präziser Ausführung und passender Integration in den Innenausbau.',
    image: windowImage,
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
                  src={service.image}
                  alt={service.alt}
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
      </div>
    </section>
  );
}

export default Services;
