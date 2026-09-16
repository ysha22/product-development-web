/**
 * AI Service – GPT / Claude / Gemini 기반 의약품 DD 보고서 자동 생성
 *
 * 전략:
 * - 보고서를 5개 청크로 나눠 순차 호출 (토큰 한도 대응)
 * - 각 청크는 독립적인 JSON Schema를 가짐
 * - 모든 응답은 ReportData 타입으로 병합
 * - 사용자가 확인한 제공사와 모델로만 호출
 */

import { callProvider, PROVIDERS, type AISettings } from './providers';
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
  Part11References,
  RiskPanel,
} from '../types';
import { calculateFinancial } from '../utils/financial';
import { parseChunk, validate } from './validation';
import type { ProductInfo, NPVInputs, DevelopmentType } from '../types';

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
7. Do not claim verification or invent sources. Unknown lists must be empty.
8. Numbers should be realistic and consistent (market sizes in USD millions, Korean market in 억원).`;

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
        "sourceId": "src002",
        "refIds": [number] (Part11 레퍼런스 번호 목록. 이 임상시험에 해당하는 Part11 references의 id값을 배열로)
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
        "riskNote": string,
        "refIds": [number] (Part11 레퍼런스 번호 목록. 이 특허에 해당하는 Part11 references의 id값을 배열로)
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
  },
  "part11": {
    "references": [
      {
        "id": number (1부터 순번),
        "category": "clinical|regulatory|patent|market|guideline|academic|financial|other",
        "title": string (한글 제목 우선. 글로벌 문헌은 한글 번역 제목을 먼저 쓰고, 필요하면 괄호 안에 원제 영문 병기. 국내 문헌은 한글만),
        "authors": string (저자명 또는 기관명),
        "source": string (저널명 / 가이드라인 발행기관 / 특허청 등),
        "year": string (발행연도 "YYYY"),
        "url": string|null (PubMed, USPTO, KIPRIS, FDA, MFDS, HIRA 등 원문 링크),
        "doi": string|null,
        "note": string|null (보충 설명 필요 시)
      }
    ]
  }
}`;
}

export interface ReportCheckpoint {
  query: string;
  devType: string;
  chunks: Record<string, unknown>[];
  provider?: string;
  model?: string;
}

// The caller owns the checkpoint; no API key or report is persisted to disk.
export async function fetchDrugReport(
  query: string,
  devType: DevelopmentType,
  apiKey: string,
  onProgress: (state: ProgressState) => void,
  checkpoint: ReportCheckpoint = { query, devType, chunks: [] },
  settings: AISettings = {provider:'gemini', model:PROVIDERS.gemini.model, apiKey},
): Promise<ReportData> {
  if (checkpoint.query !== query || checkpoint.devType !== devType ||
      (checkpoint.provider !== undefined && (checkpoint.provider !== settings.provider || checkpoint.model !== settings.model))) {
    checkpoint.query = query;
    checkpoint.devType = devType;
    checkpoint.chunks = [];
  }
  checkpoint.provider=settings.provider; checkpoint.model=settings.model;
  const chunks = checkpoint.chunks;
  async function step(index: number, progress: ProgressStep, prompt: string, verify: (d: Record<string, unknown>) => void) {
    onProgress({ step: progress, ...STEPS[progress], detail: chunks[index] ? '완료된 단계 재사용' : undefined });
    const data = chunks[index] ?? parseChunk(await callProvider(settings, SYSTEM_PROMPT, prompt));
    verify(data);
    chunks[index] = data;
    return data;
  }
  const d1 = await step(0,'product_info',chunk1Prompt(query,devType), d => {
    validate('ProductInfo',d); validate('Part1Overview',d.part1);
  });
  const part2 = validate<ProductInfo>('ProductInfo',d1);
  const part1 = validate<Part1Overview>('Part1Overview',d1.part1);
  const d2 = await step(1,'clinical',chunk2Prompt(query,part2.innName), d => {
    validate('Part3Academic',d.part3); validate('Part4Clinical',d.part4);
  });
  const d3 = await step(2,'market_patent',chunk3Prompt(query,part2.innName), d => {
    validate('Part5Market',d.part5); validate('Part6Patent',d.part6);
  });
  const d4 = await step(3,'financial',chunk4Prompt(query,part2.innName,devType), d => {
    validate('Part7Pricing',d.part7); validate('Part8Regulatory',d.part8);
  });
  const context = JSON.stringify({developmentType:devType,overview:d1,clinical:d2,market:d3,pricing:d4});
  const d5 = await step(4,'conclusion',chunk5Prompt(query,part2.innName) +
    '\nUse the preceding draft sections as context: ' + context +
    '\nDo not state exact NPV or IRR in narrative: the app calculates financial results separately. References are unverified suggestions. Use grossMargin as the authoritative margin and manufacturingCostRatio = 100 - grossMargin.', d => {
      validate('NPVInputs',d.part9inputs); validate('Part10Conclusion',d.part10);
      validate('RiskPanel',d.riskPanel); validate('Part11References',d.part11);
    });
  const now = new Date().toISOString().slice(0,10);
  const part9 = calculateFinancial(validate<NPVInputs>('NPVInputs',d5.part9inputs), Number(now.slice(0,4)));
  const report: ReportData = {
    id: 'report-' + Date.now(), createdAt:now, updatedAt:now, isDemoData:false,
    input: { productName:part2.brandName, innName:part2.innName, developmentType:devType,
      indication:part1.targetProductProfile.indication, developmentCountry:'미확인', targetMarket:'미확인',
      expectedLaunchYear:part9.inputs.launchYear, developmentStage:'unknown' },
    sources:{}, part1, part2,
    part3:validate<Part3Academic>('Part3Academic',d2.part3),
    part4:validate<Part4Clinical>('Part4Clinical',d2.part4),
    part5:validate<Part5Market>('Part5Market',d3.part5),
    part6:validate<Part6Patent>('Part6Patent',d3.part6),
    part7:validate<Part7Pricing>('Part7Pricing',d4.part7),
    part8:validate<Part8Regulatory>('Part8Regulatory',d4.part8), part9,
    part10:validate<Part10Conclusion>('Part10Conclusion',d5.part10),
    part11:validate<Part11References>('Part11References',d5.part11),
    riskPanel:validate<RiskPanel>('RiskPanel',d5.riskPanel),
  };
  report.part6.expectedLaunchYear = part9.inputs.launchYear;
  // No source lookup was performed. Remove unverified links between independent chunks.
  for (const trial of report.part4.trials) { trial.refIds = []; trial.sourceId = ''; }
  for (const patent of report.part6.patents) patent.refIds = [];
  for (const guideline of report.part3.guidelinePositions) guideline.sourceId = '';
  function markUnverified(value: unknown): void {
    if (!value || typeof value !== 'object') return;
    const obj = value as Record<string, unknown>;
    if (obj.status === 'actual') obj.status = 'estimate';
    if (obj.isActual === true) obj.isActual = false;
    if ('sourceId' in obj) obj.sourceId = '';
    Object.values(obj).forEach(markUnverified);
  }
  markUnverified(report);
  onProgress({ step:'done', ...STEPS.done });
  return report;
}
