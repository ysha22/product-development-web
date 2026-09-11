import { useState } from 'react';
import { AlertTriangle, ExternalLink, Info } from 'lucide-react';
import type { ReportData, ClinicalTrial } from '../../types';
import { SectionCard } from '../shared/SectionCard';
import { EvidenceBadge } from '../shared/EvidenceBadge';

/* 한글 레이블 매핑 */
const DESIGN_LABELS: Record<string, string> = {
  'Design':         '연구 설계',
  'Randomization':  '무작위 배정',
  'Blinding':       '눈가림',
  'Population':     '대상 환자군',
  'Intervention':   '시험군',
  'Comparator':     '대조군',
  'n':              '샘플 수',
  'Follow-up':      '추적 기간',
};

const ENDPOINT_TOOLTIPS: Record<string, string> = {
  PFS: '무진행 생존기간 (Progression-Free Survival) — 질병 진행 또는 사망까지의 시간. 값이 클수록 효과가 좋음.',
  OS:  '전체 생존기간 (Overall Survival) — 어떤 원인으로든 사망할 때까지의 시간. 항암제 최종 유효성 지표.',
  ORR: '객관적 반응률 (Objective Response Rate) — 종양이 ≥30% 감소한 환자 비율.',
  DOR: '반응 지속기간 (Duration of Response) — 종양 반응 확인 시점부터 진행·사망까지의 기간.',
  HR:  '위험비 (Hazard Ratio) — 1보다 작을수록 시험군의 위험이 낮음. 0.46 = 54% 위험 감소.',
  CI:  '95% 신뢰구간 (Confidence Interval) — 해당 범위 내에 참값이 있을 확률 95%.',
  'p-value': 'p값 — 우연에 의한 차이일 확률. <0.05면 통계적으로 유의.',
};

/* 레퍼런스 번호 배지 */
function RefBadge({ ids }: { ids?: number[] }) {
  if (!ids || ids.length === 0) return null;
  return (
    <span className="inline-flex gap-0.5 ml-1">
      {ids.map(id => (
        <a
          key={id}
          href="#part11"
          className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-xs font-bold hover:bg-blue-200"
          title={`레퍼런스 [${id}] 보기`}
        >
          {id}
        </a>
      ))}
    </span>
  );
}

function Tooltip({ label, tip, value, color }: { label: string; tip?: string; value?: string; color?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="flex items-center gap-1 text-xs text-gray-500 cursor-help" data-tooltip={tip ?? ''}>
        {label} {tip && <Info className="w-3 h-3 text-gray-400" />}
      </span>
      {value && <span className={`text-sm font-bold ${color ?? 'text-gray-900'}`}>{value}</span>}
    </div>
  );
}

function PivotalCard({ trial }: { trial: ClinicalTrial }) {
  return (
    <div className="card border-t-4 border-t-blue-600 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-blue-600 text-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded">핵심 임상시험 (Pivotal Study)</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded">{trial.phase}</span>
            </div>
            {/* 연구명: 한글 있으면 우선, 영문 병기 */}
            <h4 className="text-lg font-black">{trial.studyName}</h4>
            {trial.clinicalTrialsId && (
              <p className="text-xs text-blue-100 mt-0.5">
                등록번호: {trial.clinicalTrialsId}
              </p>
            )}
          </div>
          <div className="text-right text-xs text-blue-100">
            <p>대상 환자 n = {trial.sampleSize.toLocaleString()}</p>
            <p>추적 기간: {trial.followUp}</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Design */}
        <div className="grid grid-cols-3 gap-3 text-xs">
          {[
            { en: 'Design',        value: trial.design },
            { en: 'Randomization', value: trial.randomization },
            { en: 'Blinding',      value: trial.blinding },
            { en: 'Population',    value: trial.population },
            { en: 'Intervention',  value: trial.intervention },
            { en: 'Comparator',    value: trial.comparator },
          ].map(({ en, value }) => (
            <div key={en}>
              <p className="font-semibold text-gray-500 mb-0.5">
                {DESIGN_LABELS[en]}
                <span className="text-gray-400 font-normal ml-1">({en})</span>
              </p>
              <p className="text-gray-800">{value}</p>
            </div>
          ))}
        </div>

        {/* Primary endpoint */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-xs">
          <p className="font-semibold text-gray-500 mb-0.5">일차 평가변수 (Primary Endpoint)</p>
          <p className="text-gray-800">{trial.primaryEndpoint}</p>
        </div>

        {/* Endpoints */}
        <div>
          <p className="label-text mb-3">주요 결과 지표 (Key Endpoints)</p>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'PFS (무진행 생존)', tip: ENDPOINT_TOOLTIPS.PFS, value: trial.endpoints.pfs, color: 'text-blue-700' },
              { label: 'OS (전체 생존)',    tip: ENDPOINT_TOOLTIPS.OS,  value: trial.endpoints.os,  color: 'text-blue-700' },
              { label: 'ORR (반응률)',      tip: ENDPOINT_TOOLTIPS.ORR, value: trial.endpoints.orr, color: 'text-green-700' },
              { label: 'DOR (반응 지속)',   tip: ENDPOINT_TOOLTIPS.DOR, value: trial.endpoints.dor, color: 'text-gray-900' },
            ].map(ep => (
              <div key={ep.label} className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <Tooltip label={ep.label} tip={ep.tip} value={ep.value ?? 'N/A'} color={ep.color} />
              </div>
            ))}
            {[
              { label: 'HR (위험비)',   tip: ENDPOINT_TOOLTIPS.HR, value: trial.endpoints.hr },
              { label: '95% CI',        tip: ENDPOINT_TOOLTIPS.CI, value: trial.endpoints.ci95 },
              { label: 'p값 (p-value)', tip: ENDPOINT_TOOLTIPS['p-value'], value: trial.endpoints.pValue, color: 'text-purple-700' },
            ].map(ep => (
              <div key={ep.label} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <Tooltip label={ep.label} tip={ep.tip} value={ep.value ?? 'N/A'} color={ep.color} />
              </div>
            ))}
          </div>
        </div>

        {/* Safety */}
        <div>
          <p className="label-text mb-3">안전성 프로파일 (Safety Profile)</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid grid-cols-2 gap-2">
              {[
                { ko: '3등급 이상 이상반응', en: 'Grade ≥3 AE',     value: trial.safety.grade3PlusAE },
                { ko: '중대한 이상반응',     en: 'SAE',              value: trial.safety.sae },
                { ko: '투약 중단율',         en: 'Discontinuation',  value: trial.safety.discontinuation },
                { ko: '사망률',              en: 'Death Rate',       value: trial.safety.deathRate },
              ].map(({ ko, en, value }) => value && (
                <div key={en} className="p-2 bg-red-50 rounded border border-red-100">
                  <p className="text-xs text-gray-500">{ko}</p>
                  <p className="text-xs text-gray-400">{en}</p>
                  <p className="text-sm font-bold text-red-700">{value}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1.5">주요 이상반응 신호 (Safety Signal)</p>
              <ul className="space-y-0.5">
                {trial.safety.majorSafetySignals.map((s, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-gray-700">
                    <span className="text-red-400 mt-0.5">·</span>{s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Reference */}
        <div className="pt-3 border-t border-gray-100">
          <p className="label-text mb-1.5 flex items-center gap-1">
            <EvidenceBadge level="B" />
            참고문헌 (Reference)
            <RefBadge ids={trial.refIds} />
          </p>
          <p className="text-xs text-gray-600 leading-relaxed">{trial.reference}</p>
          {trial.doi && (
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-xs text-blue-600">DOI: {trial.doi}</span>
              {trial.pubmedUrl && (
                <a href={trial.pubmedUrl} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800">
                  <ExternalLink className="w-3 h-3" /> PubMed
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NonPivotalCard({ trial }: { trial: ClinicalTrial }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="card">
      <button
        className="w-full card-header flex items-center justify-between text-left"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center gap-3">
          <span className="badge badge-gray">{trial.phase}</span>
          <span className="font-semibold text-gray-900">{trial.studyName}</span>
          {trial.clinicalTrialsId && <span className="text-xs text-gray-500">{trial.clinicalTrialsId}</span>}
          <RefBadge ids={trial.refIds} />
        </div>
        <div className="flex items-center gap-4 text-sm">
          {trial.endpoints.pfs && <span className="text-blue-600 font-medium">PFS {trial.endpoints.pfs}</span>}
          {trial.endpoints.orr && <span className="text-green-600 font-medium">ORR {trial.endpoints.orr}</span>}
          <span className="text-gray-400">{expanded ? '▲' : '▼'}</span>
        </div>
      </button>
      {expanded && (
        <div className="card-body space-y-3">
          <div className="grid grid-cols-3 gap-3 text-xs">
            {[
              { en: 'Design',      value: trial.design },
              { en: 'n',           value: trial.sampleSize.toString() },
              { en: 'Population',  value: trial.population },
              { en: 'Intervention',value: trial.intervention },
              { en: 'Comparator',  value: trial.comparator },
              { en: 'Follow-up',   value: trial.followUp },
            ].map(({ en, value }) => (
              <div key={en}>
                <p className="text-gray-500 mb-0.5">
                  {DESIGN_LABELS[en] ?? en}
                  {DESIGN_LABELS[en] && <span className="text-gray-400 font-normal ml-1">({en})</span>}
                </p>
                <p className="font-medium">{value}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 italic">{trial.reference}</p>
        </div>
      )}
    </div>
  );
}

interface Props { report: ReportData }

export function Part4Clinical({ report }: Props) {
  const { part4: p } = report;
  const pivotals = p.trials.filter(t => t.isPivotal);
  const others = p.trials.filter(t => !t.isPivotal);

  return (
    <section id="part4" className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Part 4. 핵심 임상논문</h2>
        <p className="text-sm text-gray-500 mt-0.5">임상시험 근거 · 안전성 · 경쟁 제품 비교 (Clinical Evidence · Safety · Competitor Comparison)</p>
      </div>

      {pivotals.map(t => <PivotalCard key={t.id} trial={t} />)}

      {others.length > 0 && (
        <div>
          <h3 className="section-title mb-3">지지 임상시험 (Supporting Studies)</h3>
          <div className="space-y-2">
            {others.map(t => <NonPivotalCard key={t.id} trial={t} />)}
          </div>
        </div>
      )}

      {/* Competitor Comparison */}
      <SectionCard title="임상시험 비교" subtitle="간접 비교 (Cross-trial Indirect Comparison)" noPad>
        {p.crossTrialWarning && (
          <div className="mx-5 mt-4 flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed font-medium">
              간접 비교는 환자군·연구 설계·추적 기간·평가변수 정의가 다를 수 있으므로 해석에 주의가 필요합니다.
              (Cross-trial comparison should be interpreted with caution.)
            </p>
          </div>
        )}
        <div className="mt-4">
          <table className="table-professional">
            <thead>
              <tr>
                <th>제품명</th>
                <th className="text-right">ORR (반응률)</th>
                <th className="text-right">중앙 PFS</th>
                <th className="text-right">중앙 OS</th>
                <th className="text-right">HR (위험비)</th>
                <th className="text-right">3등급 이상 AE</th>
                <th className="text-right">투약 중단율</th>
                <th>임상시험명</th>
              </tr>
            </thead>
            <tbody>
              {p.competitorComparison.map((c, i) => (
                <tr key={i} className={i === 0 ? 'bg-blue-50/50 font-medium' : ''}>
                  <td className={i === 0 ? 'font-semibold text-blue-700' : ''}>{c.productName}</td>
                  <td className="text-right">{c.orr ?? 'N/A'}</td>
                  <td className="text-right font-medium text-blue-700">{c.medianPfs ?? 'N/A'}</td>
                  <td className="text-right">{c.medianOs ?? 'N/A'}</td>
                  <td className="text-right">{c.hr ?? 'N/A'}</td>
                  <td className="text-right text-red-600">{c.grade3PlusAE ?? 'N/A'}</td>
                  <td className="text-right">{c.discontinuation ?? 'N/A'}</td>
                  <td className="text-xs text-gray-500">{c.studyName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </section>
  );
}
