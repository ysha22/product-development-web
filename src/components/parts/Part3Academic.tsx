import type { ReportData } from '../../types';
import { SectionCard } from '../shared/SectionCard';
import { EvidenceBadge, StatusBadge } from '../shared/EvidenceBadge';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, ZAxis, Legend,
} from 'recharts';

interface Props { report: ReportData }

export function Part3Academic({ report }: Props) {
  const p = report.part3;

  /* Therapeutic positioning scatter data */
  const scatterData = p.therapeuticPositioning.map(d => ({
    x: d.efficacy,
    y: d.unmetNeed,
    z: (d.marketShare ?? 10) * 5,
    name: d.name,
    fill: d.color,
  }));

  return (
    <section id="part3" className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Part 3. 학술정보 및 치료적 위치</h2>
        <p className="text-sm text-gray-500 mt-0.5">Disease Overview · MoA · Standard of Care · Guideline Position · Therapeutic Positioning</p>
      </div>

      {/* 3-1 Disease Overview */}
      <SectionCard title="3-1. Disease Overview" badge={<EvidenceBadge level="A" />}>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">{p.diseaseOverview.definition}</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: '유병률', dp: p.diseaseOverview.prevalence },
            { label: '발생률', dp: p.diseaseOverview.incidence },
            { label: '환자수 (추정)', dp: p.diseaseOverview.patientNumber },
            { label: '사망률', dp: p.diseaseOverview.mortalityRate },
            { label: '치료시장 규모', dp: p.diseaseOverview.marketSize },
          ].map(({ label, dp }) => (
            <div key={label} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">{label}</p>
              <p className="text-sm font-semibold text-gray-900 mb-1">{dp.value}</p>
              <StatusBadge status={dp.status} />
            </div>
          ))}
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">질병 부담</p>
            <p className="text-xs text-gray-700 leading-relaxed">{p.diseaseOverview.diseaseBurden}</p>
          </div>
        </div>
      </SectionCard>

      {/* 3-2 MoA */}
      <SectionCard title="3-2. Mechanism of Action (MoA)">
        <p className="text-sm text-gray-700 leading-relaxed mb-4">{p.mechanismOfAction.summary}</p>
        {/* Pathway visualization */}
        <div className="overflow-x-auto">
          <div className="flex items-stretch gap-0 min-w-max">
            {p.mechanismOfAction.pathway.map((step, i) => (
              <div key={i} className="flex items-stretch">
                <div className={`px-3 py-2.5 text-xs font-medium leading-snug text-center max-w-[160px] rounded ${
                  i === 0 ? 'bg-red-100 text-red-800 border border-red-200' :
                  i === p.mechanismOfAction.pathway.length - 1 ? 'bg-green-100 text-green-800 border border-green-200' :
                  'bg-blue-50 text-blue-800 border border-blue-200'
                }`}>
                  {step}
                </div>
                {i < p.mechanismOfAction.pathway.length - 1 && (
                  <div className="flex items-center px-1 text-gray-400 font-bold text-lg">›</div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {[
            { label: 'Target', value: p.mechanismOfAction.target },
            { label: 'Drug Effect', value: p.mechanismOfAction.drugEffect },
            { label: 'Biological Effect', value: p.mechanismOfAction.biologicalEffect },
            { label: 'Clinical Outcome', value: p.mechanismOfAction.clinicalOutcome },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-start gap-2">
              <span className="text-xs font-bold text-blue-600 w-28 flex-shrink-0 pt-0.5">{label}</span>
              <span className="text-xs text-gray-700">{value}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* 3-3 Standard of Care */}
      <SectionCard title="3-3. Current Standard of Care" subtitle="진료지침 기준 치료 알고리즘" badge={<EvidenceBadge level="C" />}>
        <div className="space-y-0">
          {p.standardOfCare.map((line, idx) => (
            <div key={line.line}>
              <div className={`rounded-lg border p-4 ${
                idx === 0 ? 'bg-blue-50 border-blue-200' :
                idx === 1 ? 'bg-indigo-50 border-indigo-200' :
                idx === 2 ? 'bg-violet-50 border-violet-200' :
                'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-bold ${
                    idx === 0 ? 'text-blue-800' : idx === 1 ? 'text-indigo-800' : idx === 2 ? 'text-violet-800' : 'text-gray-700'
                  }`}>{line.line}</span>
                  <span className="text-xs text-gray-500">{line.duration}</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <p className="font-medium text-gray-500 mb-1">치료제</p>
                    <ul>{line.treatments.map((t, i) => <li key={i} className="text-gray-800">· {t}</li>)}</ul>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500 mb-1">반응률</p>
                    <p className="font-semibold text-gray-900">{line.responseRate}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500 mb-1">제한점</p>
                    <ul>{line.limitations.map((l, i) => <li key={i} className="text-red-700">· {l}</li>)}</ul>
                  </div>
                </div>
              </div>
              {idx < p.standardOfCare.length - 1 && (
                <div className="flex justify-center py-1 text-gray-400 text-lg font-bold">↓</div>
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      {/* 3-4 Guideline Position */}
      <SectionCard title="3-4. Guideline Position" badge={<EvidenceBadge level="C" />} noPad>
        <table className="table-professional">
          <thead>
            <tr>
              <th>Guideline</th><th>Version</th><th>Recommended Line</th><th>Grade</th><th>Note</th>
            </tr>
          </thead>
          <tbody>
            {p.guidelinePositions.map(g => (
              <tr key={g.guideline}>
                <td className="font-semibold text-blue-700">{g.guideline}</td>
                <td className="text-gray-500">{g.version}</td>
                <td><span className="badge badge-blue">{g.recommendedLine}</span></td>
                <td><span className="badge badge-green">{g.recommendationGrade}</span></td>
                <td className="text-xs text-gray-600">{g.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      {/* 3-5 Therapeutic Positioning */}
      <SectionCard title="3-5. Therapeutic Positioning" subtitle="Clinical Efficacy vs. Unmet Medical Need (Bubble = Market Share)">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 20, bottom: 30, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                type="number" dataKey="x" domain={[5, 10.5]}
                label={{ value: 'Clinical Efficacy →', position: 'insideBottom', offset: -15, style: { fontSize: 11, fill: '#94a3b8' } }}
                tick={{ fontSize: 11 }} tickCount={6}
              />
              <YAxis
                type="number" dataKey="y" domain={[4, 10.5]}
                label={{ value: '← Unmet Medical Need →', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 11, fill: '#94a3b8' } }}
                tick={{ fontSize: 11 }} tickCount={6}
              />
              <ZAxis type="number" dataKey="z" range={[100, 1200]} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs">
                      <p className="font-semibold text-gray-900 mb-1">{d.name}</p>
                      <p>Efficacy: <strong>{d.x}/10</strong></p>
                      <p>Unmet Need: <strong>{d.y}/10</strong></p>
                    </div>
                  );
                }}
              />
              <Legend verticalAlign="top" height={30} wrapperStyle={{ fontSize: 11 }} />
              <Scatter data={scatterData} name="Products">
                {scatterData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} fillOpacity={0.8} stroke={entry.fill} strokeWidth={1.5} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        {/* Legend overlay */}
        <div className="flex flex-wrap gap-3 mt-2">
          {p.therapeuticPositioning.map(d => (
            <div key={d.name} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="text-xs text-gray-600">{d.name}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </section>
  );
}
