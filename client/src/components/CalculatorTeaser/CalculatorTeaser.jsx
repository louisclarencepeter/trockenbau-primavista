import { ArrowRight, Calculator, CheckCircle2 } from 'lucide-react';
import './CalculatorTeaser.scss';
import {
  projectDetailCeilingImage,
  projectFeaturedModernizationImage,
  responsiveImageSizes,
} from '../../assets/responsiveImages';
import useScrollReveal from '../../hooks/useScrollReveal';
import PageLink from '../PageLink/PageLink';

const calculatorBenefits = [
  'Decken, Wände, Boden und Dachschrägen kombinieren',
  'Transparente Baupreise für Material und Montage',
  'Angebot online anfragen und direkt weiterplanen',
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
            Erste Trockenbau-Kosten direkt einschätzen
          </h2>
          <p className="calculator-teaser__text calculator-teaser__reveal">
            Decken abhängen, Wände stellen, Estrich-Boden vorbereiten,
            Dachschrägen ausbauen oder Sonderleistungen anfragen:
            stellen Sie Ihr Trockenbau-Projekt individuell zusammen und
            erhalten Sie transparente Baupreise für Material und Montage.
          </p>

          <div className="calculator-teaser__benefits calculator-teaser__reveal">
            {calculatorBenefits.map((benefit) => (
              <span className="calculator-teaser__benefit" key={benefit}>
                <CheckCircle2 size={18} strokeWidth={2.2} aria-hidden="true" />
                {benefit}
              </span>
            ))}
          </div>

          <PageLink className="calculator-teaser__button calculator-teaser__reveal" to="/kalkulator">
            <Calculator size={19} strokeWidth={2.1} aria-hidden="true" />
            Zum Kalkulator
            <ArrowRight size={18} strokeWidth={2.1} aria-hidden="true" />
          </PageLink>
        </div>

        <div className="calculator-teaser__visual calculator-teaser__reveal">
          <div className="calculator-teaser__image-frame calculator-teaser__image-frame--main">
            <img
              src={projectFeaturedModernizationImage.src}
              srcSet={projectFeaturedModernizationImage.srcSet}
              sizes={responsiveImageSizes.projectsGrid}
              alt="Trockenbau-Projekt mit vorbereiteter Wand- und Deckenstruktur"
              className="calculator-teaser__image"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="calculator-teaser__estimate" aria-label="Beispielhafte Kostenschätzung">
            <span>Beispiel-Schätzung</span>
            <strong>CHF 12'800</strong>
            <small>Wände stellen</small>
          </div>

          <div className="calculator-teaser__mini-frame">
            <img
              src={projectDetailCeilingImage.src}
              srcSet={projectDetailCeilingImage.srcSet}
              sizes={responsiveImageSizes.heroDetail}
              alt="Detailansicht einer Trockenbau-Ausführung"
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
