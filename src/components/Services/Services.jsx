import { useEffect, useRef, useState } from 'react';
import './Services.scss';
import Card from '../Card/Card';

function Services() {
  const servicesRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const servicesElement = servicesRef.current;

    if (!servicesElement) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    observer.observe(servicesElement);

    return () => {
      observer.unobserve(servicesElement);
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={servicesRef}
      className={`services section${isVisible ? ' services--visible' : ''}`}
      id="leistungen"
    >
      <div className="container">
        <div className="services__header">
          <span className="services__eyebrow services__reveal">UNSERE LEISTUNGEN</span>
          <h2 className="services__title services__reveal">Unsere Leistungen</h2>
          <p className="services__text services__reveal">
            Wir bieten professionelle Lösungen im Bereich Trockenbau, Sanierung
            und Innenausbau – zuverlässig, präzise und termingerecht.
          </p>
        </div>

        <div className="services__grid">
          <div className="services__card services__reveal">
            <Card
              title="Trockenbau"
              text="Moderne Innenausbau-Lösungen mit hoher Präzision und sauberer Ausführung."
            />
          </div>

          <div className="services__card services__reveal">
            <Card
              title="Sanierung"
              text="Fachgerechte Sanierung bestehender Räume für neue Qualität und Funktionalität."
            />
          </div>

          <div className="services__card services__reveal">
            <Card
              title="Renovierung"
              text="Effiziente Renovierungsarbeiten für private und gewerbliche Objekte."
            />
          </div>

          <div className="services__card services__reveal">
            <Card
              title="Innenausbau"
              text="Individuelle Gestaltung und Ausbau von Innenräumen nach höchsten Standards."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;