import { useEffect, useRef, useState } from 'react';
import ResponsivePicture from '../ResponsivePicture/ResponsivePicture';

const MOBILE_MEDIA_QUERY = '(max-width: 768px)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const getConnection = () => {
  if (typeof navigator === 'undefined') {
    return null;
  }

  return navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;
};

const prepareInlineAutoplay = (videoElement) => {
  if (!videoElement) {
    return;
  }

  videoElement.muted = true;
  videoElement.defaultMuted = true;
  videoElement.playsInline = true;
  videoElement.setAttribute('muted', '');
  videoElement.setAttribute('playsinline', '');
  videoElement.setAttribute('webkit-playsinline', '');
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
  const [failedSourcesKey, setFailedSourcesKey] = useState('');

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
  const hasVideoCandidate =
    typeof window !== 'undefined' && !shouldUseStillMedia && selectedSources.length > 0;
  const shouldRenderVideo = hasVideoCandidate && failedSourcesKey !== sourcesKey;

  const playVideo = () => {
    const videoElement = videoRef.current;

    if (!videoElement || !isActive || !shouldRenderVideo) {
      return;
    }

    prepareInlineAutoplay(videoElement);
    videoElement.play()?.catch(() => undefined);
  };

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) {
      return;
    }

    prepareInlineAutoplay(videoElement);

    if (!isActive || !shouldRenderVideo) {
      videoElement.pause();
      return;
    }

    videoElement.load();
    videoElement.play()?.catch(() => undefined);
  }, [isActive, shouldRenderVideo, sourcesKey]);

  if (shouldUseStillMedia && media.poster) {
    return (
      <ResponsivePicture
        image={media.poster}
        sizes={media.sizes}
        alt={posterAlt}
        loading="eager"
        decoding="sync"
        className={posterClassName || className}
      />
    );
  }

  if (!shouldRenderVideo) {
    if (fallback) {
      return fallback;
    }

    if (!media.poster) {
      return null;
    }

    return (
      <ResponsivePicture
        image={media.poster}
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
      preload={isActive ? 'auto' : 'metadata'}
      aria-hidden="true"
      onCanPlay={playVideo}
      onLoadedData={playVideo}
      onLoadedMetadata={playVideo}
      onError={() => setFailedSourcesKey(sourcesKey)}
    >
      {selectedSources.map(({ src, type }) => (
        <source key={src} src={src} type={type} />
      ))}
    </video>
  );
}

export default ResponsiveVideo;
