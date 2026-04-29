import { useCallback, useEffect, useState } from 'react';

const revealedSections = new Set();

const getRevealKey = (node) => {
  if (!node) {
    return null;
  }

  if (node.dataset.scrollRevealId) {
    return node.dataset.scrollRevealId;
  }

  if (node.id) {
    return `id:${node.id}`;
  }

  const firstClassName = String(node.className)
    .split(/\s+/)
    .find(Boolean);

  return firstClassName ? `class:${firstClassName}` : null;
};

function useScrollReveal({
  threshold = 0.2,
  rootMargin = '0px 0px -10% 0px',
  once = true,
} = {}) {
  const [element, setElement] = useState(null);
  const [revealKey, setRevealKey] = useState(null);
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
      setRevealKey(null);
      return;
    }

    const nextRevealKey = getRevealKey(node);
    const isAlreadyRevealed = once && nextRevealKey && revealedSections.has(nextRevealKey);
    const isInitiallyVisible = getInitialVisibility(node);
    setRevealKey(nextRevealKey);

    if (once && nextRevealKey && isInitiallyVisible) {
      revealedSections.add(nextRevealKey);
    }

    setIsVisible((current) => (
      current
      || isAlreadyRevealed
      || isInitiallyVisible
    ));
  }, [getInitialVisibility, once]);

  useEffect(() => {
    if (!element) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (once) {
          if (entry.isIntersecting) {
            if (revealKey) {
              revealedSections.add(revealKey);
            }

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

    if (once && revealKey && revealedSections.has(revealKey)) {
      setIsVisible(true);
      return () => {
        observer.disconnect();
      };
    }

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [element, once, revealKey, rootMargin, threshold]);

  return { sectionRef, isVisible };
}

export default useScrollReveal;
