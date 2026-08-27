import { useState, useEffect } from 'react';
import { Activity, ArrowRight, FlaskConical, Key, Eye, EyeOff, Search, Settings, X, ChevronDown } from 'lucide-react';
import type { DevelopmentType } from '../../types';

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
  onSearch: (query: string, devType: DevelopmentType, apiKey: string) => void;
  onLoadDemo: () => void;
  isLoading?: boolean;
}

export function SearchForm({ onSearch, onLoadDemo, isLoading = false }: Props) {
  const [query, setQuery]         = useState('');
  const [devType, setDevType]     = useState<DevelopmentType>('new_drug');
  const [apiKey, setApiKey]       = useState('');
  const [showKey, setShowKey]     = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError]         = useState('');

  /* API Key – localStorage 자동 로드 */
  useEffect(() => {
    const saved = localStorage.getItem('pharmadd_api_key') ?? '';
    setApiKey(saved);
  }, []);

  function saveApiKey(key: string) {
    setApiKey(key);
    if (key) localStorage.setItem('pharmadd_api_key', key);
    else     localStorage.removeItem('pharmadd_api_key');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) { setError('성분명 또는 제품명을 입력하세요.'); return; }
    if (!apiKey.trim()) { setError('OpenAI API Key가 필요합니다. 아래 설정에서 입력하세요.'); setShowSettings(true); return; }
    setError('');
    onSearch(query.trim(), devType, apiKey.trim());
  }

  function handleExample(ex: string) {
    setQuery(ex);
    setError('');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0a0f2e] to-blue-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Logo & header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <p className="text-xl font-black text-white tracking-tight">PharmaDD</p>
              <p className="text-xs text-white/40 font-medium">Drug Development Due Diligence</p>
            </div>
          </div>
          <h1 className="text-3xl font-black text-white mb-3 leading-tight">
            성분명 하나로<br />
            <span className="text-blue-400">개발 타당성 보고서</span> 자동 생성
          </h1>
          <p className="text-sm text-white/50 max-w-md mx-auto leading-relaxed">
            AI가 허가현황·임상데이터·시장규모·특허·약가·NPV를 분석해
            투자심의용 DD 보고서를 즉시 생성합니다.
          </p>
        </div>

        {/* Main search card */}
        <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">

          {/* Search input */}
          <div className="p-6 pb-4">
            <label className="block text-xs font-semibold text-white/60 uppercase tracking-widest mb-3">
              성분명 (INN) 또는 제품명
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-4
                           text-white text-lg font-medium placeholder:text-white/30
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition-all"
                placeholder="예: Osimertinib, Pembrolizumab, Trastuzumab…"
                value={query}
                onChange={e => { setQuery(e.target.value); setError(''); }}
                disabled={isLoading}
                autoFocus
              />
              {query && (
                <button type="button" onClick={() => setQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick examples */}
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs text-white/30 self-center">예시:</span>
              {QUICK_EXAMPLES.map(ex => (
                <button
                  key={ex} type="button"
                  onClick={() => handleExample(ex)}
                  disabled={isLoading}
                  className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-white/60
                             hover:bg-blue-600/30 hover:text-white/90 transition-all border border-white/10"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          {/* Development type selector */}
          <div className="px-6 pb-4">
            <label className="block text-xs font-semibold text-white/60 uppercase tracking-widest mb-3">
              개발 유형
            </label>
            <div className="grid grid-cols-3 gap-2">
              {DEV_TYPES.map(({ value, label, desc, emoji }) => (
                <button
                  key={value} type="button"
                  onClick={() => setDevType(value)}
                  disabled={isLoading}
                  className={`text-left p-3 rounded-xl border transition-all ${
                    devType === value
                      ? 'border-blue-500 bg-blue-600/20 text-white'
                      : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <span className="text-base">{emoji}</span>
                  <p className={`text-xs font-semibold mt-1 ${devType === value ? 'text-white' : 'text-white/80'}`}>
                    {label}
                  </p>
                  <p className="text-xs text-white/40 mt-0.5">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* API Key settings (collapsible) */}
          <div className="px-6 pb-2">
            <button
              type="button"
              onClick={() => setShowSettings(s => !s)}
              className={`flex items-center gap-2 text-xs font-medium transition-colors ${
                apiKey
                  ? 'text-green-400 hover:text-green-300'
                  : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              {apiKey ? '✓ API Key 저장됨' : '⚠ OpenAI API Key 설정 필요'}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showSettings ? 'rotate-180' : ''}`} />
            </button>

            {showSettings && (
              <div className="mt-3 p-4 bg-white/5 rounded-xl border border-white/10">
                <label className="block text-xs font-semibold text-white/60 uppercase tracking-widest mb-2">
                  OpenAI API Key
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type={showKey ? 'text' : 'password'}
                    className="w-full bg-white/10 border border-white/20 rounded-lg pl-9 pr-10 py-2.5
                               text-white text-sm font-mono placeholder:text-white/30
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="sk-proj-…"
                    value={apiKey}
                    onChange={e => saveApiKey(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-white/30">
                    · Key는 브라우저 localStorage에만 저장되며 외부로 전송되지 않습니다.
                  </p>
                  <p className="text-xs text-white/30">
                    · GPT-4o 사용 (보고서당 약 $0.10–0.30 비용 예상)
                  </p>
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300 underline"
                  >
                    API Key 발급하기 →
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="mx-6 mb-3 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="p-6 pt-3 flex items-center gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2.5 py-3.5 px-6
                         bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/40
                         text-white font-bold text-base rounded-xl
                         transition-all shadow-lg shadow-blue-600/30
                         focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  보고서 생성 중…
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  보고서 생성
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onLoadDemo}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-3.5 rounded-xl
                         bg-white/10 hover:bg-white/15 disabled:opacity-40
                         text-white/70 hover:text-white text-sm font-medium
                         border border-white/10 transition-all"
            >
              <FlaskConical className="w-4 h-4" />
              DEMO
            </button>
          </div>
        </form>

        {/* Footer note */}
        <div className="mt-6 text-center space-y-1">
          <p className="text-xs text-white/25">
            AI 생성 데이터는 참고용이며 실제 투자·임상·법률 결정의 근거로 사용할 수 없습니다.
          </p>
          <p className="text-xs text-white/20">
            데이터 출처: FDA · EMA · MFDS · PubMed · KIPRIS · HIRA 공개 정보 기반 AI 분석
          </p>
        </div>
      </div>
    </div>
  );
}
