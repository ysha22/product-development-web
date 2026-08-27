import { useState } from 'react';
import { Activity, ArrowRight, FlaskConical } from 'lucide-react';
import type { ProductInput, DevelopmentType, DevelopmentStage } from '../../types';

const DEV_TYPES: { value: DevelopmentType; label: string; desc: string }[] = [
  { value: 'new_drug',      label: '신약 (New Drug)',          desc: '독창적 MoA 또는 신규 물질' },
  { value: 'improved_drug', label: '개량신약',                  desc: '제형·제법·조성 개선' },
  { value: 'generic',       label: '제네릭 (Generic)',          desc: '오리지널 특허 만료 후 복제' },
  { value: 'biosimilar',    label: '바이오시밀러',               desc: '생물의약품 유사 제품' },
  { value: 'combination',   label: '복합제 (Combination)',      desc: '2가지 이상 성분 복합' },
  { value: 'other',         label: '기타',                      desc: '위 유형에 해당하지 않는 경우' },
];

const DEV_STAGES: { value: DevelopmentStage; label: string }[] = [
  { value: 'preclinical', label: '비임상 (Preclinical)' },
  { value: 'phase1',      label: 'Phase 1' },
  { value: 'phase2',      label: 'Phase 2' },
  { value: 'phase3',      label: 'Phase 3' },
  { value: 'nda',         label: 'NDA/BLA/품목허가 신청' },
  { value: 'approved',    label: '허가 완료' },
  { value: 'launched',    label: '출시 완료' },
];

const INITIAL: ProductInput = {
  productName: '',
  innName: '',
  developmentType: 'new_drug',
  indication: '',
  developmentCountry: '대한민국',
  targetMarket: '한국',
  expectedLaunchYear: new Date().getFullYear() + 3,
  developmentStage: 'phase3',
};

interface Props {
  onSubmit: (input: ProductInput) => void;
  onLoadDemo: () => void;
}

export function ProductInputForm({ onSubmit, onLoadDemo }: Props) {
  const [form, setForm] = useState<ProductInput>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof ProductInput, string>>>({});

  function set<K extends keyof ProductInput>(key: K, value: ProductInput[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.productName.trim()) e.productName = '제품명을 입력하세요.';
    if (!form.innName.trim()) e.innName = '성분명을 입력하세요.';
    if (!form.indication.trim()) e.indication = '대상 적응증을 입력하세요.';
    if (!form.targetMarket.trim()) e.targetMarket = '목표 시장을 입력하세요.';
    if (form.expectedLaunchYear < 2020 || form.expectedLaunchYear > 2060) e.expectedLaunchYear = '유효한 연도를 입력하세요.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) onSubmit(form);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#0f1631] to-blue-950 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">PharmaDD</span>
          </div>
          <h1 className="text-xl font-bold text-white mb-2">
            New Product Development Assessment
          </h1>
          <p className="text-sm text-white/50">
            제품 정보를 입력하면 Drug Development Due Diligence 보고서가 생성됩니다.
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* Section 1: Product Identity */}
          <div className="px-8 pt-8 pb-6 border-b border-gray-100">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">
              Product Identity
            </h2>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="label-text block mb-1.5">제품명 *</label>
                <input
                  className="input-field"
                  placeholder="예: Tagrisso®"
                  value={form.productName}
                  onChange={e => set('productName', e.target.value)}
                />
                {errors.productName && <p className="text-xs text-red-600 mt-1">{errors.productName}</p>}
              </div>
              <div>
                <label className="label-text block mb-1.5">성분명 (INN) *</label>
                <input
                  className="input-field"
                  placeholder="예: Osimertinib"
                  value={form.innName}
                  onChange={e => set('innName', e.target.value)}
                />
                {errors.innName && <p className="text-xs text-red-600 mt-1">{errors.innName}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Development Type */}
          <div className="px-8 py-6 border-b border-gray-100">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">
              개발 유형
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {DEV_TYPES.map(({ value, label, desc }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => set('developmentType', value)}
                  className={`text-left p-3 rounded-lg border-2 transition-all ${
                    form.developmentType === value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <p className={`text-xs font-semibold mb-0.5 ${form.developmentType === value ? 'text-blue-700' : 'text-gray-800'}`}>
                    {label}
                  </p>
                  <p className="text-xs text-gray-500 leading-tight">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Clinical & Market */}
          <div className="px-8 py-6 border-b border-gray-100">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">
              임상 정보 및 목표 시장
            </h2>
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2">
                <label className="label-text block mb-1.5">대상 적응증 *</label>
                <input
                  className="input-field"
                  placeholder="예: EGFR 변이 비소세포폐암 (NSCLC), 1차 치료"
                  value={form.indication}
                  onChange={e => set('indication', e.target.value)}
                />
                {errors.indication && <p className="text-xs text-red-600 mt-1">{errors.indication}</p>}
              </div>
              <div>
                <label className="label-text block mb-1.5">개발 국가</label>
                <input
                  className="input-field"
                  placeholder="예: 대한민국"
                  value={form.developmentCountry}
                  onChange={e => set('developmentCountry', e.target.value)}
                />
              </div>
              <div>
                <label className="label-text block mb-1.5">목표 시장 *</label>
                <input
                  className="input-field"
                  placeholder="예: 한국/글로벌"
                  value={form.targetMarket}
                  onChange={e => set('targetMarket', e.target.value)}
                />
                {errors.targetMarket && <p className="text-xs text-red-600 mt-1">{errors.targetMarket}</p>}
              </div>
            </div>
          </div>

          {/* Section 4: Stage & Timeline */}
          <div className="px-8 py-6">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">
              개발 단계 및 일정
            </h2>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="label-text block mb-1.5">개발 단계</label>
                <select
                  className="select-field"
                  value={form.developmentStage}
                  onChange={e => set('developmentStage', e.target.value as DevelopmentStage)}
                >
                  {DEV_STAGES.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-text block mb-1.5">예상 출시연도</label>
                <input
                  type="number"
                  className="input-field"
                  min={2020}
                  max={2060}
                  value={form.expectedLaunchYear}
                  onChange={e => set('expectedLaunchYear', parseInt(e.target.value) || 2027)}
                />
                {errors.expectedLaunchYear && <p className="text-xs text-red-600 mt-1">{errors.expectedLaunchYear}</p>}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={onLoadDemo}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              <FlaskConical className="w-4 h-4" />
              DEMO 데이터로 시작하기
            </button>
            <button type="submit" className="btn-primary flex items-center gap-2 px-6 py-2.5">
              <span className="font-semibold">제품개발 조사 시작</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-white/30 mt-5">
          입력하는 정보는 로컬에서만 처리되며 외부로 전송되지 않습니다.
        </p>
      </div>
    </div>
  );
}
