import type { EvidenceLevel, DataStatus } from '../../types';

const EVIDENCE_LABELS: Record<EvidenceLevel, string> = {
  A: '공식 허가/정부',
  B: '동료심사 임상논문',
  C: '임상진료지침',
  D: '회사 공시',
  E: '시장조사/이차자료',
  F: '가정/추정',
};

const STATUS_LABELS: Record<DataStatus, { label: string; cls: string }> = {
  actual:      { label: 'Actual',      cls: 'bg-blue-100 text-blue-800' },
  estimate:    { label: 'Estimate',    cls: 'bg-amber-100 text-amber-800' },
  assumption:  { label: 'Assumption',  cls: 'bg-orange-100 text-orange-800' },
  unavailable: { label: 'N/A',         cls: 'bg-gray-100 text-gray-500' },
  user_input:  { label: 'User Input',  cls: 'bg-purple-100 text-purple-800' },
};

const EVIDENCE_COLORS: Record<EvidenceLevel, string> = {
  A: 'bg-blue-600',
  B: 'bg-indigo-600',
  C: 'bg-violet-600',
  D: 'bg-amber-500',
  E: 'bg-orange-500',
  F: 'bg-gray-400',
};

export function EvidenceBadge({ level }: { level: EvidenceLevel }) {
  return (
    <span
      className={`inline-flex items-center justify-center w-5 h-5 rounded text-xs font-bold text-white ${EVIDENCE_COLORS[level]}`}
      data-tooltip={`Evidence ${level}: ${EVIDENCE_LABELS[level]}`}
    >
      {level}
    </span>
  );
}

export function StatusBadge({ status }: { status: DataStatus }) {
  const { label, cls } = STATUS_LABELS[status];
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}
