import type { ReportData, DevelopmentDecision } from '../../types';
import { RiskBadge } from '../shared/RiskBadge';
import { EvidenceBadge } from '../shared/EvidenceBadge';

const DECISION_CONFIG: Record<DevelopmentDecision, {
  label: string; bg: string; text: string; border: string; dot: string;
}> = {
  DEVELOP:              { label: 'DEVELOP',              bg: 'bg-green-600',  text: 'text-white', border: 'border-green-700',  dot: 'bg-green-300' },
  CONDITIONAL_DEVELOP:  { label: 'CONDITIONAL DEVELOP',  bg: 'bg-blue-600',   text: 'text-white', border: 'border-blue-700',   dot: 'bg-blue-300' },
  HOLD:                 { label: 'HOLD',                 bg: 'bg-amber-500',  text: 'text-white', border: 'border-amber-600',  dot: 'bg-amber-200' },
  DO_NOT_DEVELOP:       { label: 'DO NOT DEVELOP',       bg: 'bg-red-600',    text: 'text-white', border: 'border-red-700',    dot: 'bg-red-300' },
};

function CardBlock({ title, children, accent = 'blue' }: { title: string; children: React.ReactNode; accent?: string }) {
  const borders: Record<string, string> = {
    blue: 'border-t-blue-500', green: 'border-t-green-500',
    purple: 'border-t-purple-500', amber: 'border-t-amber-500',
    red: 'border-t-red-500', teal: 'border-t-teal-500',
  };
  return (
    <div className={`card border-t-2 ${borders[accent] ?? 'border-t-blue-500'}`}>
      <div className="card-header">
        <h3 className="section-title text-xs font-bold text-gray-500 uppercase tracking-widest">{title}</h3>
      </div>
      <div className="card-body space-y-1.5">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-xs text-gray-500 w-28 flex-shrink-0">{label}</span>
      <span className="text-xs font-medium text-gray-900 flex-1">{value}</span>
    </div>
  );
}

interface Props { report: ReportData }

export function ExecutiveSummary({ report }: Props) {
  const { part2: p2, part4: p4, part5: p5, part6: p6, part7: p7, part9: p9, part10: p10, riskPanel } = report;
  const decision = DECISION_CONFIG[p10.decision];
  const pivotal = p4.trials.find(t => t.isPivotal);

  return (
    <section id="executive" className="space-y-6">
      {/* Title */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-gray-900">Executive Summary</h2>
            {report.isDemoData && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-400 text-amber-900">
                DEMO DATA
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">
            {report.input.productName} &nbsp;·&nbsp; {report.input.innName}
            &nbsp;·&nbsp; {report.input.indication}
          </p>
        </div>
        <p className="text-xs text-gray-400 flex-shrink-0">As of {report.createdAt}</p>
      </div>

      {/* FINAL DECISION – prominent */}
      <div className={`rounded-xl border-2 ${decision.border} ${decision.bg} p-6`}>
        <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${decision.text} opacity-70`}>
          Final Development Decision
        </p>
        <div className="flex items-center gap-3 mb-4">
          <span className={`w-3 h-3 rounded-full ${decision.dot} animate-pulse`} />
          <h3 className={`text-3xl font-black tracking-tight ${decision.text}`}>{decision.label}</h3>
        </div>
        <ul className="space-y-1">
          {p10.decisionRationale.map((r, i) => (
            <li key={i} className={`flex items-start gap-2 text-sm ${decision.text} opacity-90`}>
              <span className="flex-shrink-0 mt-0.5">•</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
        {p10.conditions && p10.conditions.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <p className={`text-xs font-bold uppercase tracking-wide ${decision.text} opacity-70 mb-2`}>조건</p>
            <ul className="space-y-1">
              {p10.conditions.map((c, i) => (
                <li key={i} className={`flex items-start gap-2 text-xs ${decision.text} opacity-80`}>
                  <span className="flex-shrink-0">→</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Score + Risk row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Development Score */}
        <div className="card p-5">
          <p className="label-text mb-3">Development Score</p>
          <div className="flex items-end gap-3 mb-3">
            <span className="text-4xl font-black text-gray-900">{p10.developmentScore}</span>
            <span className="text-lg font-bold text-gray-400 mb-1">/ 100</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                p10.developmentScore >= 75 ? 'bg-green-500' :
                p10.developmentScore >= 50 ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${p10.developmentScore}%` }}
            />
          </div>
          <div className="mt-3 space-y-1">
            {p10.scoreBreakdown.slice(0, 4).map(s => (
              <div key={s.category} className="flex items-center justify-between gap-2">
                <span className="text-xs text-gray-500 truncate flex-1">{s.category}</span>
                <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 rounded-full" style={{ width: `${s.score}%` }} />
                </div>
                <span className="text-xs font-medium text-gray-700 w-8 text-right">{s.score}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Panel */}
        <div className="card p-5">
          <p className="label-text mb-3">Risk Assessment</p>
          <div className="mb-3">
            <span className="text-sm font-bold text-gray-600 mr-2">Overall</span>
            <RiskBadge level={riskPanel.overall} size="md" />
          </div>
          <div className="space-y-1.5">
            {(Object.entries(riskPanel) as [string, typeof riskPanel.overall][])
              .filter(([k]) => k !== 'overall')
              .map(([k, v]) => (
                <div key={k} className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 capitalize">{k}</span>
                  <RiskBadge level={v} size="xs" />
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* 6-column summary grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Product */}
        <CardBlock title="Product" accent="blue">
          <Row label="성분명" value={p2.innName} />
          <Row label="제품명" value={p2.brandName} />
          <Row label="개발사" value={p2.developer} />
          <Row label="MoA" value={<span className="line-clamp-2">{p2.mechanismOfAction.substring(0, 70)}…</span>} />
          <Row label="투여경로" value={p2.routeOfAdministration} />
          <Row label="개발단계" value={report.input.developmentStage.toUpperCase()} />
        </CardBlock>

        {/* Regulatory */}
        <CardBlock title="Regulatory" accent="purple">
          <Row label="FDA 허가" value={<span className="text-green-700 font-semibold">허가 완료</span>} />
          <Row label="최초허가일" value={p2.firstApprovalDate} />
          <Row label="최초허가국" value={p2.firstApprovalCountry} />
          <Row label="국내허가일" value={p2.koreaApprovalDate} />
          <Row label="급여등재" value={p2.reimbursementStatus} />
          <Row label="재심사" value={p2.reexaminationPeriod} />
        </CardBlock>

        {/* Clinical */}
        <CardBlock title="Clinical" accent="teal">
          {pivotal ? (
            <>
              <Row label="Pivotal Study" value={pivotal.studyName} />
              <Row label="Phase" value={pivotal.phase} />
              <Row label="PFS" value={<span className="text-blue-700 font-semibold">{pivotal.endpoints.pfs ?? 'N/A'}</span>} />
              <Row label="OS" value={<span className="text-blue-700 font-semibold">{pivotal.endpoints.os ?? 'N/A'}</span>} />
              <Row label="ORR" value={pivotal.endpoints.orr ?? 'N/A'} />
              <Row label="HR (PFS)" value={pivotal.endpoints.hr ?? 'N/A'} />
            </>
          ) : <p className="text-xs text-gray-400">임상 데이터 없음</p>}
        </CardBlock>

        {/* Market */}
        <CardBlock title="Market" accent="green">
          <Row label="글로벌 시장" value={`$${p5.globalMarketLatest.value?.toLocaleString()}M`} />
          <Row label="국내 시장" value={`₩${p5.koreaMarketLatest.value?.toLocaleString()}억`} />
          <Row label="5Y CAGR" value={<span className="text-green-700 font-bold">{p5.cagr5Year}%</span>} />
          <Row label="주요경쟁사" value={p5.competitors.slice(0, 2).map(c => c.name).join(', ')} />
          <Row label="예상출시" value={`${report.input.expectedLaunchYear}년`} />
          <Row label="연간치료비" value={p5.treatmentCostAnnual.value} />
        </CardBlock>

        {/* Patent */}
        <CardBlock title="Patent" accent="amber">
          {p6.patents.slice(0, 3).map(pat => (
            <div key={pat.id} className="flex items-center justify-between gap-1">
              <span className="text-xs text-gray-600 truncate flex-1">{pat.patentNo}</span>
              <span className="text-xs text-gray-500 flex-shrink-0">{pat.expirationDate.slice(0, 7)}</span>
              <RiskBadge level={pat.riskLevel} size="xs" />
            </div>
          ))}
          <div className="pt-1 mt-1 border-t border-gray-100">
            <Row label="FTO Risk" value={<RiskBadge level={p6.ftoAnalysis.overallFTORisk} />} />
          </div>
        </CardBlock>

        {/* Economics */}
        <CardBlock title="Economics" accent="red">
          <Row label="예상약가" value={p7.expectedReimbursementPrice.value} />
          <Row label="연간치료비" value={p7.annualCost.value} />
          <Row label="5-Year NPV" value={<span className={`font-bold ${p9.npv >= 0 ? 'text-green-700' : 'text-red-700'}`}>₩{p9.npv.toLocaleString()}억</span>} />
          <Row label="RA-NPV" value={<span className={`font-bold ${p9.riskAdjustedNpv >= 0 ? 'text-green-700' : 'text-red-700'}`}>₩{p9.riskAdjustedNpv.toLocaleString()}억</span>} />
          <Row label="IRR" value={p9.irr ? `${p9.irr}%` : 'N/A'} />
          <Row label="BEP Year" value={p9.breakEvenYear ?? 'N/A'} />
        </CardBlock>
      </div>

      {/* Executive Summary Text */}
      <div className="card p-5 bg-gray-50">
        <div className="flex items-center gap-2 mb-3">
          <p className="label-text">Executive Summary Statement</p>
          <EvidenceBadge level="F" />
          <span className="text-xs text-gray-400">(AI-generated draft – requires expert review)</span>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed italic">"{p10.executiveSummaryText}"</p>
      </div>
    </section>
  );
}
