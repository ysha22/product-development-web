import { Activity, BarChart2, BookOpen, Building2, ChevronRight, DollarSign, FileText, FlaskConical, Home, LayoutDashboard, Scale, Shield, TrendingUp } from 'lucide-react';

export const NAV_SECTIONS = [
  { id: 'executive',   label: 'Executive Summary',         icon: LayoutDashboard },
  { id: 'part1',       label: '1. 개요 및 목적',              icon: Home },
  { id: 'part2',       label: '2. 제품정보',                  icon: FileText },
  { id: 'part3',       label: '3. 학술 / 치료적 위치',         icon: BookOpen },
  { id: 'part4',       label: '4. 핵심 임상논문',              icon: FlaskConical },
  { id: 'part5',       label: '5. 시장조사',                  icon: TrendingUp },
  { id: 'part6',       label: '6. 특허현황',                  icon: Shield },
  { id: 'part7',       label: '7. 예상약가',                  icon: DollarSign },
  { id: 'part8',       label: '8. 허가전략',                  icon: Building2 },
  { id: 'part9',       label: '9. S/F 및 5-Year NPV',       icon: BarChart2 },
  { id: 'part10',      label: '10. 결론 / 개발의사결정',        icon: Scale },
] as const;

export type SectionId = typeof NAV_SECTIONS[number]['id'];

interface SidebarProps {
  activeSection: SectionId;
  onNavigate: (id: SectionId) => void;
  productName?: string;
  isDemoData?: boolean;
}

export function Sidebar({ activeSection, onNavigate, productName, isDemoData }: SidebarProps) {
  return (
    <aside className="w-60 flex-shrink-0 bg-[#0f1631] text-white flex flex-col h-screen sticky top-0 overflow-y-auto">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2 mb-1">
          <Activity className="w-5 h-5 text-blue-400" />
          <span className="text-sm font-bold tracking-wide text-white">PharmaDD</span>
        </div>
        <p className="text-xs text-white/40 leading-tight">Drug Development Due Diligence</p>
      </div>

      {/* Product info */}
      {productName && (
        <div className="px-5 py-3 border-b border-white/10 bg-white/5">
          {isDemoData && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-bold bg-amber-400 text-amber-900 mb-1.5">
              DEMO DATA
            </span>
          )}
          <p className="text-xs font-semibold text-white/90 truncate">{productName}</p>
          <p className="text-xs text-white/40 mt-0.5">Assessment Report</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2">
        {NAV_SECTIONS.map(({ id, label, icon: Icon }) => {
          const isActive = activeSection === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-left mb-0.5 transition-all group ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-white/60 hover:bg-white/8 hover:text-white/90'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-white' : 'text-white/50 group-hover:text-white/80'}`} />
              <span className="text-xs font-medium leading-tight flex-1">{label}</span>
              {isActive && <ChevronRight className="w-3 h-3 flex-shrink-0 opacity-60" />}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-white/10">
        <p className="text-xs text-white/30 leading-tight">
          © 2026 PharmaDD
          <br />
          For internal use only
        </p>
      </div>
    </aside>
  );
}
