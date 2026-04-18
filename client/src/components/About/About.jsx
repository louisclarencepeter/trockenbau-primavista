import './About.scss';
import { CheckCircle2, Hammer, MessagesSquare, TimerReset } from 'lucide-react';
import ResponsiveVideo from '../ResponsiveVideo/ResponsiveVideo';
import useScrollReveal from '../../hooks/useScrollReveal';
import {
  aboutInteriorShowcaseImage,
  responsiveImageSizes,
} from '../../assets/responsiveImages';
import { aboutSectionVideo } from '../../assets/videoManifest';

const highlights = [
  {
    title: 'Saubere Ausführung',
    text: 'Von der Unterkonstruktion bis zur letzten Spachtelung arbeiten wir präzise und sauber.',
    icon: CheckCircle2,
  },
  {
    title: 'Zuverlässige Planung',
    text: 'Decken, Wände, Bodenaufbauten und Dachschrägen werden nachvollziehbar geplant und abgestimmt.',
    icon: TimerReset,
  },
  {
    title: 'Direkte Kommunikation',
    text: 'Vom ersten Gespräch bis zur Umsetzung bleiben wir erreichbar, transparent und verbindlich.',
    icon: MessagesSquare,
  },
  {
    title: 'Handwerk mit Anspruch',
    text: 'Unser Schwerpunkt liegt auf Trockenbau-Leistungen, die funktional stark und dauerhaft sauber ausgeführt sind.',
    icon: Hammer,
  },
];

function About() {
  const { sectionRef, isVisible } = useScrollReveal({
    once: false,
  });

  return (
    <section
      ref={sectionRef}
      id="ueber-uns"
      className={`ueber-uns section${isVisible ? ' ueber-uns--visible' : ''}`}
    >
      <div className="container">
        <div className="ueber-uns__layout">
          <div className="ueber-uns__intro">
            <span className="ueber-uns__eyebrow ueber-uns__reveal">ÜBER UNS</span>
            <h2 className="ueber-uns__title ueber-uns__reveal">
              Trockenbau mit klarer Planung und sauberer Ausführung
            </h2>
            <p className="ueber-uns__text ueber-uns__reveal">
              Trockenbau Prima Vista steht für klare Kommunikation, saubere
              Ausführung und nachvollziehbare Angebote im Bereich Trockenbau.
              Ob Decken, Wände, Estrich-Boden, Dachschrägen oder Sonderleistungen:
              wir schaffen funktionale Lösungen, die fachgerecht umgesetzt
              und sauber abgeschlossen werden.
            </p>

            <div className="ueber-uns__image-wrap ueber-uns__reveal">
              <ResponsiveVideo
                media={aboutSectionVideo}
                isActive={isVisible}
                posterAlt="Trockenbau-Projekt von Trockenbau Prima Vista"
                className="ueber-uns__image"
                fallback={(
                  <img
                    src={aboutInteriorShowcaseImage.src}
                    srcSet={aboutInteriorShowcaseImage.srcSet}
                    sizes={responsiveImageSizes.about}
                    alt="Trockenbau-Projekt von Trockenbau Prima Vista"
                    loading="lazy"
                    decoding="async"
                    className="ueber-uns__image"
                  />
                )}
              />
            </div>
          </div>

          <div className="ueber-uns__cards">
            {highlights.map((item) => {
              const Icon = item.icon;

              return (
                <article className="ueber-uns__card ueber-uns__reveal" key={item.title}>
                  <div className="ueber-uns__icon">
                    <Icon size={24} strokeWidth={2} />
                  </div>
                  <h3 className="ueber-uns__card-title">{item.title}</h3>
                  <p className="ueber-uns__card-text">{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
