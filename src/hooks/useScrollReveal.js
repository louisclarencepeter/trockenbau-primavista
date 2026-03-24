import { useEffect, useRef, useState } from 'react';

function useScrollReveal({
  threshold = 0.2,
  rootMargin = '0px 0px -10% 0px',
  once = true,
} = {}) {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = sectionRef.current;

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
  }, [once, rootMargin, threshold]);

  return { sectionRef, isVisible };
}

export default useScrollReveal;
