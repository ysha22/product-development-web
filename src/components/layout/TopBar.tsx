import { useState } from 'react';
import { Download, FileSpreadsheet, Printer, RefreshCw, Settings, Eye, EyeOff, Key, X } from 'lucide-react';

interface TopBarProps {
  productName: string;
  isDemoData: boolean;
  createdAt: string;
  onExportPDF: () => void;
  onExportExcel: () => void;
  onNewReport: () => void;
}

function ApiKeyPanel({ onClose }: { onClose: () => void }) {
  const [key, setKey] = useState(() => localStorage.getItem('pharmadd_api_key') ?? '');
  const [show, setShow] = useState(false);
  const [saved, setSaved] = useState(false);

  function save() {
    if (key.trim()) localStorage.setItem('pharmadd_api_key', key.trim());
    else            localStorage.removeItem('pharmadd_api_key');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-semibold text-gray-900">OpenAI API Key</span>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="relative mb-3">
        <input
          type={show ? 'text' : 'password'}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-9 text-sm font-mono
                     focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          placeholder="sk-proj-…"
          value={key}
          onChange={e => { setKey(e.target.value); setSaved(false); }}
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      <button
        onClick={save}
        className={`w-full py-2 rounded-lg text-sm font-semibold transition-all ${
          saved
            ? 'bg-green-500 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {saved ? '✓ 저장됨' : '저장'}
      </button>

      <div className="mt-2 space-y-1">
        <p className="text-xs text-gray-400">· 브라우저 localStorage에만 저장됩니다.</p>
        <p className="text-xs text-gray-400">· GPT-4o 사용 · 보고서당 약 $0.10–0.30</p>
        <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer"
           className="text-xs text-blue-500 hover:text-blue-700 underline">
          API Key 발급하기 →
        </a>
      </div>
    </div>
  );
}

export function TopBar({ productName, isDemoData, createdAt, onExportPDF, onExportExcel, onNewReport }: TopBarProps) {
  const [showApiPanel, setShowApiPanel] = useState(false);
  const hasKey = !!localStorage.getItem('pharmadd_api_key');

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between gap-4 no-print">
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
      <div className="flex items-center gap-2 flex-shrink-0 relative">
        {/* API Key button */}
        <div className="relative">
          <button
            onClick={() => setShowApiPanel(s => !s)}
            className={`btn-secondary flex items-center gap-1.5 text-xs ${
              !hasKey ? 'border-amber-300 text-amber-600 hover:bg-amber-50' : ''
            }`}
            title="API Key 설정"
          >
            <Settings className="w-3.5 h-3.5" />
            {!hasKey && <span className="text-amber-500">API Key</span>}
          </button>
          {showApiPanel && (
            <ApiKeyPanel onClose={() => setShowApiPanel(false)} />
          )}
        </div>

        <button
          onClick={onNewReport}
          className="btn-secondary flex items-center gap-1.5 text-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          New Report
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
