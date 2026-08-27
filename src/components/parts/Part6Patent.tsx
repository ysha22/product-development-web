import type { ReportData, PatentType, Patent } from '../../types';
import { SectionCard } from '../shared/SectionCard';
import { RiskBadge } from '../shared/RiskBadge';
import { AlertTriangle } from 'lucide-react';

const PATENT_TYPE_LABELS: Record<PatentType, string> = {
  compound:           'Compound',
  composition:        'Composition',
  formulation:        'Formulation',
  polymorph:          'Polymorph',
  salt:               'Salt',
  method_of_treatment:'Method of Treatment',
  use_patent:         'Use Patent',
  manufacturing:      'Manufacturing',
  combination:        'Combination',
  dosage_regimen:     'Dosage Regimen',
};

const STATUS_COLORS: Record<string, string> = {
  granted:   'badge-green',
  pending:   'badge-amber',
  expired:   'badge-gray',
  abandoned: 'badge-red',
};

function PatentTimeline({ patents, launchYear }: { patents: Patent[]; launchYear: number }) {
  const baseYear = 2010;
  const endYear = 2040;
  const totalSpan = endYear - baseYear;

  return (
    <div className="space-y-3">
      {/* Year ruler */}
      <div className="flex items-center ml-36">
        {Array.from({ length: 7 }, (_, i) => baseYear + i * 5).map(y => (
          <div key={y} className="flex-1 text-xs text-gray-400 text-center border-l border-gray-200 pt-1">
            {y}
          </div>
        ))}
      </div>
      {/* Patent bars */}
      {patents.map(pat => {
        const startYear = parseInt(pat.priorityDate.slice(0, 4));
        const expYear = parseInt(pat.expirationDate.slice(0, 4));
        const leftPct = ((startYear - baseYear) / totalSpan) * 100;
        const widthPct = ((expYear - startYear) / totalSpan) * 100;
        const launchPct = ((launchYear - baseYear) / totalSpan) * 100;

        return (
          <div key={pat.id} className="flex items-center gap-2">
            <div className="w-36 text-right flex-shrink-0">
              <p className="text-xs font-semibold text-gray-700 truncate">{pat.patentNo.split(',')[0]}</p>
              <p className="text-xs text-gray-400">{PATENT_TYPE_LABELS[pat.patentType]}</p>
            </div>
            <div className="flex-1 relative h-7 bg-gray-50 rounded border border-gray-100 overflow-hidden">
              {/* Patent bar */}
              <div
                className={`absolute top-1 bottom-1 rounded flex items-center justify-end px-1.5 ${
                  pat.riskLevel === 'HIGH' || pat.riskLevel === 'CRITICAL'
                    ? 'bg-red-400'
                    : pat.riskLevel === 'MODERATE'
                    ? 'bg-amber-400'
                    : 'bg-green-400'
                }`}
                style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
              >
                <span className="text-white text-xs font-bold truncate">{expYear}</span>
              </div>
              {/* Launch marker */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-blue-600"
                style={{ left: `${launchPct}%` }}
              >
                <div className="absolute -top-1 -left-2 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">L</span>
                </div>
              </div>
            </div>
            <RiskBadge level={pat.riskLevel} size="xs" />
          </div>
        );
      })}
      {/* Legend */}
      <div className="flex items-center gap-4 ml-36 pt-1">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-blue-600" />
          <span className="text-xs text-gray-500">Expected Launch ({launchYear})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-red-400" />
          <span className="text-xs text-gray-500">HIGH Risk Patent</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-amber-400" />
          <span className="text-xs text-gray-500">MODERATE Risk</span>
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
        <p className="text-sm text-gray-500 mt-0.5">Patent Portfolio · FTO Analysis · Patent Timeline</p>
      </div>

      {/* Patent Table */}
      <SectionCard title="특허 목록" noPad>
        <table className="table-professional">
          <thead>
            <tr>
              <th>Patent No.</th><th>Jurisdiction</th><th>Type</th><th>Priority</th>
              <th>Grant</th><th>Expiration</th><th>Status</th><th>Risk</th>
            </tr>
          </thead>
          <tbody>
            {p.patents.map(pat => (
              <tr key={pat.id}>
                <td className="font-mono text-xs font-semibold text-blue-700">{pat.patentNo}</td>
                <td><span className="badge badge-gray">{pat.jurisdiction}</span></td>
                <td className="text-xs">{PATENT_TYPE_LABELS[pat.patentType]}</td>
                <td className="text-xs text-gray-500">{pat.priorityDate}</td>
                <td className="text-xs">{pat.grantDate}</td>
                <td className="text-xs font-semibold text-gray-900">{pat.expirationDate}</td>
                <td><span className={`badge ${STATUS_COLORS[pat.status] ?? 'badge-gray'}`}>{pat.status}</span></td>
                <td><RiskBadge level={pat.riskLevel} size="xs" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      {/* Key Claims */}
      <div className="grid grid-cols-2 gap-4">
        {p.patents.slice(0, 4).map(pat => (
          <div key={pat.id} className="card p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div>
                <p className="text-xs font-bold text-blue-700">{pat.patentNo}</p>
                <p className="text-xs text-gray-500">{PATENT_TYPE_LABELS[pat.patentType]} · {pat.jurisdiction}</p>
              </div>
              <RiskBadge level={pat.riskLevel} size="xs" />
            </div>
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
        ))}
      </div>

      {/* Patent Timeline */}
      <SectionCard title="Patent Timeline" subtitle="특허 우선일 → 만료일 · 파란 점(L): 예상 출시연도">
        <PatentTimeline patents={p.patents} launchYear={p.expectedLaunchYear} />
      </SectionCard>

      {/* FTO Analysis */}
      <SectionCard
        title="FTO (Freedom-to-Operate) Analysis"
        subtitle="Preliminary Screening – Not a Legal Opinion"
        badge={<RiskBadge level={p.ftoAnalysis.overallFTORisk} size="md" />}
      >
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: 'Core Compound',    risk: p.ftoAnalysis.coreCompound },
            { label: 'Formulation',      risk: p.ftoAnalysis.formulation },
            { label: 'Use Patent',       risk: p.ftoAnalysis.usePatent },
            { label: 'Combination',      risk: p.ftoAnalysis.combination },
            { label: 'Manufacturing',    risk: p.ftoAnalysis.manufacturing },
          ].map(({ label, risk }) => (
            <div key={label} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-700">{label}</span>
              <RiskBadge level={risk} size="xs" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs mb-4">
          {[
            { label: 'Patent Term', value: p.ftoAnalysis.patentTerm },
            { label: 'SPC/PTE', value: p.ftoAnalysis.spcPte },
            { label: 'Litigation History', value: p.ftoAnalysis.litigationHistory },
            { label: 'Orange Book', value: p.ftoAnalysis.orangeBookStatus },
            { label: 'Korea Patent', value: p.ftoAnalysis.koreaPatentStatus },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="font-medium text-gray-500 mb-0.5">{label}</p>
              <p className="text-gray-800">{value}</p>
            </div>
          ))}
        </div>
        {/* Disclaimer */}
        <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>Disclaimer:</strong> {p.ftoAnalysis.disclaimer}
          </p>
        </div>
      </SectionCard>
    </section>
  );
}
