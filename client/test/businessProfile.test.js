import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { businessProfile, localBusinessSchema } from '../src/config/businessProfile.js';

test('business profile keeps the public brand separate from the legal entity', () => {
  assert.equal(businessProfile.publicName, 'Trockenbau PrimaVista Schweiz');
  assert.equal(businessProfile.legalName, 'Prima Vista B&G GmbH');
  assert.equal(businessProfile.serviceLine, 'Trockenbau • Innenausbau • Renovationen');
  assert.equal(businessProfile.slogan, 'Präzision. Qualität. Zeitloses Design.');
  assert.equal(businessProfile.whatsapp, 'https://wa.me/491793596697');
  assert.equal(businessProfile.instagram, 'https://www.instagram.com/trockenbau_primavista.ch/');
  assert.equal(
    businessProfile.contactHours,
    'Mo–Fr 08:00–17:00 · Sa nach Vereinbarung · So geschlossen',
  );
  assert.equal(
    businessProfile.appointmentNote,
    'Persönliche Beratungen und Termine erfolgen nach Vereinbarung.',
  );
});

test('website service areas preserve all 22 configured locations without duplicates', () => {
  assert.equal(businessProfile.serviceAreas.length, 22);
  assert.equal(new Set(businessProfile.serviceAreas).size, 22);
  assert.deepEqual(businessProfile.serviceAreas, [
    'Luzern',
    'Kriens',
    'Horw',
    'Emmen',
    'Emmenbrücke',
    'Ebikon',
    'Rothenburg',
    'Buchrain',
    'Root',
    'Adligenswil',
    'Meggen',
    'Sursee',
    'Sempach',
    'Zug',
    'Baar',
    'Cham',
    'Rotkreuz',
    'Küssnacht am Rigi',
    'Stans',
    'Stansstad',
    'Altdorf',
    'Zürich und Umgebung',
  ]);
});

test('local business schema includes confirmed facts, the dedicated Instagram profile, and omits gated profile fields', () => {
  assert.equal(localBusinessSchema.name, businessProfile.publicName);
  assert.equal(localBusinessSchema.legalName, businessProfile.legalName);
  assert.equal(localBusinessSchema.slogan, businessProfile.slogan);
  assert.deepEqual(localBusinessSchema.areaServed, businessProfile.serviceAreas);
  assert.deepEqual(localBusinessSchema.sameAs, [businessProfile.instagram]);

  const serializedSchema = JSON.stringify(localBusinessSchema);
  assert.deepEqual(JSON.parse(serializedSchema), localBusinessSchema);
  assert.doesNotMatch(
    serializedSchema,
    /openingHoursSpecification|aggregateRating|review|maps\.google/i,
  );
});

test('static metadata and manifest use the confirmed public brand', async () => {
  const [indexHtml, manifestText] = await Promise.all([
    readFile(new URL('../index.html', import.meta.url), 'utf8'),
    readFile(new URL('../public/site.webmanifest', import.meta.url), 'utf8'),
  ]);
  const manifest = JSON.parse(manifestText);

  assert.match(indexHtml, /<title>Trockenbau Luzern \| Trockenbau PrimaVista Schweiz<\/title>/);
  assert.match(indexHtml, /property="og:site_name" content="Trockenbau PrimaVista Schweiz"/);
  assert.equal(manifest.name, businessProfile.publicName);
});
