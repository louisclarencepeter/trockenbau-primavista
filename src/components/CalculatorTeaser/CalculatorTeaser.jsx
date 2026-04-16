import { ArrowRight, Calculator, CheckCircle2 } from 'lucide-react';
import './CalculatorTeaser.scss';
import {
  projectFeaturedModernizationImage,
  responsiveImageSizes,
  serviceWindowsImage,
} from '../../assets/responsiveImages';
import useScrollReveal from '../../hooks/useScrollReveal';

const calculatorBenefits = [
  'Leistungspaket auswählen',
  'Material und Montage sehen',
  'Anfrage direkt senden',
];

function CalculatorTeaser() {
  const { sectionRef, isVisible } = useScrollReveal({
    once: false,
  });

  return (
    <section
      ref={sectionRef}
      className={`calculator-teaser section${isVisible ? ' calculator-teaser--visible' : ''}`}
      id="kostenrechner"
    >
      <div className="container calculator-teaser__container">
        <div className="calculator-teaser__content">
          <span className="calculator-teaser__eyebrow calculator-teaser__reveal">
            Kostenrechner
          </span>
          <h2 className="calculator-teaser__title calculator-teaser__reveal">
            Schnell eine erste Kostenschätzung erhalten
          </h2>
          <p className="calculator-teaser__text calculator-teaser__reveal">
            Für Trockenbau, Sanierung, Innenausbau und Fenster können Sie Ihr
            Projekt grob konfigurieren und die wichtigsten Kostenpunkte direkt
            nachvollziehen.
          </p>

          <div className="calculator-teaser__benefits calculator-teaser__reveal">
            {calculatorBenefits.map((benefit) => (
              <span className="calculator-teaser__benefit" key={benefit}>
                <CheckCircle2 size={18} strokeWidth={2.2} aria-hidden="true" />
                {benefit}
              </span>
            ))}
          </div>

          <a className="calculator-teaser__button calculator-teaser__reveal" href="/kalkulator">
            <Calculator size={19} strokeWidth={2.1} aria-hidden="true" />
            Zum Kalkulator
            <ArrowRight size={18} strokeWidth={2.1} aria-hidden="true" />
          </a>
        </div>

        <div className="calculator-teaser__visual calculator-teaser__reveal">
          <div className="calculator-teaser__image-frame calculator-teaser__image-frame--main">
            <img
              src={projectFeaturedModernizationImage.src}
              srcSet={projectFeaturedModernizationImage.srcSet}
              sizes={responsiveImageSizes.projectsGrid}
              alt="Innenausbau-Projekt mit vorbereiteter Trockenbau-Struktur"
              className="calculator-teaser__image"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="calculator-teaser__estimate" aria-label="Beispielhafte Kostenschätzung">
            <span>Beispiel-Schätzung</span>
            <strong>CHF 12'800</strong>
            <small>Sanierung & Renovierung</small>
          </div>

          <div className="calculator-teaser__mini-frame">
            <img
              src={serviceWindowsImage.src}
              srcSet={serviceWindowsImage.srcSet}
              sizes={responsiveImageSizes.heroDetail}
              alt="Fensterarbeiten mit sauberer Integration in den Innenausbau"
              className="calculator-teaser__image"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default CalculatorTeaser;
