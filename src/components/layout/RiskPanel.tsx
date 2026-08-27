import { AlertOctagon, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import type { RiskPanel as RiskPanelType, RiskLevel } from '../../types';

const RISK_ICON: Record<RiskLevel, { icon: typeof CheckCircle; cls: string }> = {
  LOW:      { icon: CheckCircle,  cls: 'text-green-500' },
  MODERATE: { icon: AlertTriangle, cls: 'text-amber-500' },
  HIGH:     { icon: ShieldAlert,  cls: 'text-red-500' },
  CRITICAL: { icon: AlertOctagon, cls: 'text-red-700' },
};

const RISK_BAR: Record<RiskLevel, string> = {
  LOW:      'bg-green-500 w-1/4',
  MODERATE: 'bg-amber-500 w-2/4',
  HIGH:     'bg-red-500 w-3/4',
  CRITICAL: 'bg-red-700 w-full',
};

const RISK_TEXT: Record<RiskLevel, string> = {
  LOW:      'text-green-700',
  MODERATE: 'text-amber-700',
  HIGH:     'text-red-700',
  CRITICAL: 'text-red-900',
};

const RISK_BG: Record<RiskLevel, string> = {
  LOW:      'bg-green-50 border-green-200',
  MODERATE: 'bg-amber-50 border-amber-200',
  HIGH:     'bg-red-50 border-red-200',
  CRITICAL: 'bg-red-100 border-red-300',
};

function RiskRow({ label, level }: { label: string; level: RiskLevel }) {
  const { icon: Icon, cls } = RISK_ICON[level];
  return (
    <div className="flex items-center gap-2 py-1.5">
      <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${cls}`} />
      <span className="text-xs text-gray-600 flex-1 truncate">{label}</span>
      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${RISK_BAR[level]}`} />
      </div>
      <span className={`text-xs font-semibold w-16 text-right ${RISK_TEXT[level]}`}>{level}</span>
    </div>
  );
}

interface Props {
  risk: RiskPanelType;
}

export function RiskPanel({ risk }: Props) {
  return (
    <aside className="w-56 flex-shrink-0 bg-white border-l border-gray-200 h-screen sticky top-0 overflow-y-auto">
      <div className="p-4">
        {/* Overall Risk */}
        <div className="mb-4">
          <p className="label-text mb-2">Overall Risk</p>
          <div className={`rounded-lg border px-3 py-2.5 ${RISK_BG[risk.overall]}`}>
            <div className="flex items-center gap-2">
              {(() => {
                const { icon: Icon, cls } = RISK_ICON[risk.overall];
                return <Icon className={`w-5 h-5 ${cls}`} />;
              })()}
              <span className={`text-base font-bold ${RISK_TEXT[risk.overall]}`}>{risk.overall}</span>
            </div>
          </div>
        </div>

        {/* Risk Breakdown */}
        <div>
          <p className="label-text mb-2">Risk Breakdown</p>
          <div className="divide-y divide-gray-50">
            <RiskRow label="Clinical"    level={risk.clinical} />
            <RiskRow label="Regulatory"  level={risk.regulatory} />
            <RiskRow label="Patent/FTO"  level={risk.patent} />
            <RiskRow label="Market"      level={risk.market} />
            <RiskRow label="Pricing"     level={risk.pricing} />
            <RiskRow label="Financial"   level={risk.financial} />
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="label-text mb-1.5">Risk Scale</p>
          {(['LOW','MODERATE','HIGH','CRITICAL'] as RiskLevel[]).map(l => (
            <div key={l} className="flex items-center gap-1.5 py-0.5">
              <div className={`w-2 h-2 rounded-full ${RISK_BAR[l].split(' ')[0]}`} />
              <span className="text-xs text-gray-500">{l}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
