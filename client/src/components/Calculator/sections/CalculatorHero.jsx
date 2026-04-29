import { Link } from 'react-router-dom';
import { Check, ChevronRight } from 'lucide-react';
import './CalculatorHero.scss';
import { responsiveImageSizes } from '../../../assets/responsiveImages';
import { getScrollBehavior, scrollToHashTarget } from '../../../utils/hashNavigation';

function CalculatorHero({
  benefits,
  choices,
  isVisible,
  onSelectChoice,
  sectionRef,
}) {
  const handleChoiceClick = (event, choice) => {
    event.preventDefault();
    onSelectChoice(choice);

    window.requestAnimationFrame(() => {
      scrollToHashTarget('#kalkulator-konfiguration', {
        behavior: getScrollBehavior(),
      });
    });
  };

  return (
    <section
      className={`calculator-hero${isVisible ? ' calculator-hero--visible' : ''}`}
      id="kalkulator"
      ref={sectionRef}
    >
      <div className="container calculator-hero__container">
        <div className="calculator-hero__content calculator-hero__reveal">
          <span className="calculator-hero__eyebrow">Online-Angebot</span>
          <h1 className="calculator-hero__title">
            Trockenbau Angebot-Kalkulator
          </h1>
          <p className="calculator-hero__text calculator-hero__reveal">
            In 5 Minuten Online-Angebot erhalten zum Trockenbau. Ob Trockenbau/
            GK-Wände oder GK-Decken abhängen oder einen Trocken-Estrichboden
            verlegen lassen. Jetzt online kalkulieren und einbauen lassen.
          </p>
        </div>

        <div className="calculator-hero__choices calculator-hero__reveal">
          {choices.map((choice) => (
            <a
              className="calculator-hero__choice"
              href="#kalkulator-konfiguration"
              key={choice.id}
              onClick={(event) => handleChoiceClick(event, choice)}
            >
              <img
                src={choice.image.src}
                srcSet={choice.image.srcSet}
                sizes={responsiveImageSizes.services}
                alt={choice.alt}
                className="calculator-hero__choice-image"
                loading={choice.id === 'decken' ? 'eager' : 'lazy'}
                decoding={choice.id === 'decken' ? 'sync' : 'async'}
              />
              <div className="calculator-hero__choice-overlay"></div>
              <h2>{choice.title}</h2>
              <span
                className={`calculator-hero__choice-button${
                  choice.isDarkButton ? ' calculator-hero__choice-button--dark' : ''
                }`}
              >
                {choice.buttonLabel}
              </span>
            </a>
          ))}
        </div>

        <nav className="calculator-hero__breadcrumb calculator-hero__reveal" aria-label="Breadcrumb">
          <Link to="/">Startseite</Link>
          <ChevronRight size={18} strokeWidth={2.2} aria-hidden="true" />
          <span>Kalkulator</span>
        </nav>

        <div className="calculator-hero__benefits calculator-hero__reveal" aria-label="Vorteile">
          {benefits.map((benefit) => (
            <span className="calculator-hero__benefit" key={benefit}>
              <Check size={17} strokeWidth={2.3} aria-hidden="true" />
              {benefit}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CalculatorHero;
