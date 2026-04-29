import { Send } from 'lucide-react';
import './RequestSection.scss';
import { responsiveImageSizes } from '../../../assets/responsiveImages';
import { formatCurrency, formatSquareMeters } from '../utils/formatting';

function RequestSection({
  activeMediaIndex,
  formContainerRef,
  formRef,
  formStatus,
  isComponentBreakdownMode,
  isVisible,
  onResetForm,
  onSubmit,
  requestMedia,
  sectionRef,
  selection,
  summary,
  successRef,
  totals,
}) {
  const activeRequestMediaIndex = activeMediaIndex % requestMedia.length;
  const activeRequestMedia = requestMedia[activeRequestMediaIndex];

  return (
    <section
      className={`calculator-request section${isVisible ? ' calculator-request--visible' : ''}`}
      id="anfrage"
      ref={sectionRef}
    >
      <div className="container calculator-request__container">
        <div className="calculator-request__content">
          <span className="calculator-request__eyebrow calculator-request__reveal">Anfrage</span>
          <h2 className="calculator-request__reveal">Kostenschätzung prüfen lassen</h2>
          <p className="calculator-request__reveal">
            Senden Sie Ihre Konfiguration an Prima Vista. Wir melden uns mit
            einer fachlichen Einschätzung, offenen Punkten und den nächsten Schritten.
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

        <div
          className="calculator-request__form-wrap calculator-request__reveal"
          ref={formContainerRef}
        >
          {formStatus === 'success' ? (
            <div
              ref={successRef}
              className="calculator-request__success"
              role="status"
              aria-live="polite"
              tabIndex={-1}
            >
              <strong>Vielen Dank!</strong>
              <p>Ihre Kalkulator-Anfrage wurde gesendet. Wir melden uns in Kürze bei Ihnen.</p>
              <button type="button" onClick={onResetForm}>
                Neue Anfrage senden
              </button>
            </div>
          ) : (
            <form
              ref={formRef}
              className="calculator-request__form"
              name="calculator"
              onSubmit={onSubmit}
            >
              <input type="hidden" name="bot-field" />
              <input type="hidden" name="subject" value="Neue Kalkulator-Anfrage über die Website" />
              <input type="hidden" name="submission_type" value="Kalkulator-Anfrage" />
              <input type="hidden" name="confirmation_requested" value="yes" />
              <input type="hidden" name="confirmation_request_id" value="" />
              <input
                type="hidden"
                name="calculator_mode"
                value={isComponentBreakdownMode ? `${selection.activePackageTitle} - Leistungspositionen` : 'Paketangebot'}
              />
              <input type="hidden" name="package" value={selection.activePackageTitle} />
              <input type="hidden" name="area_sqm" value={formatSquareMeters(selection.areaSquareMeters)} />
              <input type="hidden" name="room_size" value={formatSquareMeters(selection.areaSquareMeters)} />
              <input type="hidden" name="package_unit_price" value={`${formatCurrency(selection.displayedPackageUnitPrice)} / m²`} />
              <input type="hidden" name="add_ons" value={summary.selectedAddOnTitles.join(', ')} />
              <input type="hidden" name="line_items" value={summary.lineItemSummary} />
              <input type="hidden" name="material_net" value={formatCurrency(totals.materialShare)} />
              <input type="hidden" name="montage_net" value={formatCurrency(totals.montageShare)} />
              <input type="hidden" name="subtotal_net" value={formatCurrency(totals.net)} />
              <input type="hidden" name="vat" value={formatCurrency(totals.vat)} />
              <input type="hidden" name="summary" value={summary.summaryText} />
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
                  placeholder="Beschreiben Sie kurz Ihre Trockenbau-Leistung, z. B. Decken, Wände, Estrich oder Dachschrägen."
                ></textarea>
              </label>

              <div className="calculator-request__selected">
                <strong>Auswahl:</strong>
                <span>{summary.summaryText}</span>
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
  );
}

export default RequestSection;
