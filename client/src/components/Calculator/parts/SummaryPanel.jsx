import {
  Calculator as CalculatorIcon,
  ClipboardList,
  ShieldCheck,
} from 'lucide-react';
import './SummaryPanel.scss';
import HashLink from '../../HashLink/HashLink';
import { formatCurrency, formatNumber, formatSquareMeters } from '../utils/formatting';

function SummaryPanel({
  activePackageTitle,
  areaSquareMeters,
  displayedPackageUnitPrice,
  isComponentBreakdownMode,
  positionLines,
  selectedAddOnCount,
  totals,
}) {
  return (
    <aside className="calculator-summary calculator-config__reveal" aria-label="Zusammenfassung">
      <div className="calculator-summary__header">
        <span className="calculator-summary__icon">
          <CalculatorIcon size={23} strokeWidth={2.1} aria-hidden="true" />
        </span>
        <div>
          <h2>Kostenschätzung</h2>
          <p>Unverbindliche Erstorientierung</p>
        </div>
      </div>

      <dl className="calculator-summary__list">
        <div>
          <dt>Leistungen</dt>
          <dd>{activePackageTitle}</dd>
        </div>
        <div>
          <dt>Fläche</dt>
          <dd>{formatSquareMeters(areaSquareMeters)}</dd>
        </div>
        <div>
          <dt>Preis / m²</dt>
          <dd>{formatCurrency(displayedPackageUnitPrice)} / m²</dd>
        </div>
        <div>
          <dt>Zusatzleistungen</dt>
          <dd>{isComponentBreakdownMode ? 'Leistungspositionen' : selectedAddOnCount}</dd>
        </div>
      </dl>

      <div className="calculator-summary__positions">
        <div className="calculator-summary__positions-head">
          <span>Position</span>
          <span>Menge</span>
          <span>Preis</span>
          <span>Total</span>
        </div>
        {positionLines.map((line) => (
          <div className="calculator-summary__position" key={line.id}>
            <span>{line.title}</span>
            <span>{formatNumber(line.quantity)} {line.unit}</span>
            <span>{formatCurrency(line.unitPrice)}</span>
            <strong>{formatCurrency(line.net)}</strong>
          </div>
        ))}
      </div>

      <div className="calculator-summary__price">
        <span>Gesamt inkl. MwSt.</span>
        <strong>{formatCurrency(totals.gross)}</strong>
        <small>{formatCurrency(totals.net)} netto</small>
      </div>

      <HashLink className="calculator-summary__button" to="#anfrage">
        <ClipboardList size={18} strokeWidth={2.2} aria-hidden="true" />
        Angebot anfragen
      </HashLink>

      <div className="calculator-summary__note">
        <ShieldCheck size={18} strokeWidth={2.2} aria-hidden="true" />
        Die finale Offerte folgt nach persönlicher Prüfung von Zustand,
        Materialauswahl und Ausführungsdetails.
      </div>
    </aside>
  );
}

export default SummaryPanel;
