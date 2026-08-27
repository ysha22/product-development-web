import type { ReportData, DevelopmentDecision } from '../../types';
import { SectionCard } from '../shared/SectionCard';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip,
} from 'recharts';

const DECISION_CONFIG: Record<DevelopmentDecision, {
  label: string; bg: string; text: string; border: string; icon: string;
}> = {
  DEVELOP:             { label: 'DEVELOP',             bg: 'bg-green-600',  text: 'text-white', border: 'border-green-700',  icon: '✓' },
  CONDITIONAL_DEVELOP: { label: 'CONDITIONAL DEVELOP', bg: 'bg-blue-600',   text: 'text-white', border: 'border-blue-700',   icon: '◑' },
  HOLD:                { label: 'HOLD',                bg: 'bg-amber-500',  text: 'text-white', border: 'border-amber-600',  icon: '⏸' },
  DO_NOT_DEVELOP:      { label: 'DO NOT DEVELOP',      bg: 'bg-red-600',    text: 'text-white', border: 'border-red-700',    icon: '✕' },
};

interface Props { report: ReportData }

export function Part10Conclusion({ report }: Props) {
  const { part10: p } = report;
  const decision = DECISION_CONFIG[p.decision];

  /* Radar data from score breakdown */
  const radarData = p.scoreBreakdown.map(s => ({
    subject: s.category.replace(' ', '\n'),
    score: s.score,
    fullMark: 100,
  }));

  return (
    <section id="part10" className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Part 10. 결론 및 개발의사결정</h2>
        <p className="text-sm text-gray-500 mt-0.5">개발위원회용 최종 요약 · Development Score · Decision</p>
      </div>

      {/* FINAL DECISION */}
      <div className={`rounded-2xl border-2 ${decision.border} ${decision.bg} p-8 text-center`}>
        <p className={`text-sm font-bold uppercase tracking-widest mb-3 ${decision.text} opacity-70`}>
          Final Development Decision
        </p>
        <div className="flex items-center justify-center gap-4 mb-4">
          <span className={`text-5xl font-black ${decision.text} opacity-20`}>{decision.icon}</span>
          <h3 className={`text-4xl font-black tracking-tight ${decision.text}`}>{decision.label}</h3>
        </div>
        <ul className="space-y-2 max-w-2xl mx-auto text-left">
          {p.decisionRationale.map((r, i) => (
            <li key={i} className={`flex items-start gap-2.5 text-sm ${decision.text} opacity-90`}>
              <span className="flex-shrink-0 mt-0.5">•</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
        {p.conditions && p.conditions.length > 0 && (
          <div className="mt-5 pt-5 border-t border-white/20 max-w-2xl mx-auto">
            <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${decision.text} opacity-60`}>
              조건 (Conditions)
            </p>
            <ul className="space-y-1 text-left">
              {p.conditions.map((c, i) => (
                <li key={i} className={`flex items-start gap-2 text-sm ${decision.text} opacity-80`}>
                  <span className="flex-shrink-0 font-bold">→</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Score + Radar */}
      <div className="grid grid-cols-2 gap-5">
        {/* Score breakdown */}
        <SectionCard title="Development Score Breakdown">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-center">
              <p className={`text-5xl font-black ${
                p.developmentScore >= 75 ? 'text-green-700' :
                p.developmentScore >= 50 ? 'text-amber-600' : 'text-red-700'
              }`}>{p.developmentScore}</p>
              <p className="text-sm text-gray-500">/ 100</p>
            </div>
            <div className="flex-1">
              <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden mb-1">
                <div
                  className={`h-full rounded-full ${
                    p.developmentScore >= 75 ? 'bg-green-500' :
                    p.developmentScore >= 50 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${p.developmentScore}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {p.scoreBreakdown.map(s => (
              <div key={s.category} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-32 flex-shrink-0 truncate">{s.category}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      s.score >= 75 ? 'bg-green-400' :
                      s.score >= 50 ? 'bg-amber-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${s.score}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-700 w-6 text-right">{s.score}</span>
                <span className="text-xs text-gray-400 w-10 text-right">(×{s.weight}%)</span>
                <span className="text-xs font-bold text-blue-700 w-8 text-right">{s.weightedScore.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Radar chart */}
        <SectionCard title="Score Radar">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#f1f5f9" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: '#64748b' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                <Radar
                  name="Score" dataKey="score" stroke="#2563eb" fill="#2563eb" fillOpacity={0.25}
                />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* Score detail table */}
      <SectionCard title="항목별 평가 근거" noPad>
        <table className="table-professional">
          <thead>
            <tr>
              <th>Category</th>
              <th className="text-right">Weight</th>
              <th className="text-right">Score</th>
              <th className="text-right">Weighted</th>
              <th>Rationale</th>
            </tr>
          </thead>
          <tbody>
            {p.scoreBreakdown.map(s => (
              <tr key={s.category}>
                <td className="font-medium">{s.category}</td>
                <td className="text-right">{s.weight}%</td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${s.score >= 75 ? 'bg-green-400' : s.score >= 50 ? 'bg-amber-400' : 'bg-red-400'}`}
                        style={{ width: `${s.score}%` }} />
                    </div>
                    <span className="font-bold">{s.score}</span>
                  </div>
                </td>
                <td className="text-right font-bold text-blue-700">{s.weightedScore.toFixed(1)}</td>
                <td className="text-xs text-gray-600">{s.rationale}</td>
              </tr>
            ))}
            <tr className="bg-blue-50 font-bold">
              <td>Total</td>
              <td className="text-right">100%</td>
              <td />
              <td className="text-right text-blue-700 text-base">{p.developmentScore}</td>
              <td />
            </tr>
          </tbody>
        </table>
      </SectionCard>

      {/* Risks & Opportunities */}
      <div className="grid grid-cols-2 gap-5">
        <SectionCard title="Key Risks">
          <ul className="space-y-2">
            {p.keyRisks.map((r, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">{r}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
        <SectionCard title="Key Opportunities">
          <ul className="space-y-2">
            {p.keyOpportunities.map((o, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <TrendingUp className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">{o}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      {/* Executive Summary Statement */}
      <div className="card p-6 bg-slate-900 text-white">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
          개발위원회용 최종 요약문 (Executive Statement)
        </p>
        <p className="text-base text-white/90 leading-relaxed italic">
          "{p.executiveSummaryText}"
        </p>
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
            DECISION_CONFIG[p.decision].bg
          }`}>
            <span className="text-sm font-black text-white">{decision.label}</span>
          </div>
          <span className="text-sm text-slate-400">
            Score: {p.developmentScore}/100 &nbsp;·&nbsp;
            NPV: ₩{report.part9.npv.toLocaleString()}억 &nbsp;·&nbsp;
            RA-NPV: ₩{report.part9.riskAdjustedNpv.toLocaleString()}억
          </span>
        </div>
      </div>
    </section>
  );
}
