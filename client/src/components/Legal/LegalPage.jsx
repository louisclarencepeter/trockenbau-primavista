import { Link } from 'react-router-dom';
import './Legal.scss';
import Impressum from './Impressum';
import PrivacyPolicy from './PrivacyPolicy';

const legalPages = [
  { key: 'impressum', href: '/impressum', label: 'Impressum' },
  { key: 'datenschutz', href: '/datenschutz', label: 'Datenschutz' },
];

const legalPageContent = {
  impressum: {
    eyebrow: 'Rechtliches',
    title: 'Impressum',
    description:
      'Alle Pflichtangaben zur Prima Vista B&G GmbH sowie die rechtlichen Hinweise zur Nutzung dieser Webseite.',
    kicker: 'Pflichtangaben',
    component: Impressum,
  },
  datenschutz: {
    eyebrow: 'Rechtliches',
    title: 'Datenschutzerklärung',
    description:
      'Informationen zur Erhebung, Bearbeitung und zum Schutz personenbezogener Daten bei der Nutzung unserer Website.',
    kicker: 'Datenschutz',
    component: PrivacyPolicy,
  },
};

function LegalPage({ page = 'impressum' }) {
  const content = legalPageContent[page] ?? legalPageContent.impressum;
  const ContentComponent = content.component;

  return (
    <section className="legal-page section section-light" aria-labelledby="legal-page-title">
      <div className="container legal-page__container">
        <div className="legal-page__hero-grid">
          <div className="legal-page__hero">
            <Link to="/" className="legal-page__back-link">
              Zur Startseite
            </Link>
            <span className="legal-page__eyebrow">{content.eyebrow}</span>
            <div className="legal-page__headline-row">
              <span className="legal-page__kicker">{content.kicker}</span>
              <h1 className="legal-page__title" id="legal-page-title">
                {content.title}
              </h1>
            </div>
            <p className="legal-page__text">{content.description}</p>

            <nav className="legal-page__switcher" aria-label="Rechtliche Seiten">
              {legalPages.map((item) => (
                <Link
                  key={item.key}
                  to={item.href}
                  className={`legal-page__switch-link${page === item.key ? ' is-active' : ''}`}
                  aria-current={page === item.key ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <aside className="legal-page__summary" aria-label="Kontaktübersicht">
            <span className="legal-page__summary-label">Kontakt</span>
            <p className="legal-page__summary-text">
              Prima Vista B&amp;G GmbH
              <br />
              Spinnereistrasse 5
              <br />
              6020 Emmenbrücke, Schweiz
            </p>
            <a href="mailto:info@trockenbau-primavista.ch" className="legal-page__summary-link">
              info@trockenbau-primavista.ch
            </a>
            <a href="tel:+41782659332" className="legal-page__summary-link">
              +41 78 265 93 32
            </a>
          </aside>
        </div>

        <ContentComponent />
      </div>
    </section>
  );
}

export default LegalPage;
