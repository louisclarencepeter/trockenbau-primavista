import './Contact.scss';
import { Mail, MapPin, Phone, MessageCircle } from 'lucide-react';
import useScrollReveal from '../../hooks/useScrollReveal';

const contactItems = [
  {
    icon: Phone,
    label: 'Telefon',
    value: '+49 00 000000000',
    href: 'tel:+490000000000',
  },
  {
    icon: Mail,
    label: 'E-Mail',
    value: 'info@trockenbau-primavista.ch',
    href: 'mailto:info@trockenbau-primavista.ch',
  },
  {
    icon: MapPin,
    label: 'Standort',
    value: 'Frankfurt am Main',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: 'Jetzt schreiben',
    href: 'https://wa.me/490000000000',
  },
];

function Contact() {
  const { sectionRef: contactRef, isVisible } = useScrollReveal({
    once: false,
  });

  return (
    <section
      ref={contactRef}
      className={`contact section${isVisible ? ' contact--visible' : ''}`}
      id="kontakt"
    >
      <div className="container">
        <div className="contact__wrapper">
          <div className="contact__content">
            <span className="contact__eyebrow contact__reveal">KONTAKT</span>
            <h2 className="contact__title contact__reveal">Lassen Sie uns über Ihr Projekt sprechen</h2>
            <p className="contact__text contact__reveal">
              Sie planen einen Innenausbau, eine Sanierung oder Renovierung?
              Kontaktieren Sie uns für eine unverbindliche Anfrage. Wir beraten
              Sie gerne persönlich und finden die passende Lösung für Ihr Projekt.
            </p>

            <div className="contact__info">
              {contactItems.map((item) => {
                const Icon = item.icon;

                if (item.href) {
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      className="contact__info-item contact__info-item--action contact__reveal"
                    >
                      <div className="contact__icon">
                        <Icon size={22} strokeWidth={2} />
                      </div>
                      <div>
                        <span className="contact__label">{item.label}</span>
                        <span className="contact__link">{item.value}</span>
                      </div>
                    </a>
                  );
                }

                return (
                  <div className="contact__info-item contact__reveal" key={item.label}>
                    <div className="contact__icon">
                      <Icon size={22} strokeWidth={2} />
                    </div>
                    <div>
                      <span className="contact__label">{item.label}</span>
                      <span className="contact__value">{item.value}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="contact__form-card contact__reveal">
            <form className="contact__form">
              <div className="contact__field">
                <label htmlFor="name" className="contact__field-label">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="contact__input"
                  placeholder="Ihr Name"
                />
              </div>

              <div className="contact__field">
                <label htmlFor="email" className="contact__field-label">
                  E-Mail
                </label>
                <input
                  id="email"
                  type="email"
                  className="contact__input"
                  placeholder="Ihre E-Mail-Adresse"
                />
              </div>

              <div className="contact__field">
                <label htmlFor="phone" className="contact__field-label">
                  Telefonnummer
                </label>
                <input
                  id="phone"
                  type="tel"
                  className="contact__input"
                  placeholder="Ihre Telefonnummer"
                />
              </div>

              <div className="contact__field">
                <label htmlFor="message" className="contact__field-label">
                  Nachricht
                </label>
                <textarea
                  id="message"
                  className="contact__textarea"
                  placeholder="Beschreiben Sie kurz Ihr Projekt"
                  rows="6"
                ></textarea>
              </div>

              <button type="submit" className="contact__button">
                Anfrage senden
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
