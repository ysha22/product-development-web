import { useRef, useState } from 'react';
import type { ReportData } from '../../types';
import { decodeReport, MAX_REPORT_BYTES, type SavedReport } from '../../services/reportStorage';

interface Props {
  entries: SavedReport[];
  onOpen: (report: ReportData) => void;
  notice: string;
}

export function ReportLibrary({ entries, onOpen, notice }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function importFile(file?: File) {
    if (!file) return;
    setBusy(true); setError('');
    try {
      if (file.size > MAX_REPORT_BYTES) throw new Error('5MB 이하의 보고서 파일을 선택하세요.');
      const report = decodeReport(await file.text());
      onOpen(report);
    } catch (err) { setError(err instanceof Error ? err.message : '파일을 불러올 수 없습니다.'); }
    finally { setBusy(false); if (fileRef.current) fileRef.current.value = ''; }
  }
  return <section className="mt-5 rounded-2xl border border-white/15 bg-white/5 p-5 text-white">
    <div className="flex flex-wrap justify-between items-center gap-3">
      <h2 className="font-semibold">저장된 보고서 ({entries.length})</h2>
      <button type="button" disabled={busy} onClick={() => fileRef.current?.click()} className="rounded-lg bg-white/10 px-3 py-2 text-sm hover:bg-white/20">
        {busy ? '불러오는 중…' : '보고서 불러오기 (JSON)'}
      </button>
      <input ref={fileRef} type="file" accept=".json,application/json" aria-label="보고서 JSON 파일" className="hidden" onChange={e => void importFile(e.target.files?.[0])} />
    </div>
    <p className="mt-2 text-xs text-white/60">저장된 보고서는 API 없이 열 수 있습니다. 다른 컴퓨터로 옮기거나 백업하려면 보고서 화면에서 JSON으로 저장하세요.</p>
    {notice && <p role="status" className="mt-3 text-sm text-amber-300">{notice}</p>}
    {error && <p role="alert" className="mt-3 text-sm text-red-300">{error}</p>}
    <div className="mt-3 max-h-64 overflow-y-auto space-y-2">
      {entries.map(({ report }) => <button key={report.id} type="button" disabled={busy} onClick={() => onOpen(report)} className="block w-full rounded-lg border border-white/10 p-3 text-left hover:bg-white/10">
        <span className="font-medium">{report.input.innName} · {report.input.productName}</span>
        <span className="block text-xs text-white/50">{report.input.developmentType} · 수정 {report.updatedAt}{report.isDemoData ? ' · DEMO' : ''} · API 호출 없음</span>
      </button>)}
      {entries.length === 0 && <p className="py-3 text-sm text-white/40">아직 저장된 보고서가 없습니다.</p>}
    </div>
  </section>;
}
