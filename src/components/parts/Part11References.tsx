import { ExternalLink } from 'lucide-react';
import type { ReportData, ReferenceCategory } from '../../types';
import { SectionCard } from '../shared/SectionCard';

const CATEGORY_LABELS: Record<ReferenceCategory, { ko: string; color: string }> = {
  clinical:    { ko: '임상',     color: 'badge-blue' },
  regulatory:  { ko: '허가·규정', color: 'badge-green' },
  patent:      { ko: '특허',     color: 'badge-purple' },
  market:      { ko: '시장',     color: 'badge-amber' },
  guideline:   { ko: '가이드라인', color: 'badge-teal' },
  academic:    { ko: '학술',     color: 'badge-gray' },
  financial:   { ko: '재무',     color: 'badge-orange' },
  other:       { ko: '기타',     color: 'badge-gray' },
};

// badge 색상이 없는 경우 fallback
const CATEGORY_STYLES: Record<ReferenceCategory, string> = {
  clinical:    'bg-blue-100 text-blue-700',
  regulatory:  'bg-green-100 text-green-700',
  patent:      'bg-purple-100 text-purple-700',
  market:      'bg-amber-100 text-amber-700',
  guideline:   'bg-teal-100 text-teal-700',
  academic:    'bg-gray-100 text-gray-700',
  financial:   'bg-orange-100 text-orange-700',
  other:       'bg-gray-100 text-gray-600',
};

interface Props { report: ReportData }

export function Part11References({ report }: Props) {
  const refs = report.part11?.references ?? [];

  // 카테고리별 그룹핑
  const groups = refs.reduce<Record<ReferenceCategory, typeof refs>>((acc, ref) => {
    if (!acc[ref.category]) acc[ref.category] = [];
    acc[ref.category].push(ref);
    return acc;
  }, {} as Record<ReferenceCategory, typeof refs>);

  const categoryOrder: ReferenceCategory[] = [
    'clinical', 'guideline', 'regulatory', 'patent', 'market', 'academic', 'financial', 'other',
  ];

  return (
    <section id="part11" className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Part 11. 참고문헌</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          AI가 제안한 미검증 참고문헌 · 링크의 실재 여부와 본문 일치 여부를 확인하세요
        </p>
      </div>

      {refs.length === 0 ? (
        <div className="card p-6 text-center text-gray-400 text-sm">
          참고문헌 정보가 없습니다.
        </div>
      ) : (
        <>
          {/* 전체 목록 */}
          <SectionCard title={`전체 참고문헌 (${refs.length}건)`} noPad>
            <table className="table-professional">
              <thead>
                <tr>
                  <th className="w-10 text-center">번호</th>
                  <th className="w-20">분류</th>
                  <th>제목</th>
                  <th>저자 / 기관</th>
                  <th className="w-16 text-center">연도</th>
                  <th className="w-16 text-center">링크</th>
                </tr>
              </thead>
              <tbody>
                {refs.map(ref => (
                  <tr key={ref.id}>
                    <td className="text-center">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold">
                        {ref.id}
                      </span>
                    </td>
                    <td>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${CATEGORY_STYLES[ref.category]}`}>
                        {CATEGORY_LABELS[ref.category].ko}
                      </span>
                    </td>
                    <td>
                      <p className="text-sm font-medium text-gray-900 leading-snug">{ref.title}</p>
                      {ref.source && (
                        <p className="text-xs text-gray-400 mt-0.5">{ref.source}</p>
                      )}
                      {ref.doi && (
                        <p className="text-xs text-blue-500 mt-0.5">DOI: {ref.doi}</p>
                      )}
                      {ref.note && (
                        <p className="text-xs text-gray-400 italic mt-0.5">{ref.note}</p>
                      )}
                    </td>
                    <td className="text-xs text-gray-600">{ref.authors ?? '-'}</td>
                    <td className="text-center text-xs text-gray-600">{ref.year ?? '-'}</td>
                    <td className="text-center">
                      {ref.url ? (
                        <a
                          href={ref.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                          원문 <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-gray-300">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>

          {/* 카테고리별 상세 */}
          <div className="space-y-4">
            {categoryOrder
              .filter(cat => groups[cat]?.length > 0)
              .map(cat => (
                <SectionCard
                  key={cat}
                  title={`${CATEGORY_LABELS[cat].ko} 문헌 (${groups[cat].length}건)`}
                >
                  <ol className="space-y-3">
                    {groups[cat].map(ref => (
                      <li key={ref.id} className="flex gap-3">
                        <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold mt-0.5">
                          {ref.id}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 leading-snug">{ref.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {[ref.authors, ref.source, ref.year].filter(Boolean).join(' · ')}
                          </p>
                          {ref.doi && (
                            <p className="text-xs text-blue-500 mt-0.5">DOI: {ref.doi}</p>
                          )}
                          {ref.url && (
                            <a
                              href={ref.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-1"
                            >
                              원문 보기 <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          {ref.note && (
                            <p className="text-xs text-gray-400 italic mt-1">{ref.note}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                </SectionCard>
              ))}
          </div>
        </>
      )}
    </section>
  );
}
