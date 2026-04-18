import { useEffect } from 'react';

const TITLE_BY_PATH = {
  '/': 'Trockenbau Prima Vista | Decken, Wände, Boden und Dachschrägen',
  '/kalkulator': 'Trockenbau Kalkulator | Prima Vista B&G GmbH',
  '/anfrage': 'Anfrage stellen | Prima Vista B&G GmbH',
  '/impressum': 'Impressum | Prima Vista B&G GmbH',
  '/datenschutz': 'Datenschutzerklärung | Prima Vista B&G GmbH',
};

export const useDocumentTitle = (pathname) => {
  useEffect(() => {
    document.title = TITLE_BY_PATH[pathname] ?? TITLE_BY_PATH['/'];
  }, [pathname]);
};
