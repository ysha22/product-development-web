import type { ReportData } from '../../types';
import { SectionCard } from '../shared/SectionCard';
import { StatusBadge } from '../shared/EvidenceBadge';
import { EvidenceBadge } from '../shared/EvidenceBadge';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend,
} from 'recharts';

interface Props { report: ReportData }

export function Part7Pricing({ report }: Props) {
  const p = report.part7;

  const scenarioData = p.scenarios.map(s => ({
    name: s.name,
    '예상매출(억)': s.annualRevenue,
    'NPV(억)': s.npv,
    환자수: s.patientNumber,
    가격: (s.price / 10000).toFixed(1) + '만',
  }));

  const SCENARIO_COLORS: Record<string, string> = {
    Conservative: '#94a3b8',
    Base:         '#2563eb',
    Optimistic:   '#059669',
  };

  return (
    <section id="part7" className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Part 7. 예상약가</h2>
        <p className="text-sm text-gray-500 mt-0.5">Pricing Analysis · Scenario · Cost Breakdown</p>
      </div>

      {/* Key prices */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: '기준약가 (Reference)', dp: p.referencePrice, color: 'border-t-blue-500' },
          { label: '예상 급여약가', dp: p.expectedReimbursementPrice, color: 'border-t-green-500' },
          { label: '환자 본인부담금', dp: p.patientCopay, color: 'border-t-amber-500' },
        ].map(({ label, dp, color }) => (
          <div key={label} className={`card border-t-2 ${color} p-4`}>
            <p className="label-text mb-1">{label}</p>
            <p className="text-lg font-bold text-gray-900 mb-1">{dp.value}</p>
            <StatusBadge status={dp.status} />
          </div>
        ))}
      </div>

      {/* Cost breakdown */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: '1일 치료비', dp: p.dailyCost },
          { label: '월 치료비',  dp: p.monthlyCost },
          { label: '연간 치료비', dp: p.annualCost },
        ].map(({ label, dp }) => (
          <div key={label} className="card p-4">
            <p className="label-text mb-1">{label}</p>
            <p className="text-base font-bold text-gray-900 mb-1">{dp.value}</p>
            <StatusBadge status={dp.status} />
          </div>
        ))}
      </div>

      {/* Pricing Logic */}
      <SectionCard title="약가 산정 논리" badge={<EvidenceBadge level="F" />}>
        <div className="flex items-center gap-0 overflow-x-auto">
          {p.pricingLogic.map((step, i) => (
            <div key={i} className="flex items-center gap-0">
              <div className="flex-shrink-0 max-w-[180px] p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800 leading-snug">{step}</p>
              </div>
              {i < p.pricingLogic.length - 1 && (
                <span className="text-gray-400 font-bold text-xl px-2">→</span>
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Competitor Prices */}
      <SectionCard title="경쟁제품 약가 비교" badge={<EvidenceBadge level="A" />} noPad>
        <table className="table-professional">
          <thead><tr><th>제품명</th><th className="text-right">약가</th></tr></thead>
          <tbody>
            {p.competitorPrices.map((c, i) => (
              <tr key={i} className={i === 0 ? 'bg-blue-50/50' : ''}>
                <td className={i === 0 ? 'font-semibold text-blue-700' : 'font-medium'}>{c.name}</td>
                <td className="text-right font-semibold text-gray-900">{c.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      {/* Scenario Analysis */}
      <SectionCard title="약가 시나리오 분석">
        <div className="grid grid-cols-3 gap-4 mb-5">
          {p.scenarios.map(s => (
            <div key={s.name} className={`rounded-lg border-2 p-4 ${
              s.name === 'Base' ? 'border-blue-500 bg-blue-50' :
              s.name === 'Conservative' ? 'border-gray-300 bg-gray-50' :
              'border-green-500 bg-green-50'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-bold uppercase tracking-wide ${
                  s.name === 'Base' ? 'text-blue-700' :
                  s.name === 'Conservative' ? 'text-gray-600' : 'text-green-700'
                }`}>{s.name}</span>
                {s.name === 'Base' && (
                  <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded">BASE</span>
                )}
              </div>
              <div className="space-y-2">
                {[
                  { label: '약가', value: `₩${(s.price / 10000).toFixed(1)}만/일` },
                  { label: '환자수', value: `${s.patientNumber.toLocaleString()}명` },
                  { label: '예상매출', value: `₩${s.annualRevenue.toLocaleString()}억` },
                  { label: '급여율', value: `${s.reimbursementRate}%` },
                  { label: 'NPV', value: `₩${s.npv.toLocaleString()}억` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-xs text-gray-500">{label}</span>
                    <span className="text-xs font-bold text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Scenario bar chart */}
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scenarioData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }}
                formatter={(v) => [`₩${Number(v).toLocaleString()}억`]}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="예상매출(억)" radius={[3, 3, 0, 0]}>
                {p.scenarios.map((s) => (
                  <Cell key={s.name} fill={SCENARIO_COLORS[s.name]} />
                ))}
              </Bar>
              <Bar dataKey="NPV(억)" radius={[3, 3, 0, 0]} fill="#818cf8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>
    </section>
  );
}
