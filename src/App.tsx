import { useState, useRef, useCallback } from 'react';
import type { ReportData, NPVInputs, DevelopmentType } from './types';
import { DEMO_REPORT } from './data/mockData';
import { fetchDrugReport, type ProgressState } from './services/aiService';

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
  | { screen: 'loading';  query: string; devType: DevelopmentType; apiKey: string }
  | { screen: 'error';    error: string; query: string; devType: DevelopmentType; apiKey: string; partial?: ReportData }
  | { screen: 'report';   report: ReportData };

export default function App() {
  const [state, setState] = useState<AppState>({ screen: 'search' });
  const [progress, setProgress] = useState<ProgressState>({ step: 'searching', label: '시작 중…', percent: 0 });
  const [activeSection, setActiveSection] = useState<SectionId>('executive');
  const mainRef = useRef<HTMLDivElement>(null);

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
  async function handleSearch(query: string, devType: DevelopmentType, apiKey: string) {
    setState({ screen: 'loading', query, devType, apiKey });
    setProgress({ step: 'searching', label: '분석 시작 중…', percent: 0 });

    let partialReport: ReportData | undefined;

    try {
      const report = await fetchDrugReport(
        query,
        devType,
        apiKey,
        (p) => {
          setProgress(p);
          // keep last partially built report in case of later error
          // (fetchDrugReport mutates and returns the full object at end,
          //  but we can capture progress updates)
        },
      );
      setState({ screen: 'report', report });
      setActiveSection('executive');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setState({
        screen: 'error',
        error: msg,
        query,
        devType,
        apiKey,
        partial: partialReport,
      });
    }
  }

  /* ── Demo ── */
  function handleLoadDemo() {
    setState({ screen: 'report', report: DEMO_REPORT });
    setActiveSection('executive');
  }

  /* ── Retry ── */
  function handleRetry() {
    if (state.screen !== 'error') return;
    handleSearch(state.query, state.devType, state.apiKey);
  }

  /* ── Back to search ── */
  function handleNewReport() {
    setState({ screen: 'search' });
  }

  /* ── NPV inputs update ── */
  function handleFinancialInputChange(inputs: NPVInputs) {
    if (state.screen !== 'report') return;
    setState(prev => prev.screen === 'report' ? {
      ...prev,
      report: { ...prev.report, part9: { ...prev.report.part9, inputs } },
    } : prev);
  }

  /* ── Screens ── */

  if (state.screen === 'search') {
    return (
      <SearchForm
        onSearch={handleSearch}
        onLoadDemo={handleLoadDemo}
      />
    );
  }

  if (state.screen === 'loading') {
    return (
      <LoadingScreen
        progress={progress}
        drugName={state.query}
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
        partialReport={!!state.partial}
        onUsePartial={state.partial
          ? () => setState({ screen: 'report', report: state.partial! })
          : undefined
        }
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
        />

        <main id="report-content" className="px-6 py-6 max-w-5xl mx-auto space-y-10">
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
