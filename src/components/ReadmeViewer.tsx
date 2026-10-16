import React, { useState } from 'react';
import { Download, Copy, Check, FileText, CheckCircle2 } from 'lucide-react';
import { GITHUB_README_MARKDOWN } from '../data/readmeContent';

interface ReadmeViewerProps {
  onGoToScreenshots: () => void;
}

export const ReadmeViewer: React.FC<ReadmeViewerProps> = ({ onGoToScreenshots }) => {
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('overview');

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(GITHUB_README_MARKDOWN);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([GITHUB_README_MARKDOWN], { type: 'text/markdown;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'README.md';
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span className="font-mono text-emerald-400">Project Root</span>
            <span>·</span>
            <span>README.md</span>
            <span>·</span>
            <span>GitHub Flavored Markdown</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            GitHub Repository README.md
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Complete, professional markdown documentation with badges, screenshots, architecture, and curl examples.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>Copy Raw Markdown</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download README.md</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Table of Contents & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left TOC Navigation (3 cols) */}
        <div className="lg:col-span-3 sticky top-24 space-y-4">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Table of Contents
            </div>
            <nav className="space-y-1 text-xs">
              <a
                href="#overview"
                className="block py-1.5 px-2 rounded text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                1. Project Overview & Badges
              </a>
              <a
                href="#screenshots"
                className="block py-1.5 px-2 rounded text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                2. Screenshots & Visuals
              </a>
              <a
                href="#architecture"
                className="block py-1.5 px-2 rounded text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                3. Architectural Highlights
              </a>
              <a
                href="#validation"
                className="block py-1.5 px-2 rounded text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                4. Validation Rules Matrix
              </a>
              <a
                href="#endpoints"
                className="block py-1.5 px-2 rounded text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                5. REST Endpoints Matrix
              </a>
              <a
                href="#examples"
                className="block py-1.5 px-2 rounded text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                6. cURL Request & Error Payloads
              </a>
              <a
                href="#running"
                className="block py-1.5 px-2 rounded text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                7. How to Run Locally & Tests
              </a>
            </nav>

            <div className="pt-3 border-t border-slate-800">
              <button
                onClick={onGoToScreenshots}
                className="w-full text-left p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-medium transition-colors"
              >
                🖼️ View / Export Screenshots →
              </button>
            </div>
          </div>
        </div>

        {/* Right Content Area (9 cols) */}
        <div className="lg:col-span-9 border border-slate-800 rounded-xl bg-slate-900/40 p-6 sm:p-8 space-y-8 prose prose-invert max-w-none text-slate-300">
          {/* Section 1: Title and Badges */}
          <div id="overview" className="space-y-4 not-prose border-b border-slate-800 pb-6">
            <h2 className="text-3xl font-extrabold text-white">Student Records REST API</h2>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded bg-[#ED8B00]/20 text-[#ED8B00] border border-[#ED8B00]/40 font-mono text-xs font-semibold">
                Java 21
              </span>
              <span className="px-2.5 py-1 rounded bg-[#6DB33F]/20 text-[#6DB33F] border border-[#6DB33F]/40 font-mono text-xs font-semibold">
                Spring Boot 3.3.4
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono text-xs font-semibold">
                Hibernate Validator 8.0
              </span>
              <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-400 border border-blue-500/40 font-mono text-xs font-semibold">
                Spring Data JPA
              </span>
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono text-xs font-semibold">
                Build: Passing
              </span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              A production-ready Spring Boot RESTful microservice designed for managing university student records. It showcases strict input validation using Hibernate Validator (JSR-380), canonical HTTP status responses (200, 201 with Location header, 204, 400, 404, 409), robust Spring Data JPA persistence with pagination and sorting, and centralized RFC-7807 problem detail exception handling.
            </p>
          </div>

          {/* Section 2: Screenshots Preview */}
          <div id="screenshots" className="space-y-4 not-prose border-b border-slate-800 pb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Visual Showcase / Screenshots</h3>
              <button
                onClick={onGoToScreenshots}
                className="text-xs text-emerald-400 hover:underline"
              >
                Open Studio to Download
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={onGoToScreenshots}
                className="p-4 rounded-lg border border-slate-800 bg-slate-950 hover:border-emerald-500/50 cursor-pointer transition-all group"
              >
                <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 flex items-center justify-between">
                  <span>1. Swagger UI OpenAPI Documentation</span>
                  <span className="text-[10px] text-slate-500 font-mono">swagger-ui.png</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Full endpoint explorer with color-coded HTTP methods, request parameters, and schemas.
                </p>
              </div>

              <div
                onClick={onGoToScreenshots}
                className="p-4 rounded-lg border border-slate-800 bg-slate-950 hover:border-emerald-500/50 cursor-pointer transition-all group"
              >
                <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 flex items-center justify-between">
                  <span>2. 400 Bad Request Field Errors</span>
                  <span className="text-[10px] text-slate-500 font-mono">validation-error-400.png</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Terminal cURL demonstrating Hibernate Validator errors across multiple invalid inputs.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Architecture */}
          <div id="architecture" className="space-y-3 not-prose border-b border-slate-800 pb-6">
            <h3 className="text-xl font-bold text-white">Architectural Highlights</h3>
            <ul className="space-y-2 text-sm text-slate-300 list-disc list-inside">
              <li><strong className="text-white">Strict Input Validation:</strong> Enforced via Hibernate Validator (<code className="text-emerald-400 font-mono">@NotNull</code>, <code className="text-emerald-400 font-mono">@NotBlank</code>, <code className="text-emerald-400 font-mono">@Size</code>, <code className="text-emerald-400 font-mono">@Email</code>, <code className="text-emerald-400 font-mono">@Past</code>, <code className="text-emerald-400 font-mono">@DecimalMin</code>, <code className="text-emerald-400 font-mono">@DecimalMax</code>).</li>
              <li><strong className="text-white">HTTP 201 with Location Header:</strong> Standard REST response pointing to the newly created URI (<code className="text-emerald-400 font-mono">/api/v1/students/&#123;id&#125;</code>).</li>
              <li><strong className="text-white">Spring Data JPA & JPQL:</strong> Type-safe persistence with derived queries, multi-attribute specs, and pagination.</li>
              <li><strong className="text-white">Global Exception Interception:</strong> <code className="text-emerald-400 font-mono">@RestControllerAdvice</code> mapping errors to RFC-7807 problem details.</li>
            </ul>
          </div>

          {/* Section 4: Validation Table */}
          <div id="validation" className="space-y-3 not-prose border-b border-slate-800 pb-6">
            <h3 className="text-xl font-bold text-white">Entity & Hibernate Validation Constraints</h3>
            <div className="border border-slate-800 rounded-lg overflow-x-auto text-xs font-mono">
              <table className="w-full text-left">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Field</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Hibernate Constraints</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  <tr>
                    <td className="py-2 px-3 text-emerald-400">studentId</td>
                    <td className="py-2 px-3">String</td>
                    <td className="py-2 px-3">@NotBlank, @Pattern(regexp = "^STU-[0-9]&#123;4&#125;-[0-9]&#123;4&#125;$")</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-emerald-400">firstName</td>
                    <td className="py-2 px-3">String</td>
                    <td className="py-2 px-3">@NotBlank, @Size(min = 2, max = 50)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-emerald-400">lastName</td>
                    <td className="py-2 px-3">String</td>
                    <td className="py-2 px-3">@NotBlank, @Size(min = 2, max = 50)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-emerald-400">email</td>
                    <td className="py-2 px-3">String</td>
                    <td className="py-2 px-3">@NotBlank, @Email(institutional format)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-emerald-400">department</td>
                    <td className="py-2 px-3">String</td>
                    <td className="py-2 px-3">@NotBlank, @Size(min = 2, max = 80)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-emerald-400">academicYear</td>
                    <td className="py-2 px-3">Enum</td>
                    <td className="py-2 px-3">@NotNull (FRESHMAN, SOPHOMORE, JUNIOR, SENIOR, GRADUATE)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-emerald-400">gpa</td>
                    <td className="py-2 px-3">BigDecimal</td>
                    <td className="py-2 px-3">@NotNull, @DecimalMin("0.00"), @DecimalMax("4.00")</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-emerald-400">dateOfBirth</td>
                    <td className="py-2 px-3">LocalDate</td>
                    <td className="py-2 px-3">@NotNull, @Past(message = "Date of birth must be a past date")</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-emerald-400">creditsCompleted</td>
                    <td className="py-2 px-3">Integer</td>
                    <td className="py-2 px-3">@Min(0), @Max(300)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 5: Endpoints */}
          <div id="endpoints" className="space-y-3 not-prose border-b border-slate-800 pb-6">
            <h3 className="text-xl font-bold text-white">REST Endpoints Matrix</h3>
            <div className="border border-slate-800 rounded-lg overflow-x-auto text-xs font-mono">
              <table className="w-full text-left">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Method</th>
                    <th className="py-2.5 px-3">Endpoint</th>
                    <th className="py-2.5 px-3">HTTP Status</th>
                    <th className="py-2.5 px-3 font-sans">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  <tr>
                    <td className="py-2 px-3 text-emerald-400 font-bold">POST</td>
                    <td className="py-2 px-3">/api/v1/students</td>
                    <td className="py-2 px-3 text-emerald-400">201 Created</td>
                    <td className="py-2 px-3 font-sans">Creates student record with Location header</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-blue-400 font-bold">GET</td>
                    <td className="py-2 px-3">/api/v1/students</td>
                    <td className="py-2 px-3 text-blue-400">200 OK</td>
                    <td className="py-2 px-3 font-sans">Paginated list with page, size, and sort</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-blue-400 font-bold">GET</td>
                    <td className="py-2 px-3">/api/v1/students/&#123;id&#125;</td>
                    <td className="py-2 px-3 text-blue-400">200 / 404</td>
                    <td className="py-2 px-3 font-sans">Retrieves single student by database ID</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-amber-400 font-bold">PUT</td>
                    <td className="py-2 px-3">/api/v1/students/&#123;id&#125;</td>
                    <td className="py-2 px-3 text-amber-400">200 / 400</td>
                    <td className="py-2 px-3 font-sans">Updates existing student with full validation</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-rose-400 font-bold">DELETE</td>
                    <td className="py-2 px-3">/api/v1/students/&#123;id&#125;</td>
                    <td className="py-2 px-3 text-rose-400">204 No Content</td>
                    <td className="py-2 px-3 font-sans">Deletes student record idempotently</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-blue-400 font-bold">GET</td>
                    <td className="py-2 px-3">/api/v1/students/search</td>
                    <td className="py-2 px-3 text-blue-400">200 OK</td>
                    <td className="py-2 px-3 font-sans">Multi-attribute query by department & min GPA</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-blue-400 font-bold">GET</td>
                    <td className="py-2 px-3">/api/v1/students/stats</td>
                    <td className="py-2 px-3 text-blue-400">200 OK</td>
                    <td className="py-2 px-3 font-sans">Aggregated department GPA averages</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 6: cURL & Running */}
          <div id="examples" className="space-y-4 not-prose">
            <h3 className="text-xl font-bold text-white">How to Run Locally</h3>
            <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 leading-relaxed overflow-x-auto">
{`# 1. Clone repository
git clone https://github.com/your-username/student-records-api.git
cd student-records-api

# 2. Build and launch Spring Boot microservice
./mvnw clean spring-boot:run

# 3. Access Swagger UI in browser
open http://localhost:8080/swagger-ui.html`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
