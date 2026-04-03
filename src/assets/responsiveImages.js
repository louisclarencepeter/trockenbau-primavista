import aboutInteriorShowcase480 from './images/about/about-interior-showcase-480.jpg';
import aboutInteriorShowcase800 from './images/about/about-interior-showcase-800.jpg';
import aboutInteriorShowcase1200 from './images/about/about-interior-showcase-1200.jpg';
import heroDetailAccent480 from './images/hero/hero-detail-accent-480.jpg';
import heroDetailAccent800 from './images/hero/hero-detail-accent-800.jpg';
import heroDetailAccent1200 from './images/hero/hero-detail-accent-1200.jpg';
import projectCeilingDrywall480 from './images/projects/project-ceiling-drywall-480.jpg';
import projectCeilingDrywall800 from './images/projects/project-ceiling-drywall-800.jpg';
import projectCeilingDrywall1200 from './images/projects/project-ceiling-drywall-1200.jpg';
import projectDetailCeiling480 from './images/projects/project-detail-ceiling-480.jpg';
import projectDetailCeiling800 from './images/projects/project-detail-ceiling-800.jpg';
import projectDetailCeiling1200 from './images/projects/project-detail-ceiling-1200.jpg';
import projectExistingSpaceRenovation480 from './images/projects/project-existing-space-renovation-480.jpg';
import projectExistingSpaceRenovation800 from './images/projects/project-existing-space-renovation-800.jpg';
import projectExistingSpaceRenovation1200 from './images/projects/project-existing-space-renovation-1200.jpg';
import projectFeaturedModernization480 from './images/projects/project-featured-modernization-480.jpg';
import projectFeaturedModernization800 from './images/projects/project-featured-modernization-800.jpg';
import projectFeaturedModernization1200 from './images/projects/project-featured-modernization-1200.jpg';
import projectFinish480 from './images/projects/project-finish-480.jpg';
import projectFinish720 from './images/projects/project-finish-720.jpg';
import projectFinish960 from './images/projects/project-finish-960.jpg';
import serviceDrywall480 from './images/services/service-drywall-480.jpg';
import serviceDrywall800 from './images/services/service-drywall-800.jpg';
import serviceDrywall1200 from './images/services/service-drywall-1200.jpg';
import serviceInterior480 from './images/services/service-interior-480.jpg';
import serviceInterior800 from './images/services/service-interior-800.jpg';
import serviceInterior1200 from './images/services/service-interior-1200.jpg';
import serviceRenovation480 from './images/services/service-renovation-480.jpg';
import serviceRenovation720 from './images/services/service-renovation-720.jpg';
import serviceRenovation960 from './images/services/service-renovation-960.jpg';
import serviceWindows480 from './images/services/service-windows-480.jpg';
import serviceWindows720 from './images/services/service-windows-720.jpg';
import serviceWindows960 from './images/services/service-windows-960.jpg';
import logo192 from './logo-192.png';

const createResponsiveImage = (variants) => ({
  src: variants[variants.length - 1].src,
  srcSet: variants.map(({ src, width }) => `${src} ${width}w`).join(', '),
});

export const responsiveImageSizes = {
  about: '(max-width: 992px) calc(100vw - 40px), 620px',
  heroDetail: '(max-width: 768px) calc((100vw - 56px) / 2), 144px',
  heroMain: '(max-width: 768px) calc(100vw - 40px), (max-width: 992px) 458px, 358px',
  projectsFeatured: '(max-width: 1200px) calc(100vw - 40px), 1160px',
  projectsGrid: '(max-width: 576px) calc(100vw - 40px), (max-width: 992px) calc((100vw - 64px) / 2), 371px',
  services: '(max-width: 576px) calc(100vw - 40px), (max-width: 992px) calc((100vw - 64px) / 2), 272px',
};

export const aboutInteriorShowcaseImage = createResponsiveImage([
  { src: aboutInteriorShowcase480, width: 480 },
  { src: aboutInteriorShowcase800, width: 800 },
  { src: aboutInteriorShowcase1200, width: 1200 },
]);

export const heroDetailAccentImage = createResponsiveImage([
  { src: heroDetailAccent480, width: 480 },
  { src: heroDetailAccent800, width: 800 },
  { src: heroDetailAccent1200, width: 1200 },
]);

export const projectCeilingDrywallImage = createResponsiveImage([
  { src: projectCeilingDrywall480, width: 480 },
  { src: projectCeilingDrywall800, width: 800 },
  { src: projectCeilingDrywall1200, width: 1200 },
]);

export const projectDetailCeilingImage = createResponsiveImage([
  { src: projectDetailCeiling480, width: 480 },
  { src: projectDetailCeiling800, width: 800 },
  { src: projectDetailCeiling1200, width: 1200 },
]);

export const projectExistingSpaceRenovationImage = createResponsiveImage([
  { src: projectExistingSpaceRenovation480, width: 480 },
  { src: projectExistingSpaceRenovation800, width: 800 },
  { src: projectExistingSpaceRenovation1200, width: 1200 },
]);

export const projectFeaturedModernizationImage = createResponsiveImage([
  { src: projectFeaturedModernization480, width: 480 },
  { src: projectFeaturedModernization800, width: 800 },
  { src: projectFeaturedModernization1200, width: 1200 },
]);

export const projectFinishImage = createResponsiveImage([
  { src: projectFinish480, width: 480 },
  { src: projectFinish720, width: 720 },
  { src: projectFinish960, width: 960 },
]);

export const serviceDrywallImage = createResponsiveImage([
  { src: serviceDrywall480, width: 480 },
  { src: serviceDrywall800, width: 800 },
  { src: serviceDrywall1200, width: 1200 },
]);

export const serviceInteriorImage = createResponsiveImage([
  { src: serviceInterior480, width: 480 },
  { src: serviceInterior800, width: 800 },
  { src: serviceInterior1200, width: 1200 },
]);

export const serviceRenovationImage = createResponsiveImage([
  { src: serviceRenovation480, width: 480 },
  { src: serviceRenovation720, width: 720 },
  { src: serviceRenovation960, width: 960 },
]);

export const serviceWindowsImage = createResponsiveImage([
  { src: serviceWindows480, width: 480 },
  { src: serviceWindows720, width: 720 },
  { src: serviceWindows960, width: 960 },
]);

export const logoSmall = logo192;
