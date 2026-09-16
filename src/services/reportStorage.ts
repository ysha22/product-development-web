import type { ReportData, DevelopmentType } from '../types';
import { validate } from './validation';

export interface SavedReport { query: string; report: ReportData }
const STORAGE_KEY = 'pharmadd_reports_v1';
export const MAX_REPORT_BYTES = 5 * 1024 * 1024;
const normalize = (name: string) => name.normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase();

function cleanReport(value: unknown): ReportData {
  const report = validate<ReportData>('ReportData', value);
  if (!report.id.trim() || !report.input.innName.trim() ||
      !/^\d{4}-\d{2}-\d{2}$/.test(report.createdAt) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(report.updatedAt)) throw new Error('보고서 식별자·성분명·날짜가 올바르지 않습니다.');
  return report;
}

export function encodeReport(report: ReportData): string {
  // Schema allowlist excludes credentials and unrelated application state.
  return JSON.stringify({ format: 'PharmaDD', version: 1, report: cleanReport(report) }, null, 2);
}

export function decodeReport(text: string): ReportData {
  if (new Blob([text]).size > MAX_REPORT_BYTES) throw new Error('5MB 이하의 보고서 파일을 선택하세요.');
  let data;
  try { data = JSON.parse(text.replace(/^\uFEFF/, '')); }
  catch { throw new Error('올바른 JSON 보고서 파일이 아닙니다.'); }
  if (data?.format !== 'PharmaDD' || data?.version !== 1) throw new Error('지원하지 않는 보고서 형식 또는 버전입니다. PharmaDD에서 저장한 JSON 파일을 선택하세요.');
  try { return cleanReport(data.report); }
  catch { throw new Error('보고서 데이터가 누락되거나 손상되었습니다. 기존 보고서는 변경되지 않았습니다.'); }
}

export function readLibrary(): { entries: SavedReport[]; warning: string } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { entries: [], warning: '' };
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) throw new Error();
    return { entries: data.map(item => {
      if (typeof item?.query !== 'string') throw new Error();
      return { query: item.query, report: cleanReport(item.report) };
    }), warning: '' };
  } catch { return { entries: [], warning: '브라우저의 보고서 보관함을 읽을 수 없습니다. 저장한 JSON 파일로 불러오세요.' }; }
}

export function writeLibrary(entries: SavedReport[]): string {
  try {
    if (readLibrary().warning) return '기존 보관함을 읽을 수 없어 덮어쓰지 않았습니다. 보고서 저장(JSON)으로 파일을 보관하세요.';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.map(e => ({ query:e.query, report:cleanReport(e.report) }))));
    return '';
  } catch { return '브라우저 저장 공간이 부족하거나 저장이 차단되었습니다. 보고서 저장(JSON)으로 파일을 보관하세요. 현재 보고서는 열려 있습니다.'; }
}

export function upsertReport(entries: SavedReport[], report: ReportData, query = report.input.innName): SavedReport[] {
  const previous = entries.find(e => e.report.id === report.id);
  return [{ query: previous?.query ?? query, report: cleanReport(report) }, ...entries.filter(e => e.report.id !== report.id)];
}

export function findSavedReport(entries: SavedReport[], query: string, devType: DevelopmentType): ReportData | undefined {
  if (!normalize(query)) return undefined;
  return entries.find(e => !e.report.isDemoData && e.report.input.developmentType === devType &&
    [e.query, e.report.input.innName, e.report.input.productName].some(name => normalize(name) === normalize(query)))?.report;
}

export function downloadReport(report: ReportData): void {
  const url = URL.createObjectURL(new Blob([encodeReport(report)], { type:'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  // eslint-disable-next-line no-control-regex
  link.download = `PharmaDD_${report.input.innName.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')}_${report.updatedAt}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
