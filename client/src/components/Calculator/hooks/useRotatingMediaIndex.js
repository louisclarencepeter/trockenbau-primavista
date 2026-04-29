import { useEffect, useState } from 'react';

function useRotatingMediaIndex(itemCount, intervalMs = 4600) {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  useEffect(() => {
    if (itemCount <= 1 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveMediaIndex((currentIndex) => (currentIndex + 1) % itemCount);
    }, intervalMs);

    return () => window.clearInterval(intervalId);
  }, [intervalMs, itemCount]);

  return activeMediaIndex;
}

export default useRotatingMediaIndex;
