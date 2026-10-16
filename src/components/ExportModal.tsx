import React, { useState } from 'react';
import { X, Download, FileText, Image as ImageIcon, Archive, CheckCircle2 } from 'lucide-react';
import JSZip from 'jszip';
import { GITHUB_README_MARKDOWN } from '../data/readmeContent';
import { SPRING_CODE_FILES } from '../data/springCodeFiles';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToScreenshots: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onGoToScreenshots,
}) => {
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleDownloadFullPackage = async () => {
    setIsExporting(true);
    try {
      const zip = new JSZip();

      // 1. Root README.md
      zip.file('README.md', GITHUB_README_MARKDOWN);

      // 2. All Spring Boot Source code
      for (const file of SPRING_CODE_FILES) {
        zip.file(file.path, file.content);
      }

      // 3. Documentation folder note
      zip.file(
        'docs/screenshots/README.txt',
        'Use the GitHub Screenshots Studio in the web app to export high-resolution PNG captures directly into this folder.'
      );

      const blob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'student-records-api-github-package.zip';
      link.click();
    } catch (err) {
      console.error('Failed generating zip package:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadReadmeOnly = () => {
    const blob = new Blob([GITHUB_README_MARKDOWN], { type: 'text/markdown;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'README.md';
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Archive className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Export GitHub Assets</h2>
              <p className="text-xs text-slate-400">Download files ready to commit and push</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Options */}
        <div className="p-6 space-y-4">
          {/* Option 1: Full Repository Package */}
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  RECOMMENDED
                </span>
                <h3 className="text-sm font-bold text-white mt-1.5">
                  Complete GitHub Repository (.zip)
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Includes <code className="text-emerald-300">README.md</code>, full Maven Spring Boot codebase (<code className="text-emerald-300">pom.xml</code>, Entities, Repositories, Services, Controllers), and documentation scaffolds.
                </p>
              </div>
            </div>

            <button
              onClick={handleDownloadFullPackage}
              disabled={isExporting}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-sm disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Packaging...' : 'Download Full Package (.zip)'}</span>
            </button>
          </div>

          {/* Option 2: Individual downloads */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <button
              onClick={handleDownloadReadmeOnly}
              className="p-3 rounded-lg border border-slate-800 bg-slate-950/60 hover:bg-slate-800/60 text-left transition-colors group"
            >
              <FileText className="w-4 h-4 text-emerald-400 mb-2" />
              <div className="font-semibold text-slate-200 group-hover:text-emerald-300">
                README.md
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Standalone markdown</div>
            </button>

            <button
              onClick={() => {
                onClose();
                onGoToScreenshots();
              }}
              className="p-3 rounded-lg border border-slate-800 bg-slate-950/60 hover:bg-slate-800/60 text-left transition-colors group"
            >
              <ImageIcon className="w-4 h-4 text-blue-400 mb-2" />
              <div className="font-semibold text-slate-200 group-hover:text-blue-300">
                PNG Screenshots
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Export studio captures</div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <span>License: MIT · Java 21 LTS · Spring Boot 3</span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
