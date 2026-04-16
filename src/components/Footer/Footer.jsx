import { Facebook, Instagram, Youtube } from 'lucide-react';
import './Footer.scss';
import { logoSmall } from '../../assets/responsiveImages';
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher';

function Footer({
  isHomePage = true,
  themePreference = 'system',
  resolvedTheme = 'light',
  onThemeChange,
}) {
  const currentYear = new Date().getFullYear();
  const socialLinks = [
    {
      label: 'Facebook',
      icon: Facebook,
      href: 'https://www.facebook.com/PrimaVistaBauprojekte',
    },
    {
      label: 'Instagram',
      icon: Instagram,
      href: 'https://www.instagram.com/primavista.bauprojekte',
    },
    {
      label: 'YouTube',
      icon: Youtube,
      href: 'https://www.youtube.com/@PrimaVistaBauprojekte',
    },
  ];
  const getSectionHref = (id) => (isHomePage ? `#${id}` : `/#${id}`);

  return (
    <footer className="footer">
      <div className="container footer__container">
        <div className="footer__top">
          <div className="footer__brand">
            <img
              src={logoSmall}
              alt="Trockenbau Prima Vista Logo"
              className="footer__logo"
            />
            <div>
              <h3 className="footer__title">Trockenbau Prima Vista</h3>
              <p className="footer__text">
                Professionelle Trockenbau-Lösungen für Decken, Wände,
                Estrich-Boden, Dachschrägen und weitere Ausbauarbeiten mit
                Fokus auf Qualität, Präzision und saubere Ausführung.
              </p>

              <div className="footer__socials">
                {socialLinks.map((socialLink) => (
                  (() => {
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
                  })()
                ))}
              </div>
            </div>
          </div>

          <div className="footer__links">
            <div className="footer__column">
              <h4 className="footer__heading">Navigation</h4>
              <a href={getSectionHref('leistungen')} className="footer__link">Leistungen</a>
              <a href={getSectionHref('referenzen')} className="footer__link">Referenzen</a>
              <a href={getSectionHref('ueber-uns')} className="footer__link">Über uns</a>
              <a href="/kalkulator" className="footer__link">Kalkulator</a>
              <a href={getSectionHref('kontakt')} className="footer__link">Kontakt</a>
            </div>

            <div className="footer__column">
              <h4 className="footer__heading">Leistungen</h4>
              <span className="footer__item">Decken abhängen</span>
              <span className="footer__item">Wände stellen</span>
              <span className="footer__item">Estrich-Boden</span>
              <span className="footer__item">Dachschrägen</span>
              <span className="footer__item">Sonstiges</span>
            </div>

            <div className="footer__column">
              <h4 className="footer__heading">Kontakt</h4>
              <span className="footer__item">Spinnereistrasse 5, 6020 Emmenbrücke, Schweiz</span>
              <a href="tel:+41782659332" className="footer__link">+41 78 265 93 32</a>
              <a href="mailto:info@primavista-bauprojekte.ch" className="footer__link">
                info@primavista-bauprojekte.ch
              </a>
            </div>

            <div className="footer__theme">
              <ThemeSwitcher
                themePreference={themePreference}
                resolvedTheme={resolvedTheme}
                onChange={onThemeChange}
              />
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            © {currentYear} Trockenbau Prima Vista. Alle Rechte vorbehalten.
          </p>

          <div className="footer__legal">
            <a href="/impressum" className="footer__link footer__link--legal">
              Impressum
            </a>
            <a href="/datenschutz" className="footer__link footer__link--legal">
              Datenschutzerklärung
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
