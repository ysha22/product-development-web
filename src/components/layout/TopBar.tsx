import { Download, FileSpreadsheet, Printer, RefreshCw } from 'lucide-react';
interface TopBarProps {
  productName: string;
  isDemoData: boolean;
  createdAt: string;
  onExportPDF: () => void;
  onExportExcel: () => void;
  onNewReport: () => void;
  onSaveReport: () => void;
}

export function TopBar({ productName, isDemoData, createdAt, onExportPDF, onExportExcel, onNewReport, onSaveReport }: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 no-print">
      {/* Left */}
      <div className="flex items-center gap-3 min-w-0">
        {isDemoData && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-400 text-amber-900 flex-shrink-0">
            DEMO DATA
          </span>
        )}
        <div className="min-w-0">
          <h1 className="text-sm font-bold text-gray-900 truncate">
            Product Development Due Diligence Report
          </h1>
          <p className="text-xs text-gray-500 truncate">
            {productName} &nbsp;·&nbsp; Created: {createdAt} &nbsp;·&nbsp;
            <span className="text-red-600 font-medium">CONFIDENTIAL</span>
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-wrap items-center gap-2 relative">
        <button onClick={onSaveReport} className="btn-secondary text-xs">보고서 저장 (JSON)</button>

        <button
          onClick={onNewReport}
          className="btn-secondary flex items-center gap-1.5 text-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          새 성분 / 보관함
        </button>
        <button
          onClick={onExportExcel}
          className="btn-secondary flex items-center gap-1.5 text-xs"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          Excel
        </button>
        <button
          onClick={onExportPDF}
          className="btn-primary flex items-center gap-1.5 text-xs"
        >
          <Download className="w-3.5 h-3.5" />
          PDF
        </button>
        <button
          onClick={() => window.print()}
          className="btn-secondary flex items-center gap-1.5 text-xs"
        >
          <Printer className="w-3.5 h-3.5" />
          Print
        </button>
      </div>
    </header>
  );
}
