import type { ReportData } from '../../types';
import { SectionCard } from '../shared/SectionCard';
import { RiskBadge } from '../shared/RiskBadge';
import { CheckCircle, XCircle } from 'lucide-react';

interface Props { report: ReportData }

const CATEGORY_COLORS: Record<string, string> = {
  Clinical:      '#2563eb',
  Regulatory:    '#7c3aed',
  CMC:           '#0891b2',
  Patent:        '#dc2626',
  Pricing:       '#d97706',
  Market:        '#059669',
  Manufacturing: '#6366f1',
  Commercial:    '#ec4899',
};

function HeatmapCell({ prob, impact }: { prob: number; impact: number }) {
  const score = prob * impact;
  const bg =
    score >= 16 ? 'bg-red-600 text-white' :
    score >= 9  ? 'bg-red-400 text-white' :
    score >= 6  ? 'bg-amber-400 text-white' :
    score >= 3  ? 'bg-amber-200 text-amber-900' :
                  'bg-green-100 text-green-800';
  return (
    <div className={`w-9 h-9 flex items-center justify-center rounded text-xs font-bold ${bg}`}>
      {score}
    </div>
  );
}

export function Part8Regulatory({ report }: Props) {
  const p = report.part8;
  const inp = report.input;

  return (
    <section id="part8" className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Part 8. 허가전략</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          개발 유형: <span className="font-semibold text-blue-700">{inp.developmentType.replace('_', ' ').toUpperCase()}</span>
          &nbsp;·&nbsp; Regulatory Strategy · Risk Matrix
        </p>
      </div>

      {/* Strategy items */}
      <SectionCard title="허가 전략 항목" subtitle="개발 유형에 따른 동적 체크리스트" noPad>
        <table className="table-professional">
          <thead>
            <tr><th className="w-8" /><th>Item</th><th>Detail</th><th>Status</th></tr>
          </thead>
          <tbody>
            {p.strategy.map((item, i) => (
              <tr key={i}>
                <td className="text-center">
                  {item.applicable
                    ? <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                    : <XCircle className="w-4 h-4 text-gray-300 mx-auto" />
                  }
                </td>
                <td className={`font-medium ${item.applicable ? 'text-gray-900' : 'text-gray-400'}`}>
                  {item.item}
                </td>
                <td className={`text-xs ${item.applicable ? 'text-gray-700' : 'text-gray-400'}`}>
                  {item.detail}
                </td>
                <td>
                  {item.status && (
                    <span className={`badge ${item.status.includes('완료') ? 'badge-green' : item.status === 'N/A' ? 'badge-gray' : 'badge-blue'}`}>
                      {item.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      {/* Key regulatory details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4">
          <p className="label-text mb-3">Bridging Study</p>
          <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded ${p.bridgingRequired ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
            {p.bridgingRequired ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
            <span className="text-sm font-semibold">{p.bridgingRequired ? '필요' : '불필요'}</span>
          </div>
          <p className="text-xs text-gray-600 mt-2">{p.bridgingNote}</p>
        </div>
        <div className="card p-4">
          <p className="label-text mb-3">Fast Track / 혁신신약 옵션</p>
          <ul className="space-y-1">
            {p.fastTrackOptions.map((opt, i) => (
              <li key={i} className="flex items-start gap-1.5 text-sm text-gray-700">
                <span className="text-blue-500 font-bold mt-0.5">✓</span>
                {opt}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Risk Matrix Heatmap */}
      <SectionCard title="허가 Risk Matrix" subtitle="Probability × Impact · 색상: 위험 수준">
        {/* Heatmap */}
        <div className="mb-5">
          <div className="overflow-x-auto">
            <div className="min-w-[400px]">
              <div className="flex gap-1 mb-1 ml-24">
                {[1,2,3,4,5].map(p => (
                  <div key={p} className="w-9 text-center text-xs text-gray-400">I={p}</div>
                ))}
                <div className="ml-2 text-xs text-gray-400">Impact →</div>
              </div>
              {[5,4,3,2,1].map(prob => (
                <div key={prob} className="flex items-center gap-1 mb-1">
                  <div className="w-24 text-right pr-2 text-xs text-gray-400 flex-shrink-0">P={prob}</div>
                  {[1,2,3,4,5].map(impact => (
                    <HeatmapCell key={impact} prob={prob} impact={impact} />
                  ))}
                </div>
              ))}
              <div className="ml-24 text-xs text-gray-400 mt-1">Probability ↑</div>
            </div>
          </div>
        </div>

        {/* Risk item list */}
        <table className="table-professional">
          <thead>
            <tr>
              <th>Category</th>
              <th className="text-center">Prob.</th>
              <th className="text-center">Impact</th>
              <th className="text-center">Score</th>
              <th>Level</th>
              <th>Mitigation</th>
            </tr>
          </thead>
          <tbody>
            {p.riskMatrix
              .sort((a, b) => b.riskScore - a.riskScore)
              .map((item, i) => (
              <tr key={i}>
                <td>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: CATEGORY_COLORS[item.category] ?? '#94a3b8' }}
                    />
                    <span className="font-medium">{item.category}</span>
                  </div>
                </td>
                <td className="text-center">{item.probability}</td>
                <td className="text-center">{item.impact}</td>
                <td className="text-center font-bold">{item.riskScore}</td>
                <td><RiskBadge level={item.level} size="xs" /></td>
                <td className="text-xs text-gray-600">{item.mitigation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </section>
  );
}
