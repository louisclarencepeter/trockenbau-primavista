import { useEffect, useMemo, useState } from 'react';
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
  projectCeilingDrywallImage,
  projectDetailCeilingImage,
  projectExistingSpaceRenovationImage,
  projectFeaturedModernizationImage,
  projectFinishImage,
  responsiveImageSizes,
  serviceInteriorImage,
} from '../../assets/responsiveImages';
import useScrollReveal from '../../hooks/useScrollReveal';

const vatRate = 0.081;
const minQuantity = 1;
const maxQuantity = 5;

const packages = [
  {
    id: 'trockenbau',
    title: 'Trockenbau',
    description: 'Wände, Decken und Vorwandarbeiten mit präziser Unterkonstruktion.',
    price: 8600,
    details: ['Unterkonstruktion & Beplankung', 'Spachtelarbeiten', 'Saubere Anschlüsse'],
  },
  {
    id: 'sanierung-renovierung',
    title: 'Sanierung & Renovierung',
    description: 'Bestehende Räume fachgerecht erneuern, vorbereiten und hochwertig abschließen.',
    price: 12800,
    details: ['Rückbau & Vorbereitung', 'Oberflächen erneuern', 'Koordinierter Ablauf'],
  },
  {
    id: 'innenausbau',
    title: 'Innenausbau',
    description: 'Individuelle Innenräume mit sauberem Finish und stimmigen Details.',
    price: 16400,
    details: ['Raumgestaltung', 'Trockenbau & Finish', 'Materialkoordination'],
  },
  {
    id: 'fenster',
    title: 'Fenster',
    description: 'Fensterarbeiten sauber in Trockenbau, Renovierung und Innenausbau integrieren.',
    price: 7400,
    details: ['Laibungen & Anschlüsse', 'Innenausbau-Integration', 'Saubere Übergänge'],
  },
];

const roomSizes = [
  { id: 'small', label: 'bis 5 m2', helper: 'Kleiner Raum oder Detailarbeit', multiplier: 0.86 },
  { id: 'medium', label: '6-9 m2', helper: 'Standardraum', multiplier: 1 },
  { id: 'large', label: '10-14 m2', helper: 'Großzügiger Raum', multiplier: 1.18 },
  { id: 'xl', label: 'ab 15 m2', helper: 'Mehrere Flächen oder großer Ausbau', multiplier: 1.35 },
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
    title: 'Abdichtung & Schutz',
    description: 'Schutz- und Abdichtungsarbeiten für beanspruchte Wand- und Bodenflächen.',
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
  {
    id: 'windows',
    title: 'Fenster & Anschlussdetails',
    description: 'Fensterlaibungen, Übergänge und saubere Integration in den Innenausbau.',
    price: 1600,
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
    id: 'montage',
    label: 'Montage',
    title: 'Vorwand & Trockenbau',
    image: projectFeaturedModernizationImage,
    alt: 'Modernisierung im Innenausbau mit vorbereiteten Wandflächen',
  },
  {
    id: 'finish',
    label: 'Finish',
    title: 'Saubere Oberflächen',
    image: serviceInteriorImage,
    alt: 'Hochwertiger Innenausbau mit sauberem Finish',
  },
  {
    id: 'sanierung',
    label: 'Sanierung',
    title: 'Geprüfte Umsetzung',
    image: projectExistingSpaceRenovationImage,
    alt: 'Sanierter Innenraum während der Ausbauphase',
  },
];

const requestMedia = [
  {
    id: 'anschluesse',
    label: 'Detailprüfung',
    title: 'Saubere Anschlüsse',
    text: 'Wir prüfen Übergänge, Kanten und vorbereitete Flächen vor dem verbindlichen Angebot.',
    image: projectDetailCeilingImage,
    alt: 'Detailansicht eines vorbereiteten Innenausbau-Projekts',
  },
  {
    id: 'decken',
    label: 'Ausführung',
    title: 'Decken & Wände',
    text: 'Trockenbau, Beplankung und Unterkonstruktion werden sauber nachvollziehbar geplant.',
    image: projectCeilingDrywallImage,
    alt: 'Trockenbau-Projekt mit Decken- und Wandflächen',
  },
  {
    id: 'finish',
    label: 'Finish',
    title: 'Bereit für die Übergabe',
    text: 'Zum Schluss geht es um klare Oberflächen, stimmige Details und ein gepflegtes Ergebnis.',
    image: projectFinishImage,
    alt: 'Innenausbau-Projekt mit vorbereiteten Oberflächen und Finish-Arbeiten',
  },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF',
    maximumFractionDigits: 0,
  }).format(value);

function CalculatorPage() {
  const { sectionRef: heroRef, isVisible: isHeroVisible } = useScrollReveal({
    threshold: 0.22,
    rootMargin: '0px 0px -10% 0px',
    once: false,
  });
  const { sectionRef: offerRef, isVisible: isOfferVisible } = useScrollReveal({
    threshold: 0.28,
    rootMargin: '0px 0px -8% 0px',
    once: false,
  });
  const { sectionRef: configRef, isVisible: isConfigVisible } = useScrollReveal({
    threshold: 0.12,
    rootMargin: '0px 0px -8% 0px',
    once: false,
  });
  const { sectionRef: requestRef, isVisible: isRequestVisible } = useScrollReveal({
    threshold: 0.18,
    rootMargin: '0px 0px -8% 0px',
    once: false,
  });
  const [selectedPackageId, setSelectedPackageId] = useState(packages[1].id);
  const [selectedSizeId, setSelectedSizeId] = useState(roomSizes[1].id);
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState(() =>
    addOns
      .filter((addOn) => addOn.defaultSelected)
      .map((addOn) => addOn.id),
  );
  const [formStatus, setFormStatus] = useState('idle');
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  const selectedPackage = packages.find((item) => item.id === selectedPackageId) ?? packages[0];
  const selectedSize = roomSizes.find((item) => item.id === selectedSizeId) ?? roomSizes[1];
  const activeHeroMedia = heroMedia[activeMediaIndex];
  const supportingHeroMedia = [
    heroMedia[(activeMediaIndex + 1) % heroMedia.length],
    heroMedia[(activeMediaIndex + 2) % heroMedia.length],
  ];
  const activeRequestMediaIndex = activeMediaIndex % requestMedia.length;
  const activeRequestMedia = requestMedia[activeRequestMediaIndex];
  const selectedAddOnItems = useMemo(
    () => addOns.filter((addOn) => selectedAddOns.includes(addOn.id)),
    [selectedAddOns],
  );

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveMediaIndex((currentIndex) => (currentIndex + 1) % heroMedia.length);
    }, 4600);

    return () => window.clearInterval(intervalId);
  }, []);

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
      <section
        className={`calculator-hero${isHeroVisible ? ' calculator-hero--visible' : ''}`}
        ref={heroRef}
      >
        <div className="container calculator-hero__container">
          <div className="calculator-hero__content">
            <nav className="calculator-hero__breadcrumb calculator-hero__reveal" aria-label="Breadcrumb">
              <a href="/">Startseite</a>
              <ChevronRight size={18} strokeWidth={2.2} aria-hidden="true" />
              <span>Kalkulator</span>
            </nav>

            <span className="calculator-hero__eyebrow calculator-hero__reveal">Prima Vista Blitz-Angebot</span>
            <h1 className="calculator-hero__title calculator-hero__reveal" aria-label="Projekt kalkulieren: Montage und Material">
              <span>Projekt</span>
              <span>kalkulieren:</span>
              <span>Montage & Material</span>
            </h1>
            <p className="calculator-hero__text calculator-hero__reveal">
              Wählen Sie Leistungspaket, Raumgröße und Zusatzarbeiten. Der Rechner
              zeigt direkt eine nachvollziehbare Kostenschätzung für Ihre Anfrage.
            </p>

            <div className="calculator-hero__benefits calculator-hero__reveal" aria-label="Vorteile">
              {benefits.map((benefit) => (
                <span className="calculator-hero__benefit" key={benefit}>
                  <Check size={17} strokeWidth={2.3} aria-hidden="true" />
                  {benefit}
                </span>
              ))}
            </div>
          </div>

          <div className="calculator-hero__visual calculator-hero__reveal">
            <div className="calculator-hero__media-main">
              {heroMedia.map((item, index) => (
                <img
                  key={item.id}
                  src={item.image.src}
                  srcSet={item.image.srcSet}
                  sizes={responsiveImageSizes.projectsFeatured}
                  alt={item.alt}
                  className={`calculator-hero__image${
                    index === activeMediaIndex ? ' is-active' : ''
                  }`}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding={index === 0 ? 'sync' : 'async'}
                />
              ))}
              <div className="calculator-hero__price-card" aria-label="Beispielhafte Kostenschätzung">
                <span>Aktuelle Schätzung</span>
                <strong>{formatCurrency(totals.gross)}</strong>
                <small>{selectedPackage.title}</small>
              </div>
              <div className="calculator-hero__media-caption">
                <span>{activeHeroMedia.label}</span>
                <strong>{activeHeroMedia.title}</strong>
              </div>
            </div>

            <div className="calculator-hero__media-stack" aria-label="Weitere Projektansichten">
              {supportingHeroMedia.map((item, stackIndex) => (
                <div className="calculator-hero__stack-frame" key={`${item.id}-${stackIndex}`}>
                  {heroMedia.map((media) => (
                    <img
                      key={`${item.id}-${media.id}`}
                      src={media.image.src}
                      srcSet={media.image.srcSet}
                      sizes={responsiveImageSizes.projectsGrid}
                      alt={media.alt}
                      className={`calculator-hero__stack-image${
                        media.id === item.id ? ' is-active' : ''
                      }`}
                      loading="lazy"
                      decoding="async"
                    />
                  ))}
                  <span className="calculator-hero__stack-label">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className={`calculator-offer${isOfferVisible ? ' calculator-offer--visible' : ''}`}
        aria-label="Aktuelle Kostenschätzung"
        ref={offerRef}
      >
        <div className="container calculator-offer__container">
          <div className="calculator-offer__intro calculator-offer__reveal">
            <span>Ihre aktuelle Schätzung</span>
            <strong>{formatCurrency(totals.gross)}</strong>
            <small>{formatCurrency(pricePerUnit)} pro Einheit, inkl. MwSt.</small>
          </div>

          <div className="calculator-offer__totals" aria-live="polite">
            <div className="calculator-offer__line calculator-offer__reveal">
              <span>Material netto</span>
              <strong>{formatCurrency(totals.materialShare)}</strong>
            </div>
            <div className="calculator-offer__line calculator-offer__reveal">
              <span>Montage netto</span>
              <strong>{formatCurrency(totals.montageShare)}</strong>
            </div>
            <div className="calculator-offer__line calculator-offer__reveal">
              <span>zzgl. 8.1 % MwSt.</span>
              <strong>{formatCurrency(totals.vat)}</strong>
            </div>
            <div className="calculator-offer__line calculator-offer__line--total calculator-offer__reveal">
              <span>Gesamtsumme</span>
              <strong>{formatCurrency(totals.gross)}</strong>
            </div>
          </div>

          <div className="calculator-offer__actions calculator-offer__reveal">
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

      <section
        className={`calculator-config section${isConfigVisible ? ' calculator-config--visible' : ''}`}
        id="kalkulator-konfiguration"
        ref={configRef}
      >
        <div className="container calculator-config__container">
          <div className="calculator-config__main">
            <div className="calculator-config__header calculator-config__reveal">
              <span className="calculator-config__eyebrow">Kalkulation</span>
              <h2>Projekt konfigurieren</h2>
              <p>
                Die Werte sind Richtpreise für die erste Planung. Details wie
                Untergrund, Materialwahl und Leitungsführung werden im Anschluss geprüft.
              </p>
            </div>

            <fieldset className="calculator-config__group calculator-config__reveal">
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

            <fieldset className="calculator-config__group calculator-config__reveal">
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

            <fieldset className="calculator-config__group calculator-config__reveal">
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

          <aside className="calculator-summary calculator-config__reveal" aria-label="Zusammenfassung">
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

      <section
        className={`calculator-request section${isRequestVisible ? ' calculator-request--visible' : ''}`}
        id="anfrage"
        ref={requestRef}
      >
        <div className="container calculator-request__container">
          <div className="calculator-request__content">
            <span className="calculator-request__eyebrow calculator-request__reveal">Anfrage</span>
            <h2 className="calculator-request__reveal">Kostenschätzung prüfen lassen</h2>
            <p className="calculator-request__reveal">
              Senden Sie Ihre Konfiguration an Prima Vista. Wir melden uns mit
              einer fachlichen Einschätzung und den nächsten Schritten.
            </p>

            <div className="calculator-request__media calculator-request__reveal">
              {requestMedia.map((item, index) => (
                <img
                  key={item.id}
                  src={item.image.src}
                  srcSet={item.image.srcSet}
                  sizes={responsiveImageSizes.projectsGrid}
                  alt={item.alt}
                  className={`calculator-request__media-image${
                    index === activeRequestMediaIndex ? ' is-active' : ''
                  }`}
                  loading="lazy"
                  decoding="async"
                />
              ))}

              <div className="calculator-request__media-panel">
                <span>{activeRequestMedia.label}</span>
                <strong>{activeRequestMedia.title}</strong>
                <small>{activeRequestMedia.text}</small>
              </div>

              <div className="calculator-request__media-strip" aria-hidden="true">
                {requestMedia.map((item, index) => (
                  <span
                    className={`calculator-request__media-dot${
                      index === activeRequestMediaIndex ? ' is-active' : ''
                    }`}
                    key={item.id}
                  >
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="calculator-request__form-wrap calculator-request__reveal">
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
                    placeholder="Beschreiben Sie kurz Ihr Trockenbau-, Sanierungs- oder Innenausbau-Projekt."
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
