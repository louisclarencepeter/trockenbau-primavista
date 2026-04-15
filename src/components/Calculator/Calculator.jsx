import { useMemo, useState } from 'react';
import {
  Calculator as CalculatorIcon,
  Check,
  ChevronRight,
  ClipboardList,
  Minus,
  Plus,
  Send,
  ShieldCheck,
} from 'lucide-react';
import './Calculator.scss';
import {
  projectDetailCeilingImage,
  projectExistingSpaceRenovationImage,
  projectFeaturedModernizationImage,
  responsiveImageSizes,
  serviceInteriorImage,
} from '../../assets/responsiveImages';

const vatRate = 0.081;
const minQuantity = 1;
const maxQuantity = 5;

const packages = [
  {
    id: 'bad-kompakt',
    title: 'Badsanierung Kompakt',
    description: 'Solide Modernisierung mit sauberem Ausbau, Abdichtung und Finish.',
    price: 12800,
    details: ['Rückbau & Vorbereitung', 'Nassraumabdichtung', 'Saubere Anschlussarbeiten'],
  },
  {
    id: 'wanne-dusche',
    title: 'Badewanne & Dusche',
    description: 'Komplette Lösung für ein Bad mit Wanne, Dusche und hochwertigen Oberflächen.',
    price: 16400,
    details: ['Wanne und Duschbereich', 'Vorwand & Trockenbau', 'Koordinierter Ablauf'],
  },
  {
    id: 'barrierearm',
    title: 'Barrierearme Dusche',
    description: 'Ebenerdige Dusche, sichere Details und präzise Vorwandarbeiten.',
    price: 9800,
    details: ['Ebenerdiger Einstieg', 'Gefälle & Abdichtung', 'Rutschhemmender Aufbau'],
  },
];

const roomSizes = [
  { id: 'small', label: 'bis 5 m2', helper: 'Gäste- oder Kompaktbad', multiplier: 0.86 },
  { id: 'medium', label: '6-9 m2', helper: 'Standardbad', multiplier: 1 },
  { id: 'large', label: '10-14 m2', helper: 'Großzügiges Bad', multiplier: 1.18 },
  { id: 'xl', label: 'ab 15 m2', helper: 'Masterbad oder Wellnessbereich', multiplier: 1.35 },
];

const addOns = [
  {
    id: 'demolition',
    title: 'Demontage & Entsorgung',
    description: 'Rückbau alter Einbauten inklusive fachgerechter Entsorgung.',
    price: 1250,
    defaultSelected: true,
  },
  {
    id: 'drywall',
    title: 'Trockenbau & Vorwand',
    description: 'Vorwandinstallation, Beplankung und saubere Anschlussdetails.',
    price: 2200,
    defaultSelected: true,
  },
  {
    id: 'waterproofing',
    title: 'Abdichtung',
    description: 'Nassraumabdichtung für Wand- und Bodenflächen.',
    price: 1800,
    defaultSelected: true,
  },
  {
    id: 'tiles',
    title: 'Beläge & Oberflächen',
    description: 'Vorbereitung und Verlegung hochwertiger Wand- und Bodenbeläge.',
    price: 4200,
    defaultSelected: false,
  },
  {
    id: 'finish',
    title: 'Malerarbeiten & Finish',
    description: 'Spachtelarbeiten, Anschlüsse und ein gepflegter Abschluss.',
    price: 1450,
    defaultSelected: false,
  },
  {
    id: 'coordination',
    title: 'Projektkoordination',
    description: 'Terminplanung und Abstimmung der beteiligten Gewerke.',
    price: 950,
    defaultSelected: false,
  },
];

const benefits = [
  'Schnelle Orientierung für Ihr Budget',
  'Material und Montage getrennt nachvollziehbar',
  'Persönliche Prüfung vor dem verbindlichen Angebot',
];

const heroMedia = [
  {
    image: projectFeaturedModernizationImage,
    alt: 'Modernisierung im Innenausbau mit vorbereiteten Wandflächen',
  },
  {
    image: serviceInteriorImage,
    alt: 'Hochwertiger Innenausbau mit sauberem Finish',
  },
  {
    image: projectExistingSpaceRenovationImage,
    alt: 'Sanierter Innenraum während der Ausbauphase',
  },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF',
    maximumFractionDigits: 0,
  }).format(value);

function CalculatorPage() {
  const [selectedPackageId, setSelectedPackageId] = useState(packages[1].id);
  const [selectedSizeId, setSelectedSizeId] = useState(roomSizes[1].id);
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState(() =>
    addOns
      .filter((addOn) => addOn.defaultSelected)
      .map((addOn) => addOn.id),
  );
  const [formStatus, setFormStatus] = useState('idle');

  const selectedPackage = packages.find((item) => item.id === selectedPackageId) ?? packages[0];
  const selectedSize = roomSizes.find((item) => item.id === selectedSizeId) ?? roomSizes[1];
  const selectedAddOnItems = useMemo(
    () => addOns.filter((addOn) => selectedAddOns.includes(addOn.id)),
    [selectedAddOns],
  );

  const totals = useMemo(() => {
    const extras = selectedAddOnItems.reduce((sum, addOn) => sum + addOn.price, 0);
    const materialShare = Math.round((selectedPackage.price * 0.42 + extras * 0.5) * selectedSize.multiplier);
    const montageShare = Math.round((selectedPackage.price * 0.58 + extras * 0.5) * selectedSize.multiplier);
    const net = Math.round((materialShare + montageShare) * quantity);
    const vat = Math.round(net * vatRate);

    return {
      materialShare: materialShare * quantity,
      montageShare: montageShare * quantity,
      addOnsNet: extras * quantity,
      net,
      vat,
      gross: net + vat,
    };
  }, [quantity, selectedAddOnItems, selectedPackage.price, selectedSize.multiplier]);

  const selectedAddOnTitles = selectedAddOnItems.map((item) => item.title);
  const pricePerUnit = Math.round(totals.gross / quantity);
  const summaryText = [
    `Paket: ${selectedPackage.title}`,
    `Raumgröße: ${selectedSize.label}`,
    `Menge: ${quantity}`,
    `Optionen: ${selectedAddOnTitles.join(', ') || 'keine'}`,
    `Gesamtsumme: ${formatCurrency(totals.gross)}`,
  ].join(' | ');

  const toggleAddOn = (id) => {
    setSelectedAddOns((current) => (
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    ));
  };

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(minQuantity, current - 1));
  };

  const increaseQuantity = () => {
    setQuantity((current) => Math.min(maxQuantity, current + 1));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormStatus('submitting');

    const form = event.target;
    const formData = new FormData(form);

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString(),
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      setFormStatus('success');
      form.reset();
    } catch {
      setFormStatus('error');
    }
  };

  return (
    <div className="calculator-page">
      <section className="calculator-hero">
        <div className="container calculator-hero__container">
          <div className="calculator-hero__content">
            <nav className="calculator-hero__breadcrumb" aria-label="Breadcrumb">
              <a href="/">Startseite</a>
              <ChevronRight size={18} strokeWidth={2.2} aria-hidden="true" />
              <span>Kalkulator</span>
            </nav>

            <span className="calculator-hero__eyebrow">Prima Vista Blitz-Angebot</span>
            <h1 className="calculator-hero__title">
              <span>Badsanierung</span>
              <span>kalkulieren:</span>
              <span>Montage & Material</span>
            </h1>
            <p className="calculator-hero__text">
              Wählen Sie Leistungspaket, Raumgröße und Zusatzarbeiten. Der Rechner
              zeigt direkt eine nachvollziehbare Kostenschätzung für Ihre Anfrage.
            </p>

            <div className="calculator-hero__benefits" aria-label="Vorteile">
              {benefits.map((benefit) => (
                <span className="calculator-hero__benefit" key={benefit}>
                  <Check size={17} strokeWidth={2.3} aria-hidden="true" />
                  {benefit}
                </span>
              ))}
            </div>
          </div>

          <div className="calculator-hero__visual">
            <div className="calculator-hero__media-main">
              <img
                src={heroMedia[0].image.src}
                srcSet={heroMedia[0].image.srcSet}
                sizes={responsiveImageSizes.projectsFeatured}
                alt={heroMedia[0].alt}
                className="calculator-hero__image"
                loading="eager"
                decoding="async"
              />
              <div className="calculator-hero__price-card" aria-label="Beispielhafte Kostenschätzung">
                <span>Aktuelle Schätzung</span>
                <strong>{formatCurrency(totals.gross)}</strong>
                <small>{selectedPackage.title}</small>
              </div>
            </div>

            <div className="calculator-hero__media-stack" aria-label="Weitere Projektansichten">
              {heroMedia.slice(1).map((item) => (
                <img
                  key={item.alt}
                  src={item.image.src}
                  srcSet={item.image.srcSet}
                  sizes={responsiveImageSizes.projectsGrid}
                  alt={item.alt}
                  className="calculator-hero__stack-image"
                  loading="lazy"
                  decoding="async"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="calculator-offer" aria-label="Aktuelle Kostenschätzung">
        <div className="container calculator-offer__container">
          <div className="calculator-offer__intro">
            <span>Ihre aktuelle Schätzung</span>
            <strong>{formatCurrency(totals.gross)}</strong>
            <small>{formatCurrency(pricePerUnit)} pro Einheit, inkl. MwSt.</small>
          </div>

          <div className="calculator-offer__totals" aria-live="polite">
            <div className="calculator-offer__line">
              <span>Material netto</span>
              <strong>{formatCurrency(totals.materialShare)}</strong>
            </div>
            <div className="calculator-offer__line">
              <span>Montage netto</span>
              <strong>{formatCurrency(totals.montageShare)}</strong>
            </div>
            <div className="calculator-offer__line">
              <span>zzgl. 8.1 % MwSt.</span>
              <strong>{formatCurrency(totals.vat)}</strong>
            </div>
            <div className="calculator-offer__line calculator-offer__line--total">
              <span>Gesamtsumme</span>
              <strong>{formatCurrency(totals.gross)}</strong>
            </div>
          </div>

          <div className="calculator-offer__actions">
            <div className="calculator-offer__quantity" aria-label="Menge">
              <button
                type="button"
                onClick={decreaseQuantity}
                aria-label="Menge verringern"
                disabled={quantity === minQuantity}
              >
                <Minus size={17} strokeWidth={2.4} aria-hidden="true" />
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={increaseQuantity}
                aria-label="Menge erhöhen"
                disabled={quantity === maxQuantity}
              >
                <Plus size={17} strokeWidth={2.4} aria-hidden="true" />
              </button>
            </div>

            <a className="calculator-offer__button" href="#anfrage">
              <Send size={18} strokeWidth={2.2} aria-hidden="true" />
              Anfrage starten
            </a>
          </div>
        </div>
      </section>

      <section className="calculator-config section" id="kalkulator-konfiguration">
        <div className="container calculator-config__container">
          <div className="calculator-config__main">
            <div className="calculator-config__header">
              <span className="calculator-config__eyebrow">Kalkulation</span>
              <h2>Projekt konfigurieren</h2>
              <p>
                Die Werte sind Richtpreise für die erste Planung. Details wie
                Untergrund, Materialwahl und Leitungsführung werden im Anschluss geprüft.
              </p>
            </div>

            <fieldset className="calculator-config__group">
              <legend>Leistungspaket</legend>
              <div className="calculator-config__cards">
                {packages.map((item) => (
                  <label
                    className={`calculator-config__card${
                      selectedPackageId === item.id ? ' is-selected' : ''
                    }`}
                    key={item.id}
                  >
                    <input
                      type="radio"
                      name="package"
                      value={item.id}
                      checked={selectedPackageId === item.id}
                      onChange={() => setSelectedPackageId(item.id)}
                    />
                    <span className="calculator-config__card-check">
                      <Check size={16} strokeWidth={2.4} aria-hidden="true" />
                    </span>
                    <span className="calculator-config__card-title">{item.title}</span>
                    <span className="calculator-config__card-text">{item.description}</span>
                    <ul className="calculator-config__card-list">
                      {item.details.map((detail) => (
                        <li key={detail}>
                          <Check size={15} strokeWidth={2.4} aria-hidden="true" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                    <strong>{formatCurrency(item.price)}</strong>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="calculator-config__group">
              <legend>Raumgröße</legend>
              <div className="calculator-config__segments">
                {roomSizes.map((item) => (
                  <button
                    className={`calculator-config__segment${
                      selectedSizeId === item.id ? ' is-selected' : ''
                    }`}
                    type="button"
                    key={item.id}
                    aria-pressed={selectedSizeId === item.id}
                    onClick={() => setSelectedSizeId(item.id)}
                  >
                    <span>{item.label}</span>
                    <small>{item.helper}</small>
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="calculator-config__group">
              <legend>Zusatzleistungen</legend>
              <div className="calculator-config__addons">
                {addOns.map((item) => (
                  <label
                    className={`calculator-config__addon${
                      selectedAddOns.includes(item.id) ? ' is-selected' : ''
                    }`}
                    key={item.id}
                  >
                    <input
                      type="checkbox"
                      checked={selectedAddOns.includes(item.id)}
                      onChange={() => toggleAddOn(item.id)}
                    />
                    <span className="calculator-config__addon-box">
                      <Check size={15} strokeWidth={2.6} aria-hidden="true" />
                    </span>
                    <span className="calculator-config__addon-content">
                      <span>
                        <strong>{item.title}</strong>
                        <em>{item.description}</em>
                      </span>
                      <b>{formatCurrency(item.price)}</b>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <aside className="calculator-summary" aria-label="Zusammenfassung">
            <div className="calculator-summary__header">
              <span className="calculator-summary__icon">
                <CalculatorIcon size={23} strokeWidth={2.1} aria-hidden="true" />
              </span>
              <div>
                <h2>Kostenschätzung</h2>
                <p>Unverbindliche Orientierung</p>
              </div>
            </div>

            <dl className="calculator-summary__list">
              <div>
                <dt>Paket</dt>
                <dd>{selectedPackage.title}</dd>
              </div>
              <div>
                <dt>Raumgröße</dt>
                <dd>{selectedSize.label}</dd>
              </div>
              <div>
                <dt>Zusatzleistungen</dt>
                <dd>{selectedAddOnItems.length}</dd>
              </div>
              <div>
                <dt>Menge</dt>
                <dd>{quantity}</dd>
              </div>
            </dl>

            <div className="calculator-summary__price">
              <span>Gesamt inkl. MwSt.</span>
              <strong>{formatCurrency(totals.gross)}</strong>
              <small>{formatCurrency(totals.net)} netto</small>
            </div>

            <a className="calculator-summary__button" href="#anfrage">
              <ClipboardList size={18} strokeWidth={2.2} aria-hidden="true" />
              Angebot anfragen
            </a>

            <div className="calculator-summary__note">
              <ShieldCheck size={18} strokeWidth={2.2} aria-hidden="true" />
              Die finale Offerte folgt nach persönlicher Prüfung von Zustand,
              Materialauswahl und Ausführungsdetails.
            </div>
          </aside>
        </div>
      </section>

      <section className="calculator-request section" id="anfrage">
        <div className="container calculator-request__container">
          <div className="calculator-request__content">
            <span className="calculator-request__eyebrow">Anfrage</span>
            <h2>Kostenschätzung prüfen lassen</h2>
            <p>
              Senden Sie Ihre Konfiguration an Prima Vista. Wir melden uns mit
              einer fachlichen Einschätzung und den nächsten Schritten.
            </p>

            <div className="calculator-request__media">
              <img
                src={projectDetailCeilingImage.src}
                srcSet={projectDetailCeilingImage.srcSet}
                sizes={responsiveImageSizes.projectsGrid}
                alt="Hochwertig ausgeführtes Innenausbau-Projekt von Prima Vista"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <div className="calculator-request__form-wrap">
            {formStatus === 'success' ? (
              <div className="calculator-request__success">
                <strong>Vielen Dank!</strong>
                <p>Ihre Kalkulator-Anfrage wurde gesendet. Wir melden uns in Kürze bei Ihnen.</p>
                <button type="button" onClick={() => setFormStatus('idle')}>
                  Neue Anfrage senden
                </button>
              </div>
            ) : (
              <form
                className="calculator-request__form"
                name="calculator"
                method="POST"
                data-netlify="true"
                onSubmit={handleSubmit}
              >
                <input type="hidden" name="form-name" value="calculator" />
                <input type="hidden" name="bot-field" />
                <input type="hidden" name="package" value={selectedPackage.title} />
                <input type="hidden" name="room_size" value={selectedSize.label} />
                <input type="hidden" name="quantity" value={quantity} />
                <input type="hidden" name="add_ons" value={selectedAddOnTitles.join(', ')} />
                <input type="hidden" name="material_net" value={formatCurrency(totals.materialShare)} />
                <input type="hidden" name="montage_net" value={formatCurrency(totals.montageShare)} />
                <input type="hidden" name="subtotal_net" value={formatCurrency(totals.net)} />
                <input type="hidden" name="vat" value={formatCurrency(totals.vat)} />
                <input type="hidden" name="summary" value={summaryText} />
                <input type="hidden" name="total" value={formatCurrency(totals.gross)} />

                <label className="calculator-request__field" htmlFor="calculator-name">
                  Name
                  <input id="calculator-name" name="name" type="text" autoComplete="name" required />
                </label>

                <label className="calculator-request__field" htmlFor="calculator-email">
                  E-Mail
                  <input id="calculator-email" name="email" type="email" autoComplete="email" required />
                </label>

                <label className="calculator-request__field" htmlFor="calculator-phone">
                  Telefonnummer
                  <input id="calculator-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" />
                </label>

                <label className="calculator-request__field calculator-request__field--wide" htmlFor="calculator-message">
                  Nachricht
                  <textarea
                    id="calculator-message"
                    name="message"
                    rows="5"
                    placeholder="Beschreiben Sie kurz Ihr Bad oder Innenausbau-Projekt."
                  ></textarea>
                </label>

                <div className="calculator-request__selected">
                  <strong>Auswahl:</strong>
                  <span>{summaryText}</span>
                </div>

                <button
                  className="calculator-request__submit"
                  type="submit"
                  disabled={formStatus === 'submitting'}
                >
                  <Send size={18} strokeWidth={2.2} aria-hidden="true" />
                  {formStatus === 'submitting' ? 'Wird gesendet...' : 'Anfrage senden'}
                </button>

                {formStatus === 'error' ? (
                  <p className="calculator-request__error">
                    Fehler beim Senden. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.
                  </p>
                ) : null}
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default CalculatorPage;
