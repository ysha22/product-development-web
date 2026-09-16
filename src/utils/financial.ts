import type { NPVInputs, NPVYearData, ScenarioResult, SensitivityItem, Part9Financial } from '../types';

function calcOverallPoS(p: NPVInputs['probabilityByStage']): number {
  return Object.values(p).reduce((acc, v) => acc * v, 1);
}

function calcRevenue(inputs: NPVInputs): number {
  return (inputs.expectedPrice * inputs.patientNumber * (inputs.marketShare / 100)) / 1e8;
}

function calcNPVYearData(inputs: NPVInputs, valuationYear: number): NPVYearData[] {
  const launchYear = inputs.launchYear;
  const years = ['Year 0', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];
  const r = inputs.discountRate / 100;
  const totalDevCost = inputs.developmentCost + inputs.clinicalCost + inputs.regulatoryCost + inputs.cmcCost;

  let cumFCF = 0;
  return years.map((y, idx) => {
    const calYear = launchYear - 1 + idx;
    const rampUp = idx === 0 ? 0 : idx === 1 ? 0.4 : idx === 2 ? 0.7 : idx === 3 ? 0.9 : 1.0;
    const baseRevenue = idx === 0 ? 0 : calcRevenue(inputs) * rampUp;
    const cogs = baseRevenue * ((100 - inputs.grossMargin) / 100) * -1;
    const sga = baseRevenue * (inputs.sgaRatio / 100) * -1;
    const devCostY = idx === 0 ? -totalDevCost : idx === 1 ? -(inputs.launchCost + inputs.marketingCost * 0.5) : idx === 2 ? -(inputs.marketingCost * 0.2) : -(inputs.marketingCost * 0.1);
    const ebit = baseRevenue + cogs + sga + devCostY;
    const tax = ebit > 0 ? -(ebit * (inputs.taxRate / 100)) : 0;
    const fcf = ebit + tax;
    const discountedFcf = fcf / Math.pow(1 + r, calYear - valuationYear);
    cumFCF += discountedFcf;

    return {
      year: `${y} (${calYear})`,
      revenue: Math.round(baseRevenue),
      cogs: Math.round(cogs),
      sga: Math.round(sga),
      developmentCost: Math.round(devCostY),
      tax: Math.round(tax),
      fcf: Math.round(fcf),
      discountedFcf: Math.round(discountedFcf),
      cumulativeFcf: Math.round(cumFCF),
    };
  });
}

function calcNPV(yearData: NPVYearData[]): number {
  return yearData[yearData.length - 1].cumulativeFcf;
}

function calcBreakEven(yearData: NPVYearData[]): number | null {
  for (let i = 1; i < yearData.length; i++) {
    if (yearData[i].cumulativeFcf >= 0 && yearData[i - 1].cumulativeFcf < 0) {
      return parseInt(yearData[i].year.match(/\((\d+)\)/)?.[1] ?? '0');
    }
  }
  return null;
}

function calcScenarios(baseInputs: NPVInputs, valuationYear: number): ScenarioResult[] {
  const configs: { name: ScenarioResult['name']; shareMult: number; priceMult: number; costMult: number; yearOffset: number }[] = [
    { name: 'Conservative', shareMult: 0.65, priceMult: 0.88, costMult: 1.2, yearOffset: 1 },
    { name: 'Base',         shareMult: 1.00, priceMult: 1.00, costMult: 1.0, yearOffset: 0 },
    { name: 'Optimistic',   shareMult: 1.35, priceMult: 1.12, costMult: 0.85, yearOffset: -1 },
  ];

  return configs.map(cfg => {
    const inp: NPVInputs = {
      ...baseInputs,
      marketShare: Math.min(100, baseInputs.marketShare * cfg.shareMult),
      expectedPrice: baseInputs.expectedPrice * cfg.priceMult,
      developmentCost: baseInputs.developmentCost * cfg.costMult,
      launchYear: baseInputs.launchYear + cfg.yearOffset,
    };
    const yearData = calcNPVYearData(inp, valuationYear);
    const npv = calcNPV(yearData);
    const pos = calcOverallPoS(inp.probabilityByStage);
    const revenue = calcRevenue(inp);
    const ebitda = Math.round(revenue * (inp.grossMargin / 100 - inp.sgaRatio / 100));

    return {
      name: cfg.name,
      revenue: Math.round(revenue),
      ebitda,
      npv,
      riskAdjustedNpv: Math.round(npv * pos),
      breakEvenYear: calcBreakEven(yearData),
      marketShare: Math.round(inp.marketShare),
      price: inp.expectedPrice,
    };
  });
}

function calcSensitivity(baseInputs: NPVInputs, baseNPV: number, valuationYear: number): SensitivityItem[] {
  const variables: { key: keyof NPVInputs; label: string; delta: number }[] = [
    { key: 'expectedPrice',    label: 'Drug Price',            delta: 0.2 },
    { key: 'patientNumber',    label: 'Patient Number',        delta: 0.2 },
    { key: 'marketShare',      label: 'Market Share',          delta: 0.2 },
    { key: 'grossMargin',      label: 'Gross Margin',          delta: 0.15 },
    { key: 'developmentCost',  label: 'Development Cost',      delta: 0.3 },
    { key: 'discountRate',     label: 'Discount Rate',         delta: 0.3 },
    { key: 'launchYear',       label: 'Launch Year',           delta: 0 },
  ];

  return variables.map(({ key, label, delta }) => {
    const base = baseInputs[key] as number;
    const lowVal = key === 'launchYear' ? base + 2 : base * (1 - delta);
    const highVal = key === 'launchYear' ? base - 2 : base * (1 + delta);

    const lowInputs = { ...baseInputs, [key]: lowVal };
    const highInputs = { ...baseInputs, [key]: highVal };

    const lowNPV = calcNPV(calcNPVYearData(normalizeInputs(lowInputs), valuationYear));
    const highNPV = calcNPV(calcNPVYearData(normalizeInputs(highInputs), valuationYear));

    return {
      variable: label,
      low: Math.round(lowNPV - baseNPV),
      base: 0,
      high: Math.round(highNPV - baseNPV),
      impact: Math.round(Math.abs(highNPV - lowNPV)),
    };
  });
}


export function normalizeInputs(inputs: NPVInputs): NPVInputs {
  const out = structuredClone(inputs);
  for (const [key, value] of Object.entries(out)) {
    if (key === 'probabilityByStage') continue;
    if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error('재무 입력값은 유한한 숫자여야 합니다.');
    (out as unknown as Record<string, unknown>)[key] = Math.max(0, value);
  }
  for (const key of ['marketShare','grossMargin','sgaRatio','taxRate','manufacturingCostRatio'] as const) out[key] = Math.min(100,out[key]);
  out.launchYear = Math.min(2200, Math.max(1900, Math.round(out.launchYear)));
  out.manufacturingCostRatio = 100 - out.grossMargin;
  for (const key of Object.keys(out.probabilityByStage) as (keyof NPVInputs['probabilityByStage'])[]) {
    const v = out.probabilityByStage[key];
    if (!Number.isFinite(v)) throw new Error('성공확률은 유한한 숫자여야 합니다.');
    out.probabilityByStage[key] = Math.max(0,Math.min(1,v));
  }
  return out;
}

// All values are 억 KRW; full development spend in launchYear - 1.
// Marketing allocation over five selling years: 50%, 20%, 10%, 10%, 10%.
export function calculateFinancial(raw: NPVInputs, valuationYear = new Date().getFullYear()): Part9Financial {
  const inputs = normalizeInputs(raw);
  const yearlyData = calcNPVYearData(inputs, valuationYear);
  const npv = calcNPV(yearlyData);
  const pos = calcOverallPoS(inputs.probabilityByStage);
  return { inputs, yearlyData, npv, riskAdjustedNpv: Math.round(npv * pos),
    probabilityOfSuccess: pos, breakEvenYear: calcBreakEven(yearlyData),
    scenarios: calcScenarios(inputs, valuationYear), sensitivityItems: calcSensitivity(inputs,npv,valuationYear) };
}
