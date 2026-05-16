import {
  projectCeilingDrywallImage,
  projectDetailCeilingImage,
  projectExistingSpaceRenovationImage,
  projectFeaturedModernizationImage,
  projectFinishImage,
  serviceCeilingImage,
  serviceDrywallImage,
  serviceInteriorImage,
  serviceRenovationImage,
  serviceRoofSlopeImage,
  serviceSpecialImage,
  serviceWallsImage,
} from '../../../assets/responsiveImages';

export const featuredProject = {
  slug: 'trockenbau-aus-einer-hand',
  title: 'Trockenbau aus einer Hand',
  eyebrow: 'Komplettausbau',
  shortText: 'Decken, Wände und Anschlussdetails sauber geplant und fachgerecht umgesetzt.',
  image: projectFeaturedModernizationImage,
  alt: 'Trockenbau-Projekt mit moderner Ausführung',
  calculatorChoiceId: 'alles',
  summary:
    'Ein Modernisierungsprojekt, in dem mehrere Trockenbau-Gewerke zusammen geplant '
    + 'und umgesetzt wurden – von der abgehängten Decke über die neuen Trennwände '
    + 'bis zu sauberen Anschlüssen an Bestandsbauteile.',
  highlights: [
    'Abgehängte Decken inklusive Vorbereitung für Beleuchtung und Lüftung',
    'Trennwände in Metallständerbauweise mit beidseitiger Beplankung',
    'Detail- und Anschlussarbeiten an Türen, Fenstern und Bestandsbauteilen',
  ],
  facts: {
    Leistung: 'Decken, Wände, Anschlussdetails',
    Region: 'Schweiz',
    Bauphase: 'Innenausbau / Modernisierung',
  },
  gallery: [
    {
      image: projectDetailCeilingImage,
      alt: 'Detailaufnahme mit präzise ausgeführten Decken- und Übergangsdetails',
    },
    {
      image: projectFinishImage,
      alt: 'Fertig ausgebauter Innenraum nach Trockenbau-Arbeiten',
    },
    {
      image: projectCeilingDrywallImage,
      alt: 'Trockenbau-Decke mit sichtbarer Unterkonstruktion',
    },
  ],
};

export const supportingProjects = [
  {
    slug: 'decken-abhaengen',
    title: 'Decken abhängen',
    image: projectCeilingDrywallImage,
    alt: 'Trockenbau-Projekt mit sichtbarer Decken- und Leitungsstruktur',
    calculatorChoiceId: 'decken',
    summary:
      'Abgehängte Decke mit integrierter Unterkonstruktion für Leitungen, '
      + 'Lüftung und Beleuchtung. Saubere Flächen als Basis für die folgenden Gewerke.',
    highlights: [
      'Metall-Unterkonstruktion in passender Abhängehöhe',
      'Gipskarton-Beplankung mit vorbereiteten Aussparungen',
      'Anschluss an Wände und Bestandsbauteile ohne sichtbare Übergänge',
    ],
    facts: {
      Leistung: 'Decke abhängen',
      Aufbau: 'Unterkonstruktion + Beplankung',
      Vorbereitung: 'Aussparungen für Technik',
    },
    gallery: [
      {
        image: projectDetailCeilingImage,
        alt: 'Nahaufnahme einer abgehängten Decke mit sauberen Anschlüssen',
      },
      {
        image: serviceCeilingImage,
        alt: 'Trockenbau-Arbeiten an einer Deckenfläche',
      },
      {
        image: projectFinishImage,
        alt: 'Fertige Decke nach Trockenbau und Verspachtelung',
      },
    ],
  },
  {
    slug: 'waende-im-bestand',
    title: 'Wände im Bestand',
    image: projectExistingSpaceRenovationImage,
    alt: 'Trockenbau-Projekt mit vorbereiteten Wand- und Deckenflächen',
    calculatorChoiceId: 'waende-stellen',
    summary:
      'Neue Wandflächen im Bestand: Metallständerwerk, Beplankung und '
      + 'angepasste Anschlüsse an vorhandene Decken, Böden und Türöffnungen.',
    highlights: [
      'Aufmaß und Planung im Bestand',
      'Metallständerwerk mit Beplankung',
      'Anschlussdetails an Bestandsbauteile',
    ],
    facts: {
      Leistung: 'Wände stellen',
      Kontext: 'Umbau im Bestand',
      Anschlüsse: 'Decke, Boden, Türöffnung',
    },
    gallery: [
      {
        image: serviceWallsImage,
        alt: 'Metallständerwände im Aufbau mit Platten und Unterkonstruktion',
      },
      {
        image: serviceInteriorImage,
        alt: 'Innenausbau-Detail mit neuen Wandflächen',
      },
      {
        image: projectFinishImage,
        alt: 'Fertige Wandflächen nach Trockenbau-Arbeiten',
      },
    ],
  },
  {
    slug: 'estrich-boden',
    title: 'Estrich-Boden',
    image: serviceDrywallImage,
    alt: 'Rohbau-Innenraum mit vorbereitetem Boden für den weiteren Ausbau',
    calculatorChoiceId: 'estrich',
    summary:
      'Trockener Bodenaufbau mit Trockenestrich-Elementen als ebene, '
      + 'belastbare Basis für die nachfolgenden Bodenbeläge.',
    highlights: [
      'Vorbereiteter Untergrund mit Ausgleichsschüttung',
      'Trockenestrich-Elemente, verklebt und verschraubt',
      'Saubere Flächen für Folgegewerke',
    ],
    facts: {
      Leistung: 'Trockenestrich',
      Aufbau: 'Ausgleich + Elemente',
      Ergebnis: 'Belastbare, ebene Fläche',
    },
    gallery: [
      {
        image: projectFinishImage,
        alt: 'Fertig ausgebauter Innenraum nach Bodenarbeiten',
      },
      {
        image: serviceRenovationImage,
        alt: 'Renovierungsbaustelle mit vorbereitetem Boden',
      },
      {
        image: projectFeaturedModernizationImage,
        alt: 'Modernisierungsprojekt mit neuem Bodenaufbau',
      },
    ],
  },
  {
    slug: 'saubere-anschluesse',
    title: 'Saubere Anschlüsse',
    image: projectDetailCeilingImage,
    alt: 'Ausbauprojekt mit präzise ausgeführten Decken- und Übergangsdetails',
    calculatorChoiceId: 'alles',
    summary:
      'Detailausbau mit präzisen Übergängen zwischen Decke, Wand und '
      + 'Bestandsbauteilen – die Grundlage für ein gepflegtes Gesamtbild.',
    highlights: [
      'Präzise Maßaufnahme im Bestand',
      'Saubere Kanten und Übergänge',
      'Vorbereitung für Verspachtelung und Anstrich',
    ],
    facts: {
      Leistung: 'Detail- und Anschlussarbeiten',
      Fokus: 'Übergänge und Kanten',
      Vorbereitung: 'Verspachtelung folgt',
    },
    gallery: [
      {
        image: projectFinishImage,
        alt: 'Fertige Innenflächen mit präzisen Übergängen',
      },
      {
        image: projectCeilingDrywallImage,
        alt: 'Trockenbau-Decke mit sauberen Wandanschlüssen',
      },
      {
        image: serviceInteriorImage,
        alt: 'Innenausbau-Detail mit sorgfältig ausgeführten Kanten',
      },
    ],
  },
  {
    slug: 'dachschraegen-ausbauen',
    title: 'Dachschrägen ausbauen',
    image: serviceRoofSlopeImage,
    alt: 'Trockenbau-Ausbau an Dachschrägen mit Metallprofilen und Beplankung',
    calculatorChoiceId: 'dachschraegen',
    summary:
      'Verkleidung und Ausbau einer Dachschräge mit Unterkonstruktion, '
      + 'Dämmung und Beplankung für nutzbare Wohn- oder Arbeitsflächen.',
    highlights: [
      'Unterkonstruktion entlang der Dachschräge',
      'Dämmebene und Dampfbremse',
      'Beplankung mit Gipskartonplatten',
    ],
    facts: {
      Leistung: 'Dachschrägen verkleiden',
      Aufbau: 'Unterkonstruktion, Dämmung, Beplankung',
      Nutzung: 'Wohn- oder Arbeitsraum',
    },
    gallery: [
      {
        image: serviceRenovationImage,
        alt: 'Dachgeschoss-Renovierung mit Trockenbau-Arbeiten',
      },
      {
        image: projectDetailCeilingImage,
        alt: 'Detailaufnahme an einer geneigten Decke mit sauberen Übergängen',
      },
      {
        image: serviceCeilingImage,
        alt: 'Trockenbau-Beplankung an einer Schräge',
      },
    ],
  },
  {
    slug: 'sonstige-leistungen',
    title: 'Sonstige Leistungen',
    image: serviceSpecialImage,
    alt: 'Trockenbau-Sonderleistungen mit Dämmung und Installationen in einer Wand',
    calculatorChoiceId: 'alles',
    summary:
      'Sonderarbeiten rund um Trockenbau: Dämmung, Brandschutz, '
      + 'Revisionsklappen, Türeinbauten und weitere Detaillösungen nach Aufgabenstellung.',
    highlights: [
      'Individuell abgestimmte Trockenbau-Leistungen',
      'Dämmung, Brandschutz, Revisionsklappen',
      'Abgestimmte Schnittstellen zu anderen Gewerken',
    ],
    facts: {
      Leistung: 'Sonderlösungen',
      Beispiele: 'Dämmung, Brandschutz, Klappen',
      Vorgehen: 'Abstimmung pro Projekt',
    },
    gallery: [
      {
        image: serviceInteriorImage,
        alt: 'Innenausbau mit individuellen Detaillösungen',
      },
      {
        image: projectFinishImage,
        alt: 'Fertige Räume mit sorgfältig umgesetzten Sonderlösungen',
      },
      {
        image: projectExistingSpaceRenovationImage,
        alt: 'Renovierung im Bestand mit angepassten Trockenbau-Arbeiten',
      },
    ],
  },
];

export const allProjects = [featuredProject, ...supportingProjects];

export const getProjectBySlug = (slug) => allProjects.find((project) => project.slug === slug);
