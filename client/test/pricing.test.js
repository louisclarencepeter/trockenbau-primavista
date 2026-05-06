import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parsePositiveNumber,
  roundCurrency,
  getCalculatorSelection,
  getCalculatorTotals,
} from '../src/components/Calculator/utils/pricing.js';

test('parsePositiveNumber handles comma decimals and rejects negatives', () => {
  assert.equal(parsePositiveNumber('12,5'), 12.5);
  assert.equal(parsePositiveNumber('12.5'), 12.5);
  assert.equal(parsePositiveNumber('-3', 99), 99);
  assert.equal(parsePositiveNumber('abc', 0), 0);
  assert.equal(parsePositiveNumber('', 7), 7);
});

test('roundCurrency rounds to 2 decimals', () => {
  assert.equal(roundCurrency(1.005), 1);
  assert.equal(roundCurrency(1.235), 1.24);
  assert.equal(roundCurrency(99.999), 100);
});

const fixturePackages = [
  { id: 'pkg-a', title: 'Trockenbau A', unitPrice: 100, materialRatio: 0.4 },
  { id: 'pkg-b', title: 'Trockenbau B', unitPrice: 150, materialRatio: 0.5 },
];

const fixtureAddOns = [
  {
    id: 'addon-1',
    title: 'Schalldämmung',
    unitPrice: 25,
    materialRatio: 0.6,
    pricingMode: 'area',
    quantityRatio: 1,
    appliesTo: ['pkg-a'],
  },
];

test('getCalculatorTotals computes net, vat, gross for area-priced package + addon', () => {
  const selection = getCalculatorSelection({
    packages: fixturePackages,
    addOns: fixtureAddOns,
    serviceComponents: {},
    selectedChoiceId: null,
    selectedPackageIds: ['pkg-a'],
    selectedAddOns: ['addon-1'],
    isComponentBreakdownMode: false,
    areaInput: '20',
    customPackagePrices: {},
    customServiceComponentPrices: {},
  });

  const totals = getCalculatorTotals({
    activePackages: selection.activePackages,
    activeServiceComponentEntries: selection.activeServiceComponentEntries,
    areaSquareMeters: selection.areaSquareMeters,
    selectedAddOnItems: selection.selectedAddOnItems,
    isComponentBreakdownMode: false,
    customPackagePrices: {},
    customAddOnPrices: {},
    customServiceComponentPrices: {},
    customAddOnQuantities: {},
    vatRate: 0.081,
  });

  // 20 m² * 100 = 2000 (package), 20 * 25 = 500 (addon) → net 2500
  assert.equal(totals.net, 2500);
  assert.equal(totals.packageNet, 2000);
  assert.equal(totals.addOnsNet, 500);
  // VAT 8.1% → 202.5
  assert.equal(totals.vat, 202.5);
  assert.equal(totals.gross, 2702.5);
  // Material share: 2000 * 0.4 + 500 * 0.6 = 800 + 300 = 1100
  assert.equal(totals.materialShare, 1100);
  assert.equal(totals.montageShare, 1400);
});

test('getCalculatorTotals falls back to first package when none selected', () => {
  const selection = getCalculatorSelection({
    packages: fixturePackages,
    addOns: [],
    serviceComponents: {},
    selectedChoiceId: null,
    selectedPackageIds: [],
    selectedAddOns: [],
    isComponentBreakdownMode: false,
    areaInput: '10',
    customPackagePrices: {},
    customServiceComponentPrices: {},
  });

  assert.equal(selection.activePackages.length, 1);
  assert.equal(selection.activePackages[0].id, 'pkg-a');
});

test('getCalculatorTotals respects custom package price overrides', () => {
  const selection = getCalculatorSelection({
    packages: fixturePackages,
    addOns: [],
    serviceComponents: {},
    selectedChoiceId: null,
    selectedPackageIds: ['pkg-a'],
    selectedAddOns: [],
    isComponentBreakdownMode: false,
    areaInput: '10',
    customPackagePrices: { 'pkg-a': '200' },
    customServiceComponentPrices: {},
  });

  const totals = getCalculatorTotals({
    activePackages: selection.activePackages,
    activeServiceComponentEntries: [],
    areaSquareMeters: selection.areaSquareMeters,
    selectedAddOnItems: [],
    isComponentBreakdownMode: false,
    customPackagePrices: { 'pkg-a': '200' },
    customAddOnPrices: {},
    customServiceComponentPrices: {},
    customAddOnQuantities: {},
    vatRate: 0,
  });

  assert.equal(totals.net, 2000);
});

test('getCalculatorTotals returns zero net for zero area', () => {
  const selection = getCalculatorSelection({
    packages: fixturePackages,
    addOns: [],
    serviceComponents: {},
    selectedChoiceId: null,
    selectedPackageIds: ['pkg-a'],
    selectedAddOns: [],
    isComponentBreakdownMode: false,
    areaInput: '0',
    customPackagePrices: {},
    customServiceComponentPrices: {},
  });

  const totals = getCalculatorTotals({
    activePackages: selection.activePackages,
    activeServiceComponentEntries: [],
    areaSquareMeters: selection.areaSquareMeters,
    selectedAddOnItems: [],
    isComponentBreakdownMode: false,
    customPackagePrices: {},
    customAddOnPrices: {},
    customServiceComponentPrices: {},
    customAddOnQuantities: {},
    vatRate: 0.081,
  });

  assert.equal(totals.net, 0);
  assert.equal(totals.vat, 0);
  assert.equal(totals.gross, 0);
});
