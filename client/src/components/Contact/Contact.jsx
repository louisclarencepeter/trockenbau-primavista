import { useState } from 'react';
import './Contact.scss';
import { CalendarCheck2, Clock3, Mail, MapPin, Phone, MessageCircle } from 'lucide-react';
import useScrollReveal from '../../hooks/useScrollReveal';
import useReturnToForm from '../../hooks/useReturnToForm';
import useSuccessView from '../../hooks/useSuccessView';
import { submitProjectForm } from '../../utils/formSubmission';
import FormErrorMessage from '../FormErrorMessage/FormErrorMessage';
import { businessProfile } from '../../config/businessProfile';

const contactItems = [
  {
    icon: Phone,
    label: 'Telefon',
    value: businessProfile.phone,
    href: businessProfile.phoneHref,
  },
  {
    icon: Mail,
    label: 'E-Mail',
    value: businessProfile.email,
    href: `mailto:${businessProfile.email}`,
  },
  {
    icon: MapPin,
    label: 'Firmensitz',
    value: `${businessProfile.address.streetAddress}, ${businessProfile.address.postalCode} ${businessProfile.address.addressLocality}, Schweiz`,
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: 'Jetzt schreiben',
    href: businessProfile.whatsapp,
  },
  {
    icon: Clock3,
    label: 'Erreichbarkeit',
    value: businessProfile.contactHours,
  },
  {
    icon: CalendarCheck2,
    label: 'Beratung',
    value: businessProfile.appointmentNote,
  },
];

function Contact() {
  const { sectionRef: contactRef, isVisible } = useScrollReveal();
  const [formStatus, setFormStatus] = useState('idle');
  const successRef = useSuccessView(formStatus === 'success');
  const { formContainerRef, formRef, prepareReturnToForm } = useReturnToForm(formStatus);

  const getLinkProps = (href) =>
    href.startsWith('http')
      ? { target: '_blank', rel: 'noreferrer' }
      : {};

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormStatus('submitting');

    const form = event.target;

    try {
      await submitProjectForm({
        form,
        formName: 'contact',
      });

      setFormStatus('success');
      form.reset();
    } catch {
      setFormStatus('error');
    }
  };

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
              Sie planen Trockenbauarbeiten wie Decken, Wände, Estrich-Boden,
              Dachschrägen oder Sonderleistungen? Kontaktieren Sie uns für
              eine unverbindliche Anfrage. Wir beraten Sie persönlich und
              stimmen die passende Lösung für Ihr Projekt mit Ihnen ab. Unser
              Schwerpunkt liegt in Luzern und der Zentralschweiz; Projekte in
              Zürich und Umgebung übernehmen wir ebenfalls.
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
                      {...getLinkProps(item.href)}
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

            <div className="contact__service-area contact__reveal">
              <span className="contact__label">Einzugsgebiet</span>
              <p>{businessProfile.serviceAreas.join(' · ')}</p>
            </div>
          </div>

          <div className="contact__form-card contact__reveal" ref={formContainerRef}>
            {formStatus === 'success' ? (
              <div
                ref={successRef}
                className="contact__form-success"
                role="status"
                aria-live="polite"
                tabIndex={-1}
              >
                <strong>Vielen Dank!</strong>
                <p>Ihre Anfrage wurde gesendet. Wir melden uns in Kürze bei Ihnen.</p>
                <button
                  type="button"
                  className="contact__button"
                  onClick={() => {
                    prepareReturnToForm();
                    setFormStatus('idle');
                  }}
                >
                  Neue Anfrage
                </button>
              </div>
            ) : (
              <form
                ref={formRef}
                className="contact__form"
                name="contact"
                onSubmit={handleSubmit}
              >
                <input type="hidden" name="bot-field" />
                <input type="hidden" name="subject" value="Neue Kontaktanfrage über die Website" />
                <input type="hidden" name="submission_type" value="Kontaktformular" />
                <input type="hidden" name="confirmation_requested" value="yes" />
                <input type="hidden" name="confirmation_request_id" value="" />

                <div className="contact__field">
                  <label htmlFor="name" className="contact__field-label">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="contact__input"
                    placeholder="Ihr Name"
                    required
                  />
                </div>

                <div className="contact__field">
                  <label htmlFor="email" className="contact__field-label">
                    E-Mail
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="contact__input"
                    placeholder="Ihre E-Mail-Adresse"
                    required
                  />
                </div>

                <div className="contact__field">
                  <label htmlFor="phone" className="contact__field-label">
                    Telefonnummer
                  </label>
                  <input
                    id="phone"
                    name="phone"
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
                    name="message"
                    className="contact__textarea"
                    placeholder="Beschreiben Sie kurz Ihre Trockenbau-Leistung, z. B. Decken, Wände, Estrich-Boden oder Dachschrägen"
                    rows="6"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="contact__button"
                  disabled={formStatus === 'submitting'}
                >
                  {formStatus === 'submitting' ? 'Wird gesendet...' : 'Anfrage senden'}
                </button>

                {formStatus === 'error' ? <FormErrorMessage /> : null}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
