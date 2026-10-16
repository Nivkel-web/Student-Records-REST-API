import React from 'react';
import { Database, Download, Terminal, FileText, Image as ImageIcon, Code2 } from 'lucide-react';

export type ActiveTab = 'playground' | 'readme' | 'screenshots' | 'codebase';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenExportModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenExportModal,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('playground');
          }}
          className="flex items-center gap-2.5 text-base font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-emerald-400 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Database className="w-4 h-4" />
          </div>
          <span className="font-sans">Student Records REST API</span>
        </a>

        {/* Zone 2: Navigation Links (4-5 single-line clean text links) */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('playground')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'playground'
                ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700/60'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            API Playground
          </button>

          <button
            onClick={() => setActiveTab('screenshots')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'screenshots'
                ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700/60'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            GitHub Screenshots
          </button>

          <button
            onClick={() => setActiveTab('readme')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'readme'
                ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700/60'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            README.md
          </button>

          <button
            onClick={() => setActiveTab('codebase')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'codebase'
                ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700/60'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Java & Spring Code
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export GitHub Package</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800/80 bg-slate-900/60 px-2 py-1.5 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('playground')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'playground' ? 'text-emerald-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Playground
        </button>
        <button
          onClick={() => setActiveTab('screenshots')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'screenshots' ? 'text-emerald-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Screenshots
        </button>
        <button
          onClick={() => setActiveTab('readme')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'readme' ? 'text-emerald-400 font-semibold' : 'text-slate-400'
          }`}
        >
          README.md
        </button>
        <button
          onClick={() => setActiveTab('codebase')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'codebase' ? 'text-emerald-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Java Code
        </button>
      </div>
    </header>
  );
};
