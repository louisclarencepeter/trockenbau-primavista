import './ConfiguratorSection.scss';
import PositionSelectionTable from '../parts/PositionSelectionTable';
import SelectedOfferOverview from '../parts/SelectedOfferOverview';
import SummaryPanel from '../parts/SummaryPanel';
import { formatCurrency, formatSquareMeters } from '../utils/formatting';
import { getPriceUnitLabel, getServiceComponentKey } from '../utils/pricing';

function ConfiguratorSection({
  actions,
  isVisible,
  sectionRef,
  selection,
  state,
  summary,
  totals,
}) {
  const {
    customAddOnPrices,
    customAddOnQuantities,
    customPackagePrices,
    customServiceComponentPrices,
    isComponentBreakdownMode,
    selectedChoice,
    selectedAddOns,
    areaInput,
  } = state;
  const {
    activePackages,
    activePackageTitle,
    activeServiceComponentEntries,
    areaSquareMeters,
    displayedPackageUnitPrice,
    selectedAddOnItems,
    visibleAddOns,
  } = selection;
  const isCatalogMode = selectedChoice.id === 'alles';
  const componentGroups = activeServiceComponentEntries.reduce((groups, item) => {
    const groupTitle = item.catalogGroup ?? item.packageTitle;

    return {
      ...groups,
      [groupTitle]: [...(groups[groupTitle] ?? []), item],
    };
  }, {});

  return (
    <section
      className={`calculator-config section${isVisible ? ' calculator-config--visible' : ''}`}
      id="kalkulator-konfiguration"
      ref={sectionRef}
    >
      <div className="container calculator-config__stage">
        <div className="calculator-config__content">
          <SelectedOfferOverview
            activePackageTitle={activePackageTitle}
            areaInput={areaInput}
            areaSquareMeters={areaSquareMeters}
            displayedPackageUnitPrice={displayedPackageUnitPrice}
            onAreaChange={actions.setAreaInput}
            selectedChoice={selectedChoice}
            showPanel={false}
            totals={totals}
          />

          <div className="calculator-config__container">
            <div className="calculator-config__main">
              <div className="calculator-config__header calculator-config__reveal">
                <span className="calculator-config__eyebrow">Angebotsdetails</span>
                <h2>{isCatalogMode ? 'Einzelpreise und Varianten' : 'Fläche und Zusatzleistungen'}</h2>
                <p>
                  {isCatalogMode
                    ? 'Diese Übersicht listet die Standard-Leistungspakete und Materialoptionen. Die Gesamtsumme bleibt bei 0,00, weil die Positionen als Einzelpreis-Katalog geführt werden.'
                    : 'Passen Sie die Fläche an und wählen Sie gewünschte Zusatzleistungen. Die finale Offerte folgt nach Prüfung von Untergrund, Materialwahl und Ausführungsdetails.'}
                </p>
              </div>

              <fieldset className="calculator-config__group calculator-config__reveal">
                <legend>Fläche eingeben</legend>
                <div className="calculator-config__area-panel">
                  <label htmlFor="calculator-area">
                    Exakte Fläche
                    <span>
                      <input
                        id="calculator-area"
                        type="number"
                        min="1"
                        step="0.1"
                        value={areaInput}
                        onChange={(event) => actions.setAreaInput(event.target.value)}
                      />
                      <em>m²</em>
                    </span>
                  </label>
                  <div>
                    <strong>{formatCurrency(displayedPackageUnitPrice)} / m²</strong>
                    <small>
                      Wird mit {formatSquareMeters(areaSquareMeters)} multipliziert.
                      {isComponentBreakdownMode
                        ? ' Die Komponenten der gewählten Leistungen werden darunter einzeln berechnet.'
                        : ' Zusatzleistungen können darunter separat angepasst werden.'}
                    </small>
                  </div>
                </div>
              </fieldset>

            </div>

            {isComponentBreakdownMode ? (
              <fieldset className="calculator-config__group calculator-config__group--positions calculator-config__reveal">
                <legend>{isCatalogMode ? 'Varianten-Katalog' : 'Leistungspositionen'}</legend>
                <div className="calculator-config__components">
                  {Object.entries(componentGroups).map(([groupTitle, items]) => (
                    <div className="calculator-config__component-group" key={groupTitle}>
                      <h3 className="calculator-config__positions-group">{groupTitle}</h3>
                      {items.map((item) => (
                        <div className="calculator-config__component" key={`${item.packageId}-${item.id}`}>
                          <span className="calculator-config__component-content">
                            <strong>{item.catalogGroup ? item.title : `${item.packageTitle}: ${item.title}`}</strong>
                            <em>{item.description}</em>
                          </span>
                          <span className="calculator-config__addon-price">
                            <span>Preis / {getPriceUnitLabel(item)}</span>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={customServiceComponentPrices[getServiceComponentKey(item.packageId, item.id)]}
                              aria-label={`Eigener Preis für ${item.title}`}
                              onChange={(event) => actions.updateServiceComponentPrice(item.packageId, item.id, event.target.value)}
                            />
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </fieldset>
            ) : (
              <PositionSelectionTable
                actions={actions}
                activePackages={activePackages}
                areaInput={areaInput}
                areaSquareMeters={areaSquareMeters}
                customAddOnPrices={customAddOnPrices}
                customAddOnQuantities={customAddOnQuantities}
                customPackagePrices={customPackagePrices}
                selectedChoiceId={selectedChoice.id}
                selectedAddOns={selectedAddOns}
                visibleAddOns={visibleAddOns}
              />
            )}
          </div>
        </div>

        <SummaryPanel
          activePackageTitle={activePackageTitle}
          areaSquareMeters={areaSquareMeters}
          displayedPackageUnitPrice={displayedPackageUnitPrice}
          isComponentBreakdownMode={isComponentBreakdownMode}
          positionLines={isCatalogMode ? [] : summary.positionLines}
          selectedAddOnCount={selectedAddOnItems.length}
          totals={totals}
        />
      </div>
    </section>
  );
}

export default ConfiguratorSection;
