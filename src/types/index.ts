// ============================================================
// ENUMS & UNION TYPES
// ============================================================

export type DevelopmentType =
  | 'new_drug'
  | 'improved_drug'
  | 'generic'
  | 'biosimilar'
  | 'combination'
  | 'other';

export type DevelopmentStage =
  | 'preclinical'
  | 'phase1'
  | 'phase2'
  | 'phase3'
  | 'nda'
  | 'approved'
  | 'launched';

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type DevelopmentDecision =
  | 'DEVELOP'
  | 'CONDITIONAL_DEVELOP'
  | 'HOLD'
  | 'DO_NOT_DEVELOP';

export type EvidenceLevel = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export type DataStatus = 'actual' | 'estimate' | 'assumption' | 'unavailable' | 'user_input';

export type PatentType =
  | 'compound'
  | 'composition'
  | 'formulation'
  | 'polymorph'
  | 'salt'
  | 'method_of_treatment'
  | 'use_patent'
  | 'manufacturing'
  | 'combination'
  | 'dosage_regimen';

// ============================================================
// PRODUCT INPUT FORM
// ============================================================

export interface ProductInput {
  productName: string;
  innName: string;
  developmentType: DevelopmentType;
  indication: string;
  developmentCountry: string;
  targetMarket: string;
  expectedLaunchYear: number;
  developmentStage: DevelopmentStage;
}

// ============================================================
// SOURCE & EVIDENCE
// ============================================================

export interface Source {
  id: string;
  organization: string;
  documentName: string;
  publishedDate: string;
  url?: string;
  accessDate: string;
  evidenceLevel: EvidenceLevel;
}

export interface DataPoint<T> {
  value: T;
  status: DataStatus;
  sourceId?: string;
  note?: string;
}

// ============================================================
// PART 1 – OVERVIEW
// ============================================================

export interface Part1Overview {
  productSummary: string;
  developmentBackground: string;
  targetDisease: string;
  currentTreatmentLimitations: string[];
  developmentNecessity: string;
  developmentObjective: string;
  targetProductProfile: {
    indication: string;
    patientPopulation: string;
    therapeuticLine: string;
    administrationRoute: string;
    dosingFrequency: string;
    safetyProfile: string;
    efficacyTarget: string;
  };
  developmentDirection: string;
  whyThisProduct: string[];
}

// ============================================================
// PART 2 – PRODUCT INFORMATION
// ============================================================

export interface ProductInfo {
  innName: string;
  brandName: string;
  developer: string;
  manufacturer: string;
  pharmacologicalClass: string;
  mechanismOfAction: string;
  routeOfAdministration: string;
  dosageForm: string;
  strength: string;
  firstApprovalCountry: string;
  firstApprovalDate: string;
  koreaApprovalDate: string;
  approvedIndications: string[];
  dosageAndAdministration: string;
  pms: string;
  reexaminationPeriod: string;
  exclusivity: string;
  patents: string[];
  reimbursementStatus: string;
  price: string;
  competitors: string[];
}

// ============================================================
// PART 3 – ACADEMIC & THERAPEUTIC POSITION
// ============================================================

export interface DiseaseOverview {
  definition: string;
  prevalence: DataPoint<string>;
  incidence: DataPoint<string>;
  patientNumber: DataPoint<string>;
  diseaseBurden: string;
  mortalityRate: DataPoint<string>;
  marketSize: DataPoint<string>;
}

export interface MechanismOfAction {
  summary: string;
  pathway: string[];         // Disease pathway steps
  target: string;
  drugEffect: string;
  biologicalEffect: string;
  clinicalOutcome: string;
  imageUrl?: string;
}

export interface TreatmentLine {
  line: string;             // "1L", "2L", "3L", "Salvage"
  treatments: string[];
  duration: string;
  responseRate: string;
  majorSideEffects: string[];
  limitations: string[];
}

export interface GuidelinePosition {
  guideline: string;         // "NCCN", "ESMO", "ASCO", "국내진료지침"
  version: string;
  recommendedLine: string;
  recommendationGrade: string;
  note: string;
  sourceId: string;
}

export interface CompetitorPosition {
  name: string;
  efficacy: number;          // 0–10 scale
  unmetNeed: number;         // 0–10 scale
  marketShare?: number;
  color: string;
}

export interface Part3Academic {
  diseaseOverview: DiseaseOverview;
  mechanismOfAction: MechanismOfAction;
  standardOfCare: TreatmentLine[];
  guidelinePositions: GuidelinePosition[];
  therapeuticPositioning: CompetitorPosition[];
}

// ============================================================
// PART 4 – CLINICAL DATA
// ============================================================

export interface ClinicalEndpoints {
  pfs?: string;              // e.g. "12.3 months"
  os?: string;
  orr?: string;
  dor?: string;
  hr?: string;
  ci95?: string;
  pValue?: string;
}

export interface SafetyData {
  grade3PlusAE?: string;
  sae?: string;
  discontinuation?: string;
  deathRate?: string;
  majorSafetySignals: string[];
}

export interface ClinicalTrial {
  id: string;
  studyName: string;
  clinicalTrialsId?: string;
  phase: string;
  design: string;
  randomization: string;
  blinding: string;
  population: string;
  sampleSize: number;
  intervention: string;
  comparator: string;
  primaryEndpoint: string;
  secondaryEndpoints: string[];
  followUp: string;
  endpoints: ClinicalEndpoints;
  safety: SafetyData;
  isPivotal: boolean;
  reference: string;
  doi?: string;
  pubmedUrl?: string;
  sourceId: string;
  refIds?: number[];            // Part11 레퍼런스 번호 목록 e.g. [1, 2]
}

export interface CompetitorClinical {
  productName: string;
  orr?: string;
  medianPfs?: string;
  medianOs?: string;
  hr?: string;
  grade3PlusAE?: string;
  discontinuation?: string;
  studyName: string;
}

export interface Part4Clinical {
  trials: ClinicalTrial[];
  competitorComparison: CompetitorClinical[];
  crossTrialWarning: boolean;
}

// ============================================================
// PART 5 – MARKET RESEARCH
// ============================================================

export interface MarketYearData {
  year: number;
  globalMarketSize: number;       // USD millions
  koreaMarketSize: number;        // KRW billions
  prescribedPatients?: number;
  marketShare?: number;
  salesRevenue?: number;
  isActual: boolean;
}

export interface Competitor {
  name: string;
  inn: string;
  company: string;
  sales?: number;               // USD millions
  marketShare?: number;
  patentExpiry?: string;
  price?: string;
  efficacyScore?: number;       // 0–10
  priceScore?: number;          // 0–10
  marketSizeUSD?: number;
}

export interface Part5Market {
  yearlyData: MarketYearData[];
  cagr5Year: number;
  globalMarketLatest: DataPoint<number>;
  koreaMarketLatest: DataPoint<number>;
  competitors: Competitor[];
  treatmentCostAnnual: DataPoint<string>;
  patientGrowthRate: DataPoint<number>;
  majorCountryMarkets: { country: string; size: string; share: number }[];
}

// ============================================================
// PART 6 – PATENT
// ============================================================

export interface Patent {
  id: string;
  patentNo: string;
  applicationNo: string;
  applicant: string;
  priorityDate: string;
  filingDate: string;
  grantDate: string;
  expirationDate: string;
  jurisdiction: string;
  patentType: PatentType;
  status: 'granted' | 'pending' | 'expired' | 'abandoned';
  keyClaims: string[];
  riskLevel: RiskLevel;
  riskNote: string;
  refIds?: number[];            // Part11 레퍼런스 번호 목록
}

export interface FTOAnalysis {
  coreCompound: RiskLevel;
  formulation: RiskLevel;
  usePatent: RiskLevel;
  combination: RiskLevel;
  manufacturing: RiskLevel;
  patentTerm: string;
  spcPte: string;
  litigationHistory: string;
  orangeBookStatus: string;
  koreaPatentStatus: string;
  overallFTORisk: RiskLevel;
  disclaimer: string;
}

export interface Part6Patent {
  patents: Patent[];
  ftoAnalysis: FTOAnalysis;
  expectedLaunchYear: number;
}

// ============================================================
// PART 7 – PRICING
// ============================================================

export interface PricingScenario {
  name: 'Conservative' | 'Base' | 'Optimistic';
  price: number;               // KRW per day or per unit
  patientNumber: number;
  annualRevenue: number;       // KRW billions
  reimbursementRate: number;   // %
  npv: number;                 // KRW billions
}

export interface Part7Pricing {
  referencePrice: DataPoint<string>;
  sameMoleculePrice?: DataPoint<string>;
  sameClassPrice?: DataPoint<string>;
  competitorPrices: { name: string; price: string }[];
  dailyCost: DataPoint<string>;
  monthlyCost: DataPoint<string>;
  annualCost: DataPoint<string>;
  expectedReimbursementPrice: DataPoint<string>;
  patientCopay: DataPoint<string>;
  pricingLogic: string[];
  scenarios: PricingScenario[];
}

// ============================================================
// PART 8 – REGULATORY STRATEGY
// ============================================================

export interface RegulatoryItem {
  item: string;
  applicable: boolean;
  detail: string;
  status?: string;
}

export interface RiskMatrixItem {
  category: string;
  probability: number;          // 1–5
  impact: number;               // 1–5
  riskScore: number;            // probability × impact
  level: RiskLevel;
  mitigation: string;
}

export interface Part8Regulatory {
  strategy: RegulatoryItem[];
  expectedApprovalDate: string;
  bridgingRequired: boolean;
  bridgingNote: string;
  fastTrackOptions: string[];
  riskMatrix: RiskMatrixItem[];
}

// ============================================================
// PART 9 – NPV & FINANCIAL
// ============================================================

export interface NPVInputs {
  developmentCost: number;       // KRW billions
  clinicalCost: number;
  regulatoryCost: number;
  cmcCost: number;
  launchCost: number;
  marketingCost: number;
  manufacturingCostRatio: number; // % of revenue
  expectedPrice: number;          // KRW per patient per year
  patientNumber: number;
  marketShare: number;            // %
  grossMargin: number;            // %
  sgaRatio: number;               // % of revenue
  taxRate: number;                // %
  discountRate: number;           // %
  probabilityByStage: {
    preclinical: number;
    phase1: number;
    phase2: number;
    phase3: number;
    nda: number;
    launch: number;
  };
  launchYear: number;
}

export interface NPVYearData {
  year: string;
  revenue: number;
  cogs: number;
  sga: number;
  developmentCost: number;
  tax: number;
  fcf: number;
  discountedFcf: number;
  cumulativeFcf: number;
}

export interface ScenarioResult {
  name: 'Conservative' | 'Base' | 'Optimistic';
  revenue: number;
  ebitda: number;
  npv: number;
  riskAdjustedNpv: number;
  breakEvenYear: number | null;
  marketShare: number;
  price: number;
}

export interface SensitivityItem {
  variable: string;
  low: number;
  base: number;
  high: number;
  impact: number;               // NPV impact range
}

export interface Part9Financial {
  inputs: NPVInputs;
  yearlyData: NPVYearData[];
  npv: number;
  riskAdjustedNpv: number;
  irr?: number;
  breakEvenYear: number | null;
  probabilityOfSuccess: number;
  scenarios: ScenarioResult[];
  sensitivityItems: SensitivityItem[];
}

// ============================================================
// PART 10 – CONCLUSION & DECISION
// ============================================================

export interface DevelopmentScoreItem {
  category: string;
  weight: number;               // % – must sum to 100
  score: number;                // 0–100
  weightedScore: number;
  rationale: string;
}

export interface Part10Conclusion {
  decision: DevelopmentDecision;
  decisionRationale: string[];
  conditions?: string[];        // For CONDITIONAL_DEVELOP
  developmentScore: number;     // 0–100
  scoreBreakdown: DevelopmentScoreItem[];
  executiveSummaryText: string;
  keyRisks: string[];
  keyOpportunities: string[];
}

// ============================================================
// PART 11 – REFERENCES
// ============================================================

export type ReferenceCategory =
  | 'clinical'
  | 'regulatory'
  | 'patent'
  | 'market'
  | 'guideline'
  | 'academic'
  | 'financial'
  | 'other';

export interface Reference {
  id: number;                   // [1], [2], ...
  category: ReferenceCategory;
  title: string;                // 논문/문서 제목 (한글 우선, 없으면 영문)
  authors?: string;             // 저자 또는 기관명
  source: string;               // 저널명 / 가이드라인 / 특허청 등
  year?: string;                // 발행연도
  url?: string;                 // PubMed, USPTO, KIPRIS 등 링크
  doi?: string;
  note?: string;                // 보충 설명
}

export interface Part11References {
  references: Reference[];
}

// ============================================================
// RISK PANEL (always visible, right sidebar)
// ============================================================

export interface RiskPanel {
  overall: RiskLevel;
  clinical: RiskLevel;
  regulatory: RiskLevel;
  patent: RiskLevel;
  market: RiskLevel;
  pricing: RiskLevel;
  financial: RiskLevel;
}

// ============================================================
// MAIN REPORT DATA MODEL
// ============================================================

export interface ReportData {
  id: string;
  createdAt: string;
  updatedAt: string;
  isDemoData: boolean;
  input: ProductInput;
  sources: Record<string, Source>;

  // Parts
  part1: Part1Overview;
  part2: ProductInfo;
  part3: Part3Academic;
  part4: Part4Clinical;
  part5: Part5Market;
  part6: Part6Patent;
  part7: Part7Pricing;
  part8: Part8Regulatory;
  part9: Part9Financial;
  part10: Part10Conclusion;
  part11: Part11References;

  // Always-visible panels
  riskPanel: RiskPanel;
}
