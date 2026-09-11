import type { ReportData, PatentType, Patent } from '../../types';
import { SectionCard } from '../shared/SectionCard';
import { RiskBadge } from '../shared/RiskBadge';
import { AlertTriangle } from 'lucide-react';

/* 특허 유형 한글 우선 */
const PATENT_TYPE_LABELS: Record<PatentType, { ko: string; en: string }> = {
  compound:            { ko: '화합물 특허',     en: 'Compound' },
  composition:         { ko: '조성물 특허',     en: 'Composition' },
  formulation:         { ko: '제형 특허',       en: 'Formulation' },
  polymorph:           { ko: '결정형 특허',     en: 'Polymorph' },
  salt:                { ko: '염 특허',         en: 'Salt' },
  method_of_treatment: { ko: '치료방법 특허',   en: 'Method of Treatment' },
  use_patent:          { ko: '용도 특허',       en: 'Use Patent' },
  manufacturing:       { ko: '제조방법 특허',   en: 'Manufacturing' },
  combination:         { ko: '병용 특허',       en: 'Combination' },
  dosage_regimen:      { ko: '용법·용량 특허',  en: 'Dosage Regimen' },
};

const STATUS_LABELS: Record<string, { ko: string; color: string }> = {
  granted:   { ko: '등록',   color: 'badge-green' },
  pending:   { ko: '출원 중', color: 'badge-amber' },
  expired:   { ko: '만료',   color: 'badge-gray' },
  abandoned: { ko: '포기',   color: 'badge-red' },
};

const JURISDICTION_LABELS: Record<string, string> = {
  US: '미국',
  EU: '유럽',
  KR: '한국',
  JP: '일본',
  CN: '중국',
};

/* 레퍼런스 번호 배지 */
function RefBadge({ ids }: { ids?: number[] }) {
  if (!ids || ids.length === 0) return null;
  return (
    <span className="inline-flex gap-0.5 ml-1">
      {ids.map(id => (
        <a key={id} href="#part11"
          className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-xs font-bold hover:bg-blue-200"
          title={`레퍼런스 [${id}] 보기`}
        >
          {id}
        </a>
      ))}
    </span>
  );
}

function PatentTimeline({ patents, launchYear }: { patents: Patent[]; launchYear: number }) {
  const baseYear = 2010;
  const endYear  = 2040;
  const totalSpan = endYear - baseYear;

  return (
    <div className="space-y-3">
      <div className="flex items-center ml-36">
        {Array.from({ length: 7 }, (_, i) => baseYear + i * 5).map(y => (
          <div key={y} className="flex-1 text-xs text-gray-400 text-center border-l border-gray-200 pt-1">{y}</div>
        ))}
      </div>
      {patents.map(pat => {
        const startYear = parseInt(pat.priorityDate.slice(0, 4));
        const expYear   = parseInt(pat.expirationDate.slice(0, 4));
        const leftPct   = ((startYear - baseYear) / totalSpan) * 100;
        const widthPct  = ((expYear - startYear)  / totalSpan) * 100;
        const launchPct = ((launchYear - baseYear) / totalSpan) * 100;
        const typeLabel = PATENT_TYPE_LABELS[pat.patentType];
        return (
          <div key={pat.id} className="flex items-center gap-2">
            <div className="w-36 text-right flex-shrink-0">
              <p className="text-xs font-semibold text-gray-700 truncate">{pat.patentNo.split(',')[0]}</p>
              <p className="text-xs text-gray-400">{typeLabel.ko}</p>
            </div>
            <div className="flex-1 relative h-7 bg-gray-50 rounded border border-gray-100 overflow-hidden">
              <div
                className={`absolute top-1 bottom-1 rounded flex items-center justify-end px-1.5 ${
                  pat.riskLevel === 'HIGH' || pat.riskLevel === 'CRITICAL' ? 'bg-red-400'
                  : pat.riskLevel === 'MODERATE' ? 'bg-amber-400'
                  : 'bg-green-400'
                }`}
                style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
              >
                <span className="text-white text-xs font-bold truncate">{expYear}</span>
              </div>
              <div className="absolute top-0 bottom-0 w-0.5 bg-blue-600" style={{ left: `${launchPct}%` }}>
                <div className="absolute -top-1 -left-2 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">L</span>
                </div>
              </div>
            </div>
            <RiskBadge level={pat.riskLevel} size="xs" />
          </div>
        );
      })}
      <div className="flex items-center gap-4 ml-36 pt-1">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-blue-600" />
          <span className="text-xs text-gray-500">예상 출시 ({launchYear}) / Expected Launch</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-red-400" />
          <span className="text-xs text-gray-500">고위험 특허 (HIGH Risk)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-amber-400" />
          <span className="text-xs text-gray-500">중위험 (MODERATE)</span>
        </div>
      </div>
    </div>
  );
}

interface Props { report: ReportData }

export function Part6Patent({ report }: Props) {
  const { part6: p } = report;

  return (
    <section id="part6" className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Part 6. 특허현황</h2>
        <p className="text-sm text-gray-500 mt-0.5">특허 포트폴리오 · FTO 분석 · 특허 타임라인 (Patent Portfolio · FTO Analysis · Timeline)</p>
      </div>

      {/* Patent Table */}
      <SectionCard title="특허 목록 (Patent List)" noPad>
        <table className="table-professional">
          <thead>
            <tr>
              <th>특허번호 (Patent No.)</th>
              <th>관할 (Jurisdiction)</th>
              <th>유형 (Type)</th>
              <th>우선일 (Priority)</th>
              <th>등록일 (Grant)</th>
              <th>만료일 (Expiration)</th>
              <th>상태 (Status)</th>
              <th>위험도</th>
            </tr>
          </thead>
          <tbody>
            {p.patents.map(pat => {
              const typeLabel = PATENT_TYPE_LABELS[pat.patentType];
              const statusLabel = STATUS_LABELS[pat.status];
              return (
                <tr key={pat.id}>
                  <td className="font-mono text-xs font-semibold text-blue-700">
                    {pat.patentNo}
                    <RefBadge ids={pat.refIds} />
                  </td>
                  <td>
                    <span className="badge badge-gray">
                      {JURISDICTION_LABELS[pat.jurisdiction] ?? pat.jurisdiction}
                      <span className="text-gray-400 ml-1">({pat.jurisdiction})</span>
                    </span>
                  </td>
                  <td className="text-xs">
                    {typeLabel.ko}
                    <span className="text-gray-400 ml-1">({typeLabel.en})</span>
                  </td>
                  <td className="text-xs text-gray-500">{pat.priorityDate}</td>
                  <td className="text-xs">{pat.grantDate}</td>
                  <td className="text-xs font-semibold text-gray-900">{pat.expirationDate}</td>
                  <td>
                    <span className={`badge ${statusLabel?.color ?? 'badge-gray'}`}>
                      {statusLabel?.ko ?? pat.status}
                    </span>
                  </td>
                  <td><RiskBadge level={pat.riskLevel} size="xs" /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </SectionCard>

      {/* Key Claims */}
      <div className="grid grid-cols-2 gap-4">
        {p.patents.slice(0, 4).map(pat => {
          const typeLabel = PATENT_TYPE_LABELS[pat.patentType];
          return (
            <div key={pat.id} className="card p-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div>
                  <p className="text-xs font-bold text-blue-700">
                    {pat.patentNo}
                    <RefBadge ids={pat.refIds} />
                  </p>
                  <p className="text-xs text-gray-500">
                    {typeLabel.ko}
                    <span className="text-gray-400 ml-1">({typeLabel.en})</span>
                    {' · '}
                    {JURISDICTION_LABELS[pat.jurisdiction] ?? pat.jurisdiction}
                  </p>
                </div>
                <RiskBadge level={pat.riskLevel} size="xs" />
              </div>
              <p className="text-xs font-semibold text-gray-600 mb-1">주요 청구항 (Key Claims)</p>
              <ul className="space-y-1 mb-2">
                {pat.keyClaims.map((claim, i) => (
                  <li key={i} className="text-xs text-gray-700 flex items-start gap-1.5">
                    <span className="text-blue-400 font-bold mt-0.5">·</span>
                    <span>{claim}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-500 italic border-t border-gray-100 pt-2">{pat.riskNote}</p>
            </div>
          );
        })}
      </div>

      {/* Patent Timeline */}
      <SectionCard title="특허 타임라인 (Patent Timeline)" subtitle="특허 우선일 → 만료일 · 파란 점(L): 예상 출시연도">
        <PatentTimeline patents={p.patents} launchYear={p.expectedLaunchYear} />
      </SectionCard>

      {/* FTO Analysis */}
      <SectionCard
        title="FTO 분석 (Freedom-to-Operate Analysis)"
        subtitle="예비 스크리닝 — 법적 효력 있는 특허 의견서 아님 (Preliminary Screening – Not a Legal Opinion)"
        badge={<RiskBadge level={p.ftoAnalysis.overallFTORisk} size="md" />}
      >
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { ko: '핵심 화합물', en: 'Core Compound',  risk: p.ftoAnalysis.coreCompound },
            { ko: '제형',        en: 'Formulation',    risk: p.ftoAnalysis.formulation },
            { ko: '용도 특허',   en: 'Use Patent',     risk: p.ftoAnalysis.usePatent },
            { ko: '병용 특허',   en: 'Combination',    risk: p.ftoAnalysis.combination },
            { ko: '제조 특허',   en: 'Manufacturing',  risk: p.ftoAnalysis.manufacturing },
          ].map(({ ko, en, risk }) => (
            <div key={en} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-gray-700 block">{ko}</span>
                <span className="text-xs text-gray-400">{en}</span>
              </div>
              <RiskBadge level={risk} size="xs" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs mb-4">
          {[
            { ko: '특허 존속기간',    en: 'Patent Term',         value: p.ftoAnalysis.patentTerm },
            { ko: '특허 기간 연장',   en: 'SPC/PTE',             value: p.ftoAnalysis.spcPte },
            { ko: '소송 이력',        en: 'Litigation History',  value: p.ftoAnalysis.litigationHistory },
            { ko: 'Orange Book',      en: 'Orange Book',         value: p.ftoAnalysis.orangeBookStatus },
            { ko: '국내 특허 현황',   en: 'Korea Patent',        value: p.ftoAnalysis.koreaPatentStatus },
          ].map(({ ko, en, value }) => (
            <div key={en}>
              <p className="font-medium text-gray-500 mb-0.5">
                {ko}
                <span className="text-gray-400 font-normal ml-1">({en})</span>
              </p>
              <p className="text-gray-800">{value}</p>
            </div>
          ))}
        </div>
        <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>주의:</strong> {p.ftoAnalysis.disclaimer}
          </p>
        </div>
      </SectionCard>
    </section>
  );
}
