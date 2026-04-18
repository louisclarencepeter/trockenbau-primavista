import { useCallback, useEffect, useState } from 'react';

function useScrollReveal({
  threshold = 0.2,
  rootMargin = '0px 0px -10% 0px',
  once = true,
} = {}) {
  const [element, setElement] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const getInitialVisibility = useCallback((node) => {
    const rect = node.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);

    if (visibleHeight <= 0) {
      return false;
    }

    const measuredHeight = Math.min(rect.height || viewportHeight, viewportHeight);
    const visibleRatio = visibleHeight / Math.max(measuredHeight, 1);

    return visibleRatio >= threshold;
  }, [threshold]);

  const sectionRef = useCallback((node) => {
    setElement(node);

    if (!node) {
      return;
    }

    setIsVisible((current) => current || getInitialVisibility(node));
  }, [getInitialVisibility]);

  useEffect(() => {
    if (!element) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (once) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }

          return;
        }

        setIsVisible(entry.isIntersecting);
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [element, once, rootMargin, threshold]);

  return { sectionRef, isVisible };
}

export default useScrollReveal;
