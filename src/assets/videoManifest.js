import {
  aboutInteriorShowcaseImage,
  projectFeaturedModernizationImage,
  responsiveImageSizes,
} from './responsiveImages';

const createVideoSource = (src, type) => ({ src, type });

export const heroMainVideo = {
  poster: projectFeaturedModernizationImage,
  sizes: responsiveImageSizes.heroMain,
  desktopSources: [
    createVideoSource('/videos/hero/desktop/prima-vista-hero.mp4', 'video/mp4'),
    createVideoSource('/videos/hero/desktop/prima-vista-hero.webm', 'video/webm'),
  ],
  mobileSources: [
    createVideoSource('/videos/hero/mobile/prima-vista-hero-mobile.mp4', 'video/mp4'),
    createVideoSource('/videos/hero/mobile/prima-vista-hero-mobile.webm', 'video/webm'),
  ],
};

export const aboutSectionVideo = {
  poster: aboutInteriorShowcaseImage,
  sizes: responsiveImageSizes.about,
  desktopSources: [
    createVideoSource('/videos/about/desktop/prima-vista-about.mp4', 'video/mp4'),
    createVideoSource('/videos/about/desktop/prima-vista-about.webm', 'video/webm'),
  ],
  mobileSources: [
    createVideoSource('/videos/about/desktop/prima-vista-about.mp4', 'video/mp4'),
    createVideoSource('/videos/about/desktop/prima-vista-about.webm', 'video/webm'),
  ],
};
