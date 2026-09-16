import { useState, useRef, useCallback } from 'react';
import type { ReportData, NPVInputs, DevelopmentType } from './types';
import { calculateFinancial } from './utils/financial';
import type { AISettings } from './services/providers';
import { readLibrary, writeLibrary, upsertReport, downloadReport } from './services/reportStorage';
import { redactApiError } from './services/apiErrors';
import { DEMO_REPORT } from './data/mockData';
import { fetchDrugReport, type ProgressState, type ReportCheckpoint } from './services/aiService';

import { Sidebar, type SectionId } from './components/layout/Sidebar';
import { RiskPanel } from './components/layout/RiskPanel';
import { TopBar } from './components/layout/TopBar';

import { SearchForm } from './components/input/SearchForm';
import { LoadingScreen } from './components/input/LoadingScreen';
import { ErrorScreen } from './components/input/ErrorScreen';

import { ExecutiveSummary } from './components/executive/ExecutiveSummary';
import { Part1Overview } from './components/parts/Part1Overview';
import { Part2Product } from './components/parts/Part2Product';
import { Part3Academic } from './components/parts/Part3Academic';
import { Part4Clinical } from './components/parts/Part4Clinical';
import { Part5Market } from './components/parts/Part5Market';
import { Part6Patent } from './components/parts/Part6Patent';
import { Part7Pricing } from './components/parts/Part7Pricing';
import { Part8Regulatory } from './components/parts/Part8Regulatory';
import { Part9Financial } from './components/parts/Part9Financial';
import { Part10Conclusion } from './components/parts/Part10Conclusion';
import { Part11References } from './components/parts/Part11References';
import { exportPDF, exportExcel } from './utils/exportUtils';

/* ── App state machine ── */
type AppState =
  | { screen: 'search' }
  | { screen: 'loading';  query: string; devType: DevelopmentType; settings: AISettings }
  | { screen: 'error';    error: string; query: string; devType: DevelopmentType; settings: AISettings; completed: number }
  | { screen: 'report';   report: ReportData };

export default function App() {
  const [state, setState] = useState<AppState>({ screen: 'search' });
  const [progress, setProgress] = useState<ProgressState>({ step: 'searching', label: '시작 중…', percent: 0 });
  const [activeSection, setActiveSection] = useState<SectionId>('executive');
  const checkpoint = useRef<ReportCheckpoint | undefined>(undefined);
  const inFlight = useRef(false);
  const [library, setLibrary] = useState(readLibrary);
  const libraryRef = useRef(library.entries);
  const [notice, setNotice] = useState('');
  const mainRef = useRef<HTMLDivElement>(null);

  function storeReport(report: ReportData, query?: string) {
    const entries = upsertReport(libraryRef.current, report, query);
    libraryRef.current = entries;
    const warning = writeLibrary(entries);
    setLibrary({ entries, warning });
    setNotice(warning || '이 브라우저의 보관함에 저장되었습니다. 백업은 JSON으로 저장하세요.');
  }

  function openReport(report: ReportData) {
    storeReport(report);
    setState({ screen:'report', report:structuredClone(report) });
    setActiveSection('executive');
  }

  function saveReportFile() {
    if (state.screen !== 'report') return;
    try { storeReport(state.report); downloadReport(state.report); }
    catch { setNotice('보고서 파일을 저장하지 못했습니다. 다시 시도하세요.'); }
  }

  /* ── Navigation ── */
  const handleNavigate = useCallback((id: SectionId) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleScroll = useCallback(() => {
    const sections = [
      'executive','part1','part2','part3','part4','part5',
      'part6','part7','part8','part9','part10','part11',
    ] as SectionId[];
    for (const id of [...sections].reverse()) {
      const rect = document.getElementById(id)?.getBoundingClientRect();
      if (rect && rect.top <= 120) { setActiveSection(id); break; }
    }
  }, []);

  /* ── Search → fetch ── */
  async function handleSearch(query: string, devType: DevelopmentType, settings: AISettings) {
    if (inFlight.current) return;
    inFlight.current = true;
    setNotice('');
    if (!checkpoint.current || checkpoint.current.query !== query || checkpoint.current.devType !== devType) {
      checkpoint.current = { query, devType, chunks: [] };
    }
    setState({ screen: 'loading', query, devType, settings });
    setProgress({ step: 'searching', label: '분석 시작 중…', percent: 0 });



    try {
      const report = await fetchDrugReport(
        query,
        devType,
        settings.apiKey,
        setProgress,
        checkpoint.current,
        settings,
      );
      checkpoint.current = undefined;
      storeReport(report, query);
      setState({ screen: 'report', report });
      setActiveSection('executive');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setState({
        screen: 'error',
        error: redactApiError(msg, settings.apiKey),
        query,
        devType,
        settings,
        completed: checkpoint.current?.chunks.length ?? 0,
      });
    } finally {
      inFlight.current = false;
    }
  }

  /* ── Demo ── */
  function handleLoadDemo() {
    setState({ screen: 'report', report: { ...structuredClone(DEMO_REPORT), part9: calculateFinancial(DEMO_REPORT.part9.inputs, Number(DEMO_REPORT.createdAt.slice(0,4))) } });
    setActiveSection('executive');
  }

  /* ── Retry ── */
  function handleRetry() {
    if (state.screen !== 'error') return;
    handleSearch(state.query, state.devType, state.settings);
  }

  /* ── Back to search ── */
  function handleNewReport() {
    setState({ screen: 'search' });
  }

  /* ── NPV inputs update ── */
  function handleFinancialInputChange(inputs: NPVInputs) {
    if (state.screen !== 'report') return;
    const financial = calculateFinancial(inputs, Number(state.report.createdAt.slice(0,4)));
    const report = { ...state.report,
      updatedAt: new Date().toISOString().slice(0,10),
      input: { ...state.report.input, expectedLaunchYear: financial.inputs.launchYear },
      part6: { ...state.report.part6, expectedLaunchYear: financial.inputs.launchYear }, part9: financial };
    storeReport(report);
    setState({screen:'report',report});
  }

  /* ── Screens ── */

  if (state.screen === 'search') {
    return (
      <SearchForm
        onSearch={handleSearch}
        onLoadDemo={handleLoadDemo}
        entries={library.entries}
        notice={library.warning}
        onOpen={openReport}
      />
    );
  }

  if (state.screen === 'loading') {
    return (
      <LoadingScreen
        progress={progress}
        drugName={state.query}
        provider={state.settings.provider}
        model={state.settings.model}
      />
    );
  }

  if (state.screen === 'error') {
    return (
      <ErrorScreen
        error={state.error}
        drugName={state.query}
        onRetry={handleRetry}
        onLoadDemo={handleLoadDemo}
        onBack={handleNewReport}
        completed={state.completed}
        provider={state.settings.provider}
      />
    );
  }

  /* ── Report ── */
  const { report } = state;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        productName={report.input.productName || report.input.innName}
        isDemoData={report.isDemoData}
      />

      <div className="flex-1 overflow-y-auto" ref={mainRef} onScroll={handleScroll}>
        <TopBar
          productName={report.input.productName || report.input.innName}
          isDemoData={report.isDemoData}
          createdAt={report.createdAt}
          onExportPDF={exportPDF}
          onExportExcel={() => exportExcel(report)}
          onNewReport={handleNewReport}
          onSaveReport={saveReportFile}
        />

        <main id="report-content" className="px-6 py-6 max-w-5xl mx-auto space-y-10">
          {notice && <p role="status" className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">{notice}</p>}
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            {report.isDemoData ? '데모 예시입니다.' : 'AI 생성 초안입니다. 원문 조회 및 출처 검증을 수행하지 않았습니다.'}
            {' '}재무 입력 변경은 NPV·차트·Excel에 반영되며, AI 결론 문구와 약가 시나리오는 자동으로 다시 작성되지 않습니다.
          </div>
          <ExecutiveSummary report={report} />
          <hr className="border-gray-200" />
          <Part1Overview report={report} />
          <hr className="border-gray-200" />
          <Part2Product report={report} />
          <hr className="border-gray-200" />
          <Part3Academic report={report} />
          <hr className="border-gray-200" />
          <Part4Clinical report={report} />
          <hr className="border-gray-200" />
          <Part5Market report={report} />
          <hr className="border-gray-200" />
          <Part6Patent report={report} />
          <hr className="border-gray-200" />
          <Part7Pricing report={report} />
          <hr className="border-gray-200" />
          <Part8Regulatory report={report} />
          <hr className="border-gray-200" />
          <Part9Financial report={report} onInputChange={handleFinancialInputChange} />
          <hr className="border-gray-200" />
          <Part10Conclusion report={report} />
          <hr className="border-gray-200" />
          <Part11References report={report} />
          <div className="h-16" />
        </main>
      </div>

      <RiskPanel risk={report.riskPanel} />
    </div>
  );
}
