import { useEffect, useState } from 'react';
import { Activity, CheckCircle, Loader2 } from 'lucide-react';
import type { ProgressState, ProgressStep } from '../../services/aiService';

const STEP_ORDER: ProgressStep[] = [
  'searching', 'product_info', 'clinical', 'market_patent', 'financial', 'conclusion', 'done',
];

const STEP_META: Record<ProgressStep, { icon: string; color: string }> = {
  searching:     { icon: '🔍', color: 'text-blue-400' },
  product_info:  { icon: '📋', color: 'text-indigo-400' },
  clinical:      { icon: '🧬', color: 'text-purple-400' },
  market_patent: { icon: '📊', color: 'text-cyan-400' },
  financial:     { icon: '💹', color: 'text-green-400' },
  conclusion:    { icon: '⚖️',  color: 'text-amber-400' },
  done:          { icon: '✅', color: 'text-green-400' },
  error:         { icon: '❌', color: 'text-red-400' },
};

const ANALYSIS_TIPS = [
  'FDA · EMA · MFDS 허가 데이터베이스 참조 중…',
  'PubMed 임상논문 검색 및 분석 중…',
  'ClinicalTrials.gov 임상시험 데이터 수집 중…',
  'NCCN · ESMO · ASCO 진료지침 확인 중…',
  'KIPRIS · USPTO · EPO 특허 포트폴리오 분석 중…',
  '시장조사 데이터 및 경쟁 현황 분석 중…',
  'HIRA · NHIS 약가 및 급여 정보 확인 중…',
  '5-Year NPV 및 리스크 모델 계산 중…',
  '개발의사결정 프레임워크 적용 중…',
];

interface Props {
  progress: ProgressState;
  drugName: string;
}

export function LoadingScreen({ progress, drugName }: Props) {
  const [tipIndex, setTipIndex] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const tipTimer = setInterval(() => {
      setTipIndex(i => (i + 1) % ANALYSIS_TIPS.length);
    }, 2800);
    return () => clearInterval(tipTimer);
  }, []);

  useEffect(() => {
    const dotTimer = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.');
    }, 400);
    return () => clearInterval(dotTimer);
  }, []);

  const currentStepIdx = STEP_ORDER.indexOf(progress.step);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0a0f2e] to-blue-950 flex flex-col items-center justify-center p-6">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <span className="text-lg font-black text-white">PharmaDD</span>
        </div>

        {/* Drug name */}
        <div className="text-center mb-8">
          <p className="text-xs text-white/40 uppercase tracking-widest mb-2">분석 대상</p>
          <h2 className="text-2xl font-black text-white">{drugName}</h2>
          <p className="text-sm text-white/50 mt-1">AI 기반 DD 보고서 생성 중{dots}</p>
        </div>

        {/* Main progress card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-5">
          {/* Overall progress bar */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-white/60">전체 진행률</span>
              <span className="text-sm font-bold text-white">{progress.percent}%</span>
            </div>
            <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
          </div>

          {/* Current step */}
          <div className="flex items-center gap-3 p-3 bg-blue-600/10 border border-blue-500/20 rounded-xl mb-4">
            <Loader2 className="w-5 h-5 text-blue-400 animate-spin flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{progress.label}</p>
              {progress.detail && (
                <p className="text-xs text-white/50 truncate mt-0.5">{progress.detail}</p>
              )}
            </div>
          </div>

          {/* Step pipeline */}
          <div className="space-y-1">
            {STEP_ORDER.filter(s => s !== 'error').map((step, idx) => {
              const isCompleted = idx < currentStepIdx;
              const isCurrent   = idx === currentStepIdx;
              const meta = STEP_META[step];

              return (
                <div
                  key={step}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                    isCurrent  ? 'bg-white/8'  :
                    isCompleted? 'opacity-70'  :
                    'opacity-30'
                  }`}
                >
                  <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : isCurrent ? (
                      <Loader2 className={`w-4 h-4 ${meta.color} animate-spin`} />
                    ) : (
                      <span className="text-sm">{meta.icon}</span>
                    )}
                  </div>
                  <span className={`text-xs font-medium ${
                    isCurrent   ? 'text-white' :
                    isCompleted ? 'text-green-300' :
                    'text-white/40'
                  }`}>
                    {step === 'searching'     ? '의약품 기본정보 조회' :
                     step === 'product_info'  ? '제품정보 · 허가현황' :
                     step === 'clinical'      ? '임상데이터 · 학술정보' :
                     step === 'market_patent' ? '시장조사 · 특허현황' :
                     step === 'financial'     ? '약가 · 허가전략 · NPV' :
                     step === 'conclusion'    ? '최종 개발의사결정' :
                     '완료'}
                  </span>
                  {isCurrent && (
                    <div className="ml-auto flex gap-0.5">
                      {[0,1,2].map(i => (
                        <div
                          key={i}
                          className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Rotating tip */}
        <div className="text-center px-4 py-3 bg-white/3 border border-white/8 rounded-xl">
          <p className="text-xs text-white/40 leading-relaxed transition-all duration-500">
            💡 {ANALYSIS_TIPS[tipIndex]}
          </p>
        </div>

        <p className="text-center text-xs text-white/20 mt-4">
          GPT-4o 기반 분석 · 약 30–60초 소요 · 5개 데이터 청크 순차 처리
        </p>
      </div>
    </div>
  );
}
