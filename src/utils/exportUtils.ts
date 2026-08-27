import type { ReportData } from '../types';

/* ── PDF Export (window.print approach – no external PDF libs needed) ── */
export function exportPDF() {
  window.print();
}

/* ── Excel Export via xlsx ── */
export async function exportExcel(report: ReportData) {
  const XLSX = await import('xlsx');

  const wb = XLSX.utils.book_new();

  /* Sheet 1: Executive Summary */
  const execRows = [
    ['Product Development Due Diligence Report'],
    ['Product:', report.input.productName],
    ['INN:', report.input.innName],
    ['Indication:', report.input.indication],
    ['Created:', report.createdAt],
    ['DEMO DATA:', report.isDemoData ? 'YES' : 'NO'],
    [],
    ['FINAL DECISION:', report.part10.decision],
    ['Development Score:', report.part10.developmentScore],
    ['NPV (Base):', `₩${report.part9.npv.toLocaleString()}억`],
    ['Risk-Adjusted NPV:', `₩${report.part9.riskAdjustedNpv.toLocaleString()}억`],
    ['IRR:', report.part9.irr ? `${report.part9.irr}%` : 'N/A'],
    ['Break-even Year:', report.part9.breakEvenYear ?? 'N/A'],
  ];
  const ws1 = XLSX.utils.aoa_to_sheet(execRows);
  XLSX.utils.book_append_sheet(wb, ws1, 'Executive Summary');

  /* Sheet 2: NPV Model */
  const npvHeader = ['Year', 'Revenue', 'COGS', 'SG&A', 'Dev Cost', 'Tax', 'FCF', 'Discounted FCF', 'Cumulative FCF'];
  const npvRows = [npvHeader, ...report.part9.yearlyData.map(y => [
    y.year, y.revenue, y.cogs, y.sga, y.developmentCost, y.tax, y.fcf, y.discountedFcf, y.cumulativeFcf
  ])];
  const ws2 = XLSX.utils.aoa_to_sheet(npvRows);
  XLSX.utils.book_append_sheet(wb, ws2, 'NPV Model');

  /* Sheet 3: Market Data */
  const mktHeader = ['Year', 'Global Market ($M)', 'Korea Market (억₩)', 'Patients', 'Market Share (%)', 'Actual/Forecast'];
  const mktRows = [mktHeader, ...report.part5.yearlyData.map(d => [
    d.year, d.globalMarketSize, d.koreaMarketSize, d.prescribedPatients, d.marketShare,
    d.isActual ? 'Actual' : 'Forecast'
  ])];
  const ws3 = XLSX.utils.aoa_to_sheet(mktRows);
  XLSX.utils.book_append_sheet(wb, ws3, 'Market Data');

  /* Sheet 4: Patent */
  const patHeader = ['Patent No.', 'Type', 'Jurisdiction', 'Priority Date', 'Grant Date', 'Expiration', 'Status', 'Risk'];
  const patRows = [patHeader, ...report.part6.patents.map(p => [
    p.patentNo, p.patentType, p.jurisdiction, p.priorityDate, p.grantDate, p.expirationDate, p.status, p.riskLevel
  ])];
  const ws4 = XLSX.utils.aoa_to_sheet(patRows);
  XLSX.utils.book_append_sheet(wb, ws4, 'Patents');

  /* Sheet 5: Scenarios */
  const scnHeader = ['Scenario', 'Revenue (억)', 'EBITDA (억)', 'NPV (억)', 'RA-NPV (억)', 'BEP Year', 'Market Share (%)', 'Price (원)'];
  const scnRows = [scnHeader, ...report.part9.scenarios.map(s => [
    s.name, s.revenue, s.ebitda, s.npv, s.riskAdjustedNpv, s.breakEvenYear ?? 'N/A', s.marketShare, s.price
  ])];
  const ws5 = XLSX.utils.aoa_to_sheet(scnRows);
  XLSX.utils.book_append_sheet(wb, ws5, 'Scenarios');

  /* Sheet 6: Clinical */
  const clinHeader = ['Study', 'Phase', 'n', 'PFS', 'OS', 'ORR', 'HR', 'p-value', 'Grade≥3 AE'];
  const clinRows = [clinHeader, ...report.part4.trials.map(t => [
    t.studyName, t.phase, t.sampleSize,
    t.endpoints.pfs ?? 'N/A', t.endpoints.os ?? 'N/A', t.endpoints.orr ?? 'N/A',
    t.endpoints.hr ?? 'N/A', t.endpoints.pValue ?? 'N/A', t.safety.grade3PlusAE ?? 'N/A'
  ])];
  const ws6 = XLSX.utils.aoa_to_sheet(clinRows);
  XLSX.utils.book_append_sheet(wb, ws6, 'Clinical Data');

  /* Download */
  const filename = `PharmaDD_${report.input.innName}_${report.createdAt}.xlsx`;
  XLSX.writeFile(wb, filename);
}
