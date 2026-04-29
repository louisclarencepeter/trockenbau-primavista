export const parsePositiveNumber = (value, fallback = 0) => {
  const parsedValue = Number.parseFloat(String(value).replace(',', '.'));

  return Number.isFinite(parsedValue) && parsedValue >= 0 ? parsedValue : fallback;
};

export const roundCurrency = (value) => Math.round(value * 100) / 100;

export const createPriceMap = (items) =>
  items.reduce((priceMap, item) => ({
    ...priceMap,
    [item.id]: String(item.unitPrice),
  }), {});

export const getServiceComponentKey = (packageId, componentId) => `${packageId}:${componentId}`;

export const createServiceComponentPriceMap = (componentGroups) =>
  Object.entries(componentGroups).reduce((priceMap, [packageId, components]) => ({
    ...priceMap,
    ...components.reduce((componentPriceMap, component) => ({
      ...componentPriceMap,
      [getServiceComponentKey(packageId, component.id)]: String(component.unitPrice),
    }), {}),
  }), {});

export const getPriceUnitLabel = (item) => item.unit ?? (item.pricingMode === 'area' ? 'm²' : '');

export const getLineQuantity = (item, areaSquareMeters) => (
  item.pricingMode === 'catalog'
    ? 1
    : item.pricingMode === 'area'
    ? areaSquareMeters * (item.quantityRatio ?? 1)
    : item.defaultQuantity ?? 1
);

export const getCustomLineQuantity = ({
  item,
  areaSquareMeters,
  customQuantities,
}) => (
  parsePositiveNumber(customQuantities[item.id], getLineQuantity(item, areaSquareMeters))
);

export const getServiceComponentUnitPrice = ({
  packageId,
  serviceComponents,
  customServiceComponentPrices,
}) => (
  (serviceComponents[packageId] ?? []).reduce(
    (sum, component) => (
      sum + (component.catalogOnly ? 0 : parsePositiveNumber(
        customServiceComponentPrices[getServiceComponentKey(packageId, component.id)],
        component.unitPrice,
      ))
    ),
    0,
  )
);

export const getCalculatorSelection = ({
  packages,
  addOns,
  serviceComponents,
  selectedChoiceId,
  selectedPackageIds,
  selectedAddOns,
  isComponentBreakdownMode,
  areaInput,
  customPackagePrices,
  customServiceComponentPrices,
}) => {
  const selectedPackages = packages.filter((item) => selectedPackageIds.includes(item.id));
  const activePackages = selectedPackages.length > 0 ? selectedPackages : [packages[0]];
  const activePackageIds = activePackages.map((item) => item.id);
  const activePackageTitles = activePackages.map((item) => item.title);
  const activePackageTitle = selectedChoiceId === 'alles'
    ? 'Trockenbau & Innenausbau'
    : activePackageTitles.join(', ');
  const packageAddOns = addOns.filter((addOn) => (
    addOn.appliesTo.some((packageId) => activePackageIds.includes(packageId))
    && (!addOn.appliesToChoices || addOn.appliesToChoices.includes(selectedChoiceId))
  ));
  const visibleAddOns = isComponentBreakdownMode ? [] : packageAddOns;
  const activeServiceComponentEntries = activePackages.flatMap((packageItem) => (
    (serviceComponents[packageItem.id] ?? []).map((component) => ({
      ...component,
      packageId: packageItem.id,
      packageTitle: packageItem.title,
    }))
  ));
  const areaSquareMeters = parsePositiveNumber(areaInput);
  const selectedPackagesUnitPrice = activePackages.reduce(
    (sum, packageItem) => (
      sum + parsePositiveNumber(customPackagePrices[packageItem.id], packageItem.unitPrice)
    ),
    0,
  );
  const serviceComponentUnitPrice = activePackageIds.reduce(
    (sum, packageId) => sum + getServiceComponentUnitPrice({
      packageId,
      serviceComponents,
      customServiceComponentPrices,
    }),
    0,
  );
  const displayedPackageUnitPrice = isComponentBreakdownMode
    ? serviceComponentUnitPrice
    : selectedPackagesUnitPrice;
  const selectedAddOnItems = visibleAddOns.filter((addOn) => selectedAddOns.includes(addOn.id));

  return {
    activePackages,
    activePackageIds,
    activePackageTitle,
    activeServiceComponentEntries,
    areaSquareMeters,
    displayedPackageUnitPrice,
    selectedAddOnItems,
    visibleAddOns,
  };
};

export const getCalculatorTotals = ({
  activePackages,
  activeServiceComponentEntries,
  areaSquareMeters,
  selectedAddOnItems,
  isComponentBreakdownMode,
  customPackagePrices,
  customAddOnPrices,
  customServiceComponentPrices,
  customAddOnQuantities,
  vatRate,
}) => {
  const packageLines = isComponentBreakdownMode
    ? activeServiceComponentEntries.map((component) => {
      const unitPrice = parsePositiveNumber(
        customServiceComponentPrices[getServiceComponentKey(component.packageId, component.id)],
        component.unitPrice,
      );
      const quantity = getLineQuantity(component, areaSquareMeters);

      return {
        id: `service-component-${component.packageId}-${component.id}`,
        title: `${component.packageTitle}: ${component.title}`,
        quantity,
        unit: component.unit,
        unitPrice,
        materialRatio: component.materialRatio,
        net: component.catalogOnly ? 0 : quantity * unitPrice,
        catalogOnly: component.catalogOnly,
      };
    })
    : activePackages.map((packageItem) => {
      const unitPrice = parsePositiveNumber(
        customPackagePrices[packageItem.id],
        packageItem.unitPrice,
      );

      return {
        id: `package-${packageItem.id}`,
        title: packageItem.title,
        quantity: areaSquareMeters,
        unit: 'm²',
        unitPrice,
        materialRatio: packageItem.materialRatio,
        net: areaSquareMeters * unitPrice,
      };
    });
  const addOnLines = selectedAddOnItems.map((addOn) => {
    const unitPrice = parsePositiveNumber(customAddOnPrices[addOn.id], addOn.unitPrice);
    const quantity = getCustomLineQuantity({
      item: addOn,
      areaSquareMeters,
      customQuantities: customAddOnQuantities,
    });

    return {
      id: `addon-${addOn.id}`,
      title: addOn.title,
      quantity,
      unit: addOn.unit,
      unitPrice,
      materialRatio: addOn.materialRatio,
      net: quantity * unitPrice,
    };
  });
  const packageNet = packageLines.reduce((sum, line) => sum + line.net, 0);
  const addOnsNet = addOnLines.reduce((sum, line) => sum + line.net, 0);
  const rawNet = packageNet + addOnsNet;
  const net = roundCurrency(rawNet);
  const materialShare = roundCurrency(
    packageLines.reduce((sum, line) => sum + line.net * line.materialRatio, 0)
    + addOnLines.reduce((sum, line) => sum + line.net * line.materialRatio, 0),
  );
  const montageShare = roundCurrency(net - materialShare);
  const vat = roundCurrency(net * vatRate);

  return {
    packageLines,
    addOnLines,
    packageNet: roundCurrency(packageNet),
    addOnsNet: roundCurrency(addOnsNet),
    materialShare,
    montageShare,
    net,
    vat,
    gross: roundCurrency(net + vat),
  };
};
