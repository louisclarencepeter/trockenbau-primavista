import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsDir = path.resolve(__dirname, '../src/assets');
const imagesDir = path.join(assetsDir, 'images');
const webpQuality = 74;

const isSourceImage = (filePath) => /\.(jpe?g|png)$/i.test(filePath) && !/-\d+\.png$/i.test(filePath);

const walk = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return walk(entryPath);
    }

    return entryPath;
  }));

  return files.flat();
};

const createWebpCompanion = async (sourcePath) => {
  const destinationPath = sourcePath.replace(/\.(jpe?g|png)$/i, '.webp');

  await sharp(sourcePath)
    .webp({ quality: webpQuality })
    .toFile(destinationPath);
};

const createLogoVariants = async () => {
  const logoSource = path.join(assetsDir, 'logo-192.png');
  const logoSmallPng = path.join(assetsDir, 'logo-96.png');
  const logoSmallWebp = path.join(assetsDir, 'logo-96.webp');

  await sharp(logoSource)
    .resize(96, 96)
    .png({ compressionLevel: 9, palette: true })
    .toFile(logoSmallPng);

  await sharp(logoSmallPng)
    .webp({ quality: 82 })
    .toFile(logoSmallWebp);
};

const sourceImages = (await walk(imagesDir)).filter(isSourceImage);

await Promise.all(sourceImages.map(createWebpCompanion));
await createLogoVariants();

console.log(`Generated ${sourceImages.length} WebP image variants and compact logo assets.`);
