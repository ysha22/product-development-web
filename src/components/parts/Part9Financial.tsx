import { useState } from 'react';
import type { ReportData, NPVInputs } from '../../types';
import { SectionCard } from '../shared/SectionCard';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, ReferenceLine, Line, Legend,
  ComposedChart,
} from 'recharts';

interface Props {
  report: ReportData;
  onInputChange?: (inputs: NPVInputs) => void;
}

const SCENARIO_COLORS: Record<string, string> = {
  Conservative: '#94a3b8',
  Base:         '#2563eb',
  Optimistic:   '#059669',
};

export function Part9Financial({ report, onInputChange }: Props) {
  const { part9: p } = report;
  const [inputs, setInputs] = useState<NPVInputs>(p.inputs);

  function updateInput<K extends keyof NPVInputs>(key: K, value: NPVInputs[K]) {
    const updated = { ...inputs, [key]: value };
    setInputs(updated);
    onInputChange?.(updated);
  }

  /* Tornado chart data – sort by impact */
  const tornadoData = [...p.sensitivityItems]
    .sort((a, b) => b.impact - a.impact)
    .map(item => ({
      name: item.variable,
      low: item.low,
      high: item.high,
      base: item.base,
      impact: item.impact,
    }));

  /* NPV waterfall / bar */
  const npvBarData = p.yearlyData.map(y => ({
    year: y.year.replace(' ', '\n'),
    'Revenue': y.revenue,
    'COGS': Math.abs(y.cogs),
    'SG&A': Math.abs(y.sga),
    'Dev Cost': Math.abs(y.developmentCost),
    'FCF': y.fcf,
    'Disc FCF': y.discountedFcf,
    cumFCF: y.cumulativeFcf,
  }));

  /* Scenario comparison */
  const scenarioCompare = p.scenarios.map(s => ({
    name: s.name,
    Revenue: s.revenue,
    NPV: s.npv,
    'RA-NPV': s.riskAdjustedNpv,
    EBITDA: s.ebitda,
  }));

  return (
    <section id="part9" className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Part 9. S/F 및 5-Year NPV</h2>
        <p className="text-sm text-gray-500 mt-0.5">Financial Model · NPV · Sensitivity · Scenario Analysis</p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '5-Year NPV', value: `₩${p.npv.toLocaleString()}억`, color: p.npv >= 0 ? 'text-green-700' : 'text-red-700', sub: 'Base scenario' },
          { label: 'Risk-Adjusted NPV', value: `₩${p.riskAdjustedNpv.toLocaleString()}억`, color: p.riskAdjustedNpv >= 0 ? 'text-green-700' : 'text-red-700', sub: `PoS: ${(p.probabilityOfSuccess * 100).toFixed(1)}%` },
          { label: 'IRR', value: p.irr ? `${p.irr}%` : 'N/A', color: 'text-blue-700', sub: '내부수익률' },
          { label: 'Break-even Year', value: p.breakEvenYear ?? 'N/A', color: 'text-gray-900', sub: '투자회수 연도' },
        ].map(({ label, value, color, sub }) => (
          <div key={label} className="card p-4 border-t-2 border-t-blue-500">
            <p className="label-text mb-1">{label}</p>
            <p className={`text-2xl font-black ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Input Panel */}
      <SectionCard title="Financial Model Inputs" subtitle="수정하면 결과가 실시간 업데이트됩니다">
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: '예상약가 (원/환자/년)', key: 'expectedPrice' as const, step: 100000 },
            { label: '목표 환자수', key: 'patientNumber' as const, step: 100 },
            { label: '시장 점유율 (%)', key: 'marketShare' as const, step: 1 },
            { label: '총이익률 (%)', key: 'grossMargin' as const, step: 1 },
            { label: '개발비 (억원)', key: 'developmentCost' as const, step: 10 },
            { label: '할인율 (%)', key: 'discountRate' as const, step: 0.5 },
            { label: 'SG&A (%)', key: 'sgaRatio' as const, step: 1 },
            { label: '출시연도', key: 'launchYear' as const, step: 1 },
          ].map(({ label, key, step }) => (
            <div key={key}>
              <label className="label-text block mb-1">{label}</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  className="input-field flex-1 text-xs"
                  value={inputs[key] as number}
                  step={step}
                  onChange={e => updateInput(key, parseFloat(e.target.value) || 0)}
                />
                <div className="flex flex-col">
                  <button className="text-gray-400 hover:text-gray-600 leading-none text-xs" onClick={() => updateInput(key, (inputs[key] as number) + step)}>▲</button>
                  <button className="text-gray-400 hover:text-gray-600 leading-none text-xs" onClick={() => updateInput(key, Math.max(0, (inputs[key] as number) - step))}>▼</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Probability of Success */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="label-text mb-3">Probability of Success by Stage</p>
          <div className="grid grid-cols-6 gap-3">
            {(Object.entries(inputs.probabilityByStage) as [string, number][]).map(([stage, prob]) => (
              <div key={stage}>
                <label className="text-xs text-gray-500 capitalize block mb-1">{stage}</label>
                <input
                  type="number" min={0} max={1} step={0.01}
                  className="input-field text-xs"
                  value={prob}
                  onChange={e => updateInput('probabilityByStage', {
                    ...inputs.probabilityByStage,
                    [stage]: parseFloat(e.target.value) || 0,
                  })}
                />
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* NPV Year-by-Year Table */}
      <SectionCard title="5-Year NPV 계산 상세" subtitle="FCF/(1+r)^t" noPad>
        <table className="table-professional">
          <thead>
            <tr>
              <th>Year</th>
              <th className="text-right">Revenue</th>
              <th className="text-right">COGS</th>
              <th className="text-right">SG&A</th>
              <th className="text-right">Dev Cost</th>
              <th className="text-right">Tax</th>
              <th className="text-right font-bold">FCF</th>
              <th className="text-right text-blue-600">Disc. FCF</th>
              <th className="text-right text-purple-600">Cum. FCF</th>
            </tr>
          </thead>
          <tbody>
            {p.yearlyData.map(y => (
              <tr key={y.year} className={y.cumulativeFcf >= 0 ? 'bg-green-50/30' : ''}>
                <td className="font-medium text-xs">{y.year}</td>
                <td className="text-right text-blue-700 font-medium">{y.revenue > 0 ? y.revenue.toLocaleString() : '-'}</td>
                <td className="text-right text-red-600">{y.cogs !== 0 ? y.cogs.toLocaleString() : '-'}</td>
                <td className="text-right text-red-600">{y.sga !== 0 ? y.sga.toLocaleString() : '-'}</td>
                <td className="text-right text-red-600">{y.developmentCost !== 0 ? y.developmentCost.toLocaleString() : '-'}</td>
                <td className="text-right text-red-600">{y.tax !== 0 ? y.tax.toLocaleString() : '-'}</td>
                <td className={`text-right font-bold ${y.fcf >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  {y.fcf.toLocaleString()}
                </td>
                <td className={`text-right font-semibold text-blue-700`}>
                  {y.discountedFcf.toLocaleString()}
                </td>
                <td className={`text-right font-bold ${y.cumulativeFcf >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  {y.cumulativeFcf.toLocaleString()}
                </td>
              </tr>
            ))}
            <tr className="bg-blue-50 font-bold">
              <td>5-Year NPV</td>
              <td colSpan={7} />
              <td className={`text-right text-lg ${p.npv >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                ₩{p.npv.toLocaleString()}억
              </td>
            </tr>
          </tbody>
        </table>
        <p className="text-xs text-gray-400 px-5 pb-3">단위: 억원 · 할인율: {inputs.discountRate}%</p>
      </SectionCard>

      {/* FCF Chart */}
      <SectionCard title="연도별 FCF / Cumulative FCF">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={npvBarData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => String(Number(v).toLocaleString())} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine y={0} stroke="#94a3b8" />
              <Bar dataKey="FCF" name="FCF" radius={[3, 3, 0, 0]}>
                {npvBarData.map((d, i) => (
                  <Cell key={i} fill={d.FCF >= 0 ? '#86efac' : '#fca5a5'} />
                ))}
              </Bar>
              <Line type="monotone" dataKey="cumFCF" name="누적 FCF" stroke="#7c3aed" strokeWidth={2} dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      {/* Tornado Chart */}
      <SectionCard title="민감도 분석 (Tornado Chart)" subtitle="변수별 NPV 영향 범위">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={tornadoData}
              margin={{ top: 5, right: 80, left: 80, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }}
                label={{ value: 'NPV Impact (억원)', position: 'insideBottom', offset: -3, style: { fontSize: 11, fill: '#94a3b8' } }}
              />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} />
              <Tooltip
                formatter={(v) => [`${Number(v) > 0 ? '+' : ''}${Number(v).toLocaleString()}억`]}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <ReferenceLine x={0} stroke="#94a3b8" strokeWidth={1.5} />
              <Bar dataKey="low" name="Downside" fill="#fca5a5" radius={[0, 0, 0, 0]} />
              <Bar dataKey="high" name="Upside" fill="#86efac" radius={[0, 0, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      {/* Scenario Comparison */}
      <SectionCard title="시나리오 분석">
        <div className="grid grid-cols-3 gap-4 mb-5">
          {p.scenarios.map(s => (
            <div key={s.name} className={`rounded-xl border-2 p-5 ${
              s.name === 'Base' ? 'border-blue-500' :
              s.name === 'Conservative' ? 'border-gray-300' : 'border-green-500'
            }`}>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">{s.name}</p>
              <div className="space-y-2">
                {[
                  { label: '시장점유율', value: `${s.marketShare}%` },
                  { label: '약가', value: `₩${(s.price / 10000).toFixed(1)}만` },
                  { label: '매출', value: `₩${s.revenue.toLocaleString()}억`, bold: true },
                  { label: 'EBITDA', value: `₩${s.ebitda.toLocaleString()}억` },
                  { label: 'NPV', value: `₩${s.npv.toLocaleString()}억`, bold: true, color: s.npv >= 0 ? 'text-green-700' : 'text-red-700' },
                  { label: 'RA-NPV', value: `₩${s.riskAdjustedNpv.toLocaleString()}억`, bold: true, color: s.riskAdjustedNpv >= 0 ? 'text-green-700' : 'text-red-700' },
                  { label: 'BEP Year', value: s.breakEvenYear ?? 'N/A' },
                ].map(({ label, value, bold, color }) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">{label}</span>
                    <span className={`text-xs ${bold ? 'font-bold text-sm' : 'font-medium'} ${color ?? 'text-gray-900'}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scenarioCompare} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [`₩${Number(v).toLocaleString()}억`]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Revenue" radius={[3, 3, 0, 0]}>
                {p.scenarios.map(s => <Cell key={s.name} fill={SCENARIO_COLORS[s.name]} />)}
              </Bar>
              <Bar dataKey="NPV" fill="#818cf8" radius={[3, 3, 0, 0]} />
              <Bar dataKey="RA-NPV" fill="#a78bfa" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>
    </section>
  );
}
