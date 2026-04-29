import { useState } from 'react';
import './Calculator.scss';
import useReturnToForm from '../../hooks/useReturnToForm';
import useScrollReveal from '../../hooks/useScrollReveal';
import useSuccessView from '../../hooks/useSuccessView';
import { submitProjectForm } from '../../utils/formSubmission';
import { benefits, calculatorChoices } from './data/calculatorCatalog';
import { heroMedia, requestMedia } from './data/calculatorMedia';
import useCalculatorState from './hooks/useCalculatorState';
import useRotatingMediaIndex from './hooks/useRotatingMediaIndex';
import CalculatorHero from './sections/CalculatorHero';
import ConfiguratorSection from './sections/ConfiguratorSection';
import RequestSection from './sections/RequestSection';

function CalculatorPage() {
  const { sectionRef: heroRef, isVisible: isHeroVisible } = useScrollReveal({
    threshold: 0.22,
    rootMargin: '0px 0px -10% 0px',
  });
  const { sectionRef: configRef, isVisible: isConfigVisible } = useScrollReveal({
    threshold: 0.12,
    rootMargin: '0px 0px -8% 0px',
  });
  const { sectionRef: requestRef, isVisible: isRequestVisible } = useScrollReveal({
    threshold: 0.18,
    rootMargin: '0px 0px -8% 0px',
  });

  const calculator = useCalculatorState();
  const activeMediaIndex = useRotatingMediaIndex(heroMedia.length);
  const [formStatus, setFormStatus] = useState('idle');
  const successRef = useSuccessView(formStatus === 'success');
  const { formContainerRef, formRef, prepareReturnToForm } = useReturnToForm(formStatus);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormStatus('submitting');

    try {
      await submitProjectForm({
        form: event.target,
        formName: 'calculator',
      });

      setFormStatus('success');
      event.target.reset();
    } catch {
      setFormStatus('error');
    }
  };

  const handleResetForm = () => {
    prepareReturnToForm();
    setFormStatus('idle');
  };

  return (
    <div className="calculator-page">
      <CalculatorHero
        benefits={benefits}
        choices={calculatorChoices}
        isVisible={isHeroVisible}
        onSelectChoice={calculator.actions.selectChoice}
        sectionRef={heroRef}
      />

      <ConfiguratorSection
        actions={calculator.actions}
        isVisible={isConfigVisible}
        sectionRef={configRef}
        selection={calculator.selection}
        state={calculator.state}
        summary={calculator.summary}
        totals={calculator.totals}
      />

      <RequestSection
        activeMediaIndex={activeMediaIndex}
        formContainerRef={formContainerRef}
        formRef={formRef}
        formStatus={formStatus}
        isComponentBreakdownMode={calculator.state.isComponentBreakdownMode}
        isVisible={isRequestVisible}
        onResetForm={handleResetForm}
        onSubmit={handleSubmit}
        requestMedia={requestMedia}
        sectionRef={requestRef}
        selection={calculator.selection}
        summary={calculator.summary}
        successRef={successRef}
        totals={calculator.totals}
      />
    </div>
  );
}

export default CalculatorPage;
