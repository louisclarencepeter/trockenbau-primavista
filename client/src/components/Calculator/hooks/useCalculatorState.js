import { useMemo, useState } from 'react';
import {
  addOns,
  calculatorChoices,
  defaultAreaSquareMeters,
  packages,
  serviceComponents,
  vatRate,
} from '../data/calculatorCatalog';
import {
  createPriceMap,
  createServiceComponentPriceMap,
  getCalculatorSelection,
  getCalculatorTotals,
  getServiceComponentKey,
  getServiceComponentUnitPrice as getServiceComponentUnitPriceValue,
} from '../utils/pricing';
import { formatCurrency, formatNumber, formatSquareMeters } from '../utils/formatting';

function useCalculatorState() {
  const [selectedPackageIds, setSelectedPackageIds] = useState([packages[0].id]);
  const [isComponentBreakdownMode, setIsComponentBreakdownMode] = useState(false);
  const [areaInput, setAreaInput] = useState(defaultAreaSquareMeters);
  const [customPackagePrices, setCustomPackagePrices] = useState(() => createPriceMap(packages));
  const [customAddOnPrices, setCustomAddOnPrices] = useState(() => createPriceMap(addOns));
  const [customAddOnQuantities, setCustomAddOnQuantities] = useState({});
  const [customServiceComponentPrices, setCustomServiceComponentPrices] = useState(() =>
    createServiceComponentPriceMap(serviceComponents),
  );
  const [selectedChoice, setSelectedChoice] = useState(calculatorChoices[0]);
  const [selectedAddOns, setSelectedAddOns] = useState(() =>
    addOns
      .filter((addOn) => addOn.defaultSelected)
      .map((addOn) => addOn.id),
  );

  const selection = useMemo(() => (
    getCalculatorSelection({
      packages,
      addOns,
      serviceComponents,
      selectedChoiceId: selectedChoice.id,
      selectedPackageIds,
      selectedAddOns,
      isComponentBreakdownMode,
      areaInput,
      customPackagePrices,
      customServiceComponentPrices,
    })
  ), [
    areaInput,
    customPackagePrices,
    customServiceComponentPrices,
    isComponentBreakdownMode,
    selectedAddOns,
    selectedChoice.id,
    selectedPackageIds,
  ]);

  const totals = useMemo(() => (
    getCalculatorTotals({
      activePackages: selection.activePackages,
      activeServiceComponentEntries: selection.activeServiceComponentEntries,
      areaSquareMeters: selection.areaSquareMeters,
      selectedAddOnItems: selection.selectedAddOnItems,
      isComponentBreakdownMode,
      customPackagePrices,
      customAddOnPrices,
      customAddOnQuantities,
      customServiceComponentPrices,
      vatRate,
    })
  ), [
    customAddOnQuantities,
    customAddOnPrices,
    customPackagePrices,
    customServiceComponentPrices,
    isComponentBreakdownMode,
    selection.activePackages,
    selection.activeServiceComponentEntries,
    selection.areaSquareMeters,
    selection.selectedAddOnItems,
  ]);

  const selectedAddOnTitles = selection.selectedAddOnItems.map((item) => item.title);
  const positionLines = [...totals.packageLines, ...totals.addOnLines];
  const lineItemSummary = positionLines
    .map((line) => (
      `${line.title}: ${formatNumber(line.quantity)} ${line.unit} x ${formatCurrency(line.unitPrice)}`
    ))
    .join(' | ');
  const summaryText = [
    `Pakete: ${selection.activePackageTitle}`,
    `Fläche: ${formatSquareMeters(selection.areaSquareMeters)}`,
    `Leistungspreis: ${formatCurrency(selection.displayedPackageUnitPrice)} / m²`,
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

  const togglePackage = (id) => {
    setSelectedPackageIds((currentIds) => {
      if (currentIds.includes(id)) {
        return currentIds.length > 1
          ? currentIds.filter((currentId) => currentId !== id)
          : currentIds;
      }

      return packages
        .map((item) => item.id)
        .filter((packageId) => [...currentIds, id].includes(packageId));
    });
  };

  const updatePackagePrice = (id, value) => {
    setCustomPackagePrices((currentPrices) => ({
      ...currentPrices,
      [id]: value,
    }));
  };

  const updateAddOnPrice = (id, value) => {
    setCustomAddOnPrices((currentPrices) => ({
      ...currentPrices,
      [id]: value,
    }));
  };

  const updateAddOnQuantity = (id, value) => {
    setCustomAddOnQuantities((currentQuantities) => ({
      ...currentQuantities,
      [id]: value,
    }));
  };

  const updateServiceComponentPrice = (packageId, componentId, value) => {
    setCustomServiceComponentPrices((currentPrices) => ({
      ...currentPrices,
      [getServiceComponentKey(packageId, componentId)]: value,
    }));
  };

  const selectChoice = (choice) => {
    setSelectedChoice(choice);
    setSelectedPackageIds(choice.packageIds);
    setIsComponentBreakdownMode(choice.id === 'alles');

    setSelectedAddOns((currentIds) => {
      const nextChoiceAddOns = choice.addOnIds ?? [];
      const nonChoiceAddOns = currentIds.filter((id) => {
        const addOn = addOns.find((item) => item.id === id);

        return !addOn?.appliesToChoices;
      });

      return Array.from(new Set([...nonChoiceAddOns, ...nextChoiceAddOns]));
    });

    if (choice.defaultAreaInput) {
      setAreaInput(choice.defaultAreaInput);
    }
  };

  const switchMode = (nextMode) => {
    setIsComponentBreakdownMode(nextMode === 'components');
  };

  const getServiceComponentUnitPrice = (packageId) => (
    getServiceComponentUnitPriceValue({
      packageId,
      serviceComponents,
      customServiceComponentPrices,
    })
  );

  return {
    state: {
      areaInput,
      customAddOnQuantities,
      customAddOnPrices,
      customPackagePrices,
      customServiceComponentPrices,
      isComponentBreakdownMode,
      selectedChoice,
      selectedAddOns,
    },
    selection,
    totals,
    summary: {
      lineItemSummary,
      positionLines,
      selectedAddOnTitles,
      summaryText,
    },
    actions: {
      getServiceComponentUnitPrice,
      selectChoice,
      setAreaInput,
      switchMode,
      toggleAddOn,
      togglePackage,
      updateAddOnQuantity,
      updateAddOnPrice,
      updatePackagePrice,
      updateServiceComponentPrice,
    },
  };
}

export default useCalculatorState;
