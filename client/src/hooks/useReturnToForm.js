import { useEffect, useRef } from 'react';

function useReturnToForm(formStatus) {
  const formContainerRef = useRef(null);
  const formRef = useRef(null);
  const shouldReturnRef = useRef(false);

  useEffect(() => {
    if (formStatus !== 'idle' || !shouldReturnRef.current) {
      return undefined;
    }

    shouldReturnRef.current = false;

    const containerNode = formContainerRef.current ?? formRef.current;
    const focusTarget = formRef.current?.querySelector(
      'input:not([type="hidden"]):not([disabled]), textarea:not([disabled]), select:not([disabled])',
    );

    if (!containerNode) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const returnToForm = (behavior) => {
      containerNode.scrollIntoView({
        behavior,
        block: 'start',
        inline: 'nearest',
      });

      focusTarget?.focus({ preventScroll: true });
    };

    const animationFrameId = window.requestAnimationFrame(() => {
      returnToForm(prefersReducedMotion ? 'auto' : 'smooth');
    });

    const timeoutId = window.setTimeout(() => {
      returnToForm('auto');
    }, 320);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.clearTimeout(timeoutId);
    };
  }, [formStatus]);

  const prepareReturnToForm = () => {
    shouldReturnRef.current = true;
  };

  return {
    formContainerRef,
    formRef,
    prepareReturnToForm,
  };
}

export default useReturnToForm;
