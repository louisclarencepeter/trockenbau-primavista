import {
  Check,
  CopyPlus,
  Info,
  PackageOpen,
  RefreshCw,
  Trash2,
  Wrench,
} from 'lucide-react';
import './PositionSelectionTable.scss';
import { formatCurrency } from '../utils/formatting';
import {
  getCustomLineQuantity,
  getLineQuantity,
  getPriceUnitLabel,
  parsePositiveNumber,
} from '../utils/pricing';

const positionDisplayByPackage = {
  decken: {
    'package:decken': {
      group: 'TROCKENBAU | Basis-Haus',
      title: 'DECKEN | 🛠️ Montage-Leistungspaket',
    },
    'addon:decken-verspachtlung': {
      group: 'TROCKENBAU | Basis-Haus',
      title: 'VERSPACHTLUNG | streichfertig | 🛠️ Zusatz-Montage',
    },
    'addon:decken-eckausbildung': {
      group: 'TROCKENBAU | Basis-Haus',
      title: 'ECKAUSBILDUNG | für GK-Wände & -Decken',
    },
    'addon:decken-rigips': {
      group: 'Material',
      title: 'Rigips Gipsplatte',
    },
    'addon:decken-knauf-gkbi': {
      group: 'Material',
      title: 'Knauf GKBI imprägniert (Feuchtraum)',
    },
    'addon:decken-parador-paneele': {
      group: 'Optionale Positionen',
      title: 'Parador Paneele Novara (Esche Weiß)',
    },
    'addon:decken-parador-deckenleiste': {
      group: 'Optionale Positionen',
      title: 'Parador Deckenleiste DAL 2',
    },
    'addon:decken-innenausbau-varianten': {
      group: 'Optionale Positionen',
      title: 'Weitere Produkte Innenausbau',
    },
  },
  waende: {
    'package:waende': {
      group: 'TROCKENBAU | Basis-Haus',
      title: 'WÄNDE | 🛠️ Montage-Leistungspaket',
    },
    'addon:waende': {
      group: 'TROCKENBAU | Basis-Haus',
      title: 'VORSATZWÄNDE | 🛠️ Montage-Leistungspaket',
    },
    'addon:waende-verspachtlung': {
      group: 'TROCKENBAU | Basis-Haus',
      title: 'VERSPACHTLUNG | STREICHFERTIG FÜR GIPSPLATTEN | 🛠️ Zusatz-Montage',
    },
    'addon:waende-tuerloch': {
      group: 'TROCKENBAU | Basis-Haus',
      title: 'TÜRLOCH HERSTELLUNG - FÜR GK-WÄNDE | 🛠️ Zusatz-Montage',
    },
    'addon:waende-eckausbildung': {
      group: 'TROCKENBAU | Basis-Haus',
      title: 'ECKAUSBILDUNG - FÜR GK-WÄNDE &-DECKEN | 🛠️ Zusatz-Montage',
    },
    'addon:waende-rigips': {
      group: 'Material',
      title: 'Rigips Gipsplatte',
    },
    'addon:waende-knauf-gkbi': {
      group: 'Material',
      title: 'Knauf GKBI SONDERPAL. impraegniert 2000x 1250x 12,5 mm AK 24 St/Pal',
    },
    'addon:waende-rohrkaesten-koffer': {
      group: 'Extra Positionen',
      title: 'ROHRKÄSTEN & KOFFER - BAU IN TROCKENBAUWEISE | 🛠️ Zusatz-Montage',
    },
    'addon:waende-durchgang-verschliessen': {
      group: 'Extra Positionen',
      title: 'DURCHGANG VERSCHLIEßEN - BAU IN TROCKENBAUWEISE | 🛠️ Zusatz-Montage',
    },
    'addon:waende-eclisse-schiebetuerset': {
      group: 'Extra Positionen',
      title: 'ECLISSE Innenwand Schiebetürset inkl. Holztürblatt Unico EF 1-flügelig für Trockenbauwand',
    },
    'addon:waende-joka-akustikpaneel': {
      group: 'Optionale Positionen',
      title: 'JOKA PARO AKUSTIK Echtholzpaneel GEPRÄGT 2400 x 600 x 20 mm, AUSPAN2021_03',
    },
    'addon:waende-ardesio-steinpaneel': {
      group: 'Optionale Positionen',
      title: 'ARDESIO Steinpaneel',
    },
  },
  'waende-verkleiden': {
    'package:waende': {
      group: 'Art der Ausführung',
      title: 'WÄNDE | 🛠️ Montage-Leistungspaket',
    },
    'addon:waende-verkleiden-ardesio': {
      group: 'Material',
      title: 'ARDESIO Steinpaneel',
    },
    'addon:waende-verkleiden-joka-akustikpaneel': {
      group: 'Optionale Positionen',
      title: 'JOKA PARO AKUSTIK Echtholzpaneel GEPRÄGT 2400 x 600 x 20 mm, AUSPAN2021_03',
    },
    'addon:waende-verkleiden-de-ryck-murok': {
      group: 'Optionale Positionen',
      title: 'De Ryck Steinriemchen Murok Sierra M47',
    },
    'addon:waende-verkleiden-botament-flexkleber': {
      group: 'Optionale Positionen',
      title: 'Botament M21 HP Premium-Flexkleber - 25Kg',
    },
    'addon:waende-verkleiden-vorsatzwaende': {
      group: 'TROCKENBAU | Basis-Haus',
      title: 'VORSATZWÄNDE | 🛠️ Montage-Leistungspaket',
    },
    'addon:waende-verkleiden-rigips': {
      group: 'TROCKENBAU | Basis-Haus',
      title: 'Rigips Gipsplatte',
    },
    'addon:waende-verkleiden-knauf-gkbi': {
      group: 'TROCKENBAU | Basis-Haus',
      title: 'Knauf GKBI SONDERPAL. impraegniert 2000x 1250x 12,5 mm AK 24 St/Pal',
    },
  },
  estrich: {
    'package:estrich-boden': {
      group: 'Art der Ausführung',
      title: 'ESTRICH | 🛠️ Montage',
    },
    'addon:estrich-alt-demontage': {
      group: 'Art der Ausführung',
      title: 'ALT-ESTRICH | 🛠️ Demontage & Entsorgung',
    },
    'addon:estrich-fermacell-elemente': {
      group: 'Material',
      title: 'Fermacell Estrich-Elemente (MW) mit Mineralwolldämmung 1500x500 mm - Dicke: 30 mm',
    },
    'addon:estrich-fermacell-kleber': {
      group: 'Extra Positionen',
      title: 'Fermacell Estrich-Kleber - 1 kg Flasche',
    },
    'addon:estrich-fermacell-schrauben': {
      group: 'Extra Positionen',
      title: 'Fermacell Schnellbauschrauben für Estrichelemente 3,9x19 mm, 1000 Stück',
    },
    'addon:estrich-ausgleichsschuettung': {
      group: 'Extra Positionen',
      title: 'Ausgleichsschüttung Herstellen (bis 3 cm)',
    },
    'addon:estrich-wabenschuettung': {
      group: 'Extra Positionen',
      title: 'Fermacell Wabenschüttung - 15 Liter Sack',
    },
    'addon:estrich-waermedaemmschuettung': {
      group: 'Extra Positionen',
      title: 'Fermacell Wärmedämmschüttung - 100 Liter Sack',
    },
    'addon:estrich-fermacell-wabe': {
      group: 'Extra Positionen',
      title: 'Fermacell Estrich-Wabe 1.500x1.000 mm, Dicke 30 mm',
    },
  },
  dachschraegen: {
    'package:dachschraegen': {
      group: 'Art der Ausführung',
      title: 'DACHAUSBAU | 🛠️ Montage-Leistungspaket',
    },
    'addon:dachschraegen-verspachtlung': {
      group: 'Art der Ausführung',
      title: 'VERSPACHTLUNG | streichfertig | 🛠️ Zusatz-Montage',
    },
    'addon:dachschraegen-daemmung-montage': {
      group: 'Art der Ausführung',
      title: 'DÄMMUNG | 🛠️ Montage-Leistung',
    },
    'addon:dachschraegen-alt-daemmung': {
      group: 'Art der Ausführung',
      title: 'ALT-DÄMMUNG | Demontage & Entsorgung',
    },
    'addon:dachschraegen-ursa-sf32': {
      group: 'Dämmung',
      title: 'URSA SF 32 PLUS | Klemmfilz (140 mm)',
    },
    'addon:dachschraegen-knauf-lds': {
      group: 'Dämmung',
      title: 'Knauf LDS Flex Plus | Dampfbremsbahn',
    },
    'addon:dachschraegen-rigips': {
      group: 'Beplankung',
      title: 'Rigips Gipsplatte | Standard',
    },
    'addon:dachschraegen-knauf-gkbi': {
      group: 'Beplankung',
      title: 'Knauf GKBI | imprägniert (Feuchtraum)',
    },
    'addon:dachschraegen-dachfenster-montage': {
      group: 'Fenster',
      title: 'DACHFENSTER | Montage-Paket',
    },
    'addon:dachschraegen-velux-solarfenster': {
      group: 'Fenster',
      title: 'Velux Solarfenster | GGU Kunststoff',
    },
    'addon:dachschraegen-velux-rollo': {
      group: 'Fenster',
      title: 'Velux Rollo | Verdunkelung manuell',
    },
    'addon:dachschraegen-revisionsklappe': {
      group: 'Extras',
      title: 'Revisionsklappe | Knauf REVO BS90',
    },
    'addon:dachschraegen-parador-paneele': {
      group: 'Optionen',
      title: 'Parador Paneele | Esche Weiss Dekor',
    },
  },
};

const fallbackPositionTitles = {
  decken: 'DECKEN abhängen',
  waende: 'WÄNDE stellen',
  'estrich-boden': 'ESTRICH verlegen',
  estrich: 'ESTRICH verlegen',
  dachschraegen: 'DACHSCHRÄGEN verkleiden',
  sonstiges: 'ALLES zu Trockenbau',
};

const getDisplayConfig = ({ activePackageKey, item, type }) => {
  const key = `${type}:${item.id}`;
  const packageDisplay = positionDisplayByPackage[activePackageKey];

  if (packageDisplay?.[key]) {
    return packageDisplay[key];
  }

  return {
    group: type === 'package' ? 'TROCKENBAU | Basis-Haus' : 'Optionale Positionen',
    title: fallbackPositionTitles[item.id] ?? item.title,
  };
};

const renderPositionGroup = ({ title, children }) => {
  const rows = children.filter(Boolean);

  if (rows.length === 0) {
    return null;
  }

  return (
    <>
      <h3 className="calculator-config__positions-group">{title}</h3>
      {rows}
    </>
  );
};

function PositionActions({
  isLocked = false,
  isSelected,
  onAdd,
  onRemove,
  onReset,
}) {
  return (
    <span className="calculator-config__position-actions">
      <button
        className="calculator-config__position-action calculator-config__position-action--reset"
        type="button"
        disabled={isLocked}
        aria-label="Position zurücksetzen"
        title="Position zurücksetzen"
        onClick={onReset}
      >
        <RefreshCw size={17} strokeWidth={2.4} aria-hidden="true" />
      </button>
      <button
        className="calculator-config__position-action calculator-config__position-action--remove"
        type="button"
        disabled={isLocked || !isSelected}
        aria-label="Position entfernen"
        title="Position entfernen"
        onClick={onRemove}
      >
        <Trash2 size={17} strokeWidth={2.4} aria-hidden="true" />
      </button>
      <button
        className="calculator-config__position-action calculator-config__position-action--add"
        type="button"
        disabled={isLocked || isSelected}
        aria-label="Position hinzufügen"
        title="Position hinzufügen"
        onClick={onAdd}
      >
        <CopyPlus size={17} strokeWidth={2.4} aria-hidden="true" />
      </button>
    </span>
  );
}

function PositionRow({
  description,
  icon,
  isLocked = false,
  isSelected,
  onPriceChange,
  onQuantityChange,
  onResetQuantity,
  onToggle,
  priceValue,
  quantity,
  rowTotal,
  title,
  unit,
}) {
  const handleAdd = () => {
    if (!isSelected) {
      onToggle();
    }
  };
  const handleRemove = () => {
    if (isSelected) {
      onToggle();
    }
  };

  return (
    <div className={`calculator-config__position-row${isSelected ? ' is-selected' : ''}`}>
      <label className="calculator-config__position-select">
        <input
          type="checkbox"
          checked={isSelected}
          disabled={isLocked}
          onChange={onToggle}
        />
        <span className="calculator-config__position-check">
          <Check size={15} strokeWidth={2.6} aria-hidden="true" />
        </span>
      </label>
      <span className="calculator-config__position-name">
        <span className="calculator-config__position-thumb" aria-hidden="true">
          {icon}
        </span>
        <span
          className="calculator-config__position-info"
          title={description}
          aria-label={`Info: ${description}`}
        >
          <Info size={18} strokeWidth={2.2} aria-hidden="true" />
        </span>
        <span>
          <strong>{title}</strong>
          <em>{description}</em>
        </span>
      </span>
      <span className="calculator-config__position-quantity">
        <input
          type="number"
          min="0"
          step="0.1"
          value={quantity}
          aria-label={`Menge für ${title}`}
          onChange={(event) => onQuantityChange(event.target.value)}
        />
      </span>
      <span className="calculator-config__position-unit">{unit}</span>
      <span className="calculator-config__position-price">
        <input
          type="number"
          min="0"
          step="0.01"
          value={priceValue}
          aria-label={`Preis für ${title}`}
          onChange={(event) => onPriceChange(event.target.value)}
        />
      </span>
      <strong className="calculator-config__position-total">
        {formatCurrency(rowTotal)}
      </strong>
      <PositionActions
        isLocked={isLocked}
        isSelected={isSelected}
        onAdd={handleAdd}
        onRemove={handleRemove}
        onReset={onResetQuantity}
      />
    </div>
  );
}

function PositionSelectionTable({
  actions,
  activePackages,
  areaInput,
  areaSquareMeters,
  customAddOnPrices,
  customAddOnQuantities,
  customPackagePrices,
  selectedChoiceId,
  selectedAddOns,
  visibleAddOns,
}) {
  const activePackageKey = activePackages.length === 1 ? activePackages[0].id : null;
  const activeDisplayKey = positionDisplayByPackage[selectedChoiceId]
    ? selectedChoiceId
    : activePackageKey;
  const packageRows = activePackages.map((item) => {
    const unitPrice = parsePositiveNumber(customPackagePrices[item.id], item.unitPrice);
    const display = getDisplayConfig({ activePackageKey: activeDisplayKey, item, type: 'package' });

    return {
      group: display.group,
      node: (
        <PositionRow
          description={item.description}
          icon={<Wrench size={20} strokeWidth={2.2} />}
          isLocked
          isSelected
          key={item.id}
          onPriceChange={(value) => actions.updatePackagePrice(item.id, value)}
          onQuantityChange={actions.setAreaInput}
          onResetQuantity={() => actions.setAreaInput(String(areaSquareMeters))}
          onToggle={() => {}}
          priceValue={customPackagePrices[item.id]}
          quantity={areaInput}
          rowTotal={areaSquareMeters * unitPrice}
          title={display.title}
          unit={item.unit ?? 'm²'}
        />
      ),
    };
  });
  const addOnRows = visibleAddOns.map((item) => {
    const isSelected = selectedAddOns.includes(item.id);
    const unitPrice = parsePositiveNumber(customAddOnPrices[item.id], item.unitPrice);
    const quantity = getCustomLineQuantity({
      item,
      areaSquareMeters,
      customQuantities: customAddOnQuantities,
    });
    const display = getDisplayConfig({ activePackageKey: activeDisplayKey, item, type: 'addon' });

    return {
      group: display.group,
      node: (
        <PositionRow
          description={item.description}
          icon={<PackageOpen size={20} strokeWidth={2.1} />}
          isSelected={isSelected}
          key={item.id}
          onPriceChange={(value) => actions.updateAddOnPrice(item.id, value)}
          onQuantityChange={(value) => actions.updateAddOnQuantity(item.id, value)}
          onResetQuantity={() => {
            actions.updateAddOnQuantity(item.id, String(getLineQuantity(item, areaSquareMeters)));
            actions.updateAddOnPrice(item.id, String(item.unitPrice));
          }}
          onToggle={() => actions.toggleAddOn(item.id)}
          priceValue={customAddOnPrices[item.id]}
          quantity={customAddOnQuantities[item.id] ?? String(getLineQuantity(item, areaSquareMeters))}
          rowTotal={quantity * unitPrice}
          title={display.title}
          unit={getPriceUnitLabel(item)}
        />
      ),
    };
  });
  const allRows = [...packageRows, ...addOnRows];
  const groupTitles = activeDisplayKey === 'waende-verkleiden'
    ? [
      'Art der Ausführung',
      'Material',
      'Optionale Positionen',
      'TROCKENBAU | Basis-Haus',
    ]
    : activeDisplayKey === 'estrich'
      ? [
        'Art der Ausführung',
        'Material',
        'Extra Positionen',
      ]
    : activeDisplayKey === 'dachschraegen'
      ? [
        'Art der Ausführung',
        'Dämmung',
        'Beplankung',
        'Fenster',
        'Extras',
        'Optionen',
      ]
    : [
      'TROCKENBAU | Basis-Haus',
      'Material',
      'Extra Positionen',
      'Optionale Positionen',
    ];

  return (
    <fieldset className="calculator-config__group calculator-config__group--positions calculator-config__reveal">
      <legend>Positionen auswählen</legend>
      <div className="calculator-config__positions" aria-label="Leistungspositionen auswählen">
        <div className="calculator-config__positions-head" aria-hidden="true">
          <span />
          <span>Name</span>
          <span>Menge</span>
          <span>VPE</span>
          <span>Preis</span>
          <span>Gesamt</span>
          <span>Aktionen</span>
        </div>

        {groupTitles.map((title) => renderPositionGroup({
          title,
          children: allRows
            .filter((row) => row.group === title)
            .map((row) => row.node),
        }))}
      </div>
    </fieldset>
  );
}

export default PositionSelectionTable;
