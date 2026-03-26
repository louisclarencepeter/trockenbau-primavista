import './Services.scss';
import drywallImage from '../../assets/images/projects/PHOTO-2026-03-12-15-08-40 24.jpg';
import renovationImage from '../../assets/images/projects/PHOTO-2026-03-07-08-04-24.jpg';
import interiorImage from '../../assets/images/projects/PHOTO-2026-03-07-07-11-08 8.jpg';
import finishingImage from '../../assets/images/projects/PHOTO-2026-03-12-15-08-40 25.jpg';
import useScrollReveal from '../../hooks/useScrollReveal';

const services = [
  {
    title: 'Trockenbau',
    text: 'Moderne Innenausbau-Lösungen mit hoher Präzision und sauberer Ausführung.',
    image: drywallImage,
    alt: 'Trockenbau-Arbeiten in einem modernen Innenraum',
  },
  {
    title: 'Sanierung',
    text: 'Fachgerechte Sanierung bestehender Räume für neue Qualität und Funktionalität.',
    image: renovationImage,
    alt: 'Sanierter Innenraum mit sauber ausgeführten Wand- und Deckenarbeiten',
  },
  {
    title: 'Renovierung',
    text: 'Effiziente Renovierungsarbeiten für private und gewerbliche Objekte.',
    image: finishingImage,
    alt: 'Renovierungsprojekt mit hochwertiger handwerklicher Ausführung',
  },
  {
    title: 'Innenausbau',
    text: 'Individuelle Gestaltung und Ausbau von Innenräumen nach hohen Standards.',
    image: interiorImage,
    alt: 'Innenausbau mit klaren Linien und hochwertigem Finish',
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
            Wir bieten professionelle Lösungen im Bereich Trockenbau, Sanierung
            und Innenausbau – zuverlässig, präzise und termingerecht.
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
