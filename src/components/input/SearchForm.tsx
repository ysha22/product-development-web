import { useState } from 'react';
import type { DevelopmentType, ReportData } from '../../types';
import type { AISettings } from '../../services/providers';
import { findSavedReport, type SavedReport } from '../../services/reportStorage';
import { ReportLibrary } from './ReportLibrary';
import { AnalysisSetup } from './AnalysisSetup';

const DEV_TYPES: { value: DevelopmentType; label: string; desc: string; emoji: string }[] = [
  { value: 'new_drug',      label: '신약',        desc: 'New Drug / NME',     emoji: '🔬' },
  { value: 'improved_drug', label: '개량신약',    desc: 'Improved Drug',       emoji: '⚗️'  },
  { value: 'generic',       label: '제네릭',      desc: 'Generic Drug',        emoji: '💊' },
  { value: 'biosimilar',    label: '바이오시밀러', desc: 'Biosimilar',          emoji: '🧬' },
  { value: 'combination',   label: '복합제',      desc: 'Fixed-dose Combo',    emoji: '🔗' },
  { value: 'other',         label: '기타',        desc: 'Other',               emoji: '📋' },
];

const QUICK_EXAMPLES = [
  'Osimertinib', 'Pembrolizumab', 'Trastuzumab', 'Imatinib',
  'Semaglutide', 'Dupilumab', 'Venetoclax', 'Lenvatinib',
];


interface Props {
  onSearch: (query:string, devType:DevelopmentType, settings:AISettings) => void;
  onLoadDemo: () => void;
  onOpen: (report:ReportData) => void;
  entries: SavedReport[];
  notice: string;
}
export function SearchForm({onSearch,onLoadDemo,onOpen,entries,notice}:Props) {
  const [query,setQuery]=useState('');
  const [devType,setDevType]=useState<DevelopmentType>('new_drug');
  const [setup,setSetup]=useState(false);
  const [error,setError]=useState('');
  const saved=findSavedReport(entries,query,devType);
  function begin() { if(!query.trim()){setError('성분명 또는 제품명을 입력하세요.');return;}setError('');setSetup(true); }
  return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0a0f2e] to-blue-950 p-6 text-white">
    <div className="mx-auto max-w-2xl py-8">
      <header className="mb-8 text-center"><p className="text-xl font-black text-blue-300">PharmaDD</p><h1 className="mt-3 text-3xl font-bold">의약품 개발 타당성 보고서</h1><p className="mt-3 text-sm text-white/60">저장된 성분은 바로 검토하고, 새 성분은 AI를 선택해 분석하세요.</p></header>
      {!setup && <form onSubmit={e=>{e.preventDefault();if(saved)onOpen(saved);else begin();}} className="rounded-2xl border border-white/15 bg-white/5 p-6">
        <label className="block text-sm">성분명 (INN) 또는 제품명
          <input value={query} onChange={e=>{setQuery(e.target.value);setError('');}} placeholder="예: Semaglutide, Osimertinib" className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 p-4 text-lg" autoFocus />
        </label>
        <div className="mt-3 flex flex-wrap gap-2">{QUICK_EXAMPLES.map(ex=><button key={ex} type="button" onClick={()=>setQuery(ex)} className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">{ex}</button>)}</div>
        <fieldset className="mt-5"><legend className="mb-3 text-sm">개발 유형</legend><div className="grid grid-cols-3 gap-2">{DEV_TYPES.map(t=><button key={t.value} type="button" aria-pressed={devType===t.value} onClick={()=>setDevType(t.value)} className={`rounded-xl border p-3 text-left text-sm ${devType===t.value?'border-blue-400 bg-blue-600/30':'border-white/10 bg-white/5'}`}>{t.emoji} {t.label}</button>)}</div></fieldset>
        {saved && <p className="mt-4 text-sm text-green-300">저장된 보고서가 있습니다. API 없이 열 수 있습니다.</p>}
        {error && <p role="alert" className="mt-3 text-sm text-red-300">{error}</p>}
        <div className="mt-5 flex flex-wrap gap-3"><button type="submit" className="rounded-lg bg-blue-600 px-5 py-3 font-semibold">{saved?'저장 보고서 열기':'새 성분 분석 설정'}</button>{saved&&<button type="button" onClick={begin} className="rounded-lg border border-white/20 px-4 py-3 text-sm">새로 분석 (API 사용)</button>}<button type="button" onClick={onLoadDemo} className="rounded-lg bg-white/10 px-4 py-3">DEMO</button></div>
      </form>}
      {setup && <AnalysisSetup query={query.trim()} devType={devType} onCancel={()=>setSetup(false)} onConfirm={settings=>onSearch(query.trim(),devType,settings)} />}
      {!setup && <ReportLibrary entries={entries} notice={notice} onOpen={onOpen} />}
      <p className="mt-5 text-center text-xs text-white/40">AI 생성 초안 · 원문 조회 및 출처 검증 미수행 · 재무 계산은 저장 보고서에서도 사용 가능</p>
    </div>
  </div>;
}
