import { useEffect, useRef, useState } from 'react';
import './Trust.scss';
import { CheckCircle, Clock, MessageCircle, Settings } from 'lucide-react';

const trustPoints = [
  {
    title: 'Saubere Ausführung',
    text: 'Wir arbeiten präzise, strukturiert und mit hohem Anspruch an ein sauberes Endergebnis.',
    icon: CheckCircle,
  },
  {
    title: 'Termintreue',
    text: 'Verlässliche Planung und pünktliche Umsetzung sorgen für einen reibungslosen Ablauf.',
    icon: Clock,
  },
  {
    title: 'Klare Kommunikation',
    text: 'Transparente Abstimmung und direkte Erreichbarkeit schaffen Vertrauen in jeder Projektphase.',
    icon: MessageCircle,
  },
  {
    title: 'Individuelle Lösungen',
    text: 'Jedes Projekt wird passend zu Raum, Anforderung und Zielsetzung geplant und umgesetzt.',
    icon: Settings,
  },
];

function Trust() {
  const trustRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const trustElement = trustRef.current;

    if (!trustElement) {
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

    observer.observe(trustElement);

    return () => {
      observer.unobserve(trustElement);
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={trustRef}
      className={`trust section${isVisible ? ' trust--visible' : ''}`}
      id="ueber-uns"
    >
      <div className="container">
        <div className="trust__header">
          <span className="trust__eyebrow trust__reveal">WARUM KUNDEN UNS VERTRAUEN</span>
          <h2 className="trust__title trust__reveal">Qualität, auf die Sie sich verlassen können</h2>
          <p className="trust__text trust__reveal">
            Wir verbinden saubere handwerkliche Ausführung mit klarer Kommunikation,
            zuverlässiger Planung und einem hohen Anspruch an jedes Detail.
          </p>
        </div>

        <div className="trust__grid">
          {trustPoints.map((point) => {
            const Icon = point.icon;

            return (
              <article className="trust__card trust__reveal" key={point.title}>
                <div className="trust__icon">
                  <Icon size={24} strokeWidth={2} />
                </div>
                <h3 className="trust__card-title">{point.title}</h3>
                <p className="trust__card-text">{point.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Trust;
