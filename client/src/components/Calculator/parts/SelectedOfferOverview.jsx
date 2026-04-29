import './SelectedOfferOverview.scss';
import { responsiveImageSizes } from '../../../assets/responsiveImages';
import HashLink from '../../HashLink/HashLink';
import ResponsivePicture from '../../ResponsivePicture/ResponsivePicture';
import { formatCurrency, formatSquareMeters } from '../utils/formatting';

const getOfferTitle = ({ selectedChoice, activePackageTitle }) => {
  const title = selectedChoice?.title ?? activePackageTitle;

  return `${title.toLocaleUpperCase('de-CH')} Angebot`;
};

function SelectedOfferOverview({
  activePackageTitle,
  areaInput,
  areaSquareMeters,
  displayedPackageUnitPrice,
  onAreaChange,
  selectedChoice,
  showPanel = true,
  totals,
}) {
  const offerTitle = getOfferTitle({ selectedChoice, activePackageTitle });
  const image = selectedChoice?.image;

  return (
    <section
      className={`calculator-selected-offer calculator-config__reveal${showPanel ? '' : ' calculator-selected-offer--main-only'}`}
      aria-label="Ausgewähltes Angebot"
    >
      <div className="calculator-selected-offer__main">
        <nav className="calculator-selected-offer__crumbs" aria-label="Kalkulator-Pfad">
          <span>Gewerke</span>
          <span>Trockenbau & Innenausbau</span>
        </nav>

        <h2>{offerTitle} | Kalkulator für Montage & Material</h2>

        <div className="calculator-selected-offer__media">
          {image ? (
            <ResponsivePicture
              image={image}
              sizes={responsiveImageSizes.projectsFeatured}
              alt={selectedChoice.alt}
              loading="eager"
              decoding="sync"
            />
          ) : null}
        </div>
      </div>

      {showPanel ? (
        <aside className="calculator-selected-offer__panel">
          <span className="calculator-selected-offer__label">Prima Vista Blitz-Angebot</span>

          <button className="calculator-selected-offer__help" type="button">
            Wie funktioniert das?
          </button>

          <dl className="calculator-selected-offer__totals">
            <div>
              <dt>Gesamtnettosumme:</dt>
              <dd>{formatCurrency(totals.net)}</dd>
            </div>
            <div>
              <dt>zzgl. 8.1 % MwSt.:</dt>
              <dd>{formatCurrency(totals.vat)}</dd>
            </div>
            <div>
              <dt>Gesamtsumme:</dt>
              <dd>{formatCurrency(totals.gross)}</dd>
            </div>
          </dl>

          <label className="calculator-selected-offer__area" htmlFor="calculator-selected-area">
            <input
              id="calculator-selected-area"
              type="number"
              min="1"
              step="0.1"
              value={areaInput}
              onChange={(event) => onAreaChange(event.target.value)}
            />
            <span>m²</span>
          </label>

          <HashLink className="calculator-selected-offer__button" to="#anfrage">
            als Anfrage
          </HashLink>

          <p>
            Richtwert für {formatSquareMeters(areaSquareMeters)} mit {activePackageTitle}.
            Aktueller Leistungspreis: {formatCurrency(displayedPackageUnitPrice)} / m².
          </p>
        </aside>
      ) : null}
    </section>
  );
}

export default SelectedOfferOverview;
