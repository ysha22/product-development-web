import type { RiskLevel } from '../../types';

const CONFIG: Record<RiskLevel, { label: string; cls: string; dot: string }> = {
  LOW:      { label: 'LOW',      cls: 'bg-green-50 text-green-700 border-green-200',  dot: 'bg-green-500' },
  MODERATE: { label: 'MODERATE', cls: 'bg-amber-50 text-amber-700 border-amber-200',  dot: 'bg-amber-500' },
  HIGH:     { label: 'HIGH',     cls: 'bg-red-50 text-red-700 border-red-200',         dot: 'bg-red-500' },
  CRITICAL: { label: 'CRITICAL', cls: 'bg-red-100 text-red-900 border-red-300',        dot: 'bg-red-700' },
};

export function RiskBadge({ level, size = 'sm' }: { level: RiskLevel; size?: 'xs' | 'sm' | 'md' }) {
  const { label, cls, dot } = CONFIG[level];
  const textSize = size === 'xs' ? 'text-xs' : size === 'md' ? 'text-sm font-semibold' : 'text-xs font-medium';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border ${cls} ${textSize}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

export function RiskDot({ level }: { level: RiskLevel }) {
  const colors: Record<RiskLevel, string> = {
    LOW: 'bg-green-500',
    MODERATE: 'bg-amber-500',
    HIGH: 'bg-red-500',
    CRITICAL: 'bg-red-800',
  };
  return <span className={`inline-block w-2.5 h-2.5 rounded-full ${colors[level]}`} />;
}
