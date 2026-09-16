import { AlertTriangle, RefreshCw, FlaskConical, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { PROVIDERS, type AIProvider } from '../../services/providers';
import { describeApiError } from '../../services/apiErrors';

interface Props {
  error: string;
  drugName: string;
  onRetry: () => void;
  onLoadDemo: () => void;
  onBack: () => void;
  completed: number;
  provider?: AIProvider;
}

export function ErrorScreen({ error, drugName, onRetry, onLoadDemo, onBack, completed, provider = 'gemini' }: Props) {
  const [showDetail, setShowDetail] = useState(false);

  const helpMsg = describeApiError(error, provider);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0a0f2e] to-blue-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8 text-center">

          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 mb-5">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>

          <h2 className="text-xl font-bold text-white mb-2">보고서 생성 실패</h2>
          <p className="text-sm text-white/50 mb-1">
            <span className="font-semibold text-white/70">{drugName}</span> 분석 중 오류가 발생했습니다.
          </p>

          {/* Help message */}
          {helpMsg && (
            <div className="mt-3 mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <p className="text-xs text-amber-300 leading-relaxed">{helpMsg}</p>
            </div>
          )}

          {/* Error detail (collapsible) */}
          <button
            onClick={() => setShowDetail(s => !s)}
            className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/50 mx-auto mb-4"
          >
            {showDetail ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            오류 상세 보기
          </button>
          {showDetail && (
            <div className="mb-4 p-3 bg-black/30 rounded-lg text-left">
              <p className="text-xs font-mono text-red-300 break-all leading-relaxed">{error}</p>
            </div>
          )}

          <p className="text-xs text-white/50 mb-4">완료된 단계는 이 화면을 사용하는 동안 유지됩니다. 새로고침하거나 창을 닫으면 사라집니다.</p>
          <a href={PROVIDERS[provider].usageUrl} target="_blank" rel="noreferrer" className="block text-sm text-blue-300 underline mb-4">{PROVIDERS[provider].label} 사용량 및 한도 확인</a>
          {/* Actions */}
          <div className="space-y-2.5">
            <button
              onClick={onRetry}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl
                         bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              {completed > 0 ? `이어서 시도 (${completed}/5단계 완료)` : '다시 시도'}
            </button>


            <button
              onClick={onLoadDemo}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl
                         bg-white/8 hover:bg-white/12 border border-white/10
                         text-white/70 font-medium text-sm transition-all"
            >
              <FlaskConical className="w-4 h-4" />
              DEMO 데이터로 확인하기
            </button>

            <button
              onClick={onBack}
              className="w-full text-xs text-white/30 hover:text-white/50 py-2 transition-colors"
            >
              ← 검색 화면으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
