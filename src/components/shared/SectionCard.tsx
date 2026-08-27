import { type ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  badge?: ReactNode;
  className?: string;
  noPad?: boolean;
}

export function SectionCard({ title, subtitle, children, badge, className = '', noPad }: SectionCardProps) {
  return (
    <div className={`card ${className}`}>
      <div className="card-header flex items-center justify-between gap-3">
        <div>
          <h3 className="section-title">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {badge && <div className="flex-shrink-0">{badge}</div>}
      </div>
      <div className={noPad ? '' : 'card-body'}>{children}</div>
    </div>
  );
}

interface InfoRowProps {
  label: string;
  value: ReactNode;
  className?: string;
}
export function InfoRow({ label, value, className = '' }: InfoRowProps) {
  return (
    <div className={`flex items-start py-2 border-b border-gray-50 last:border-0 ${className}`}>
      <span className="label-text w-40 flex-shrink-0 pt-0.5">{label}</span>
      <span className="value-text flex-1">{value}</span>
    </div>
  );
}

export function MetricCard({
  label,
  value,
  sub,
  color = 'blue',
  large,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  color?: 'blue' | 'green' | 'red' | 'amber' | 'purple' | 'gray';
  large?: boolean;
}) {
  const accent: Record<string, string> = {
    blue:   'border-t-blue-500',
    green:  'border-t-green-500',
    red:    'border-t-red-500',
    amber:  'border-t-amber-500',
    purple: 'border-t-purple-500',
    gray:   'border-t-gray-400',
  };
  return (
    <div className={`card border-t-2 ${accent[color]} p-4`}>
      <p className="label-text mb-1">{label}</p>
      <p className={`font-bold text-gray-900 leading-tight ${large ? 'text-2xl' : 'text-lg'}`}>{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}
