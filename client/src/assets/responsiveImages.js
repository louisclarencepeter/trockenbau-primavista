const imageAssetUrls = import.meta.glob('./images/*/*.{jpg,png,webp}', {
  eager: true,
  import: 'default',
  query: '?url',
});
const assetUrls = {
  ...imageAssetUrls,
  './logo-96.png': new URL('./logo-96.png', import.meta.url).href,
  './logo-96.webp': new URL('./logo-96.webp', import.meta.url).href,
};

const getAssetUrl = (path) => {
  const assetUrl = assetUrls[`./${path}`];

  if (!assetUrl) {
    throw new Error(`Missing responsive asset: ${path}`);
  }

  return assetUrl;
};

const getWebpPath = (path) => path.replace(/\.(jpe?g|png)$/i, '.webp');

const createVariant = (path, width, height) => ({
  src: getAssetUrl(path),
  webpSrc: assetUrls[`./${getWebpPath(path)}`],
  width,
  height,
});

const findVariantAtOrAboveWidth = (variants, targetWidth) =>
  variants.find(({ width }) => width >= targetWidth) ?? variants[variants.length - 1];

const getFallbackWidth = (widths, maxWidth, preferredWidth) => {
  if (preferredWidth) {
    return widths.find((width) => width >= preferredWidth) ?? maxWidth;
  }

  if (maxWidth >= 1200) {
    return widths.find((width) => width >= 960) ?? maxWidth;
  }

  if (maxWidth >= 960) {
    return widths.find((width) => width >= 768) ?? maxWidth;
  }

  if (maxWidth >= 800) {
    return widths.find((width) => width >= 640) ?? maxWidth;
  }

  return maxWidth;
};

const createResponsiveImage = (variants, { fallbackWidth } = {}) => {
  const largestVariant = variants[variants.length - 1];
  const variantWidths = variants.map(({ width }) => width);
  const resolvedFallbackWidth = getFallbackWidth(variantWidths, largestVariant.width, fallbackWidth);
  const fallbackVariant = findVariantAtOrAboveWidth(variants, resolvedFallbackWidth);
  const webpVariants = variants.filter(({ webpSrc }) => Boolean(webpSrc));

  return {
    src: fallbackVariant.src,
    srcSet: variants.map(({ src, width }) => `${src} ${width}w`).join(', '),
    webpSrcSet: webpVariants.map(({ webpSrc, width }) => `${webpSrc} ${width}w`).join(', '),
    width: largestVariant.width,
    height: largestVariant.height,
  };
};

export const responsiveImageSizes = {
  about: '(max-width: 992px) calc(100vw - 40px), 532px',
  heroDetail: '(max-width: 576px) calc((100vw - 52px) / 2), (max-width: 768px) calc((100vw - 56px) / 2), 144px',
  heroMain: '(max-width: 768px) calc(100vw - 40px), (max-width: 992px) 458px, 358px',
  projectsFeatured: '(max-width: 1200px) calc(100vw - 40px), 1160px',
  projectsGrid: '(max-width: 576px) calc(100vw - 40px), (max-width: 992px) calc((100vw - 64px) / 2), 371px',
  services: '(max-width: 576px) calc(100vw - 40px), (max-width: 992px) calc((100vw - 64px) / 2), 272px',
};

export const aboutInteriorShowcaseImage = createResponsiveImage([
  createVariant('images/about/about-interior-showcase-400.jpg', 400, 300),
  createVariant('images/about/about-interior-showcase-480.jpg', 480, 360),
  createVariant('images/about/about-interior-showcase-640.jpg', 640, 480),
  createVariant('images/about/about-interior-showcase-800.jpg', 800, 600),
  createVariant('images/about/about-interior-showcase-1200.jpg', 1200, 900),
]);

export const heroDetailAccentImage = createResponsiveImage([
  createVariant('images/hero/hero-detail-accent-400.jpg', 400, 300),
  createVariant('images/hero/hero-detail-accent-480.jpg', 480, 360),
  createVariant('images/hero/hero-detail-accent-640.jpg', 640, 480),
  createVariant('images/hero/hero-detail-accent-800.jpg', 800, 600),
  createVariant('images/hero/hero-detail-accent-1200.jpg', 1200, 900),
]);

export const projectCeilingDrywallImage = createResponsiveImage([
  createVariant('images/projects/project-ceiling-drywall-400.jpg', 400, 300),
  createVariant('images/projects/project-ceiling-drywall-480.jpg', 480, 360),
  createVariant('images/projects/project-ceiling-drywall-640.jpg', 640, 480),
  createVariant('images/projects/project-ceiling-drywall-800.jpg', 800, 600),
  createVariant('images/projects/project-ceiling-drywall-1200.jpg', 1200, 900),
]);

export const projectDetailCeilingImage = createResponsiveImage([
  createVariant('images/projects/project-detail-ceiling-400.jpg', 400, 300),
  createVariant('images/projects/project-detail-ceiling-480.jpg', 480, 360),
  createVariant('images/projects/project-detail-ceiling-640.jpg', 640, 480),
  createVariant('images/projects/project-detail-ceiling-800.jpg', 800, 600),
  createVariant('images/projects/project-detail-ceiling-1200.jpg', 1200, 900),
]);

export const projectExistingSpaceRenovationImage = createResponsiveImage([
  createVariant('images/projects/project-existing-space-renovation-400.jpg', 400, 300),
  createVariant('images/projects/project-existing-space-renovation-480.jpg', 480, 360),
  createVariant('images/projects/project-existing-space-renovation-640.jpg', 640, 480),
  createVariant('images/projects/project-existing-space-renovation-800.jpg', 800, 600),
  createVariant('images/projects/project-existing-space-renovation-1200.jpg', 1200, 900),
]);

export const projectFeaturedModernizationImage = createResponsiveImage([
  createVariant('images/projects/project-featured-modernization-400.jpg', 400, 300),
  createVariant('images/projects/project-featured-modernization-480.jpg', 480, 360),
  createVariant('images/projects/project-featured-modernization-640.jpg', 640, 480),
  createVariant('images/projects/project-featured-modernization-800.jpg', 800, 600),
  createVariant('images/projects/project-featured-modernization-1200.jpg', 1200, 900),
]);

export const projectFinishImage = createResponsiveImage([
  createVariant('images/projects/project-finish-320.jpg', 320, 426),
  createVariant('images/projects/project-finish-400.jpg', 400, 533),
  createVariant('images/projects/project-finish-480.jpg', 480, 640),
  createVariant('images/projects/project-finish-640.jpg', 640, 853),
  createVariant('images/projects/project-finish-720.jpg', 720, 960),
  createVariant('images/projects/project-finish-960.jpg', 960, 1280),
]);

export const serviceDrywallImage = createResponsiveImage([
  createVariant('images/services/service-drywall-480.jpg', 480, 360),
  createVariant('images/services/service-drywall-600.jpg', 600, 450),
  createVariant('images/services/service-drywall-640.jpg', 640, 480),
  createVariant('images/services/service-drywall-800.jpg', 800, 600),
  createVariant('images/services/service-drywall-1200.jpg', 1200, 900),
]);

export const serviceCeilingImage = createResponsiveImage([
  createVariant('images/services/service-ceiling-480.jpg', 480, 360),
  createVariant('images/services/service-ceiling-600.jpg', 600, 450),
  createVariant('images/services/service-ceiling-640.jpg', 640, 480),
  createVariant('images/services/service-ceiling-800.jpg', 800, 600),
  createVariant('images/services/service-ceiling-1200.jpg', 1200, 900),
]);

export const serviceInteriorImage = createResponsiveImage([
  createVariant('images/services/service-interior-480.jpg', 480, 360),
  createVariant('images/services/service-interior-640.jpg', 640, 480),
  createVariant('images/services/service-interior-800.jpg', 800, 600),
  createVariant('images/services/service-interior-1200.jpg', 1200, 900),
]);

export const serviceRenovationImage = createResponsiveImage([
  createVariant('images/services/service-renovation-320.jpg', 320, 426),
  createVariant('images/services/service-renovation-480.jpg', 480, 640),
  createVariant('images/services/service-renovation-600.jpg', 600, 800),
  createVariant('images/services/service-renovation-640.jpg', 640, 853),
  createVariant('images/services/service-renovation-720.jpg', 720, 960),
  createVariant('images/services/service-renovation-800.jpg', 800, 1066),
  createVariant('images/services/service-renovation-960.jpg', 960, 1280),
]);

export const serviceRoofDetailImage = serviceRenovationImage;

export const serviceWindowsImage = createResponsiveImage([
  createVariant('images/services/service-windows-480.jpg', 480, 640),
  createVariant('images/services/service-windows-600.jpg', 600, 800),
  createVariant('images/services/service-windows-640.jpg', 640, 853),
  createVariant('images/services/service-windows-720.jpg', 720, 960),
  createVariant('images/services/service-windows-800.jpg', 800, 1066),
  createVariant('images/services/service-windows-960.jpg', 960, 1280),
]);

export const serviceRoofSlopeImage = serviceWindowsImage;

export const serviceSpecialImage = createResponsiveImage([
  createVariant('images/services/service-special-480.jpg', 480, 360),
  createVariant('images/services/service-special-600.jpg', 600, 450),
  createVariant('images/services/service-special-640.jpg', 640, 480),
  createVariant('images/services/service-special-800.jpg', 800, 600),
  createVariant('images/services/service-special-1200.jpg', 1200, 900),
]);

export const serviceWallsImage = createResponsiveImage([
  createVariant('images/services/service-walls-480.jpg', 480, 360),
  createVariant('images/services/service-walls-600.jpg', 600, 450),
  createVariant('images/services/service-walls-640.jpg', 640, 480),
  createVariant('images/services/service-walls-800.jpg', 800, 600),
  createVariant('images/services/service-walls-1200.jpg', 1200, 900),
]);

export const logoImage = createResponsiveImage([
  createVariant('logo-96.png', 96, 96),
]);

export const logoSmall = logoImage.src;
