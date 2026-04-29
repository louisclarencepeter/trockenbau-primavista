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
    createVideoSource('/videos/startseite/desktop/prima-vista-hero.mp4', 'video/mp4'),
    createVideoSource('/videos/startseite/desktop/prima-vista-hero.webm', 'video/webm'),
  ],
  mobileSources: [
    createVideoSource('/videos/startseite/mobil/prima-vista-hero-mobile.mp4', 'video/mp4'),
    createVideoSource('/videos/startseite/mobil/prima-vista-hero-mobile.webm', 'video/webm'),
  ],
};

export const aboutSectionVideo = {
  poster: aboutInteriorShowcaseImage,
  sizes: responsiveImageSizes.about,
  desktopSources: [
    createVideoSource('/videos/ueber-uns/prima-vista-about.mp4', 'video/mp4'),
  ],
  mobileSources: [
    createVideoSource('/videos/ueber-uns/prima-vista-about.mp4', 'video/mp4'),
  ],
};
