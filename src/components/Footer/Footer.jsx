import './Footer.scss';
import logo from '../../assets/logo.png';

function Footer() {
  const currentYear = new Date().getFullYear();
  const socialLinks = [
    {
      label: 'Facebook',
      iconClass: 'fa-brands fa-facebook-f',
    },
    {
      label: 'Instagram',
      iconClass: 'fa-brands fa-instagram',
    },
    {
      label: 'YouTube',
      iconClass: 'fa-brands fa-youtube',
    },
  ];

  return (
    <footer className="footer">
      <div className="container footer__container">
        <div className="footer__top">
          <div className="footer__brand">
            <img
              src={logo}
              alt="Trockenbau Prima Vista Logo"
              className="footer__logo"
            />
            <div>
              <h3 className="footer__title">Trockenbau Prima Vista</h3>
              <p className="footer__text">
                Professionelle Lösungen für Trockenbau, Sanierung und Renovierung
                mit Fokus auf Qualität, Präzision und saubere Ausführung.
              </p>

              <div className="footer__socials">
                {socialLinks.map((socialLink) => (
                  <span
                    key={socialLink.label}
                    className="footer__social-link"
                    aria-hidden="true"
                    title={`${socialLink.label} folgt bald`}
                  >
                    <i className={socialLink.iconClass} aria-hidden="true"></i>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="footer__links">
            <div className="footer__column">
              <h4 className="footer__heading">Navigation</h4>
              <a href="#leistungen" className="footer__link">Leistungen</a>
              <a href="#referenzen" className="footer__link">Referenzen</a>
              <a href="#ueber-uns" className="footer__link">Warum wir</a>
              <a href="#kontakt" className="footer__link">Kontakt</a>
            </div>

            <div className="footer__column">
              <h4 className="footer__heading">Leistungen</h4>
              <span className="footer__item">Trockenbau</span>
              <span className="footer__item">Sanierung</span>
              <span className="footer__item">Renovierung</span>
              <span className="footer__item">Innenausbau</span>
            </div>

            <div className="footer__column">
              <h4 className="footer__heading">Kontakt</h4>
              <span className="footer__item">Frankfurt am Main</span>
              <a href="tel:+490000000000" className="footer__link">+49 00 000000000</a>
              <a href="mailto:info@trockenbau-primavista.ch" className="footer__link">
                info@trockenbau-primavista.ch
              </a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            © {currentYear} Trockenbau Prima Vista. Alle Rechte vorbehalten.
          </p>

          <div className="footer__legal">
            <a href="#impressum" className="footer__link footer__link--legal" id="impressum">
              Impressum
            </a>
            <a href="#datenschutz" className="footer__link footer__link--legal" id="datenschutz">
              Datenschutzerklärung
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
