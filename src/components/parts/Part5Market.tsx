import type { ReportData } from '../../types';
import { SectionCard } from '../shared/SectionCard';
import { EvidenceBadge } from '../shared/EvidenceBadge';
import { MetricCard } from '../shared/SectionCard';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, ReferenceLine,
  ScatterChart, Scatter, Cell, ZAxis,
} from 'recharts';

interface Props { report: ReportData }

export function Part5Market({ report }: Props) {
  const p = report.part5;

  /* Market chart data */
  const marketData = p.yearlyData.map(d => ({
    year: d.year.toString(),
    '글로벌($M)': d.globalMarketSize,
    '국내(억₩)': d.koreaMarketSize,
    isActual: d.isActual,
  }));

  /* Patient + share chart */
  const patientData = p.yearlyData.map(d => ({
    year: d.year.toString(),
    patients: d.prescribedPatients,
    share: d.marketShare,
    isActual: d.isActual,
  }));

  /* Competitor bubble (price vs efficacy) */
  const bubbleData = p.competitors.map(c => ({
    x: c.efficacyScore ?? 5,
    y: c.priceScore ?? 5,
    z: (c.marketSizeUSD ?? 100) / 10,
    name: c.name,
  }));

  const COLORS = ['#2563eb','#7c3aed','#059669','#d97706','#dc2626','#0891b2'];

  /* Year where actual→forecast transition */
  const firstForecastYear = p.yearlyData.find(d => !d.isActual)?.year.toString();

  return (
    <section id="part5" className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Part 5. 시장조사</h2>
        <p className="text-sm text-gray-500 mt-0.5">Global / Korea Market · CAGR · Competitive Landscape</p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          label="글로벌 시장 (최신)"
          value={`$${p.globalMarketLatest.value?.toLocaleString()}M`}
          sub={p.globalMarketLatest.status}
          color="blue"
        />
        <MetricCard
          label="국내 시장 (최신)"
          value={`₩${p.koreaMarketLatest.value?.toLocaleString()}억`}
          sub={p.koreaMarketLatest.status}
          color="green"
        />
        <MetricCard
          label="5-Year CAGR"
          value={`${p.cagr5Year}%`}
          sub="연평균 성장률"
          color="purple"
        />
        <MetricCard
          label="연간 치료비"
          value={p.treatmentCostAnnual.value}
          sub="급여가 기준"
          color="amber"
        />
      </div>

      {/* Market Growth Chart */}
      <SectionCard
        title="글로벌 / 국내 시장 규모 추이"
        subtitle="실선: 실제값 · 점선: 예측값"
        badge={<EvidenceBadge level={report.isDemoData ? "E" : "F"} />}
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={marketData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
              {firstForecastYear && (
                <ReferenceLine
                  yAxisId="left" x={firstForecastYear}
                  stroke="#94a3b8" strokeDasharray="4 2"
                  label={{ value: 'Forecast →', position: 'top', fontSize: 10, fill: '#94a3b8' }}
                />
              )}
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line yAxisId="left" type="monotone" dataKey="글로벌($M)" stroke="#2563eb" strokeWidth={2}
                dot={{ r: 3 }} activeDot={{ r: 5 }} />
              <Line yAxisId="right" type="monotone" dataKey="국내(억₩)" stroke="#059669" strokeWidth={2}
                dot={{ r: 3 }} activeDot={{ r: 5 }} strokeDasharray="0" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          * CAGR = (Ending Value / Beginning Value)^(1/n) – 1 공식 적용 · 예측값은 Estimate 기준
        </p>
      </SectionCard>

      {/* Patient numbers chart */}
      <SectionCard title="처방환자수 및 시장점유율 추이" badge={<EvidenceBadge level={report.isDemoData ? "E" : "F"} />}>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={patientData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar yAxisId="left" dataKey="patients" name="처방환자수" fill="#bfdbfe" radius={[2, 2, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="share" name="시장점유율(%)" stroke="#7c3aed" strokeWidth={2} dot={{ r: 3 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      {/* Country Markets */}
      <div className="grid grid-cols-2 gap-5">
        <SectionCard title="주요 국가별 시장" noPad>
          <table className="table-professional">
            <thead><tr><th>Country</th><th className="text-right">Market Size</th><th className="text-right">Share</th></tr></thead>
            <tbody>
              {p.majorCountryMarkets.map((c, i) => (
                <tr key={i}>
                  <td className="font-medium">{c.country}</td>
                  <td className="text-right text-blue-700 font-semibold">{c.size}</td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-400 rounded-full" style={{ width: `${c.share}%` }} />
                      </div>
                      <span className="text-xs w-8 text-right">{c.share}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>

        {/* Competitor Table */}
        <SectionCard title="주요 경쟁제품" noPad>
          <table className="table-professional">
            <thead>
              <tr><th>Product</th><th>Company</th><th className="text-right">Sales($M)</th><th className="text-right">Share</th><th>Patent</th></tr>
            </thead>
            <tbody>
              {p.competitors.map((c, i) => (
                <tr key={i} className={i === 0 ? 'bg-blue-50/50 font-medium' : ''}>
                  <td className={i === 0 ? 'font-semibold text-blue-700' : 'font-medium'}>{c.name}</td>
                  <td className="text-xs text-gray-500">{c.company}</td>
                  <td className="text-right">{c.sales?.toLocaleString() ?? 'N/A'}</td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${c.marketShare ?? 0}%`, backgroundColor: COLORS[i] ?? '#94a3b8' }} />
                      </div>
                      <span className="text-xs">{c.marketShare}%</span>
                    </div>
                  </td>
                  <td className="text-xs text-gray-500">{c.patentExpiry ?? 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      </div>

      {/* Competitive Landscape Bubble */}
      <SectionCard title="Competitive Landscape" subtitle="X: Efficacy Score · Y: Price Score (높을수록 저렴) · Bubble: Market Size">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 20, bottom: 30, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" dataKey="x" domain={[5, 10.5]} name="Efficacy"
                label={{ value: 'Clinical Efficacy →', position: 'insideBottom', offset: -15, style: { fontSize: 11, fill: '#94a3b8' } }}
                tick={{ fontSize: 11 }} />
              <YAxis type="number" dataKey="y" domain={[2, 10]} name="Price Score"
                label={{ value: '← Affordability →', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#94a3b8' } }}
                tick={{ fontSize: 11 }} />
              <ZAxis type="number" dataKey="z" range={[60, 800]} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-white border border-gray-200 rounded-lg shadow p-3 text-xs">
                      <p className="font-semibold mb-1">{d.name}</p>
                      <p>Efficacy: {d.x}/10 · Price: {d.y}/10</p>
                    </div>
                  );
                }}
              />
              <Scatter data={bubbleData} name="Competitors">
                {bubbleData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.75} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-3 mt-2">
          {p.competitors.map((c, i) => (
            <div key={c.name} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
              <span className="text-xs text-gray-600">{c.name}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </section>
  );
}
