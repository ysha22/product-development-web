/**
 * DEMO DATA – NOT REAL CLINICAL/FINANCIAL DATA
 * All figures are illustrative only for UI demonstration purposes.
 * Do not use for actual investment or regulatory decisions.
 */

import type { ReportData } from '../types';

export const DEMO_REPORT: ReportData = {
  id: 'demo-001',
  createdAt: '2026-08-27',
  updatedAt: '2026-08-27',
  isDemoData: true,

  input: {
    productName: 'Tagrisso® (DEMO)',
    innName: 'Osimertinib',
    developmentType: 'new_drug',
    indication: 'EGFR 변이 비소세포폐암 (NSCLC)',
    developmentCountry: '대한민국',
    targetMarket: '한국/글로벌',
    expectedLaunchYear: 2027,
    developmentStage: 'phase3',
  },

  sources: {
    src001: {
      id: 'src001',
      organization: 'FDA',
      documentName: 'Tagrisso Prescribing Information',
      publishedDate: '2015-11-13',
      url: 'https://www.accessdata.fda.gov/drugsatfda_docs/label/2015/208065s000lbl.pdf',
      accessDate: '2026-08-01',
      evidenceLevel: 'A',
    },
    src002: {
      id: 'src002',
      organization: 'NEJM',
      documentName: 'FLAURA: Osimertinib in Untreated EGFR-Mutated Advanced NSCLC',
      publishedDate: '2018-09-27',
      url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa1810483',
      accessDate: '2026-08-01',
      evidenceLevel: 'B',
    },
    src003: {
      id: 'src003',
      organization: 'NCCN',
      documentName: 'NCCN Clinical Practice Guidelines in Oncology: Non-Small Cell Lung Cancer v2.2026',
      publishedDate: '2026-03-01',
      url: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1450',
      accessDate: '2026-08-01',
      evidenceLevel: 'C',
    },
    src004: {
      id: 'src004',
      organization: '건강보험심사평가원(HIRA)',
      documentName: '2026년 요양급여 적용기준',
      publishedDate: '2026-01-01',
      url: 'https://www.hira.or.kr',
      accessDate: '2026-08-01',
      evidenceLevel: 'A',
    },
    src005: {
      id: 'src005',
      organization: 'AstraZeneca',
      documentName: 'Annual Report 2025',
      publishedDate: '2026-02-15',
      url: 'https://www.astrazeneca.com',
      accessDate: '2026-08-01',
      evidenceLevel: 'D',
    },
    src006: {
      id: 'src006',
      organization: 'GlobalData Pharma',
      documentName: 'EGFR NSCLC Market Forecast 2026–2032',
      publishedDate: '2026-04-01',
      url: '#',
      accessDate: '2026-08-01',
      evidenceLevel: 'E',
    },
    src007: {
      id: 'src007',
      organization: 'KIPRIS',
      documentName: 'KR 10-2018-0123456',
      publishedDate: '2020-03-15',
      url: 'https://www.kipris.or.kr',
      accessDate: '2026-08-01',
      evidenceLevel: 'A',
    },
  },

  // ============================================================
  // PART 1 – OVERVIEW
  // ============================================================
  part1: {
    productSummary:
      'Osimertinib은 3세대 EGFR 티로신 키나제 억제제(TKI)로, EGFR 엑손19 결손 및 엑손21 L858R 변이 비소세포폐암(NSCLC)에 1차 치료로 허가된 표적항암제이다.',
    developmentBackground:
      '1·2세대 EGFR TKI 치료 후 발생하는 T790M 내성 변이를 극복하기 위해 개발되었으며, 뇌혈관장벽(BBB) 투과력을 갖춰 뇌전이 환자에게도 효과적이다.',
    targetDisease: 'EGFR 변이 양성 국소 진행성/전이성 비소세포폐암 (Stage IIIB/IV)',
    currentTreatmentLimitations: [
      '1세대 TKI(Erlotinib, Gefitinib) 치료 후 1년 내외에 T790M 변이로 내성 발생',
      '2세대 TKI(Afatinib)는 야생형 EGFR 억제로 인한 독성 문제',
      '뇌전이 발생 시 기존 TKI로는 CNS 제어 효과 제한적',
      '기존 표준치료의 중앙 PFS는 9~14개월로 임상적 미충족 수요 존재',
    ],
    developmentNecessity:
      'EGFR 변이 NSCLC 환자의 1차 치료에서 T790M 선택성과 CNS 투과성을 동시에 확보한 치료제가 필요하며, 표준치료 대비 우월한 PFS 및 OS 데이터가 확보되어 있어 개발 필요성이 높다.',
    developmentObjective:
      'EGFR 변이 양성 NSCLC 1차 치료 표준요법으로 허가 취득 및 급여 등재를 통해 환자 접근성 극대화',
    targetProductProfile: {
      indication: 'EGFR 엑손19 결손 또는 엑손21 L858R 변이 국소 진행성/전이성 NSCLC',
      patientPopulation: '성인 EGFR 변이 양성 NSCLC 환자 (1차 치료)',
      therapeuticLine: '1차 치료 (First-line)',
      administrationRoute: '경구 (Oral)',
      dosingFrequency: '1일 1회 (80mg)',
      safetyProfile: '기존 EGFR TKI 대비 개선된 내약성, 야생형 EGFR 보존',
      efficacyTarget: 'PFS ≥ 18개월, OS ≥ 38개월, CNS ORR ≥ 60%',
    },
    developmentDirection:
      '글로벌 FLAURA 임상 데이터를 활용한 한국 허가 신청 (bridging study 불필요), 급여 등재 시 A7 약가 산정 전략 적용, adjuvant 적응증 확대 임상 진행 중.',
    whyThisProduct: [
      'EGFR 변이 NSCLC는 한국에서 폐암의 약 30%를 차지하며 환자 규모가 크다',
      '1차 치료 표준요법으로 자리잡은 Osimertinib은 경쟁자 없는 독보적 위치',
      '뇌전이 발생률이 높은 한국 NSCLC 환자군에서 CNS 활성 효과가 특히 중요',
      '특허 만료 이후 바이오시밀러 진입 전 시장 선점 기회 존재',
      '5-Year NPV 기준 긍정적 사업성 추정 (Base Scenario)',
    ],
  },

  // ============================================================
  // PART 2 – PRODUCT INFORMATION
  // ============================================================
  part2: {
    innName: 'Osimertinib',
    brandName: 'Tagrisso® (DEMO)',
    developer: 'AstraZeneca',
    manufacturer: 'AstraZeneca UK Limited',
    pharmacologicalClass: '항암제 / EGFR 티로신 키나제 억제제 (3세대)',
    mechanismOfAction:
      'EGFR 변이(엑손19 결손, L858R, T790M)에 선택적으로 결합하여 티로신 키나제 활성을 불가역적으로 억제. 야생형 EGFR에 대한 선택성이 높아 독성이 낮음.',
    routeOfAdministration: '경구 (Oral)',
    dosageForm: '필름코팅정',
    strength: '40mg, 80mg',
    firstApprovalCountry: '미국 (FDA)',
    firstApprovalDate: '2015-11-13',
    koreaApprovalDate: '2016-04-20',
    approvedIndications: [
      'EGFR 엑손19 결손 또는 엑손21 L858R 변이 양성 국소 진행성/전이성 NSCLC 1차 치료',
      'T790M 변이 양성 NSCLC (이전 EGFR TKI 치료 후 진행)',
      'EGFR 변이 양성 NSCLC 완전절제 후 보조요법 (adjuvant)',
    ],
    dosageAndAdministration: '80mg 1일 1회 경구 투여 (식사 여부 무관)',
    pms: '4년 (완료)',
    reexaminationPeriod: '6년 (만료)',
    exclusivity: 'NCE Exclusivity 만료 (FDA 2020-11-13)',
    patents: ['화합물 특허: US8,946,235 (만료 2031)', '제형 특허: US9,340,522 (만료 2033)'],
    reimbursementStatus: '급여 등재 (건강보험 등재일: 2017-08-01)',
    price: '80mg 1정 기준 ₩38,540 (2026년 기준, DEMO)',
    competitors: ['Erlotinib (Tarceva)', 'Gefitinib (Iressa)', 'Afatinib (Giotrif)', 'Dacomitinib (Vizimpro)', 'Lazertinib (Leclaza)'],
  },

  // ============================================================
  // PART 3 – ACADEMIC & THERAPEUTIC POSITION
  // ============================================================
  part3: {
    diseaseOverview: {
      definition:
        '비소세포폐암(NSCLC)은 폐암의 약 85%를 차지하는 아형으로, 선암(Adenocarcinoma), 편평상피암(Squamous), 대세포암(Large cell)으로 분류된다. EGFR 변이는 아시아인에서 약 40–50%, 비흡연 여성에서 높은 빈도로 발생한다.',
      prevalence: { value: '국내 폐암 유병자 약 12만 명 (2024년 기준)', status: 'actual', sourceId: 'src004' },
      incidence: { value: '국내 신규 폐암 환자 약 3만 1천 명/년 (2024)', status: 'actual', sourceId: 'src004' },
      patientNumber: { value: 'EGFR 변이 NSCLC 국내 추정 환자 약 8,000–10,000명/년', status: 'estimate', sourceId: 'src006' },
      diseaseBurden: '폐암은 국내 암 사망률 1위이며, EGFR 변이 NSCLC는 상대적으로 예후가 양호하나 완치가 어렵고 장기 치료가 필요하다.',
      mortalityRate: { value: '5년 생존율 약 28% (전체 폐암 기준, 2024)', status: 'actual', sourceId: 'src004' },
      marketSize: { value: '국내 EGFR NSCLC 치료제 시장 약 3,200억원 (2025년 추정)', status: 'estimate', sourceId: 'src006' },
    },

    mechanismOfAction: {
      summary:
        'Osimertinib은 EGFR 변이(엑손19 결손, L858R, T790M)에 공유결합으로 불가역적으로 결합하여 ATP 경쟁적 억제를 통해 세포 증식을 억제한다.',
      pathway: [
        'EGFR 변이 (Ex19del / L858R)',
        '→ RAS/MAPK, PI3K/AKT 신호전달 과활성화',
        '→ 세포 증식·생존·전이 촉진',
        '→ Osimertinib이 EGFR C797 부위에 공유결합',
        '→ 티로신 키나제 활성 불가역적 억제',
        '→ 세포주기 정지 및 세포사멸 유도',
      ],
      target: 'EGFR (ErbB1) – T790M 변이 포함 3세대 선택적 억제',
      drugEffect: 'EGFR 인산화 억제 → 하위 신호전달 차단',
      biologicalEffect: '종양 세포 증식 억제, 세포사멸(apoptosis) 유도',
      clinicalOutcome: '종양 반응(ORR ~80%), 무진행 생존 연장(PFS ~18.9개월), 전체 생존 개선(OS ~38.6개월)',
    },

    standardOfCare: [
      {
        line: '1L (First-line)',
        treatments: ['Osimertinib 80mg QD (Category 1)', 'Erlotinib (대안)', 'Gefitinib (대안)'],
        duration: '진행 또는 독성 발현까지 (중앙 18.9개월)',
        responseRate: 'ORR 80%, PFS 18.9개월',
        majorSideEffects: ['설사', '발진', '손발톱 변화', 'QTc 연장'],
        limitations: ['T790M 외 내성 기전 (C797S 등)으로 결국 진행', '뇌전이 이후 치료 옵션 제한'],
      },
      {
        line: '2L (T790M+ after 1G TKI)',
        treatments: ['Osimertinib 80mg QD'],
        duration: '진행까지 (중앙 10.1개월 – AURA3)',
        responseRate: 'ORR 71%, PFS 10.1개월',
        majorSideEffects: ['설사', '발진', 'ILD (1–2%)'],
        limitations: ['T790M 음성 환자에서 효과 제한', 'C797S 내성 시 선택지 없음'],
      },
      {
        line: '3L (Post-Osimertinib)',
        treatments: ['백금 기반 화학요법', 'Amivantamab + Lazertinib', '임상시험 참여 권장'],
        duration: '6–12개월',
        responseRate: 'ORR 20–40%',
        majorSideEffects: ['골수억제', '신독성', '피로'],
        limitations: ['명확한 표준치료 없음', '내성 기전 다양성으로 치료 선택 어려움'],
      },
      {
        line: 'Salvage',
        treatments: ['Best Supportive Care', '면역항암제 (limited role)', '임상시험'],
        duration: '2–4개월',
        responseRate: 'ORR <15%',
        majorSideEffects: ['다양한 독성'],
        limitations: ['생존 기간 극히 제한적'],
      },
    ],

    guidelinePositions: [
      {
        guideline: 'NCCN',
        version: 'v2.2026',
        recommendedLine: '1L (Category 1 Preferred)',
        recommendationGrade: 'Category 1',
        note: 'EGFR Ex19del 또는 L858R 모든 환자에서 1차 표준요법으로 권고',
        sourceId: 'src003',
      },
      {
        guideline: 'ESMO',
        version: '2023',
        recommendedLine: '1L (Grade A, Level I)',
        recommendationGrade: 'Grade A',
        note: 'FLAURA OS 데이터에 기반한 최우선 권고',
        sourceId: 'src003',
      },
      {
        guideline: 'ASCO',
        version: '2023',
        recommendedLine: '1L (Strong recommendation)',
        recommendationGrade: 'Strong',
        note: 'OS 및 CNS 효과 고려 시 최우선 선택',
        sourceId: 'src003',
      },
      {
        guideline: '국내 진료지침 (KCSG)',
        version: '2025',
        recommendedLine: '1L (권고수준 A)',
        recommendationGrade: 'A',
        note: '국내 EGFR 변이 빈도 높은 특성 고려 시 특히 권고',
        sourceId: 'src003',
      },
    ],

    therapeuticPositioning: [
      { name: 'Osimertinib (DEMO)', efficacy: 9.2, unmetNeed: 8.5, marketShare: 45, color: '#2563eb' },
      { name: 'Lazertinib', efficacy: 8.8, unmetNeed: 8.0, marketShare: 18, color: '#7c3aed' },
      { name: 'Afatinib', efficacy: 7.5, unmetNeed: 6.5, marketShare: 12, color: '#059669' },
      { name: 'Gefitinib', efficacy: 6.8, unmetNeed: 6.0, marketShare: 10, color: '#d97706' },
      { name: 'Erlotinib', efficacy: 6.5, unmetNeed: 5.8, marketShare: 8, color: '#dc2626' },
      { name: 'Dacomitinib', efficacy: 7.8, unmetNeed: 6.8, marketShare: 7, color: '#0891b2' },
    ],
  },

  // ============================================================
  // PART 4 – CLINICAL
  // ============================================================
  part4: {
    trials: [
      {
        id: 'flaura',
        studyName: 'FLAURA',
        clinicalTrialsId: 'NCT02296125',
        phase: 'Phase III',
        design: '무작위배정, 이중맹검, 다국가 활성대조 3상 시험',
        randomization: '1:1 (Osimertinib vs. 표준 EGFR TKI)',
        blinding: '이중맹검 (Double-blind)',
        population: 'EGFR 엑손19 결손 또는 L858R 변이 국소진행성/전이성 NSCLC, 이전 전신 치료 미경험',
        sampleSize: 556,
        intervention: 'Osimertinib 80mg 1일 1회 경구',
        comparator: 'Gefitinib 250mg 또는 Erlotinib 150mg 1일 1회 경구',
        primaryEndpoint: '무진행생존기간 (PFS) – 독립 중앙 맹검 평가(BICR)',
        secondaryEndpoints: ['전체 생존기간 (OS)', '객관적 반응률 (ORR)', '반응 지속 기간 (DOR)', 'CNS PFS', '삶의 질 (QoL)'],
        followUp: '중앙값 35.8개월 (최종 OS 분석)',
        endpoints: {
          pfs: '18.9개월 (vs. 10.2개월)',
          os: '38.6개월 (vs. 31.8개월)',
          orr: '80% (vs. 76%)',
          dor: '17.2개월 (vs. 8.5개월)',
          hr: '0.46 (PFS) / 0.80 (OS)',
          ci95: 'PFS: 0.37–0.57 / OS: 0.64–1.00',
          pValue: 'PFS: <0.001 / OS: 0.046',
        },
        safety: {
          grade3PlusAE: '42% (vs. 47%)',
          sae: '18% (vs. 22%)',
          discontinuation: '13% (vs. 18%)',
          deathRate: '1% (치료 관련)',
          majorSafetySignals: ['설사 (58%)', '발진 (58%)', '손발톱 이상 (35%)', 'QTc 연장 (11%)', 'ILD/폐렴 (3.5%)'],
        },
        isPivotal: true,
        reference:
          'Soria JC, et al. Osimertinib in Untreated EGFR-Mutated Advanced Non-Small-Cell Lung Cancer. N Engl J Med. 2018;378(2):113-125.',
        doi: '10.1056/NEJMoa1810483',
        pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/29151359/',
        sourceId: 'src002',
      },
      {
        id: 'aura3',
        studyName: 'AURA3',
        clinicalTrialsId: 'NCT02151981',
        phase: 'Phase III',
        design: '무작위배정, 이중맹검, 활성대조 3상 시험',
        randomization: '2:1 (Osimertinib vs. Platinum-pemetrexed)',
        blinding: '이중맹검',
        population: 'T790M 변이 양성 NSCLC, 1세대 EGFR TKI 치료 후 진행',
        sampleSize: 419,
        intervention: 'Osimertinib 80mg 1일 1회 경구',
        comparator: '백금-페메트렉시드 병용 화학요법',
        primaryEndpoint: '무진행생존기간 (PFS) – BICR',
        secondaryEndpoints: ['ORR', 'DOR', 'CNS PFS', 'OS', 'QoL'],
        followUp: '중앙값 8.3개월',
        endpoints: {
          pfs: '10.1개월 (vs. 4.4개월)',
          orr: '71% (vs. 31%)',
          hr: '0.30',
          ci95: '0.23–0.41',
          pValue: '<0.001',
        },
        safety: {
          grade3PlusAE: '23% (vs. 47%)',
          sae: '7% (vs. 21%)',
          discontinuation: '7% (vs. 10%)',
          majorSafetySignals: ['설사 (41%)', '발진 (34%)', 'ILD (2%)'],
        },
        isPivotal: false,
        reference:
          'Mok TS, et al. Osimertinib or Platinum-Pemetrexed in EGFR T790M-Positive Lung Cancer. N Engl J Med. 2017;376(7):629-640.',
        doi: '10.1056/NEJMoa1612674',
        pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/27959700/',
        sourceId: 'src002',
      },
    ],

    competitorComparison: [
      { productName: 'Osimertinib (DEMO)', orr: '80%', medianPfs: '18.9 mo', medianOs: '38.6 mo', hr: '0.46', grade3PlusAE: '42%', discontinuation: '13%', studyName: 'FLAURA' },
      { productName: 'Lazertinib', orr: '76%', medianPfs: '20.6 mo', medianOs: 'NR', hr: '0.45', grade3PlusAE: '39%', discontinuation: '11%', studyName: 'LASER301' },
      { productName: 'Afatinib', orr: '69%', medianPfs: '11.0 mo', medianOs: '33.3 mo', hr: '0.73', grade3PlusAE: '49%', discontinuation: '14%', studyName: 'LUX-Lung 3' },
      { productName: 'Dacomitinib', orr: '75%', medianPfs: '14.7 mo', medianOs: '34.1 mo', hr: '0.59', grade3PlusAE: '66%', discontinuation: '20%', studyName: 'ARCHER 1050' },
      { productName: 'Gefitinib', orr: '47%', medianPfs: '9.5 mo', medianOs: '22.3 mo', hr: '0.74', grade3PlusAE: '31%', discontinuation: '8%', studyName: 'IPASS' },
    ],
    crossTrialWarning: true,
  },

  // ============================================================
  // PART 5 – MARKET
  // ============================================================
  part5: {
    yearlyData: [
      { year: 2021, globalMarketSize: 3200, koreaMarketSize: 280, prescribedPatients: 6800, marketShare: 42, salesRevenue: 2100, isActual: true },
      { year: 2022, globalMarketSize: 4100, koreaMarketSize: 320, prescribedPatients: 7200, marketShare: 44, salesRevenue: 2600, isActual: true },
      { year: 2023, globalMarketSize: 5200, koreaMarketSize: 380, prescribedPatients: 7800, marketShare: 46, salesRevenue: 3200, isActual: true },
      { year: 2024, globalMarketSize: 6500, koreaMarketSize: 420, prescribedPatients: 8200, marketShare: 47, salesRevenue: 3900, isActual: true },
      { year: 2025, globalMarketSize: 7800, koreaMarketSize: 480, prescribedPatients: 8600, marketShare: 48, salesRevenue: 4600, isActual: false },
      { year: 2026, globalMarketSize: 8900, koreaMarketSize: 530, prescribedPatients: 9000, marketShare: 47, salesRevenue: 5100, isActual: false },
      { year: 2027, globalMarketSize: 10100, koreaMarketSize: 580, prescribedPatients: 9400, marketShare: 46, salesRevenue: 5600, isActual: false },
      { year: 2028, globalMarketSize: 11200, koreaMarketSize: 620, prescribedPatients: 9700, marketShare: 45, salesRevenue: 6000, isActual: false },
      { year: 2029, globalMarketSize: 12000, koreaMarketSize: 660, prescribedPatients: 10000, marketShare: 44, salesRevenue: 6300, isActual: false },
      { year: 2030, globalMarketSize: 12500, koreaMarketSize: 680, prescribedPatients: 10200, marketShare: 42, salesRevenue: 6500, isActual: false },
    ],
    cagr5Year: 15.8,
    globalMarketLatest: { value: 7800, status: 'estimate', sourceId: 'src006' },
    koreaMarketLatest: { value: 480, status: 'estimate', sourceId: 'src006' },
    competitors: [
      { name: 'Osimertinib (DEMO)', inn: 'Osimertinib', company: 'AstraZeneca', sales: 4600, marketShare: 48, patentExpiry: '2031-03', price: '₩38,540/정', efficacyScore: 9.2, priceScore: 3.0, marketSizeUSD: 4600 },
      { name: 'Lazertinib', inn: 'Lazertinib', company: '유한양행/J&J', sales: 850, marketShare: 18, patentExpiry: '2035-06', price: '₩34,200/정', efficacyScore: 8.8, priceScore: 3.5, marketSizeUSD: 850 },
      { name: 'Afatinib', inn: 'Afatinib', company: 'Boehringer Ingelheim', sales: 420, marketShare: 12, patentExpiry: '2028-01', price: '₩18,900/정', efficacyScore: 7.5, priceScore: 6.0, marketSizeUSD: 420 },
      { name: 'Dacomitinib', inn: 'Dacomitinib', company: 'Pfizer', sales: 280, marketShare: 7, patentExpiry: '2030-09', price: '₩31,400/정', efficacyScore: 7.8, priceScore: 4.0, marketSizeUSD: 280 },
      { name: 'Gefitinib', inn: 'Gefitinib', company: 'AZ/Generic', sales: 210, marketShare: 10, patentExpiry: '2023-05', price: '₩8,200/정', efficacyScore: 6.8, priceScore: 8.5, marketSizeUSD: 210 },
    ],
    treatmentCostAnnual: { value: '약 ₩1,400만원/년 (급여가 기준)', status: 'estimate', sourceId: 'src004' },
    patientGrowthRate: { value: 4.2, status: 'estimate', sourceId: 'src006' },
    majorCountryMarkets: [
      { country: 'USA', size: '$2,800M', share: 36 },
      { country: 'EU5', size: '$1,600M', share: 21 },
      { country: 'Japan', size: '$900M', share: 12 },
      { country: 'Korea', size: '$480M', share: 6 },
      { country: 'China', size: '$1,200M', share: 15 },
      { country: 'Others', size: '$820M', share: 10 },
    ],
  },

  // ============================================================
  // PART 6 – PATENT
  // ============================================================
  part6: {
    patents: [
      {
        id: 'pat001',
        patentNo: 'US8,946,235',
        applicationNo: 'US13/920,456',
        applicant: 'AstraZeneca AB',
        priorityDate: '2012-12-20',
        filingDate: '2013-06-18',
        grantDate: '2015-02-03',
        expirationDate: '2031-03-15',
        jurisdiction: 'US',
        patentType: 'compound',
        status: 'granted',
        keyClaims: [
          'Claim 1: Osimertinib 화합물 또는 약학적으로 허용 가능한 염',
          'Claim 5: EGFR 변이 암 치료를 위한 조성물',
          'Claim 12: 일 1회 경구 투여 방법',
        ],
        riskLevel: 'HIGH',
        riskNote: '핵심 화합물 특허로 2031년까지 유효. 제네릭/바이오시밀러 진입 불가.',
      },
      {
        id: 'pat002',
        patentNo: 'US9,340,522',
        applicationNo: 'US14/512,789',
        applicant: 'AstraZeneca AB',
        priorityDate: '2013-10-11',
        filingDate: '2014-10-11',
        grantDate: '2016-05-17',
        expirationDate: '2033-10-11',
        jurisdiction: 'US',
        patentType: 'formulation',
        status: 'granted',
        keyClaims: [
          'Claim 1: 80mg Osimertinib 포함 고체 경구 제형',
          'Claim 3: 특정 부형제 조합을 포함하는 안정적 제형',
        ],
        riskLevel: 'MODERATE',
        riskNote: '제형 특허로 2033년까지 유효. 대안 제형으로 회피 가능성 존재.',
      },
      {
        id: 'pat003',
        patentNo: 'KR 10-2018-0123456',
        applicationNo: 'KR2018-0045678',
        applicant: 'AstraZeneca AB',
        priorityDate: '2012-12-20',
        filingDate: '2013-06-19',
        grantDate: '2020-03-15',
        expirationDate: '2033-06-19',
        jurisdiction: 'KR',
        patentType: 'compound',
        status: 'granted',
        keyClaims: [
          'Claim 1: Osimertinib 화합물',
          'Claim 2: EGFR 변이 NSCLC 치료용 용도',
        ],
        riskLevel: 'HIGH',
        riskNote: '한국 화합물 특허 2033년까지 유효. 국내 제네릭 진입 불가.',
      },
      {
        id: 'pat004',
        patentNo: 'EP3082800',
        applicationNo: 'EP14793112',
        applicant: 'AstraZeneca AB',
        priorityDate: '2013-10-11',
        filingDate: '2014-10-10',
        grantDate: '2018-07-04',
        expirationDate: '2034-10-10',
        jurisdiction: 'EP',
        patentType: 'use_patent',
        status: 'granted',
        keyClaims: [
          'Claim 1: T790M 변이 NSCLC 치료를 위한 Osimertinib 용도',
          'Claim 4: 1차 치료에서의 용도',
        ],
        riskLevel: 'MODERATE',
        riskNote: '용도 특허. 동일 적응증 진입 시 위험 높음.',
      },
    ],

    ftoAnalysis: {
      coreCompound: 'HIGH',
      formulation: 'MODERATE',
      usePatent: 'MODERATE',
      combination: 'LOW',
      manufacturing: 'LOW',
      patentTerm: '핵심 화합물 특허 2031–2033년 만료 예정',
      spcPte: 'FDA PTE 적용 시 최대 5년 연장 가능 (추정)',
      litigationHistory: '복수 제네릭사 IPR 청원 진행 중 (2024–2026년 기준)',
      orangeBookStatus: 'FDA Orange Book 등재 완료',
      koreaPatentStatus: '특허심판원 무효심판 청구 1건 진행 중 (2025년)',
      overallFTORisk: 'HIGH',
      disclaimer:
        '본 FTO 분석은 예비적 스크리닝(Preliminary FTO Screening)으로, 실제 법적 효력이 있는 특허 의견서(Freedom-to-Operate Opinion)를 대체하지 않습니다. 개발 착수 전 반드시 전문 변리사/특허 전문 법무법인의 법률 의견을 받으시기 바랍니다.',
    },

    expectedLaunchYear: 2027,
  },

  // ============================================================
  // PART 7 – PRICING
  // ============================================================
  part7: {
    referencePrice: { value: '₩38,540/80mg정 (현행 급여가)', status: 'actual', sourceId: 'src004' },
    sameMoleculePrice: { value: '해당 없음 (특허 보호 중)', status: 'unavailable' },
    sameClassPrice: { value: 'Lazertinib ₩34,200/정, Afatinib ₩18,900/정', status: 'actual', sourceId: 'src004' },
    competitorPrices: [
      { name: 'Osimertinib (DEMO)', price: '₩38,540/정 (80mg)' },
      { name: 'Lazertinib', price: '₩34,200/정 (240mg)' },
      { name: 'Dacomitinib', price: '₩31,400/정 (45mg)' },
      { name: 'Afatinib', price: '₩18,900/정 (40mg)' },
      { name: 'Gefitinib (Generic)', price: '₩8,200/정 (250mg)' },
    ],
    dailyCost: { value: '₩38,540/일 (1정/일 기준)', status: 'actual', sourceId: 'src004' },
    monthlyCost: { value: '약 ₩1,156,200/월', status: 'estimate' },
    annualCost: { value: '약 ₩1,406만원/년', status: 'estimate' },
    expectedReimbursementPrice: { value: '₩38,540 (현행 유지 가정)', status: 'assumption' },
    patientCopay: { value: '₩1,121,700/월 (5% 본인부담, 산정특례 기준)', status: 'estimate', sourceId: 'src004' },
    pricingLogic: [
      '1. Reference price: 현행 오리지널 급여가 ₩38,540/정 적용',
      '2. Comparative price: 동일계열 대비 효능 우수성 인정 (Lazertinib 대비 OS 유지)',
      '3. Cost-effectiveness: QALY당 비용 ₩45–50M 추정 (임계값 내)',
      '4. Risk sharing: 실거래가 조정 조건 급여 (PAS 미적용)',
      '5. Expected reimbursement price: 현행 급여가 유지 또는 5% 이내 조정 예상',
    ],
    scenarios: [
      { name: 'Conservative', price: 35000, patientNumber: 5000, annualRevenue: 638, reimbursementRate: 85, npv: 1240 },
      { name: 'Base', price: 38540, patientNumber: 7000, annualRevenue: 985, reimbursementRate: 90, npv: 1980 },
      { name: 'Optimistic', price: 42000, patientNumber: 9000, annualRevenue: 1380, reimbursementRate: 95, npv: 2860 },
    ],
  },

  // ============================================================
  // PART 8 – REGULATORY STRATEGY
  // ============================================================
  part8: {
    strategy: [
      { item: '국내 신약허가 (MFDS)', applicable: true, detail: '글로벌 임상 데이터 활용, 국내 동반허가 신청 가능', status: '허가 완료 (2016-04-20)' },
      { item: '글로벌 임상 활용 (Bridging 불필요)', applicable: true, detail: 'FLAURA 아시아 하위군 데이터 충분', status: '완료' },
      { item: '신속심사 (Fast Track)', applicable: true, detail: 'FDA Breakthrough Therapy Designation 취득 완료', status: '완료' },
      { item: '우선심사 (Priority Review)', applicable: true, detail: 'FDA Priority Review 지정', status: '완료' },
      { item: '조건부허가', applicable: false, detail: '완전한 임상 데이터 확보로 미해당', status: 'N/A' },
      { item: '희귀의약품 지정', applicable: false, detail: '환자 수 기준 미해당', status: 'N/A' },
      { item: '혁신신약 지정 (MFDS)', applicable: true, detail: '2016년 혁신신약 지정', status: '완료' },
      { item: '급여 등재', applicable: true, detail: '2017-08-01 급여 등재 완료', status: '완료 (요양급여)' },
      { item: 'Adjuvant 적응증 확대', applicable: true, detail: 'ADAURA 임상 기반 추가 적응증 허가 진행 중', status: '허가 완료 (2021)' },
    ],
    expectedApprovalDate: '허가 완료 (2016-04-20)',
    bridgingRequired: false,
    bridgingNote: 'FLAURA 연구에 한국인 환자 포함(약 9%). 별도 bridging study 불필요.',
    fastTrackOptions: [
      'FDA Breakthrough Therapy Designation (취득 완료)',
      'EMA PRIME (적용 가능)',
      'MFDS 혁신신약 (취득 완료)',
    ],
    riskMatrix: [
      { category: 'Clinical', probability: 2, impact: 3, riskScore: 6, level: 'MODERATE', mitigation: '다수의 pivotal study로 임상 근거 확립됨' },
      { category: 'Regulatory', probability: 1, impact: 2, riskScore: 2, level: 'LOW', mitigation: '허가 완료, 적응증 확대 단계' },
      { category: 'CMC', probability: 2, impact: 2, riskScore: 4, level: 'LOW', mitigation: '상업화 제형 확립, 안정성 자료 완비' },
      { category: 'Patent', probability: 4, impact: 5, riskScore: 20, level: 'HIGH', mitigation: '2031년 화합물 특허 만료 전 시장 선점 필요' },
      { category: 'Pricing', probability: 3, impact: 3, riskScore: 9, level: 'MODERATE', mitigation: '급여가 재협상 시 가격 하락 가능성 존재' },
      { category: 'Market', probability: 2, impact: 4, riskScore: 8, level: 'MODERATE', mitigation: 'Lazertinib 시장 잠식 가능성 모니터링 필요' },
      { category: 'Manufacturing', probability: 1, impact: 3, riskScore: 3, level: 'LOW', mitigation: '글로벌 CMO 공급망 안정적' },
      { category: 'Commercial', probability: 2, impact: 4, riskScore: 8, level: 'MODERATE', mitigation: '영업/마케팅 투자 지속 필요' },
    ],
  },

  // ============================================================
  // PART 9 – FINANCIAL / NPV
  // ============================================================
  part9: {
    inputs: {
      developmentCost: 450,
      clinicalCost: 280,
      regulatoryCost: 30,
      cmcCost: 60,
      launchCost: 80,
      marketingCost: 120,
      manufacturingCostRatio: 18,
      expectedPrice: 14060000,
      patientNumber: 7000,
      marketShare: 45,
      grossMargin: 72,
      sgaRatio: 22,
      taxRate: 22,
      discountRate: 12,
      probabilityByStage: {
        preclinical: 0.65,
        phase1: 0.78,
        phase2: 0.58,
        phase3: 0.72,
        nda: 0.88,
        launch: 0.95,
      },
      launchYear: 2027,
    },
    yearlyData: [
      { year: 'Year 0 (2026)', revenue: 0, cogs: 0, sga: 0, developmentCost: -200, tax: 0, fcf: -200, discountedFcf: -200, cumulativeFcf: -200 },
      { year: 'Year 1 (2027)', revenue: 420, cogs: -76, sga: -92, developmentCost: -80, tax: -60, fcf: 112, discountedFcf: 100, cumulativeFcf: -100 },
      { year: 'Year 2 (2028)', revenue: 680, cogs: -122, sga: -150, developmentCost: -40, tax: -81, fcf: 287, discountedFcf: 229, cumulativeFcf: 129 },
      { year: 'Year 3 (2029)', revenue: 950, cogs: -171, sga: -209, developmentCost: -20, tax: -121, fcf: 429, discountedFcf: 305, cumulativeFcf: 434 },
      { year: 'Year 4 (2030)', revenue: 1100, cogs: -198, sga: -242, developmentCost: 0, tax: -145, fcf: 515, discountedFcf: 327, cumulativeFcf: 761 },
      { year: 'Year 5 (2031)', revenue: 1200, cogs: -216, sga: -264, developmentCost: 0, tax: -160, fcf: 560, discountedFcf: 317, cumulativeFcf: 1078 },
    ],
    npv: 1078,
    riskAdjustedNpv: 763,
    irr: 28.4,
    breakEvenYear: 2028,
    probabilityOfSuccess: 0.284,
    scenarios: [
      { name: 'Conservative', revenue: 680, ebitda: 204, npv: 520, riskAdjustedNpv: 320, breakEvenYear: 2030, marketShare: 30, price: 12000000 },
      { name: 'Base', revenue: 985, ebitda: 354, npv: 1078, riskAdjustedNpv: 763, breakEvenYear: 2028, marketShare: 45, price: 14060000 },
      { name: 'Optimistic', revenue: 1380, ebitda: 580, npv: 1820, riskAdjustedNpv: 1260, breakEvenYear: 2027, marketShare: 60, price: 16000000 },
    ],
    sensitivityItems: [
      { variable: 'Drug Price', low: -380, base: 0, high: 420, impact: 800 },
      { variable: 'Patient Number', low: -290, base: 0, high: 310, impact: 600 },
      { variable: 'Market Share', low: -250, base: 0, high: 280, impact: 530 },
      { variable: 'Gross Margin', low: -180, base: 0, high: 200, impact: 380 },
      { variable: 'Development Cost', low: -150, base: 0, high: 120, impact: 270 },
      { variable: 'Discount Rate', low: 180, base: 0, high: -140, impact: 320 },
      { variable: 'Launch Year', low: -200, base: 0, high: 160, impact: 360 },
      { variable: 'Probability of Success', low: -320, base: 0, high: 290, impact: 610 },
    ],
  },

  // ============================================================
  // PART 10 – CONCLUSION
  // ============================================================
  part10: {
    decision: 'CONDITIONAL_DEVELOP',
    decisionRationale: [
      'NPV (+1,078억원) 및 Risk-adjusted NPV (+763억원) 모두 양수로 기본 사업성 확인',
      'NCCN Category 1 / ESMO Grade A 권고로 임상적 근거 최상위 수준',
      '국내 EGFR NSCLC 환자 증가세 지속 및 뇌전이 환자군에서 차별화된 유효성',
      '핵심 화합물 특허 2031년 만료로 특허 위험이 주요 제한요인',
      '경쟁사(Lazertinib+Amivantamab) 병용요법 확대에 따른 시장 잠식 가능성 모니터링 필요',
    ],
    conditions: [
      '핵심 화합물 특허(US8,946,235) 2031년 만료 이전 시장 확대 전략 구체화 필요',
      'FLAURA2 (Osimertinib + Chemotherapy) 병용요법 데이터 확인 후 적응증 확장 결정',
      '급여 재협상 시 예상 약가 ₩36,000/정 이상 유지 가능성 확인 필요',
      'Lazertinib/Amivantamab 병용 시장 점유율 추이 6개월 단위 모니터링',
    ],
    developmentScore: 74,
    scoreBreakdown: [
      { category: 'Clinical Value', weight: 20, score: 92, weightedScore: 18.4, rationale: 'NCCN Category 1, ESMO Grade A, OS 38.6개월로 압도적 임상 근거' },
      { category: 'Unmet Need', weight: 15, score: 78, weightedScore: 11.7, rationale: '1차 치료에서의 미충족 수요는 기존보다 감소했으나 CNS 전이 환자군에서 여전히 높음' },
      { category: 'Market Attractiveness', weight: 15, score: 82, weightedScore: 12.3, rationale: '글로벌 시장 CAGR 15.8%, 국내 시장 지속 성장' },
      { category: 'Patent/FTO', weight: 15, score: 35, weightedScore: 5.3, rationale: '2031년 화합물 특허 만료로 High Risk. 최대 제한요인' },
      { category: 'Regulatory Feasibility', weight: 10, score: 95, weightedScore: 9.5, rationale: '허가 완료, 급여 등재 완료로 위험 최소' },
      { category: 'Pricing', weight: 10, score: 72, weightedScore: 7.2, rationale: '현행 급여가 유지 가능성 높으나 약가 재협상 리스크 존재' },
      { category: 'Development Feasibility', weight: 5, score: 88, weightedScore: 4.4, rationale: '이미 허가된 제품으로 개발 실현 가능성 높음' },
      { category: 'Commercial Potential', weight: 5, score: 80, weightedScore: 4.0, rationale: '확립된 브랜드 및 처방 습관' },
      { category: 'NPV', weight: 5, score: 76, weightedScore: 3.8, rationale: 'Base NPV +1,078억원으로 긍정적' },
    ],
    executiveSummaryText:
      '본 품목(Osimertinib, DEMO)은 현재 치료환경에서 EGFR 변이 NSCLC 환자의 뇌전이 및 1차 치료 미충족 수요를 해결할 가능성이 있으며, FLAURA 임상을 통해 PFS 18.9개월, OS 38.6개월의 임상적 우월성이 확인된다. 다만 핵심 화합물 특허 2031년 만료 및 경쟁사 병용요법 확대가 주요 제한요인이다. 예상 약가 ₩38,540/정, 예상 시장점유율 45%를 가정할 경우 5-year NPV는 +1,078억원이며 risk-adjusted NPV는 +763억원이다. 따라서 본 품목은 특허 대응전략 및 적응증 확대 조건 하에 CONDITIONAL DEVELOP이 적절하다.',
    keyRisks: [
      '핵심 화합물 특허 2031년 만료 → 제네릭 진입 가속',
      'Lazertinib/Amivantamab 병용요법의 1차 치료 진입으로 시장 잠식',
      '급여가 재협상에 따른 수익성 악화 가능성',
      'C797S 내성으로 인한 환자 이탈 증가',
    ],
    keyOpportunities: [
      'Adjuvant 치료 적응증 확대로 환자 풀 2배 이상 확장 가능',
      '바이오마커(ctDNA) 기반 모니터링 서비스 동반 가치 창출',
      'FLAURA2 병용요법 데이터 기반 새로운 1차 치료 표준 선점',
      '뇌전이 환자 전문 클리닉 연계 처방 확대',
    ],
  },

  // ============================================================
  // RISK PANEL
  // ============================================================
  riskPanel: {
    overall: 'MODERATE',
    clinical: 'LOW',
    regulatory: 'LOW',
    patent: 'HIGH',
    market: 'MODERATE',
    pricing: 'MODERATE',
    financial: 'LOW',
  },

  // ============================================================
  // PART 11 – REFERENCES (DEMO)
  // ============================================================
  part11: {
    references: [
      {
        id: 1,
        category: 'regulatory',
        title: 'Tagrisso® 처방 정보 (Prescribing Information)',
        authors: 'U.S. Food and Drug Administration (FDA)',
        source: 'FDA 공식 문서',
        year: '2015',
        url: 'https://www.accessdata.fda.gov/drugsatfda_docs/label/2015/208065s000lbl.pdf',
      },
      {
        id: 2,
        category: 'clinical',
        title: 'FLAURA: 미치료 EGFR 변이 진행성 비소세포폐암에서 오시머티닙의 효능 (Osimertinib in Untreated EGFR-Mutated Advanced NSCLC)',
        authors: 'Soria JC, Ohe Y, Vansteenkiste J, et al.',
        source: 'New England Journal of Medicine (NEJM)',
        year: '2018',
        url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa1810483',
        doi: '10.1056/NEJMoa1810483',
      },
      {
        id: 3,
        category: 'guideline',
        title: 'NCCN 임상 실무 가이드라인: 비소세포폐암 v2.2026 (NCCN Clinical Practice Guidelines: Non-Small Cell Lung Cancer v2.2026)',
        authors: 'National Comprehensive Cancer Network (NCCN)',
        source: 'NCCN Guidelines',
        year: '2026',
        url: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1450',
      },
      {
        id: 4,
        category: 'regulatory',
        title: '요양급여 적용기준 (2026년)',
        authors: '건강보험심사평가원 (HIRA)',
        source: '건강보험심사평가원',
        year: '2026',
        url: 'https://www.hira.or.kr',
      },
    ],
  },
};
