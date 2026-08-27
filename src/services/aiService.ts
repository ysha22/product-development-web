/**
 * AI Service – Google Gemini 기반 의약품 DD 보고서 자동 생성
 *
 * 전략:
 * - 보고서를 5개 청크로 나눠 순차 호출 (토큰 한도 대응)
 * - 각 청크는 독립적인 JSON Schema를 가짐
 * - 모든 응답은 ReportData 타입으로 병합
 * - 모델 폴백: gemini-3.6-flash → gemini-3.5-flash-lite
 */

import { GoogleGenAI } from '@google/genai';
import type {
  ReportData,
  Part1Overview,
  Part3Academic,
  Part4Clinical,
  Part5Market,
  Part6Patent,
  Part7Pricing,
  Part8Regulatory,
  Part10Conclusion,
  RiskPanel,
} from '../types';
import { DEMO_REPORT } from '../data/mockData';

export type ProgressStep =
  | 'searching'
  | 'product_info'
  | 'clinical'
  | 'market_patent'
  | 'financial'
  | 'conclusion'
  | 'done'
  | 'error';

export interface ProgressState {
  step: ProgressStep;
  label: string;
  percent: number;
  detail?: string;
}

const STEPS: Record<ProgressStep, { label: string; percent: number }> = {
  searching:    { label: '의약품 기본정보 조회 중…',        percent: 5  },
  product_info: { label: '제품정보 · 허가현황 분석 중…',    percent: 20 },
  clinical:     { label: '임상 데이터 · 학술정보 수집 중…', percent: 40 },
  market_patent:{ label: '시장조사 · 특허현황 분석 중…',    percent: 60 },
  financial:    { label: '약가 · 허가전략 · NPV 계산 중…',  percent: 80 },
  conclusion:   { label: '최종 개발의사결정 분석 중…',      percent: 93 },
  done:         { label: '보고서 생성 완료',                 percent: 100 },
  error:        { label: '오류 발생',                        percent: 0  },
};

/* ── 시스템 프롬프트 ── */
const SYSTEM_PROMPT = `You are a pharmaceutical drug development due diligence expert with deep knowledge of:
- Global and Korean drug regulatory affairs (FDA, EMA, MFDS)
- Clinical trial design and oncology/rare disease endpoints
- Patent strategy and FTO analysis
- Pharmaceutical market research and pricing (HIRA, NHIS)
- Drug development NPV modeling and risk assessment

Your task: Generate a comprehensive, structured JSON report for a given drug/INN name.
CRITICAL RULES:
1. Return ONLY valid JSON matching the exact schema provided. No markdown, no explanation.
2. Use REAL data when known (approvals, trial names, patent numbers, guideline positions).
3. Mark uncertain values with status: "estimate" or "assumption". Never fabricate specific numbers as "actual".
4. If data is truly unknown, use "Data unavailable" as the value string.
5. All dates must be in YYYY-MM-DD format.
6. Korean text is preferred for Korean-specific fields; English for global fields.
7. Numbers should be realistic and consistent (market sizes in USD millions, Korean market in 억원).`;

/* ── JSON 청크별 프롬프트 생성 ── */

function chunk1Prompt(query: string, devType: string): string {
  return `Drug query: "${query}" (development type: ${devType})

Return JSON for OVERVIEW and PRODUCT INFO sections:
{
  "innName": string,
  "brandName": string (most well-known brand, or "Unknown" if generic/biosimilar),
  "developer": string,
  "manufacturer": string,
  "pharmacologicalClass": string,
  "mechanismOfAction": string (detailed 2-3 sentences),
  "routeOfAdministration": string,
  "dosageForm": string,
  "strength": string,
  "firstApprovalCountry": string,
  "firstApprovalDate": "YYYY-MM-DD or unknown",
  "koreaApprovalDate": "YYYY-MM-DD or unknown",
  "approvedIndications": [string],
  "dosageAndAdministration": string,
  "pms": string,
  "reexaminationPeriod": string,
  "exclusivity": string,
  "patents": [string],
  "reimbursementStatus": string (Korean reimbursement status),
  "price": string (Korean reimbursement price if known),
  "competitors": [string],
  "part1": {
    "productSummary": string,
    "developmentBackground": string,
    "targetDisease": string,
    "currentTreatmentLimitations": [string, string, string],
    "developmentNecessity": string,
    "developmentObjective": string,
    "targetProductProfile": {
      "indication": string,
      "patientPopulation": string,
      "therapeuticLine": string,
      "administrationRoute": string,
      "dosingFrequency": string,
      "safetyProfile": string,
      "efficacyTarget": string
    },
    "developmentDirection": string,
    "whyThisProduct": [string, string, string, string]
  }
}`;
}

function chunk2Prompt(query: string, innName: string): string {
  return `Drug: "${query}" (INN: ${innName})

Return JSON for ACADEMIC INFO and CLINICAL DATA:
{
  "part3": {
    "diseaseOverview": {
      "definition": string,
      "prevalence": { "value": string, "status": "actual|estimate" },
      "incidence": { "value": string, "status": "actual|estimate" },
      "patientNumber": { "value": string, "status": "estimate" },
      "diseaseBurden": string,
      "mortalityRate": { "value": string, "status": "actual|estimate" },
      "marketSize": { "value": string, "status": "estimate" }
    },
    "mechanismOfAction": {
      "summary": string,
      "pathway": [string, string, string, string, string, string],
      "target": string,
      "drugEffect": string,
      "biologicalEffect": string,
      "clinicalOutcome": string
    },
    "standardOfCare": [
      {
        "line": "1L",
        "treatments": [string],
        "duration": string,
        "responseRate": string,
        "majorSideEffects": [string],
        "limitations": [string]
      }
    ],
    "guidelinePositions": [
      { "guideline": "NCCN|ESMO|ASCO|국내진료지침", "version": string, "recommendedLine": string, "recommendationGrade": string, "note": string, "sourceId": "src003" }
    ],
    "therapeuticPositioning": [
      { "name": string, "efficacy": number (1-10), "unmetNeed": number (1-10), "marketShare": number, "color": "#hexcolor" }
    ]
  },
  "part4": {
    "trials": [
      {
        "id": string,
        "studyName": string,
        "clinicalTrialsId": string,
        "phase": string,
        "design": string,
        "randomization": string,
        "blinding": string,
        "population": string,
        "sampleSize": number,
        "intervention": string,
        "comparator": string,
        "primaryEndpoint": string,
        "secondaryEndpoints": [string],
        "followUp": string,
        "endpoints": {
          "pfs": string|null,
          "os": string|null,
          "orr": string|null,
          "dor": string|null,
          "hr": string|null,
          "ci95": string|null,
          "pValue": string|null
        },
        "safety": {
          "grade3PlusAE": string|null,
          "sae": string|null,
          "discontinuation": string|null,
          "deathRate": string|null,
          "majorSafetySignals": [string]
        },
        "isPivotal": boolean,
        "reference": string (full citation),
        "doi": string|null,
        "pubmedUrl": string|null,
        "sourceId": "src002"
      }
    ],
    "competitorComparison": [
      { "productName": string, "orr": string|null, "medianPfs": string|null, "medianOs": string|null, "hr": string|null, "grade3PlusAE": string|null, "discontinuation": string|null, "studyName": string }
    ],
    "crossTrialWarning": true
  }
}`;
}

function chunk3Prompt(query: string, innName: string): string {
  return `Drug: "${query}" (INN: ${innName})

Return JSON for MARKET DATA and PATENT INFO:
{
  "part5": {
    "yearlyData": [
      { "year": number, "globalMarketSize": number (USD M), "koreaMarketSize": number (억KRW), "prescribedPatients": number, "marketShare": number (%), "salesRevenue": number (USD M), "isActual": boolean }
    ],
    "cagr5Year": number,
    "globalMarketLatest": { "value": number, "status": "actual|estimate" },
    "koreaMarketLatest": { "value": number, "status": "estimate" },
    "competitors": [
      { "name": string, "inn": string, "company": string, "sales": number, "marketShare": number, "patentExpiry": "YYYY-MM", "price": string, "efficacyScore": number (1-10), "priceScore": number (1-10), "marketSizeUSD": number }
    ],
    "treatmentCostAnnual": { "value": string, "status": "estimate" },
    "patientGrowthRate": { "value": number, "status": "estimate" },
    "majorCountryMarkets": [
      { "country": string, "size": string, "share": number }
    ]
  },
  "part6": {
    "patents": [
      {
        "id": string,
        "patentNo": string,
        "applicationNo": string,
        "applicant": string,
        "priorityDate": "YYYY-MM-DD",
        "filingDate": "YYYY-MM-DD",
        "grantDate": "YYYY-MM-DD",
        "expirationDate": "YYYY-MM-DD",
        "jurisdiction": "US|EU|KR|JP|CN",
        "patentType": "compound|composition|formulation|polymorph|salt|method_of_treatment|use_patent|manufacturing|combination|dosage_regimen",
        "status": "granted|pending|expired|abandoned",
        "keyClaims": [string],
        "riskLevel": "LOW|MODERATE|HIGH|CRITICAL",
        "riskNote": string
      }
    ],
    "ftoAnalysis": {
      "coreCompound": "LOW|MODERATE|HIGH|CRITICAL",
      "formulation": "LOW|MODERATE|HIGH|CRITICAL",
      "usePatent": "LOW|MODERATE|HIGH|CRITICAL",
      "combination": "LOW|MODERATE|HIGH|CRITICAL",
      "manufacturing": "LOW|MODERATE|HIGH|CRITICAL",
      "patentTerm": string,
      "spcPte": string,
      "litigationHistory": string,
      "orangeBookStatus": string,
      "koreaPatentStatus": string,
      "overallFTORisk": "LOW|MODERATE|HIGH|CRITICAL",
      "disclaimer": "본 FTO 분석은 예비적 스크리닝(Preliminary FTO Screening)으로, 실제 법적 효력이 있는 특허 의견서를 대체하지 않습니다."
    },
    "expectedLaunchYear": number
  }
}`;
}

function chunk4Prompt(query: string, innName: string, devType: string): string {
  return `Drug: "${query}" (INN: ${innName}, dev type: ${devType})

Return JSON for PRICING and REGULATORY STRATEGY:
{
  "part7": {
    "referencePrice": { "value": string, "status": "actual|estimate" },
    "sameClassPrice": { "value": string, "status": "actual|estimate" },
    "competitorPrices": [{ "name": string, "price": string }],
    "dailyCost": { "value": string, "status": "estimate" },
    "monthlyCost": { "value": string, "status": "estimate" },
    "annualCost": { "value": string, "status": "estimate" },
    "expectedReimbursementPrice": { "value": string, "status": "estimate|assumption" },
    "patientCopay": { "value": string, "status": "estimate" },
    "pricingLogic": [string, string, string, string, string],
    "scenarios": [
      { "name": "Conservative", "price": number, "patientNumber": number, "annualRevenue": number, "reimbursementRate": number, "npv": number },
      { "name": "Base",         "price": number, "patientNumber": number, "annualRevenue": number, "reimbursementRate": number, "npv": number },
      { "name": "Optimistic",   "price": number, "patientNumber": number, "annualRevenue": number, "reimbursementRate": number, "npv": number }
    ]
  },
  "part8": {
    "strategy": [
      { "item": string, "applicable": boolean, "detail": string, "status": string }
    ],
    "expectedApprovalDate": string,
    "bridgingRequired": boolean,
    "bridgingNote": string,
    "fastTrackOptions": [string],
    "riskMatrix": [
      { "category": "Clinical|Regulatory|CMC|Patent|Pricing|Market|Manufacturing|Commercial", "probability": number (1-5), "impact": number (1-5), "riskScore": number, "level": "LOW|MODERATE|HIGH|CRITICAL", "mitigation": string }
    ]
  }
}`;
}

function chunk5Prompt(query: string, innName: string): string {
  return `Drug: "${query}" (INN: ${innName})

Return JSON for FINANCIAL MODEL and CONCLUSION:
{
  "part9inputs": {
    "developmentCost": number (억KRW),
    "clinicalCost": number,
    "regulatoryCost": number,
    "cmcCost": number,
    "launchCost": number,
    "marketingCost": number,
    "manufacturingCostRatio": number (%),
    "expectedPrice": number (KRW per patient per year),
    "patientNumber": number,
    "marketShare": number (%),
    "grossMargin": number (%),
    "sgaRatio": number (%),
    "taxRate": number (%),
    "discountRate": number (%),
    "probabilityByStage": {
      "preclinical": number (0-1),
      "phase1": number,
      "phase2": number,
      "phase3": number,
      "nda": number,
      "launch": number
    },
    "launchYear": number
  },
  "part10": {
    "decision": "DEVELOP|CONDITIONAL_DEVELOP|HOLD|DO_NOT_DEVELOP",
    "decisionRationale": [string, string, string, string, string],
    "conditions": [string],
    "developmentScore": number (0-100),
    "scoreBreakdown": [
      { "category": string, "weight": number, "score": number (0-100), "weightedScore": number, "rationale": string }
    ],
    "executiveSummaryText": string (Korean, 3-4 sentences with specific numbers),
    "keyRisks": [string, string, string, string],
    "keyOpportunities": [string, string, string, string]
  },
  "riskPanel": {
    "overall": "LOW|MODERATE|HIGH|CRITICAL",
    "clinical": "LOW|MODERATE|HIGH|CRITICAL",
    "regulatory": "LOW|MODERATE|HIGH|CRITICAL",
    "patent": "LOW|MODERATE|HIGH|CRITICAL",
    "market": "LOW|MODERATE|HIGH|CRITICAL",
    "pricing": "LOW|MODERATE|HIGH|CRITICAL",
    "financial": "LOW|MODERATE|HIGH|CRITICAL"
  }
}`;
}

/* ── Gemini API 호출 (자동 폴백) ── */
const GEMINI_MODELS = ['gemini-3.6-flash', 'gemini-3.5-flash-lite'];

async function callGemini(
  apiKey: string,
  userPrompt: string,
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey });
  let lastError: Error = new Error('알 수 없는 오류');

  for (const model of GEMINI_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: `${SYSTEM_PROMPT}\n\n${userPrompt}`,
        config: {
          temperature: 0.2,
          maxOutputTokens: 8192,
          responseMimeType: 'application/json',
        },
      });

      const text = response.text;
      if (!text) throw new Error('Gemini API 응답이 비어있습니다.');
      return text;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      const msg = lastError.message;
      // 503(과부하) 또는 404(모델 없음)일 때만 다음 모델로 폴백
      const shouldFallback = msg.includes('503') || msg.includes('UNAVAILABLE')
        || msg.includes('404') || msg.includes('NOT_FOUND')
        || msg.includes('no longer available');
      if (!shouldFallback) throw lastError; // 인증 오류 등은 즉시 throw
      // 다음 모델 시도
    }
  }

  throw lastError;
}

function safeParseJSON(raw: string): Record<string, unknown> {
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    // GPT sometimes wraps in ```json … ```
    const match = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) return JSON.parse(match[1]) as Record<string, unknown>;
    throw new Error('AI 응답을 JSON으로 파싱할 수 없습니다.');
  }
}

/* ── NPV 연도별 데이터 계산 ── */
function buildNPVYearData(inputs: import('../types').NPVInputs) {
  const r = inputs.discountRate / 100;
  const totalDevCost = inputs.developmentCost + inputs.clinicalCost +
    inputs.regulatoryCost + inputs.cmcCost;
  const baseRevenue = (inputs.expectedPrice * inputs.patientNumber *
    (inputs.marketShare / 100)) / 1e8;

  const RAMPS = [0, 0.4, 0.7, 0.9, 1.0, 1.0];
  let cumFCF = 0;

  return RAMPS.map((ramp, idx) => {
    const calYear = inputs.launchYear - 1 + idx;
    const rev = idx === 0 ? 0 : baseRevenue * ramp;
    const cogs = -(rev * inputs.manufacturingCostRatio / 100);
    const sga  = -(rev * inputs.sgaRatio / 100);
    const devCostY = idx === 0 ? -(totalDevCost * 0.45)
      : idx === 1 ? -(inputs.launchCost + inputs.marketingCost * 0.5)
      : idx === 2 ? -(inputs.marketingCost * 0.3)
      : -(inputs.marketingCost * 0.1);
    const ebit = rev + cogs + sga + devCostY;
    const tax  = ebit > 0 ? -(ebit * inputs.taxRate / 100) : 0;
    const fcf  = ebit + tax;
    const discFcf = fcf / Math.pow(1 + r, idx);
    cumFCF += discFcf;

    return {
      year: `Year ${idx} (${calYear})`,
      revenue:        Math.round(rev),
      cogs:           Math.round(cogs),
      sga:            Math.round(sga),
      developmentCost:Math.round(devCostY),
      tax:            Math.round(tax),
      fcf:            Math.round(fcf),
      discountedFcf:  Math.round(discFcf),
      cumulativeFcf:  Math.round(cumFCF),
    };
  });
}

/* ── 메인 조회 함수 ── */
export async function fetchDrugReport(
  query: string,
  devType: string,
  apiKey: string,
  onProgress: (state: ProgressState) => void,
): Promise<ReportData> {

  const report: ReportData = JSON.parse(JSON.stringify(DEMO_REPORT)) as ReportData;
  report.id = `report-${Date.now()}`;
  report.createdAt = new Date().toISOString().slice(0, 10);
  report.updatedAt = new Date().toISOString().slice(0, 10);
  report.isDemoData = false;
  report.input.productName = query;
  report.input.innName = query;
  report.input.developmentType = devType as import('../types').DevelopmentType;

  /* ── Step 1: Product Info + Part1 ── */
  onProgress({ step: 'searching', ...STEPS.searching });
  await delay(300);
  onProgress({ step: 'product_info', ...STEPS.product_info, detail: '제품명·성분명·허가현황 분석' });

  const raw1 = await callGemini(apiKey, chunk1Prompt(query, devType));
  const d1 = safeParseJSON(raw1) as Record<string, unknown>;

  // Merge product info (Part2 = ProductInfo)
  const p2Fields = [
    'innName','brandName','developer','manufacturer',
    'pharmacologicalClass','mechanismOfAction','routeOfAdministration',
    'dosageForm','strength','firstApprovalCountry','firstApprovalDate',
    'koreaApprovalDate','approvedIndications','dosageAndAdministration',
    'pms','reexaminationPeriod','exclusivity','patents',
    'reimbursementStatus','price','competitors',
  ] as const;
  for (const f of p2Fields) {
    if (d1[f] !== undefined) {
      (report.part2 as unknown as Record<string, unknown>)[f] = d1[f];
    }
  }
  if (d1.part1) {
    report.part1 = { ...report.part1, ...(d1.part1 as Partial<Part1Overview>) };
  }
  // Sync input fields from AI
  if (d1.innName)    report.input.innName    = d1.innName as string;
  if (d1.brandName)  report.input.productName = d1.brandName as string;

  /* ── Step 2: Clinical + Academic ── */
  onProgress({ step: 'clinical', ...STEPS.clinical, detail: '임상시험 · 학술논문 · 진료지침' });
  const raw2 = await callGemini(apiKey, chunk2Prompt(query, report.input.innName));
  const d2 = safeParseJSON(raw2) as Record<string, unknown>;
  if (d2.part3) report.part3 = { ...report.part3, ...(d2.part3 as Partial<Part3Academic>) };
  if (d2.part4) report.part4 = { ...report.part4, ...(d2.part4 as Partial<Part4Clinical>) };

  /* ── Step 3: Market + Patent ── */
  onProgress({ step: 'market_patent', ...STEPS.market_patent, detail: '시장규모 · 경쟁제품 · 특허포트폴리오' });
  const raw3 = await callGemini(apiKey, chunk3Prompt(query, report.input.innName));
  const d3 = safeParseJSON(raw3) as Record<string, unknown>;
  if (d3.part5) report.part5 = { ...report.part5, ...(d3.part5 as Partial<Part5Market>) };
  if (d3.part6) {
    report.part6 = { ...report.part6, ...(d3.part6 as Partial<Part6Patent>) };
    report.part6.expectedLaunchYear = report.input.expectedLaunchYear;
  }

  /* ── Step 4: Pricing + Regulatory ── */
  onProgress({ step: 'financial', ...STEPS.financial, detail: '약가 · 허가전략 · 리스크 매트릭스' });
  const raw4 = await callGemini(apiKey, chunk4Prompt(query, report.input.innName, devType));
  const d4 = safeParseJSON(raw4) as Record<string, unknown>;
  if (d4.part7) report.part7 = { ...report.part7, ...(d4.part7 as Partial<Part7Pricing>) };
  if (d4.part8) report.part8 = { ...report.part8, ...(d4.part8 as Partial<Part8Regulatory>) };

  /* ── Step 5: Financial + Conclusion ── */
  onProgress({ step: 'conclusion', ...STEPS.conclusion, detail: 'NPV · 시나리오 · 개발의사결정' });
  const raw5 = await callGemini(apiKey, chunk5Prompt(query, report.input.innName));
  const d5 = safeParseJSON(raw5) as Record<string, unknown>;

  if (d5.part9inputs) {
    const inp = d5.part9inputs as import('../types').NPVInputs;    report.part9.inputs = { ...report.part9.inputs, ...inp };
    report.part9.yearlyData = buildNPVYearData(report.part9.inputs);
    const lastYear = report.part9.yearlyData[report.part9.yearlyData.length - 1];
    report.part9.npv = lastYear.cumulativeFcf;
    const pos = Object.values(report.part9.inputs.probabilityByStage)
      .reduce((a, v) => a * v, 1);
    report.part9.probabilityOfSuccess = pos;
    report.part9.riskAdjustedNpv = Math.round(report.part9.npv * pos);
    // break-even year
    const bep = report.part9.yearlyData.find((y, i) =>
      i > 0 && y.cumulativeFcf >= 0 &&
      report.part9.yearlyData[i - 1].cumulativeFcf < 0
    );
    report.part9.breakEvenYear = bep
      ? parseInt(bep.year.match(/\((\d+)\)/)?.[1] ?? '0')
      : null;
    // Rebuild scenarios
    report.part9.scenarios = buildScenarios(report.part9.inputs);
  }
  if (d5.part10) {
    report.part10 = { ...report.part10, ...(d5.part10 as Partial<Part10Conclusion>) };
  }
  if (d5.riskPanel) {
    report.riskPanel = { ...report.riskPanel, ...(d5.riskPanel as Partial<RiskPanel>) };
  }

  onProgress({ step: 'done', ...STEPS.done });
  return report;
}

function buildScenarios(inp: import('../types').NPVInputs): import('../types').ScenarioResult[] {
  const CFGS = [
    { name: 'Conservative' as const, sm: 0.65, pm: 0.88, cm: 1.2, yo: 1  },
    { name: 'Base'         as const, sm: 1.00, pm: 1.00, cm: 1.0, yo: 0  },
    { name: 'Optimistic'   as const, sm: 1.35, pm: 1.12, cm: 0.85,yo: -1 },
  ];
  return CFGS.map(cfg => {
    const si = { ...inp,
      marketShare:     inp.marketShare * cfg.sm,
      expectedPrice:   inp.expectedPrice * cfg.pm,
      developmentCost: inp.developmentCost * cfg.cm,
      launchYear:      inp.launchYear + cfg.yo,
    };
    const yd = buildNPVYearData(si);
    const npv = yd[yd.length - 1].cumulativeFcf;
    const pos = Object.values(si.probabilityByStage).reduce((a, v) => a * v, 1);
    const rev = (si.expectedPrice * si.patientNumber * si.marketShare / 100) / 1e8;
    const bep = yd.find((y, i) =>
      i > 0 && y.cumulativeFcf >= 0 && yd[i - 1].cumulativeFcf < 0
    );
    return {
      name: cfg.name,
      revenue: Math.round(rev),
      ebitda: Math.round(rev * (si.grossMargin / 100 - si.sgaRatio / 100)),
      npv,
      riskAdjustedNpv: Math.round(npv * pos),
      breakEvenYear: bep ? parseInt(bep.year.match(/\((\d+)\)/)?.[1] ?? '0') : null,
      marketShare: Math.round(si.marketShare),
      price: si.expectedPrice,
    };
  });
}

function delay(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}
