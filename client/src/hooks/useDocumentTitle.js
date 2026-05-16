import { useEffect } from 'react';
import { getProjectBySlug } from '../components/Projects/data/projectsCatalog';

const TITLE_BY_PATH = {
  '/': 'Trockenbau Prima Vista | Decken, Wände, Boden und Dachschrägen',
  '/kalkulator': 'Trockenbau Kalkulator | Prima Vista B&G GmbH',
  '/anfrage': 'Anfrage stellen | Prima Vista B&G GmbH',
  '/impressum': 'Impressum | Prima Vista B&G GmbH',
  '/datenschutz': 'Datenschutzerklärung | Prima Vista B&G GmbH',
};

const resolveTitle = (pathname) => {
  if (TITLE_BY_PATH[pathname]) {
    return TITLE_BY_PATH[pathname];
  }

  const referenzenMatch = pathname.match(/^\/referenzen\/([^/]+)$/);

  if (referenzenMatch) {
    const project = getProjectBySlug(referenzenMatch[1]);

    if (project) {
      return `${project.title} – Referenzen | Trockenbau Prima Vista`;
    }
  }

  return TITLE_BY_PATH['/'];
};

export const useDocumentTitle = (pathname) => {
  useEffect(() => {
    document.title = resolveTitle(pathname);
  }, [pathname]);
};
