import type { ReportData } from '../../types';
import { SectionCard } from '../shared/SectionCard';
import { EvidenceBadge } from '../shared/EvidenceBadge';

interface Props { report: ReportData }

export function Part2Product({ report }: Props) {
  const p = report.part2;

  const rows: { cat: string; value: React.ReactNode }[] = [
    { cat: '성분명 (INN)',      value: <span className="font-semibold">{p.innName}</span> },
    { cat: '제품명',             value: p.brandName },
    { cat: '개발사',             value: p.developer },
    { cat: '제조사',             value: p.manufacturer },
    { cat: '약효분류',           value: p.pharmacologicalClass },
    { cat: '작용기전 (MoA)',     value: p.mechanismOfAction },
    { cat: '투여경로',           value: p.routeOfAdministration },
    { cat: '제형',               value: p.dosageForm },
    { cat: '용량',               value: p.strength },
    { cat: '최초허가국',         value: p.firstApprovalCountry },
    { cat: '최초허가일',         value: <span className="font-semibold text-blue-700">{p.firstApprovalDate} 최초 허가</span> },
    { cat: '국내허가일',         value: p.koreaApprovalDate ? <span className="font-semibold text-blue-700">{p.koreaApprovalDate} 허가</span> : 'N/A' },
    { cat: '허가 적응증',        value: (
        <ul className="space-y-0.5">
          {p.approvedIndications.map((ind, i) => (
            <li key={i} className="flex items-start gap-1.5">
              <span className="text-blue-500 font-bold mt-0.5">·</span>
              <span>{ind}</span>
            </li>
          ))}
        </ul>
      )
    },
    { cat: '용법·용량',          value: p.dosageAndAdministration },
    { cat: 'PMS',               value: p.pms },
    { cat: '재심사기간',         value: p.reexaminationPeriod },
    { cat: '독점권 (Exclusivity)', value: p.exclusivity },
    { cat: '특허',               value: (
        <ul className="space-y-0.5">
          {p.patents.map((pat, i) => <li key={i} className="text-sm">{pat}</li>)}
        </ul>
      )
    },
    { cat: '보험급여',           value: p.reimbursementStatus },
    { cat: '약가',               value: <span className="font-semibold text-green-700">{p.price}</span> },
    { cat: '경쟁품목',           value: p.competitors.join(', ') },
  ];

  return (
    <section id="part2" className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Part 2. 제품정보</h2>
        <p className="text-sm text-gray-500 mt-0.5">허가·규제·제품 기본 정보</p>
      </div>

      <SectionCard
        title="제품 기본정보"
        subtitle="허가 관련 일자는 실제 날짜를 기준으로 표시"
        badge={<EvidenceBadge level="A" />}
        noPad
      >
        <table className="table-professional">
          <thead>
            <tr>
              <th className="w-44">Category</th>
              <th>Information</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ cat, value }) => (
              <tr key={cat}>
                <td className="font-medium text-gray-600 bg-gray-50/50 w-44">{cat}</td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      {/* Note on dates */}
      <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
        <span className="text-blue-600 font-bold text-xs flex-shrink-0 mt-0.5">NOTE</span>
        <p className="text-xs text-blue-800 leading-relaxed">
          허가 관련 날짜는 반드시 MFDS / FDA / EMA 공식 문서를 1차 출처로 하며, 
          단순히 "허가됨"으로 표시하지 않고 실제 날짜(YYYY-MM-DD)를 명시합니다.
          추정값의 경우 별도 표시됩니다.
        </p>
      </div>
    </section>
  );
}
