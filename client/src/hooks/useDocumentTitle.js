import { useEffect } from 'react';
import { getProjectBySlug } from '../components/Projects/data/projectsCatalog';
import { businessProfile } from '../config/businessProfile';

const SITE_ORIGIN = 'https://trockenbau-primavista.ch';

const META_BY_PATH = {
  '/': {
    title: `Trockenbau Luzern | ${businessProfile.publicName}`,
    description:
      `${businessProfile.publicName}: Trockenbau, Innenausbau und Renovationen in Luzern, der Zentralschweiz sowie Zürich und Umgebung.`,
  },
  '/kalkulator': {
    title: `Trockenbau Kalkulator | ${businessProfile.publicName}`,
    description:
      'Schätzen Sie Ihr Trockenbau-Projekt online: Decken, Wände, Estrich-Boden, Dachschrägen und Zusatzleistungen unverbindlich kalkulieren.',
  },
  '/anfrage': {
    title: `Anfrage stellen | ${businessProfile.publicName}`,
    description:
      'Stellen Sie eine unverbindliche Anfrage für Ihr Trockenbau-Projekt und teilen Sie Leistung, Fläche, Zeitplan und Kontaktdaten.',
  },
  '/impressum': {
    title: 'Impressum | Prima Vista B&G GmbH',
    description:
      'Impressum und Pflichtangaben der Prima Vista B&G GmbH in Emmenbrücke, Schweiz.',
  },
  '/datenschutz': {
    title: 'Datenschutzerklärung | Prima Vista B&G GmbH',
    description:
      'Datenschutzhinweise der Prima Vista B&G GmbH zu Website, Kontaktformularen, Chatbot, Google Bewertungen und optionaler Analyse.',
  },
};

const getOrCreateMeta = (selector, createElement) => {
  const existingElement = document.head.querySelector(selector);

  if (existingElement) {
    return existingElement;
  }

  const element = createElement();
  document.head.appendChild(element);
  return element;
};

const setNamedMeta = (name, content) => {
  const element = getOrCreateMeta(`meta[name="${name}"]`, () => {
    const meta = document.createElement('meta');
    meta.setAttribute('name', name);
    return meta;
  });

  element.setAttribute('content', content);
};

const setPropertyMeta = (property, content) => {
  const element = getOrCreateMeta(`meta[property="${property}"]`, () => {
    const meta = document.createElement('meta');
    meta.setAttribute('property', property);
    return meta;
  });

  element.setAttribute('content', content);
};

const setCanonical = (url) => {
  const element = getOrCreateMeta('link[rel="canonical"]', () => {
    const link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    return link;
  });

  element.setAttribute('href', url);
};

const resolveMeta = (pathname) => {
  if (META_BY_PATH[pathname]) {
    return META_BY_PATH[pathname];
  }

  const referenzenMatch = pathname.match(/^\/referenzen\/([^/]+)$/);

  if (referenzenMatch) {
    const project = getProjectBySlug(referenzenMatch[1]);

    if (project) {
      return {
        title: `${project.title} – Referenzen | ${businessProfile.publicName}`,
        description: project.summary,
      };
    }
  }

  return META_BY_PATH['/'];
};

export const useDocumentTitle = (pathname) => {
  useEffect(() => {
    const meta = resolveMeta(pathname);
    const canonicalPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
    const canonicalUrl = `${SITE_ORIGIN}${canonicalPath}`;

    document.title = meta.title;
    setNamedMeta('description', meta.description);
    setPropertyMeta('og:title', meta.title);
    setPropertyMeta('og:description', meta.description);
    setPropertyMeta('og:type', 'website');
    setPropertyMeta('og:url', canonicalUrl);
    setPropertyMeta('og:site_name', businessProfile.publicName);
    setNamedMeta('twitter:card', 'summary_large_image');
    setNamedMeta('twitter:title', meta.title);
    setNamedMeta('twitter:description', meta.description);
    setCanonical(canonicalUrl);
  }, [pathname]);
};
