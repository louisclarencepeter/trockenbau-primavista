import { useEffect, useRef, useState } from 'react';

const MOBILE_MEDIA_QUERY = '(max-width: 768px)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const getConnection = () => {
  if (typeof navigator === 'undefined') {
    return null;
  }

  return navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;
};

function ResponsiveVideo({
  media,
  fallback = null,
  className = '',
  posterClassName = '',
  isActive = true,
  posterAlt = '',
}) {
  const videoRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [saveData, setSaveData] = useState(false);
  const [isVideoAvailable, setIsVideoAvailable] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const mobileMediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
    const reducedMotionMediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    const connection = getConnection();

    const updatePreferences = () => {
      setIsMobile(mobileMediaQuery.matches);
      setPrefersReducedMotion(reducedMotionMediaQuery.matches);
      setSaveData(Boolean(connection?.saveData));
    };

    updatePreferences();

    mobileMediaQuery.addEventListener('change', updatePreferences);
    reducedMotionMediaQuery.addEventListener('change', updatePreferences);
    connection?.addEventListener?.('change', updatePreferences);

    return () => {
      mobileMediaQuery.removeEventListener('change', updatePreferences);
      reducedMotionMediaQuery.removeEventListener('change', updatePreferences);
      connection?.removeEventListener?.('change', updatePreferences);
    };
  }, []);

  const selectedSources = isMobile && media.mobileSources.length
    ? media.mobileSources
    : media.desktopSources;
  const shouldUseStillMedia = prefersReducedMotion || saveData;
  const sourcesKey = selectedSources.map(({ src }) => src).join('|');

  useEffect(() => {
    if (typeof window === 'undefined' || shouldUseStillMedia || selectedSources.length === 0) {
      setIsVideoAvailable(false);
      return undefined;
    }

    let isMounted = true;

    const checkAvailability = async () => {
      const results = await Promise.allSettled(
        selectedSources.map(({ src }) =>
          fetch(src, { method: 'HEAD' }).then((response) => response.ok)
        )
      );

      if (!isMounted) {
        return;
      }

      setIsVideoAvailable(
        results.some((result) => result.status === 'fulfilled' && result.value)
      );
    };

    checkAvailability().catch(() => {
      if (isMounted) {
        setIsVideoAvailable(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedSources, shouldUseStillMedia]);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) {
      return;
    }

    if (!isActive || !isVideoAvailable || shouldUseStillMedia) {
      videoElement.pause();
      return;
    }

    const playPromise = videoElement.play();
    playPromise?.catch(() => undefined);
  }, [isActive, isVideoAvailable, shouldUseStillMedia, sourcesKey]);

  if (shouldUseStillMedia && media.poster) {
    return (
      <img
        src={media.poster.src}
        srcSet={media.poster.srcSet}
        sizes={media.sizes}
        alt={posterAlt}
        loading="eager"
        decoding="sync"
        className={posterClassName || className}
      />
    );
  }

  if (!isVideoAvailable) {
    if (fallback) {
      return fallback;
    }

    if (!media.poster) {
      return null;
    }

    return (
      <img
        src={media.poster.src}
        srcSet={media.poster.srcSet}
        sizes={media.sizes}
        alt={posterAlt}
        loading="eager"
        decoding="sync"
        className={posterClassName || className}
      />
    );
  }

  return (
    <video
      key={sourcesKey}
      ref={videoRef}
      className={className}
      poster={media.poster?.src}
      autoPlay
      loop
      muted
      playsInline
      preload={isActive ? 'metadata' : 'none'}
      aria-hidden="true"
    >
      {selectedSources.map(({ src, type }) => (
        <source key={src} src={src} type={type} />
      ))}
    </video>
  );
}

export default ResponsiveVideo;
