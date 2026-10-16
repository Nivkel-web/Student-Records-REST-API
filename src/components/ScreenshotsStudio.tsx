import React, { useState, useRef } from 'react';
import {
  Download,
  Copy,
  Check,
  Laptop,
  Terminal,
  Database,
  FileCode,
  Share2,
  Sparkles,
  Maximize2,
  Layers,
  CheckCircle2,
  Code
} from 'lucide-react';
import { toPng, toBlob } from 'html-to-image';
import JSZip from 'jszip';
import { INITIAL_STUDENTS } from '../data/mockStudents';

type ScreenshotId =
  | 'swagger-ui'
  | 'validation-error-400'
  | 'database-records'
  | 'repository-banner'
  | 'postman-client';

interface ScreenshotConfig {
  id: ScreenshotId;
  title: string;
  filename: string;
  description: string;
  aspectRatio: string;
}

const SCREENSHOT_TABS: ScreenshotConfig[] = [
  {
    id: 'swagger-ui',
    title: 'Swagger / OpenAPI 3.0 UI',
    filename: 'swagger-ui.png',
    description: 'Interactive API contract explorer with color-coded endpoints and schemas',
    aspectRatio: '16:10',
  },
  {
    id: 'validation-error-400',
    title: '400 Validation Error Terminal',
    filename: 'validation-error-400.png',
    description: 'Terminal curl output displaying Hibernate Validator field-level errors',
    aspectRatio: '16:10',
  },
  {
    id: 'database-records',
    title: 'JPA Database & Records View',
    filename: 'database-records.png',
    description: 'Relational table records, SQL query tracker, and schema constraints',
    aspectRatio: '16:10',
  },
  {
    id: 'repository-banner',
    title: 'GitHub Social Repository Banner',
    filename: 'repository-banner.png',
    description: '1280x640 social preview card for GitHub repo header / social sharing',
    aspectRatio: '16:9',
  },
  {
    id: 'postman-client',
    title: 'REST Client / 201 Created',
    filename: 'postman-client.png',
    description: 'API client inspection showing 201 Created status and Location header',
    aspectRatio: '16:10',
  },
];

export const ScreenshotsStudio: React.FC = () => {
  const [activeScreenshot, setActiveScreenshot] = useState<ScreenshotId>('swagger-ui');
  const [frameTheme, setFrameTheme] = useState<'macos-dark' | 'macos-light' | 'clean'>('macos-dark');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState<boolean>(false);
  const [copiedImage, setCopiedImage] = useState<boolean>(false);

  // Ref to the capture element
  const captureContainerRef = useRef<HTMLDivElement>(null);

  const currentConfig = SCREENSHOT_TABS.find((t) => t.id === activeScreenshot)!;

  const handleDownloadSingle = async () => {
    if (!captureContainerRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(captureContainerRef.current, {
        cacheBust: true,
        pixelRatio: 2, // High resolution for crisp GitHub display
      });
      const link = document.createElement('a');
      link.download = currentConfig.filename;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating screenshot PNG:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyImageToClipboard = async () => {
    if (!captureContainerRef.current) return;
    setIsExporting(true);
    try {
      const blob = await toBlob(captureContainerRef.current, {
        pixelRatio: 2,
      });
      if (blob && navigator.clipboard && (window as any).ClipboardItem) {
        await navigator.clipboard.write([
          new (window as any).ClipboardItem({ 'image/png': blob }),
        ]);
        setCopiedImage(true);
        setTimeout(() => setCopiedImage(false), 2000);
      }
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyMarkdownSnippet = () => {
    const markdown = `![${currentConfig.title}](docs/screenshots/${currentConfig.filename})`;
    navigator.clipboard.writeText(markdown);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  const handleDownloadAllZip = async () => {
    if (!captureContainerRef.current) return;
    setIsExporting(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder('docs/screenshots');

      // Loop through each screenshot tab, render and append
      const originalTab = activeScreenshot;

      for (const tab of SCREENSHOT_TABS) {
        setActiveScreenshot(tab.id);
        // Wait 150ms for react render
        await new Promise((resolve) => setTimeout(resolve, 150));
        if (captureContainerRef.current) {
          const blob = await toBlob(captureContainerRef.current, { pixelRatio: 2 });
          if (blob && folder) {
            folder.file(tab.filename, blob);
          }
        }
      }

      // Restore user view
      setActiveScreenshot(originalTab);

      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'student-records-api-screenshots.zip';
      link.click();
    } catch (err) {
      console.error('Failed generating screenshots zip:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span className="font-mono text-emerald-400">GitHub Assets</span>
            <span>·</span>
            <span>docs/screenshots/</span>
            <span>·</span>
            <span>Retina 2x Export</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            GitHub Screenshots Studio
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Export pixel-perfect, realistic screenshots ready for your GitHub README, documentation, and social previews.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleCopyMarkdownSnippet}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
          >
            {copiedMarkdown ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>Copy README Tag</span>
          </button>

          <button
            onClick={handleCopyImageToClipboard}
            disabled={isExporting}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {copiedImage ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Share2 className="w-3.5 h-3.5" />
            )}
            <span>Copy Image</span>
          </button>

          <button
            onClick={handleDownloadSingle}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-sm disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PNG</span>
          </button>

          <button
            onClick={handleDownloadAllZip}
            disabled={isExporting}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download All 5 (.zip)</span>
          </button>
        </div>
      </div>

      {/* Screenshot Selector & Frame Theme */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          {SCREENSHOT_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveScreenshot(tab.id)}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeScreenshot === tab.id
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>

        {/* Frame Style Selector */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Window Frame:</span>
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            <button
              onClick={() => setFrameTheme('macos-dark')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                frameTheme === 'macos-dark' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              macOS Dark
            </button>
            <button
              onClick={() => setFrameTheme('macos-light')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                frameTheme === 'macos-light' ? 'bg-slate-200 text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              macOS Light
            </button>
            <button
              onClick={() => setFrameTheme('clean')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                frameTheme === 'clean' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Borderless
            </button>
          </div>
        </div>
      </div>

      {/* Info Pill */}
      <div className="text-xs text-slate-400 flex items-center justify-between">
        <div>
          <span className="font-semibold text-slate-200">{currentConfig.filename}</span>
          <span className="mx-2">·</span>
          <span>{currentConfig.description}</span>
        </div>
        <div className="font-mono text-slate-500">
          Markdown: <code className="text-emerald-400">![{currentConfig.title}](docs/screenshots/{currentConfig.filename})</code>
        </div>
      </div>

      {/* Capture Container */}
      <div className="p-4 sm:p-8 bg-slate-950/80 border border-slate-800/80 rounded-2xl flex items-center justify-center overflow-x-auto shadow-2xl">
        <div
          ref={captureContainerRef}
          className={`w-full max-w-4xl transition-all ${
            frameTheme === 'macos-dark'
              ? 'bg-slate-950 text-slate-100 rounded-xl shadow-2xl border border-slate-800 overflow-hidden'
              : frameTheme === 'macos-light'
              ? 'bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 overflow-hidden'
              : 'bg-slate-950 text-slate-100 rounded-lg border border-slate-800 overflow-hidden'
          }`}
        >
          {/* macOS Titlebar (if not clean) */}
          {frameTheme !== 'clean' && (
            <div
              className={`px-4 py-3 flex items-center justify-between border-b text-xs ${
                frameTheme === 'macos-dark'
                  ? 'bg-slate-900/90 border-slate-800 text-slate-400'
                  : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>

              <div className="font-mono text-[11px] truncate px-4 opacity-75">
                {activeScreenshot === 'swagger-ui' && 'http://localhost:8080/swagger-ui.html — Swagger UI'}
                {activeScreenshot === 'validation-error-400' && 'bash — curl -i -X POST /api/v1/students — 80x24'}
                {activeScreenshot === 'database-records' && 'H2 Database Console — jdbc:h2:mem:studentdb'}
                {activeScreenshot === 'repository-banner' && 'github.com/university/student-records-api'}
                {activeScreenshot === 'postman-client' && 'REST Client — POST /api/v1/students'}
              </div>

              <div className="w-12 text-right text-[10px] opacity-40 font-mono">200 OK</div>
            </div>
          )}

          {/* Screenshot Views Content */}
          <div className="p-6">
            {/* VIEW 1: Swagger UI */}
            {activeScreenshot === 'swagger-ui' && (
              <div className="space-y-6 font-sans">
                {/* Swagger Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                        <span className="px-2 py-0.5 text-xs font-mono font-bold bg-[#85ea2d] text-slate-950 rounded">
                          swagger
                        </span>
                        Student Records REST API
                      </h2>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        v1.0.0
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20">
                        OAS 3.0
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Production microservice for university student records management with Bean Validation and Spring Data JPA
                    </p>
                  </div>
                  <div className="text-right text-xs font-mono text-slate-400">
                    <div>[ Base URL: localhost:8080/ ]</div>
                    <div className="text-emerald-400 text-[11px]">/v3/api-docs</div>
                  </div>
                </div>

                {/* Operations List */}
                <div className="space-y-3 font-mono text-xs">
                  {/* POST */}
                  <div className="rounded-lg border border-emerald-500/40 bg-emerald-950/20 overflow-hidden">
                    <div className="p-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 font-bold text-white bg-[#49cc90] rounded text-[11px]">
                          POST
                        </span>
                        <span className="font-semibold text-slate-100">/api/v1/students</span>
                      </div>
                      <span className="text-slate-400 text-[11px] hidden sm:inline">
                        Create a new student record (validates Hibernate rules)
                      </span>
                      <span className="text-emerald-400 text-[11px]">201 Created</span>
                    </div>
                  </div>

                  {/* GET list */}
                  <div className="rounded-lg border border-blue-500/40 bg-blue-950/20 overflow-hidden">
                    <div className="p-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 font-bold text-white bg-[#61affe] rounded text-[11px]">
                          GET
                        </span>
                        <span className="font-semibold text-slate-100">/api/v1/students</span>
                      </div>
                      <span className="text-slate-400 text-[11px] hidden sm:inline">
                        List all students with pagination & sorting (Pageable)
                      </span>
                      <span className="text-blue-400 text-[11px]">200 OK</span>
                    </div>
                  </div>

                  {/* GET single */}
                  <div className="rounded-lg border border-blue-500/40 bg-blue-950/20 overflow-hidden">
                    <div className="p-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 font-bold text-white bg-[#61affe] rounded text-[11px]">
                          GET
                        </span>
                        <span className="font-semibold text-slate-100">/api/v1/students/{'{id}'}</span>
                      </div>
                      <span className="text-slate-400 text-[11px] hidden sm:inline">
                        Get student by primary database ID
                      </span>
                      <span className="text-blue-400 text-[11px]">200 / 404</span>
                    </div>
                  </div>

                  {/* PUT */}
                  <div className="rounded-lg border border-amber-500/40 bg-amber-950/20 overflow-hidden">
                    <div className="p-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 font-bold text-white bg-[#fca130] rounded text-[11px]">
                          PUT
                        </span>
                        <span className="font-semibold text-slate-100">/api/v1/students/{'{id}'}</span>
                      </div>
                      <span className="text-slate-400 text-[11px] hidden sm:inline">
                        Update existing student with constraint validation
                      </span>
                      <span className="text-amber-400 text-[11px]">200 / 400</span>
                    </div>
                  </div>

                  {/* DELETE */}
                  <div className="rounded-lg border border-rose-500/40 bg-rose-950/20 overflow-hidden">
                    <div className="p-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 font-bold text-white bg-[#f93e3e] rounded text-[11px]">
                          DELETE
                        </span>
                        <span className="font-semibold text-slate-100">/api/v1/students/{'{id}'}</span>
                      </div>
                      <span className="text-slate-400 text-[11px] hidden sm:inline">
                        Delete student record idempotently
                      </span>
                      <span className="text-rose-400 text-[11px]">204 No Content</span>
                    </div>
                  </div>

                  {/* GET search */}
                  <div className="rounded-lg border border-blue-500/40 bg-blue-950/20 overflow-hidden">
                    <div className="p-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 font-bold text-white bg-[#61affe] rounded text-[11px]">
                          GET
                        </span>
                        <span className="font-semibold text-slate-100">/api/v1/students/search</span>
                      </div>
                      <span className="text-slate-400 text-[11px] hidden sm:inline">
                        Search by department, min GPA & status
                      </span>
                      <span className="text-blue-400 text-[11px]">200 OK</span>
                    </div>
                  </div>
                </div>

                {/* Schemas strip */}
                <div className="pt-2 border-t border-slate-800 text-xs">
                  <div className="font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    OpenAPI Model Schemas
                  </div>
                  <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
                    <div className="p-2 bg-slate-900 border border-slate-800 rounded">
                      <span className="text-emerald-400 font-semibold">StudentRequestDto</span>
                      <div className="text-slate-400 text-[10px] mt-0.5">8 validated fields</div>
                    </div>
                    <div className="p-2 bg-slate-900 border border-slate-800 rounded">
                      <span className="text-blue-400 font-semibold">StudentResponseDto</span>
                      <div className="text-slate-400 text-[10px] mt-0.5">14 entity properties</div>
                    </div>
                    <div className="p-2 bg-slate-900 border border-slate-800 rounded">
                      <span className="text-rose-400 font-semibold">ApiErrorResponse</span>
                      <div className="text-slate-400 text-[10px] mt-0.5">RFC-7807 problem details</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: 400 Validation Error Terminal */}
            {activeScreenshot === 'validation-error-400' && (
              <div className="space-y-4 font-mono text-xs">
                {/* Command Line */}
                <div className="text-slate-300">
                  <span className="text-emerald-400 font-bold">dev@workstation</span>
                  <span className="text-slate-500">:</span>
                  <span className="text-blue-400 font-bold">~/student-records-api</span>
                  <span className="text-slate-300">$ </span>
                  <span className="text-white">
                    curl -i -X POST http://localhost:8080/api/v1/students \
                  </span>
                  <div className="pl-6 text-slate-400">
                    -H &quot;Content-Type: application/json&quot; \
                  </div>
                  <div className="pl-6 text-slate-400">
                    -d &#39;&#123;&quot;firstName&quot;: &quot;&quot;, &quot;email&quot;: &quot;bad-email&quot;, &quot;gpa&quot;: 4.95, &quot;dateOfBirth&quot;: &quot;2030-01-01&quot;&#125;&#39;
                  </div>
                </div>

                {/* HTTP Headers */}
                <div className="pt-2 text-slate-400 space-y-0.5 border-t border-slate-800/80">
                  <div className="text-amber-400 font-bold">HTTP/1.1 400 Bad Request</div>
                  <div>Content-Type: application/json</div>
                  <div>Transfer-Encoding: chunked</div>
                  <div>Date: Fri, 16 Oct 2026 08:15:22 GMT</div>
                  <div>Connection: close</div>
                </div>

                {/* JSON Error Body */}
                <div className="p-4 rounded-lg bg-slate-900/90 border border-amber-500/30 text-slate-200">
                  <pre className="text-[11px] leading-relaxed overflow-x-auto text-amber-200">
{`{
  "timestamp": "2026-10-16T08:15:22.418Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Input validation failed for 4 field(s)",
  "path": "/api/v1/students",
  "fieldErrors": [
    {
      "field": "firstName",
      "rejectedValue": "",
      "message": "First name is mandatory and cannot be empty"
    },
    {
      "field": "email",
      "rejectedValue": "bad-email",
      "message": "Email address must be well-formed (e.g., student@university.edu)"
    },
    {
      "field": "gpa",
      "rejectedValue": 4.95,
      "message": "GPA cannot exceed 4.00 maximum"
    },
    {
      "field": "dateOfBirth",
      "rejectedValue": "2030-01-01",
      "message": "Date of birth must be a past date"
    }
  ]
}`}
                  </pre>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Handled by @RestControllerAdvice · GlobalExceptionHandler.java</span>
                </div>
              </div>
            )}

            {/* VIEW 3: JPA Database Records */}
            {activeScreenshot === 'database-records' && (
              <div className="space-y-4 font-sans text-xs">
                {/* Database Top Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-white font-mono">TABLE: students</span>
                    <span className="text-slate-400">·</span>
                    <span className="font-mono text-[11px] text-slate-400">8 active records</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      HikariPool-1 Active
                    </span>
                    <span>H2 in-memory 2.2</span>
                  </div>
                </div>

                {/* Data Table */}
                <div className="border border-slate-800 rounded-lg overflow-x-auto bg-slate-900/60 font-mono text-[11px]">
                  <table className="w-full text-left">
                    <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">id</th>
                        <th className="py-2.5 px-3">student_id</th>
                        <th className="py-2.5 px-3">first_name</th>
                        <th className="py-2.5 px-3">last_name</th>
                        <th className="py-2.5 px-3">email</th>
                        <th className="py-2.5 px-3">department</th>
                        <th className="py-2.5 px-3 text-right">gpa</th>
                        <th className="py-2.5 px-3">status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {INITIAL_STUDENTS.slice(0, 5).map((s) => (
                        <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-2 px-3 text-emerald-400">{s.id}</td>
                          <td className="py-2 px-3 text-slate-200">{s.studentId}</td>
                          <td className="py-2 px-3">{s.firstName}</td>
                          <td className="py-2 px-3">{s.lastName}</td>
                          <td className="py-2 px-3 text-slate-400">{s.email}</td>
                          <td className="py-2 px-3">{s.department}</td>
                          <td className="py-2 px-3 text-right font-bold text-emerald-400 tabular-nums">
                            {s.gpa.toFixed(2)}
                          </td>
                          <td className="py-2 px-3">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] ${
                                s.enrollmentStatus === 'ACTIVE'
                                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                              }`}
                            >
                              {s.enrollmentStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* JPA Query Log Footer */}
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg font-mono text-[11px] text-slate-400 space-y-1">
                  <div className="text-slate-500 text-[10px]">LATEST JPA EXECUTED SQL:</div>
                  <div className="text-emerald-400">
                    Hibernate: select s1_0.id, s1_0.student_id, s1_0.first_name, s1_0.last_name, s1_0.email, s1_0.gpa from students s1_0 order by s1_0.gpa desc limit 5
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 4: GitHub Repository Banner */}
            {activeScreenshot === 'repository-banner' && (
              <div className="p-8 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-xl relative overflow-hidden">
                {/* Accent glow in corner */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="space-y-6 relative z-10">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md font-mono text-xs font-semibold">
                      Spring Boot 3.3.4
                    </span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-md font-mono text-xs font-semibold">
                      Java 21 LTS
                    </span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-md font-mono text-xs font-semibold">
                      Spring Data JPA
                    </span>
                    <span className="px-3 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded-md font-mono text-xs font-semibold">
                      Hibernate Validator 8
                    </span>
                  </div>

                  <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                      Student Records REST API
                    </h1>
                    <p className="text-base text-slate-400 mt-2 max-w-2xl leading-relaxed">
                      Enterprise-grade RESTful microservice featuring JSR-380 input validation, canonical HTTP status semantics (201 Created with Location header, 400 Bad Request, 409 Conflict), and Spring Data JPA persistence.
                    </p>
                  </div>

                  {/* 4 Feature blocks */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800 font-mono text-xs">
                    <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg">
                      <div className="text-emerald-400 font-bold text-base">201 / 400</div>
                      <div className="text-slate-400 text-[11px] mt-0.5">HTTP Status Codes</div>
                    </div>
                    <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg">
                      <div className="text-blue-400 font-bold text-base">JSR-380</div>
                      <div className="text-slate-400 text-[11px] mt-0.5">Hibernate Validator</div>
                    </div>
                    <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg">
                      <div className="text-purple-400 font-bold text-base">JPA 3.1</div>
                      <div className="text-slate-400 text-[11px] mt-0.5">Derived Queries & Specs</div>
                    </div>
                    <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg">
                      <div className="text-amber-400 font-bold text-base">OpenAPI 3.0</div>
                      <div className="text-slate-400 text-[11px] mt-0.5">Swagger UI Included</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 5: REST Client / 201 Created */}
            {activeScreenshot === 'postman-client' && (
              <div className="space-y-4 font-mono text-xs">
                {/* Request bar */}
                <div className="flex items-center gap-2 p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded font-bold">
                    POST
                  </span>
                  <span className="text-slate-200">http://localhost:8080/api/v1/students</span>
                </div>

                {/* Status bar */}
                <div className="flex items-center justify-between p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-400 text-sm">Status: 201 Created</span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-400">Time: 24 ms</span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-400">Size: 486 B</span>
                  </div>
                  <div className="text-emerald-400 text-[11px]">
                    Location: /api/v1/students/101
                  </div>
                </div>

                {/* JSON Body */}
                <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-lg">
                  <div className="text-[10px] text-slate-500 mb-2 uppercase tracking-wider font-sans font-semibold">
                    Response Payload (StudentResponseDto)
                  </div>
                  <pre className="text-emerald-300 leading-relaxed overflow-x-auto text-[11px]">
{`{
  "id": 101,
  "studentId": "STU-2023-1001",
  "firstName": "Amara",
  "lastName": "Chen",
  "fullName": "Amara Chen",
  "email": "amara.chen@campus.edu",
  "department": "Computer Science",
  "academicYear": "SENIOR",
  "gpa": 3.92,
  "enrollmentStatus": "ACTIVE",
  "dateOfBirth": "2002-04-18",
  "creditsCompleted": 104,
  "createdAt": "2024-10-16T12:00:00Z",
  "updatedAt": "2024-10-16T12:00:00Z"
}`}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
