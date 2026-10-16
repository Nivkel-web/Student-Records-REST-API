import React, { useState } from 'react';
import {
  FileCode,
  Folder,
  FolderOpen,
  Copy,
  Check,
  Download,
  Code2,
  Terminal,
  FileCheck
} from 'lucide-react';
import JSZip from 'jszip';
import { SPRING_CODE_FILES, CodeFile } from '../data/springCodeFiles';

export const CodeViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<CodeFile>(SPRING_CODE_FILES[1]); // Student.java
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingle = () => {
    const blob = new Blob([selectedFile.content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = selectedFile.name;
    link.click();
  };

  const handleDownloadAllZip = async () => {
    const zip = new JSZip();
    for (const file of SPRING_CODE_FILES) {
      zip.file(file.path, file.content);
    }
    const content = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = 'student-records-spring-boot.zip';
    link.click();
  };

  const lines = selectedFile.content.split('\n');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span className="font-mono text-emerald-400">Spring Boot 3.3.4</span>
            <span>·</span>
            <span>Java 21</span>
            <span>·</span>
            <span>Clean Architecture</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Java Microservice Codebase
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse full production source code for JPA Entities, Repositories, Controllers, and Exception Handlers.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>Copy File Code</span>
          </button>

          <button
            onClick={handleDownloadAllZip}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Source ZIP</span>
          </button>
        </div>
      </div>

      {/* Code Browser Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: File Tree Explorer (4 cols) */}
        <div className="lg:col-span-4 border border-slate-800 rounded-xl bg-slate-900/60 overflow-hidden">
          <div className="p-3 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span>Project Explorer</span>
            <span className="text-[10px] font-mono text-slate-500">Maven Standard</span>
          </div>

          <div className="p-2 space-y-1 text-xs font-mono max-h-[640px] overflow-y-auto">
            {SPRING_CODE_FILES.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-2.5 rounded-lg flex items-start gap-2.5 transition-colors ${
                    isSelected
                      ? 'bg-slate-800 text-emerald-400 border border-slate-700/80'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <FileCode className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-slate-200 truncate">{file.name}</div>
                    <div className="text-[10px] text-slate-500 truncate mt-0.5">{file.path}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Code Viewer (8 cols) */}
        <div className="lg:col-span-8 border border-slate-800 rounded-xl bg-slate-900/60 overflow-hidden flex flex-col">
          {/* File Tab Header */}
          <div className="p-3 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950/60">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-mono font-semibold text-emerald-400 truncate">
                {selectedFile.path}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-mono text-slate-500">{lines.length} lines</span>
              <button
                onClick={handleDownloadSingle}
                className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transition-colors"
                title="Download this file"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Description bar */}
          <div className="px-4 py-2 border-b border-slate-800 bg-slate-900/40 text-xs text-slate-400">
            {selectedFile.description}
          </div>

          {/* Code Body with Line Numbers */}
          <div className="p-4 bg-slate-950 overflow-x-auto max-h-[580px] overflow-y-auto">
            <pre className="font-mono text-xs leading-relaxed text-slate-200 flex">
              {/* Line Numbers */}
              <div className="select-none text-slate-600 text-right pr-4 border-r border-slate-800/80 shrink-0">
                {lines.map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>

              {/* Code Content */}
              <div className="pl-4 min-w-0 flex-1">
                {lines.map((line, i) => {
                  // Basic regex styling for key Java keywords
                  let styled = line;
                  const isAnnotation = line.trim().startsWith('@');
                  const isComment = line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*');

                  return (
                    <div
                      key={i}
                      className={`${
                        isAnnotation
                          ? 'text-amber-400 font-medium'
                          : isComment
                          ? 'text-slate-500 italic'
                          : 'text-slate-200'
                      }`}
                    >
                      {line || '\n'}
                    </div>
                  );
                })}
              </div>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
