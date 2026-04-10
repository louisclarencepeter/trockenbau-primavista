import aboutInteriorShowcase400 from './images/about/about-interior-showcase-400.jpg';
import aboutInteriorShowcase480 from './images/about/about-interior-showcase-480.jpg';
import aboutInteriorShowcase640 from './images/about/about-interior-showcase-640.jpg';
import aboutInteriorShowcase800 from './images/about/about-interior-showcase-800.jpg';
import aboutInteriorShowcase1200 from './images/about/about-interior-showcase-1200.jpg';
import heroDetailAccent400 from './images/hero/hero-detail-accent-400.jpg';
import heroDetailAccent480 from './images/hero/hero-detail-accent-480.jpg';
import heroDetailAccent640 from './images/hero/hero-detail-accent-640.jpg';
import heroDetailAccent800 from './images/hero/hero-detail-accent-800.jpg';
import heroDetailAccent1200 from './images/hero/hero-detail-accent-1200.jpg';
import projectCeilingDrywall400 from './images/projects/project-ceiling-drywall-400.jpg';
import projectCeilingDrywall480 from './images/projects/project-ceiling-drywall-480.jpg';
import projectCeilingDrywall640 from './images/projects/project-ceiling-drywall-640.jpg';
import projectCeilingDrywall800 from './images/projects/project-ceiling-drywall-800.jpg';
import projectCeilingDrywall1200 from './images/projects/project-ceiling-drywall-1200.jpg';
import projectDetailCeiling400 from './images/projects/project-detail-ceiling-400.jpg';
import projectDetailCeiling480 from './images/projects/project-detail-ceiling-480.jpg';
import projectDetailCeiling640 from './images/projects/project-detail-ceiling-640.jpg';
import projectDetailCeiling800 from './images/projects/project-detail-ceiling-800.jpg';
import projectDetailCeiling1200 from './images/projects/project-detail-ceiling-1200.jpg';
import projectExistingSpaceRenovation400 from './images/projects/project-existing-space-renovation-400.jpg';
import projectExistingSpaceRenovation480 from './images/projects/project-existing-space-renovation-480.jpg';
import projectExistingSpaceRenovation640 from './images/projects/project-existing-space-renovation-640.jpg';
import projectExistingSpaceRenovation800 from './images/projects/project-existing-space-renovation-800.jpg';
import projectExistingSpaceRenovation1200 from './images/projects/project-existing-space-renovation-1200.jpg';
import projectFeaturedModernization400 from './images/projects/project-featured-modernization-400.jpg';
import projectFeaturedModernization480 from './images/projects/project-featured-modernization-480.jpg';
import projectFeaturedModernization640 from './images/projects/project-featured-modernization-640.jpg';
import projectFeaturedModernization800 from './images/projects/project-featured-modernization-800.jpg';
import projectFeaturedModernization1200 from './images/projects/project-featured-modernization-1200.jpg';
import projectFinish320 from './images/projects/project-finish-320.jpg';
import projectFinish400 from './images/projects/project-finish-400.jpg';
import projectFinish480 from './images/projects/project-finish-480.jpg';
import projectFinish640 from './images/projects/project-finish-640.jpg';
import projectFinish720 from './images/projects/project-finish-720.jpg';
import projectFinish960 from './images/projects/project-finish-960.jpg';
import serviceDrywall480 from './images/services/service-drywall-480.jpg';
import serviceDrywall600 from './images/services/service-drywall-600.jpg';
import serviceDrywall640 from './images/services/service-drywall-640.jpg';
import serviceDrywall800 from './images/services/service-drywall-800.jpg';
import serviceDrywall1200 from './images/services/service-drywall-1200.jpg';
import serviceInterior480 from './images/services/service-interior-480.jpg';
import serviceInterior640 from './images/services/service-interior-640.jpg';
import serviceInterior800 from './images/services/service-interior-800.jpg';
import serviceInterior1200 from './images/services/service-interior-1200.jpg';
import serviceRenovation320 from './images/services/service-renovation-320.jpg';
import serviceRenovation480 from './images/services/service-renovation-480.jpg';
import serviceRenovation600 from './images/services/service-renovation-600.jpg';
import serviceRenovation640 from './images/services/service-renovation-640.jpg';
import serviceRenovation720 from './images/services/service-renovation-720.jpg';
import serviceRenovation800 from './images/services/service-renovation-800.jpg';
import serviceRenovation960 from './images/services/service-renovation-960.jpg';
import serviceWindows480 from './images/services/service-windows-480.jpg';
import serviceWindows600 from './images/services/service-windows-600.jpg';
import serviceWindows640 from './images/services/service-windows-640.jpg';
import serviceWindows720 from './images/services/service-windows-720.jpg';
import serviceWindows800 from './images/services/service-windows-800.jpg';
import serviceWindows960 from './images/services/service-windows-960.jpg';
import logo192 from './logo-192.png';

const createNetlifyImageUrl = (sourceUrl, width, quality = 76) =>
  `/.netlify/images?url=${encodeURIComponent(sourceUrl)}&w=${width}&q=${quality}`;

const createResponsiveImage = (variants, { quality = 76 } = {}) => {
  const largestVariant = variants[variants.length - 1];
  const useNetlifyImageCdn = import.meta.env.PROD;

  if (!useNetlifyImageCdn) {
    return {
      src: largestVariant.src,
      srcSet: variants.map(({ src, width }) => `${src} ${width}w`).join(', '),
    };
  }

  return {
    src: createNetlifyImageUrl(largestVariant.src, largestVariant.width, quality),
    srcSet: variants
      .map(({ width }) => `${createNetlifyImageUrl(largestVariant.src, width, quality)} ${width}w`)
      .join(', '),
  };
};

export const responsiveImageSizes = {
  about: '(max-width: 992px) calc(100vw - 40px), 552px',
  heroDetail: '(max-width: 768px) calc((100vw - 58px) / 2), 144px',
  heroMain: '(max-width: 768px) calc(100vw - 40px), (max-width: 992px) 458px, 358px',
  projectsFeatured: '(max-width: 1200px) calc(100vw - 40px), 1160px',
  projectsGrid: '(max-width: 576px) calc(100vw - 40px), (max-width: 992px) calc((100vw - 64px) / 2), 371px',
  services: '(max-width: 576px) calc(100vw - 58px), (max-width: 992px) calc((100vw - 64px) / 2), 272px',
};

export const aboutInteriorShowcaseImage = createResponsiveImage([
  { src: aboutInteriorShowcase400, width: 400 },
  { src: aboutInteriorShowcase480, width: 480 },
  { src: aboutInteriorShowcase640, width: 640 },
  { src: aboutInteriorShowcase800, width: 800 },
  { src: aboutInteriorShowcase1200, width: 1200 },
]);

export const heroDetailAccentImage = createResponsiveImage([
  { src: heroDetailAccent400, width: 400 },
  { src: heroDetailAccent480, width: 480 },
  { src: heroDetailAccent640, width: 640 },
  { src: heroDetailAccent800, width: 800 },
  { src: heroDetailAccent1200, width: 1200 },
]);

export const projectCeilingDrywallImage = createResponsiveImage([
  { src: projectCeilingDrywall400, width: 400 },
  { src: projectCeilingDrywall480, width: 480 },
  { src: projectCeilingDrywall640, width: 640 },
  { src: projectCeilingDrywall800, width: 800 },
  { src: projectCeilingDrywall1200, width: 1200 },
]);

export const projectDetailCeilingImage = createResponsiveImage([
  { src: projectDetailCeiling400, width: 400 },
  { src: projectDetailCeiling480, width: 480 },
  { src: projectDetailCeiling640, width: 640 },
  { src: projectDetailCeiling800, width: 800 },
  { src: projectDetailCeiling1200, width: 1200 },
]);

export const projectExistingSpaceRenovationImage = createResponsiveImage([
  { src: projectExistingSpaceRenovation400, width: 400 },
  { src: projectExistingSpaceRenovation480, width: 480 },
  { src: projectExistingSpaceRenovation640, width: 640 },
  { src: projectExistingSpaceRenovation800, width: 800 },
  { src: projectExistingSpaceRenovation1200, width: 1200 },
]);

export const projectFeaturedModernizationImage = createResponsiveImage([
  { src: projectFeaturedModernization400, width: 400 },
  { src: projectFeaturedModernization480, width: 480 },
  { src: projectFeaturedModernization640, width: 640 },
  { src: projectFeaturedModernization800, width: 800 },
  { src: projectFeaturedModernization1200, width: 1200 },
]);

export const projectFinishImage = createResponsiveImage([
  { src: projectFinish320, width: 320 },
  { src: projectFinish400, width: 400 },
  { src: projectFinish480, width: 480 },
  { src: projectFinish640, width: 640 },
  { src: projectFinish720, width: 720 },
  { src: projectFinish960, width: 960 },
]);

export const serviceDrywallImage = createResponsiveImage([
  { src: serviceDrywall480, width: 480 },
  { src: serviceDrywall600, width: 600 },
  { src: serviceDrywall640, width: 640 },
  { src: serviceDrywall800, width: 800 },
  { src: serviceDrywall1200, width: 1200 },
]);

export const serviceInteriorImage = createResponsiveImage([
  { src: serviceInterior480, width: 480 },
  { src: serviceInterior640, width: 640 },
  { src: serviceInterior800, width: 800 },
  { src: serviceInterior1200, width: 1200 },
]);

export const serviceRenovationImage = createResponsiveImage([
  { src: serviceRenovation320, width: 320 },
  { src: serviceRenovation480, width: 480 },
  { src: serviceRenovation600, width: 600 },
  { src: serviceRenovation640, width: 640 },
  { src: serviceRenovation720, width: 720 },
  { src: serviceRenovation800, width: 800 },
  { src: serviceRenovation960, width: 960 },
]);

export const serviceWindowsImage = createResponsiveImage([
  { src: serviceWindows480, width: 480 },
  { src: serviceWindows600, width: 600 },
  { src: serviceWindows640, width: 640 },
  { src: serviceWindows720, width: 720 },
  { src: serviceWindows800, width: 800 },
  { src: serviceWindows960, width: 960 },
]);

export const logoSmall = logo192;
