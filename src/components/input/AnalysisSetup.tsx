import { useState } from 'react';
import { PROVIDERS, type AIProvider, type AISettings } from '../../services/providers';
import type { DevelopmentType } from '../../types';

interface Props { query:string; devType:DevelopmentType; onConfirm:(settings:AISettings)=>void; onCancel:()=>void }
export function AnalysisSetup({ query, devType, onConfirm, onCancel }: Props) {
  const [provider,setProvider] = useState<AIProvider>('gemini');
  const [model,setModel] = useState<string>(PROVIDERS.gemini.model);
  const [apiKey,setApiKey] = useState('');
  const [showKey,setShowKey] = useState(false);
  const [review,setReview] = useState(false);
  const [error,setError] = useState('');
  const [submitted,setSubmitted] = useState(false);
  const info = PROVIDERS[provider];
  return <section className="mt-5 rounded-2xl border border-blue-400/40 bg-slate-900 p-6 text-white" aria-label="새 성분 분석 설정">
    <h2 className="text-lg font-bold">{review ? '분석 진행 확인' : 'API 선택 및 키 입력'}</h2>
    <p className="mt-2 text-sm text-white/70">성분: {query} · 개발유형: {devType}</p>
    {!review ? <form onSubmit={e => { e.preventDefault(); if (!apiKey.trim() || !model.trim()) {setError('모델과 API 키를 입력하세요.');return;} setError('');setReview(true); }}>
      <label className="block mt-4 text-sm">AI 제공사
        <select value={provider} onChange={e => { const next=e.target.value as AIProvider;setProvider(next);setModel(PROVIDERS[next].model);setApiKey('');setShowKey(false); }} className="mt-1 w-full rounded-lg bg-slate-800 p-3">
          {Object.entries(PROVIDERS).map(([id,p]) => <option key={id} value={id}>{p.label}</option>)}
        </select>
      </label>
      <label className="block mt-3 text-sm">모델 ID
        <input value={model} onChange={e=>setModel(e.target.value)} className="mt-1 w-full rounded-lg bg-slate-800 p-3" required />
      </label>
      <label className="block mt-3 text-sm">{info.label} API 키
        <input type={showKey ? 'text' : 'password'} value={apiKey} onChange={e=>setApiKey(e.target.value)} autoComplete="off" spellCheck={false} className="mt-1 w-full rounded-lg bg-slate-800 p-3" required />
      </label>
      <button type="button" onClick={()=>setShowKey(v=>!v)} className="mt-2 text-xs text-blue-300">{showKey ? '키 숨기기' : '키 보기'}</button>
      <a href={info.keyUrl} target="_blank" rel="noreferrer" className="ml-4 text-xs text-blue-300 underline">API 키 발급 페이지</a>
      <p className="mt-3 text-xs text-white/60">키는 이번 분석에만 사용하며 보고서 파일이나 브라우저 보관함에 저장하지 않습니다. 다음 화면에서 확인하기 전에는 API를 호출하지 않습니다.</p>
      {error && <p role="alert" className="mt-2 text-red-300">{error}</p>}
      <div className="mt-5 flex gap-3"><button type="button" onClick={onCancel} className="rounded-lg bg-white/10 px-4 py-3">취소</button><button type="submit" className="rounded-lg bg-blue-600 px-4 py-3">진행 내용 확인</button></div>
    </form> : <div>
      <dl className="mt-4 space-y-2 text-sm"><div>제공사: {info.label}</div><div>모델: {model.trim()}</div><div>API 키: 입력 완료 (숨김)</div><div>예정 요청: 5단계 · 기본 5회</div></dl>
      <p className="mt-4 text-sm text-amber-200">‘분석 진행’을 누르면 성분명·개발유형·분석 내용을 선택한 제공사로 보내며 API 사용량과 비용이 발생할 수 있습니다. 요금·모델 접근 권한은 해당 API 계정 기준입니다.</p>
      <p className="mt-2 text-xs text-white/60">이 앱은 브라우저에서 제공사 API로 직접 연결됩니다. 생성 완료 시 이 브라우저에 보고서를 자동 저장합니다.</p>
      <a href={info.usageUrl} target="_blank" rel="noreferrer" className="mt-3 block text-sm text-blue-300 underline">사용량·한도 확인</a>
      <div className="mt-5 flex gap-3"><button type="button" disabled={submitted} onClick={()=>setReview(false)} className="rounded-lg bg-white/10 px-4 py-3">설정 수정</button><button type="button" disabled={submitted} onClick={()=>{setSubmitted(true);onConfirm({provider,model:model.trim(),apiKey:apiKey.trim()});}} className="rounded-lg bg-blue-600 px-4 py-3 disabled:opacity-50">분석 진행</button><button type="button" disabled={submitted} onClick={onCancel} className="px-3 text-sm">취소</button></div>
    </div>}
  </section>;
}
