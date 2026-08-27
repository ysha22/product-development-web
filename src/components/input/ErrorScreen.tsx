import { AlertTriangle, RefreshCw, FlaskConical, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface Props {
  error: string;
  drugName: string;
  onRetry: () => void;
  onLoadDemo: () => void;
  onBack: () => void;
  partialReport?: boolean;   // true if partial data was loaded
  onUsePartial?: () => void;
}

const ERROR_HELPS: { pattern: RegExp; help: string }[] = [
  { pattern: /401|Unauthorized|invalid.*key/i,
    help: 'API Key가 올바르지 않습니다. 설정에서 OpenAI API Key를 다시 확인하세요.' },
  { pattern: /429|rate.*limit|quota/i,
    help: 'API 호출 한도에 도달했습니다. 잠시 후 다시 시도하거나 사용 플랜을 확인하세요.' },
  { pattern: /503|502|500|server/i,
    help: 'OpenAI 서버에 일시적인 문제가 있습니다. 1-2분 후 재시도하세요.' },
  { pattern: /network|fetch|CORS|Failed to fetch/i,
    help: '네트워크 연결을 확인하세요. VPN 또는 방화벽이 API 요청을 차단할 수 있습니다.' },
  { pattern: /parse|JSON/i,
    help: 'AI 응답 형식 오류입니다. 재시도하면 대부분 해결됩니다.' },
];

export function ErrorScreen({ error, drugName, onRetry, onLoadDemo, onBack, partialReport, onUsePartial }: Props) {
  const [showDetail, setShowDetail] = useState(false);

  const helpMsg = ERROR_HELPS.find(h => h.pattern.test(error))?.help;

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

          {/* Actions */}
          <div className="space-y-2.5">
            <button
              onClick={onRetry}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl
                         bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              다시 시도
            </button>

            {partialReport && onUsePartial && (
              <button
                onClick={onUsePartial}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl
                           bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30
                           text-amber-300 font-medium text-sm transition-all"
              >
                부분 생성된 보고서 보기
                <span className="text-xs text-amber-400/60">(불완전할 수 있음)</span>
              </button>
            )}

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
