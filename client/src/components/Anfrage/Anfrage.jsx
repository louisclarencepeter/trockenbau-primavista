import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  CalendarClock,
  Check,
  ChevronRight,
  Clock,
  DoorOpen,
  Home,
  LayoutGrid,
  Layers,
  PaintBucket,
  PanelLeft,
  Send,
  ShieldCheck,
  Thermometer,
  Trash2,
  Wrench,
  Zap,
} from 'lucide-react';
import './Anfrage.scss';
import { submitProjectForm } from '../../utils/formSubmission';

const services = [
  {
    id: 'decken',
    title: 'Decken abhängen',
    icon: Layers,
    description: 'Abgehängte Decken für Licht, Akustik und Technik.',
  },
  {
    id: 'waende',
    title: 'Wände stellen',
    icon: PanelLeft,
    description: 'Trennwände, Vorsatzschalen und Verkleidungen.',
  },
  {
    id: 'estrich-boden',
    title: 'Estrich-Boden',
    icon: LayoutGrid,
    description: 'Trockene Bodenaufbauten für ebene Flächen.',
  },
  {
    id: 'dachschraegen',
    title: 'Dachschrägen',
    icon: Home,
    description: 'Dachschrägen verkleiden und nutzbar machen.',
  },
  {
    id: 'sonstiges',
    title: 'Sonstiges / Mehreres',
    icon: Wrench,
    description: 'Weitere Trockenbauarbeiten oder kombinierte Leistungen.',
  },
];

const addOns = [
  { id: 'daemmung', title: 'Dämmung', icon: Thermometer },
  { id: 'tueren', title: 'Türen einbauen', icon: DoorOpen },
  { id: 'elektro', title: 'Elektroleitungen', icon: Zap },
  { id: 'brandschutz', title: 'Brandschutz', icon: ShieldCheck },
  { id: 'spachteln', title: 'Spachtelarbeiten', icon: PaintBucket },
  { id: 'abbruch', title: 'Abbruch & Entsorgung', icon: Trash2 },
];

const roomSizes = [
  { id: 'small', label: 'bis 5 m²', helper: 'Kleiner Raum oder Detailarbeit' },
  { id: 'medium', label: '6–9 m²', helper: 'Standardraum' },
  { id: 'large', label: '10–14 m²', helper: 'Großzügiger Raum' },
  { id: 'xl', label: 'ab 15 m²', helper: 'Mehrere Flächen oder großer Ausbau' },
];

const timelines = [
  { id: 'sofort', label: 'Sofort', icon: Zap, helper: 'So schnell wie möglich' },
  { id: '1-3-monate', label: 'In 1–3 Monaten', icon: Calendar, helper: 'Kurzfristige Planung' },
  { id: '3-6-monate', label: 'In 3–6 Monaten', icon: CalendarClock, helper: 'Mittelfristige Planung' },
  { id: 'flexibel', label: 'Flexibel', icon: Clock, helper: 'Noch nicht festgelegt' },
];

const TOTAL_STEPS = 5;

function Anfrage() {
  const [step, setStep] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [service, setService] = useState('');
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [roomSize, setRoomSize] = useState('');
  const [timeline, setTimeline] = useState('');
  const [formStatus, setFormStatus] = useState('idle');
  const pendingAdvanceRef = useRef(null);

  const clearPendingAdvance = () => {
    if (pendingAdvanceRef.current) {
      window.clearTimeout(pendingAdvanceRef.current);
      pendingAdvanceRef.current = null;
    }
  };

  const advance = () => {
    clearPendingAdvance();

    let didAdvance = false;

    setStep((currentStep) => {
      if (currentStep >= TOTAL_STEPS - 1) {
        return currentStep;
      }

      didAdvance = true;
      return currentStep + 1;
    });

    if (didAdvance) {
      setAnimKey((k) => k + 1);
    }
  };

  const goBack = () => {
    clearPendingAdvance();

    let didGoBack = false;

    setStep((currentStep) => {
      if (currentStep <= 0) {
        return currentStep;
      }

      didGoBack = true;
      return currentStep - 1;
    });

    if (didGoBack) {
      setAnimKey((k) => k + 1);
    }
  };

  const selectAndAdvance = (setter, value) => {
    clearPendingAdvance();
    setter(value);
    pendingAdvanceRef.current = window.setTimeout(() => {
      pendingAdvanceRef.current = null;
      advance();
    }, 220);
  };

  useEffect(() => () => {
    clearPendingAdvance();
  }, []);

  const toggleAddOn = (id) => {
    setSelectedAddOns((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormStatus('submitting');

    try {
      await submitProjectForm({ form: event.target, formName: 'anfrage' });
      setFormStatus('success');
    } catch {
      setFormStatus('error');
    }
  };

  const selectedService = services.find((s) => s.id === service);
  const selectedAddOnTitles = addOns
    .filter((a) => selectedAddOns.includes(a.id))
    .map((a) => a.title);
  const selectedRoomSize = roomSizes.find((r) => r.id === roomSize);
  const selectedTimeline = timelines.find((t) => t.id === timeline);

  const summaryText = [
    selectedService ? `Leistung: ${selectedService.title}` : '',
    selectedAddOnTitles.length ? `Extras: ${selectedAddOnTitles.join(', ')}` : '',
    selectedRoomSize ? `Raumgröße: ${selectedRoomSize.label}` : '',
    selectedTimeline ? `Zeitplan: ${selectedTimeline.label}` : '',
  ]
    .filter(Boolean)
    .join(' | ');

  if (formStatus === 'success') {
    return (
      <div className="anfrage">
        <div className="anfrage__success">
          <span className="anfrage__success-icon">
            <Check size={28} strokeWidth={2.4} />
          </span>
          <h1 className="anfrage__success-title">Vielen Dank!</h1>
          <p className="anfrage__success-text">
            Ihre Anfrage ist bei uns eingegangen. Wir prüfen Ihre Angaben und melden
            uns so schnell wie möglich persönlich bei Ihnen.
          </p>
          {summaryText && (
            <div className="anfrage__success-summary">{summaryText}</div>
          )}
          <Link className="anfrage__success-back" to="/">Zurück zur Startseite</Link>
        </div>
      </div>
    );
  }

  const progressPercent = ((step + 1) / TOTAL_STEPS) * 100;

  return (
    <div className="anfrage">
      <div
        className="anfrage__progress"
        role="progressbar"
        aria-valuenow={step + 1}
        aria-valuemin={1}
        aria-valuemax={TOTAL_STEPS}
        aria-label={`Schritt ${step + 1} von ${TOTAL_STEPS}`}
      >
        <div className="anfrage__progress-bar" style={{ width: `${progressPercent}%` }} />
      </div>

      <div className="anfrage__container">
        <nav className="anfrage__breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Startseite</Link>
          <ChevronRight size={15} strokeWidth={2.2} aria-hidden="true" />
          <span>Anfrage</span>
        </nav>

        <div className="anfrage__step" key={animKey}>
          {step === 0 && (
            <div className="anfrage__step-content">
              <span className="anfrage__eyebrow">Schritt 1 von {TOTAL_STEPS}</span>
              <h1 className="anfrage__title">Welche Leistung benötigen Sie?</h1>
              <div className="anfrage__cards anfrage__cards--service">
                {services.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`anfrage__card${service === item.id ? ' is-selected' : ''}`}
                      onClick={() => selectAndAdvance(setService, item.id)}
                      aria-pressed={service === item.id}
                    >
                      {service === item.id && (
                        <span className="anfrage__card-check" aria-hidden="true">
                          <Check size={13} strokeWidth={2.8} />
                        </span>
                      )}
                      <span className="anfrage__card-icon" aria-hidden="true">
                        <Icon size={30} strokeWidth={1.6} />
                      </span>
                      <strong className="anfrage__card-title">{item.title}</strong>
                      <span className="anfrage__card-text">{item.description}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="anfrage__step-content">
              <span className="anfrage__eyebrow">Schritt 2 von {TOTAL_STEPS}</span>
              <h1 className="anfrage__title">Welche Extras werden benötigt?</h1>
              <p className="anfrage__subtitle">Mehrfachauswahl möglich – oder einfach überspringen.</p>
              <div className="anfrage__cards anfrage__cards--addons">
                {addOns.map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedAddOns.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`anfrage__card${isSelected ? ' is-selected' : ''}`}
                      onClick={() => toggleAddOn(item.id)}
                      aria-pressed={isSelected}
                    >
                      {isSelected && (
                        <span className="anfrage__card-check" aria-hidden="true">
                          <Check size={13} strokeWidth={2.8} />
                        </span>
                      )}
                      <span className="anfrage__card-icon" aria-hidden="true">
                        <Icon size={26} strokeWidth={1.6} />
                      </span>
                      <strong className="anfrage__card-title">{item.title}</strong>
                    </button>
                  );
                })}
              </div>
              <div className="anfrage__nav">
                <button type="button" className="anfrage__back" onClick={goBack}>
                  <ArrowLeft size={17} strokeWidth={2.2} aria-hidden="true" />
                  Zurück
                </button>
                <button type="button" className="anfrage__next" onClick={advance}>
                  Weiter
                  <ChevronRight size={17} strokeWidth={2.2} aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="anfrage__step-content">
              <span className="anfrage__eyebrow">Schritt 3 von {TOTAL_STEPS}</span>
              <h1 className="anfrage__title">Wie groß ist die Fläche?</h1>
              <div className="anfrage__cards anfrage__cards--size">
                {roomSizes.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`anfrage__card${roomSize === item.id ? ' is-selected' : ''}`}
                    onClick={() => selectAndAdvance(setRoomSize, item.id)}
                    aria-pressed={roomSize === item.id}
                  >
                    {roomSize === item.id && (
                      <span className="anfrage__card-check" aria-hidden="true">
                        <Check size={13} strokeWidth={2.8} />
                      </span>
                    )}
                    <strong className="anfrage__card-title anfrage__card-title--xl">{item.label}</strong>
                    <span className="anfrage__card-text">{item.helper}</span>
                  </button>
                ))}
              </div>
              <div className="anfrage__nav">
                <button type="button" className="anfrage__back" onClick={goBack}>
                  <ArrowLeft size={17} strokeWidth={2.2} aria-hidden="true" />
                  Zurück
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="anfrage__step-content">
              <span className="anfrage__eyebrow">Schritt 4 von {TOTAL_STEPS}</span>
              <h1 className="anfrage__title">Wann soll es losgehen?</h1>
              <div className="anfrage__cards anfrage__cards--timeline">
                {timelines.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`anfrage__card${timeline === item.id ? ' is-selected' : ''}`}
                      onClick={() => selectAndAdvance(setTimeline, item.id)}
                      aria-pressed={timeline === item.id}
                    >
                      {timeline === item.id && (
                        <span className="anfrage__card-check" aria-hidden="true">
                          <Check size={13} strokeWidth={2.8} />
                        </span>
                      )}
                      <span className="anfrage__card-icon" aria-hidden="true">
                        <Icon size={26} strokeWidth={1.6} />
                      </span>
                      <strong className="anfrage__card-title">{item.label}</strong>
                      <span className="anfrage__card-text">{item.helper}</span>
                    </button>
                  );
                })}
              </div>
              <div className="anfrage__nav">
                <button type="button" className="anfrage__back" onClick={goBack}>
                  <ArrowLeft size={17} strokeWidth={2.2} aria-hidden="true" />
                  Zurück
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="anfrage__step-content">
              <span className="anfrage__eyebrow">Schritt 5 von {TOTAL_STEPS}</span>
              <h1 className="anfrage__title">Wie können wir Sie erreichen?</h1>
              {summaryText && (
                <div className="anfrage__summary" aria-label="Ihre bisherige Auswahl">
                  <strong>Ihre Auswahl:</strong> {summaryText}
                </div>
              )}
              <form
                className="anfrage__form"
                name="anfrage"
                onSubmit={handleSubmit}
              >
                <input type="hidden" name="bot-field" />
                <input type="hidden" name="subject" value="Neue Anfrage über den Anfrageassistenten" />
                <input type="hidden" name="submission_type" value="Anfrageassistent" />
                <input type="hidden" name="confirmation_requested" value="yes" />
                <input type="hidden" name="confirmation_request_id" value="" />
                <input type="hidden" name="service" value={selectedService?.title ?? ''} />
                <input type="hidden" name="add_ons" value={selectedAddOnTitles.join(', ')} />
                <input type="hidden" name="room_size" value={selectedRoomSize?.label ?? ''} />
                <input type="hidden" name="zeitplan" value={selectedTimeline?.label ?? ''} />
                <input type="hidden" name="summary" value={summaryText} />

                <div className="anfrage__fields">
                  <label className="anfrage__field" htmlFor="anfrage-name">
                    Name <span className="anfrage__field-required" aria-hidden="true">*</span>
                    <input
                      id="anfrage-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                    />
                  </label>
                  <label className="anfrage__field" htmlFor="anfrage-email">
                    E-Mail <span className="anfrage__field-required" aria-hidden="true">*</span>
                    <input
                      id="anfrage-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                    />
                  </label>
                  <label className="anfrage__field" htmlFor="anfrage-phone">
                    Telefon
                    <input
                      id="anfrage-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                    />
                  </label>
                  <label className="anfrage__field" htmlFor="anfrage-plz">
                    Postleitzahl
                    <input
                      id="anfrage-plz"
                      name="plz"
                      type="text"
                      autoComplete="postal-code"
                      inputMode="numeric"
                    />
                  </label>
                </div>

                <label
                  className="anfrage__field anfrage__field--wide"
                  htmlFor="anfrage-message"
                >
                  Nachricht{' '}
                  <span className="anfrage__field-optional">(optional)</span>
                  <textarea
                    id="anfrage-message"
                    name="message"
                    rows={4}
                    placeholder="Weitere Angaben zu Ihrem Projekt, z. B. besondere Anforderungen oder offene Fragen."
                  />
                </label>

                <div className="anfrage__nav anfrage__nav--submit">
                  <button type="button" className="anfrage__back" onClick={goBack}>
                    <ArrowLeft size={17} strokeWidth={2.2} aria-hidden="true" />
                    Zurück
                  </button>
                  <button
                    className="anfrage__submit"
                    type="submit"
                    disabled={formStatus === 'submitting'}
                  >
                    <Send size={16} strokeWidth={2.2} aria-hidden="true" />
                    {formStatus === 'submitting' ? 'Wird gesendet…' : 'Anfrage senden'}
                  </button>
                </div>

                {formStatus === 'error' && (
                  <p className="anfrage__error" role="alert">
                    Fehler beim Senden. Bitte versuchen Sie es erneut oder kontaktieren
                    Sie uns direkt unter{' '}
                    <a href="mailto:info@trockenbau-primavista.ch">
                      info@trockenbau-primavista.ch
                    </a>
                    .
                  </p>
                )}
              </form>
            </div>
          )}
        </div>
      </div>

      <footer className="anfrage__footer">
        Der Service ist unverbindlich. Wir melden uns persönlich mit einer Einschätzung.
      </footer>
    </div>
  );
}

export default Anfrage;
import { Link } from 'react-router-dom';
