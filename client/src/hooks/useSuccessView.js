import { useEffect, useRef } from 'react';

function useSuccessView(isActive) {
  const successRef = useRef(null);

  useEffect(() => {
    if (!isActive || !successRef.current) {
      return undefined;
    }

    const node = successRef.current;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const alignSuccessView = (behavior) => {
      node.focus({ preventScroll: true });
      node.scrollIntoView({
        behavior,
        block: 'start',
        inline: 'nearest',
      });
    };

    const animationFrameId = window.requestAnimationFrame(() => {
      alignSuccessView(prefersReducedMotion ? 'auto' : 'smooth');
    });

    const timeoutId = window.setTimeout(() => {
      alignSuccessView('auto');
    }, 320);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.clearTimeout(timeoutId);
    };
  }, [isActive]);

  return successRef;
}

export default useSuccessView;
