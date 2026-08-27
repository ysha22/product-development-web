import { CheckCircle, Target } from 'lucide-react';
import type { ReportData } from '../../types';
import { SectionCard } from '../shared/SectionCard';

interface Props { report: ReportData }

export function Part1Overview({ report }: Props) {
  const p = report.part1;
  const inp = report.input;

  return (
    <section id="part1" className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Part 1. 개요 및 목적</h2>
        <p className="text-sm text-gray-500 mt-0.5">Why this product? – 개발 배경, 필요성, 목적</p>
      </div>

      {/* Why This Product */}
      <div className="card border-t-2 border-t-blue-600 p-5">
        <p className="label-text mb-3">Why This Product?</p>
        <div className="grid grid-cols-2 gap-3">
          {p.whyThisProduct.map((r, i) => (
            <div key={i} className="flex items-start gap-2.5 p-3 bg-blue-50 rounded-lg">
              <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-900 leading-relaxed">{r}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Product Summary */}
        <SectionCard title="제품 개요">
          <p className="text-sm text-gray-700 leading-relaxed">{p.productSummary}</p>
        </SectionCard>

        {/* Development Background */}
        <SectionCard title="개발 배경">
          <p className="text-sm text-gray-700 leading-relaxed">{p.developmentBackground}</p>
        </SectionCard>
      </div>

      {/* Disease & Limitations */}
      <div className="grid grid-cols-2 gap-5">
        <SectionCard title="대상 질환">
          <p className="text-sm font-semibold text-gray-800 mb-2">{p.targetDisease}</p>
          <p className="text-sm text-gray-600">적응증: {inp.indication}</p>
        </SectionCard>

        <SectionCard title="현재 치료의 한계">
          <ul className="space-y-2">
            {p.currentTreatmentLimitations.map((lim, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-gray-700">{lim}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      {/* Development Necessity & Objective */}
      <div className="grid grid-cols-2 gap-5">
        <SectionCard title="개발 필요성">
          <p className="text-sm text-gray-700 leading-relaxed">{p.developmentNecessity}</p>
        </SectionCard>
        <SectionCard title="개발 목적">
          <p className="text-sm text-gray-700 leading-relaxed">{p.developmentObjective}</p>
        </SectionCard>
      </div>

      {/* Target Product Profile */}
      <SectionCard
        title="Target Product Profile (TPP)"
        badge={<span className="badge badge-blue">TPP</span>}
      >
        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
          {Object.entries(p.targetProductProfile).map(([key, value]) => {
            const labels: Record<string, string> = {
              indication: '대상 적응증',
              patientPopulation: '환자 집단',
              therapeuticLine: '치료 순서',
              administrationRoute: '투여경로',
              dosingFrequency: '투여주기',
              safetyProfile: '안전성 목표',
              efficacyTarget: '유효성 목표',
            };
            return (
              <div key={key} className="flex items-start gap-3">
                <span className="w-24 flex-shrink-0 text-xs font-medium text-gray-500 pt-0.5">{labels[key] ?? key}</span>
                <span className="text-sm text-gray-800">{value}</span>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Development Direction */}
      <SectionCard title="예상 개발 방향">
        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
          <Target className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-800 leading-relaxed">{p.developmentDirection}</p>
        </div>
      </SectionCard>

      {/* Key Question */}
      <div className="card border border-dashed border-blue-300 bg-blue-50 p-5">
        <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-2">
          Key Assessment Question
        </p>
        <p className="text-base font-semibold text-blue-900 italic">
          "현재 시장과 임상환경에서 이 제품을 개발할 이유가 있는가?"
        </p>
        <p className="text-sm text-blue-700 mt-2 leading-relaxed">
          → 상기 분석에 기반할 때, <strong>{inp.innName}</strong>의 개발 필요성은
          충분하며, 개발 목적이 명확하게 정의된다.
        </p>
      </div>
    </section>
  );
}
