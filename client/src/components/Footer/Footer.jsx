import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import './Footer.scss';
import { logoImage } from '../../assets/responsiveImages';
import HashLink from '../HashLink/HashLink';
import PageLink from '../PageLink/PageLink';
import ResponsivePicture from '../ResponsivePicture/ResponsivePicture';
import { businessProfile } from '../../config/businessProfile';

function Footer({ isHomePage = true }) {
  const currentYear = new Date().getFullYear();
  const socialLinks = [
    {
      label: 'Instagram',
      icon: Instagram,
      href: businessProfile.instagram,
    },
  ];
  const getSectionHref = (id) => (isHomePage ? `#${id}` : `/#${id}`);

  return (
    <footer className="footer">
      <div className="container footer__container">
        <div className="footer__top">
          <div className="footer__brand">
            <ResponsivePicture
              image={logoImage}
              alt={`${businessProfile.publicName} Logo`}
              loading="lazy"
              decoding="async"
              className="footer__logo"
            />
            <div>
              <h3 className="footer__title">{businessProfile.publicName}</h3>
              <p className="footer__text">
                {businessProfile.serviceLine}<br />
                {businessProfile.slogan}
              </p>
              <div className="footer__socials">
                {socialLinks.map((socialLink) => {
                  const Icon = socialLink.icon;

                  return (
                    <a
                      key={socialLink.label}
                      href={socialLink.href}
                      className="footer__social-link"
                      aria-label={socialLink.label}
                      title={socialLink.label}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Icon size={18} strokeWidth={1.9} aria-hidden="true" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="footer__links">
            <div className="footer__column">
              <h4 className="footer__heading">Navigation</h4>
              <HashLink to={getSectionHref('leistungen')} className="footer__link">
                <span className="footer__link-icon" aria-hidden="true">01</span>
                <span>Leistungen</span>
              </HashLink>
              <HashLink to={getSectionHref('referenzen')} className="footer__link">
                <span className="footer__link-icon" aria-hidden="true">02</span>
                <span>Referenzen</span>
              </HashLink>
              <HashLink to={getSectionHref('ueber-uns')} className="footer__link">
                <span className="footer__link-icon" aria-hidden="true">03</span>
                <span>Über uns</span>
              </HashLink>
              <PageLink to="/kalkulator" className="footer__link">
                <span className="footer__link-icon" aria-hidden="true">04</span>
                <span>Kalkulator</span>
              </PageLink>
              <HashLink to={getSectionHref('kontakt')} className="footer__link">
                <span className="footer__link-icon" aria-hidden="true">05</span>
                <span>Kontakt</span>
              </HashLink>
            </div>

            <div className="footer__column">
              <h4 className="footer__heading">Leistungen</h4>
              <span className="footer__item">
                <span className="footer__link-icon" aria-hidden="true">01</span>
                <span>Decken abhängen</span>
              </span>
              <span className="footer__item">
                <span className="footer__link-icon" aria-hidden="true">02</span>
                <span>Wände stellen</span>
              </span>
              <span className="footer__item">
                <span className="footer__link-icon" aria-hidden="true">03</span>
                <span>Estrich-Boden</span>
              </span>
              <span className="footer__item">
                <span className="footer__link-icon" aria-hidden="true">04</span>
                <span>Dachschrägen</span>
              </span>
              <span className="footer__item">
                <span className="footer__link-icon" aria-hidden="true">05</span>
                <span>Sonstiges</span>
              </span>
            </div>

            <div className="footer__column">
              <h4 className="footer__heading">Kontakt</h4>
              <span className="footer__item footer__item--address">
                <span className="footer__link-icon" aria-hidden="true">CH</span>
                <span>Spinnereistrasse 5, 6020 Emmenbrücke, Schweiz</span>
              </span>
              <a href="tel:+41782659332" className="footer__link">
                <span className="footer__link-icon" aria-hidden="true">☎</span>
                <span>+41 78 265 93 32</span>
              </a>
              <a href="mailto:info@trockenbau-primavista.ch" className="footer__link">
                <span className="footer__link-icon" aria-hidden="true">@</span>
                <span>info@trockenbau-primavista.ch</span>
              </a>
            </div>

          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            © {currentYear} {businessProfile.publicName}. Alle Rechte vorbehalten.
          </p>

          <div className="footer__legal">
            <Link to="/impressum" className="footer__link footer__link--legal">
              Impressum
            </Link>
            <Link to="/datenschutz" className="footer__link footer__link--legal">
              Datenschutzerklärung
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
