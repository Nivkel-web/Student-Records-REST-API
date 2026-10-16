import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Server,
  Layers,
  Database,
  Search,
  PlusCircle,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { simulator, HttpResponse } from '../services/springBootSimulator';
import { Student, StudentRequestDto, SpringBootErrorResponse } from '../types/student';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface EndpointPreset {
  name: string;
  badge: string;
  method: HttpMethod;
  endpoint: string;
  description: string;
  payload?: Partial<StudentRequestDto>;
  queryParams?: Record<string, string>;
}

const PRESETS: EndpointPreset[] = [
  {
    name: 'Create Valid Student (201 Created)',
    badge: '201 Created',
    method: 'POST',
    endpoint: '/api/v1/students',
    description: 'Hibernate Validator passes; inserts into DB and returns 201 with Location header.',
    payload: {
      firstName: 'Sophia',
      lastName: 'Patel',
      email: 'sophia.patel@campus.edu',
      department: 'Computer Science',
      academicYear: 'SOPHOMORE',
      gpa: 3.85,
      enrollmentStatus: 'ACTIVE',
      dateOfBirth: '2003-05-12',
      creditsCompleted: 45,
    },
  },
  {
    name: 'Validation Failure (400 Bad Request)',
    badge: '400 Bad Request',
    method: 'POST',
    endpoint: '/api/v1/students',
    description: 'Triggers @Valid & Hibernate Validator: blank name, malformed email, GPA > 4.00, future DOB.',
    payload: {
      firstName: '', // Fails @NotBlank
      lastName: 'Tester',
      email: 'invalid-email-address', // Fails @Email
      department: 'Biotechnology',
      academicYear: 'FRESHMAN',
      gpa: 4.85, // Fails @DecimalMax(4.00)
      enrollmentStatus: 'ACTIVE',
      dateOfBirth: '2032-01-01', // Fails @Past
      creditsCompleted: 12,
    },
  },
  {
    name: 'Duplicate Email (409 Conflict)',
    badge: '409 Conflict',
    method: 'POST',
    endpoint: '/api/v1/students',
    description: 'Service checks repository.existsByEmail(); returns 409 Conflict.',
    payload: {
      firstName: 'Duplicate',
      lastName: 'Student',
      email: 'amara.chen@campus.edu', // Existing email
      department: 'Electrical Engineering',
      academicYear: 'JUNIOR',
      gpa: 3.5,
      enrollmentStatus: 'ACTIVE',
      dateOfBirth: '2002-08-10',
      creditsCompleted: 60,
    },
  },
  {
    name: 'Get All Students (200 OK)',
    badge: '200 OK',
    method: 'GET',
    endpoint: '/api/v1/students',
    description: 'Paged Spring Data JPA query with sorting and metadata.',
    queryParams: {
      page: '0',
      size: '5',
      sortBy: 'gpa',
      sortDir: 'desc',
    },
  },
  {
    name: 'Get Non-Existent Student (404 Not Found)',
    badge: '404 Not Found',
    method: 'GET',
    endpoint: '/api/v1/students/999',
    description: 'Repository returns Optional.empty(), triggers ResourceNotFoundException (404).',
  },
  {
    name: 'Search by Dept & Min GPA (200 OK)',
    badge: '200 OK',
    method: 'GET',
    endpoint: '/api/v1/students/search',
    description: 'Executes custom JPQL search query with department and GPA filter.',
    queryParams: {
      department: 'Computer Science',
      minGpa: '3.8',
    },
  },
  {
    name: 'Aggregated Academic Stats (200 OK)',
    badge: '200 OK',
    method: 'GET',
    endpoint: '/api/v1/students/stats',
    description: 'JPA aggregation query computing department GPA averages and active headcounts.',
  },
];

export const Playground: React.FC = () => {
  const [method, setMethod] = useState<HttpMethod>('POST');
  const [endpoint, setEndpoint] = useState<string>('/api/v1/students');
  const [requestBody, setRequestBody] = useState<string>(
    JSON.stringify(PRESETS[0].payload, null, 2)
  );
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [response, setResponse] = useState<HttpResponse<any> | null>(() =>
    simulator.createStudent(PRESETS[0].payload as StudentRequestDto)
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedResponse, setCopiedResponse] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'response' | 'headers' | 'sql'>('response');

  const applyPreset = (preset: EndpointPreset) => {
    setMethod(preset.method);
    setEndpoint(preset.endpoint);
    setRequestBody(preset.payload ? JSON.stringify(preset.payload, null, 2) : '');
    setQueryParams(preset.queryParams || {});
  };

  const handleExecute = () => {
    setIsLoading(true);
    setTimeout(() => {
      let res: HttpResponse<any>;

      try {
        if (method === 'POST') {
          const parsed = requestBody ? JSON.parse(requestBody) : {};
          res = simulator.createStudent(parsed);
        } else if (method === 'GET') {
          if (endpoint.includes('/stats')) {
            res = {
              status: 200,
              statusText: 'OK',
              headers: { 'Content-Type': 'application/json' },
              latencyMs: 14,
              data: simulator.getStatistics(),
            };
          } else if (endpoint.includes('/search')) {
            const dept = queryParams['department'];
            const minGpa = queryParams['minGpa'] ? Number(queryParams['minGpa']) : undefined;
            const status = queryParams['status'] as any;
            res = simulator.searchStudents(dept, minGpa, status);
          } else if (endpoint.match(/\/api\/v1\/students\/(\d+)/)) {
            const id = Number(endpoint.split('/').pop());
            res = simulator.getStudentById(id);
          } else {
            const page = queryParams['page'] ? Number(queryParams['page']) : 0;
            const size = queryParams['size'] ? Number(queryParams['size']) : 10;
            const sortBy = queryParams['sortBy'] || 'id';
            const sortDir = (queryParams['sortDir'] as any) || 'asc';
            res = simulator.getAllStudents(page, size, sortBy, sortDir);
          }
        } else if (method === 'PUT') {
          const id = Number(endpoint.split('/').pop()) || 101;
          const parsed = requestBody ? JSON.parse(requestBody) : {};
          res = simulator.updateStudent(id, parsed);
        } else if (method === 'DELETE') {
          const id = Number(endpoint.split('/').pop()) || 101;
          res = simulator.deleteStudent(id);
        } else {
          res = simulator.getAllStudents();
        }
      } catch (err: any) {
        res = {
          status: 400,
          statusText: 'Bad Request',
          headers: { 'Content-Type': 'application/json' },
          latencyMs: 8,
          data: {
            timestamp: new Date().toISOString(),
            status: 400,
            error: 'Malformed JSON',
            message: err.message,
            path: endpoint,
          },
        };
      }

      setResponse(res);
      setIsLoading(false);
    }, 120);
  };

  const handleCopyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response.data, null, 2));
      setCopiedResponse(true);
      setTimeout(() => setCopiedResponse(false), 2000);
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (status === 400) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    if (status === 404) return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    if (status === 409) return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
    return 'text-slate-400 bg-slate-800 border-slate-700';
  };

  const getMethodColor = (m: HttpMethod) => {
    switch (m) {
      case 'GET':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'POST':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'PUT':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'DELETE':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    }
  };

  const queryLogs = simulator.getQueryLogs();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Overview */}
      <div className="border border-slate-800 rounded-xl bg-slate-900/40 p-6 md:p-8 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="font-mono text-emerald-400 font-semibold">Spring Boot 3.3.4</span>
              <span>·</span>
              <span>Hibernate Validator 8.0</span>
              <span>·</span>
              <span>Spring Data JPA</span>
              <span>·</span>
              <span>Java 21</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Student Records RESTful Microservice Playground
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Test live HTTP status responses (<span className="text-emerald-400 font-mono">201 Created</span>, <span className="text-amber-400 font-mono">400 Bad Request</span>, <span className="text-rose-400 font-mono">404</span>, <span className="text-purple-400 font-mono">409 Conflict</span>), inspect Hibernate field validator constraints, and observe generated JPA queries in real time.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                simulator.resetData();
                handleExecute();
              }}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Database State
            </button>
          </div>
        </div>

        {/* Quick Presets Strip */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <div className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">
            One-Click Scenarios:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {PRESETS.slice(0, 4).map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  applyPreset(p);
                  setTimeout(() => handleExecute(), 50);
                }}
                className="text-left p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 hover:bg-slate-800/60 hover:border-slate-700 transition-all group"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${getMethodColor(p.method)}`}>
                    {p.method}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{p.badge}</span>
                </div>
                <div className="text-xs font-medium text-slate-200 group-hover:text-emerald-300 transition-colors truncate">
                  {p.name.split('(')[0]}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Request & Response Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Request Builder (7 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="border border-slate-800 rounded-xl bg-slate-900/60 overflow-hidden">
            {/* Header / URL Bar */}
            <div className="p-4 border-b border-slate-800 space-y-3">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>HTTP Request</span>
                <span className="font-mono text-[11px] text-slate-500">Target: Spring Boot Tomcat / 8080</span>
              </div>

              <div className="flex items-stretch gap-2">
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as HttpMethod)}
                  aria-label="HTTP Method"
                  className={`px-3 py-2 text-xs font-bold font-mono rounded-lg border bg-slate-950 focus:outline-none focus:ring-1 focus:ring-emerald-500 ${getMethodColor(
                    method
                  )}`}
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>

                <div className="relative flex-1">
                  <input
                    type="text"
                    value={endpoint}
                    onChange={(e) => setEndpoint(e.target.value)}
                    placeholder="/api/v1/students"
                    aria-label="API Endpoint Path"
                    className="w-full h-full px-3 py-2 text-xs font-mono text-slate-200 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  onClick={handleExecute}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Send</span>
                </button>
              </div>
            </div>

            {/* Request Payload Editor */}
            {(method === 'POST' || method === 'PUT') && (
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-medium">Request Body (JSON with Hibernate Validator fields)</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setRequestBody(JSON.stringify(PRESETS[0].payload, null, 2))}
                      className="text-[11px] text-emerald-400 hover:underline"
                    >
                      Fill Valid
                    </button>
                    <button
                      onClick={() => setRequestBody(JSON.stringify(PRESETS[1].payload, null, 2))}
                      className="text-[11px] text-amber-400 hover:underline"
                    >
                      Fill Invalid (400)
                    </button>
                  </div>
                </div>

                <textarea
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  rows={14}
                  spellCheck={false}
                  aria-label="Request Payload Body"
                  className="w-full p-3 text-xs font-mono text-emerald-300 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-emerald-500 resize-y leading-relaxed"
                />

                <div className="text-[11px] text-slate-500 space-y-1">
                  <p>• Hibernate rules: <code className="text-slate-400">@Email</code> (well-formed), <code className="text-slate-400">@DecimalMax("4.00")</code>, <code className="text-slate-400">@Past</code> (DOB).</p>
                </div>
              </div>
            )}

            {/* GET Query Params (when applicable) */}
            {method === 'GET' && (
              <div className="p-4 space-y-3">
                <div className="text-xs font-medium text-slate-400">Query Parameters (Spring Pageable & Filters)</div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Department</label>
                    <input
                      type="text"
                      value={queryParams['department'] || ''}
                      onChange={(e) =>
                        setQueryParams({ ...queryParams, department: e.target.value })
                      }
                      placeholder="e.g. Computer Science"
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Minimum GPA</label>
                    <input
                      type="number"
                      step="0.1"
                      value={queryParams['minGpa'] || ''}
                      onChange={(e) =>
                        setQueryParams({ ...queryParams, minGpa: e.target.value })
                      }
                      placeholder="e.g. 3.5"
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Page Number (0-indexed)</label>
                    <input
                      type="number"
                      value={queryParams['page'] || '0'}
                      onChange={(e) =>
                        setQueryParams({ ...queryParams, page: e.target.value })
                      }
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Page Size</label>
                    <input
                      type="number"
                      value={queryParams['size'] || '10'}
                      onChange={(e) =>
                        setQueryParams({ ...queryParams, size: e.target.value })
                      }
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded text-slate-200"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Response Inspector (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="border border-slate-800 rounded-xl bg-slate-900/60 overflow-hidden flex flex-col min-h-[460px]">
            {/* Response Status Bar */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  HTTP Response
                </span>
                {response && (
                  <span
                    className={`text-xs font-mono font-semibold px-2.5 py-1 rounded-md border flex items-center gap-1.5 ${getStatusColor(
                      response.status
                    )}`}
                  >
                    {response.status >= 200 && response.status < 300 ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5" />
                    )}
                    {response.status} {response.statusText}
                  </span>
                )}
              </div>

              {response && (
                <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                  <span className="tabular-nums">{response.latencyMs}ms</span>
                  <button
                    onClick={handleCopyResponse}
                    className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transition-colors"
                    title="Copy Response Body"
                  >
                    {copiedResponse ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Tabs: Body / Headers / Hibernate SQL */}
            <div className="flex items-center gap-1 px-4 pt-2 border-b border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('response')}
                className={`px-3 py-1.5 font-medium border-b-2 transition-colors ${
                  activeTab === 'response'
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Payload JSON
              </button>
              <button
                onClick={() => setActiveTab('headers')}
                className={`px-3 py-1.5 font-medium border-b-2 transition-colors ${
                  activeTab === 'headers'
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Headers {response?.headers.Location && ' (Location Set)'}
              </button>
              <button
                onClick={() => setActiveTab('sql')}
                className={`px-3 py-1.5 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'sql'
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Database className="w-3 h-3" />
                JPA SQL Console ({queryLogs.length})
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-4 flex-1 flex flex-col">
              {activeTab === 'response' && (
                <div className="space-y-4">
                  {/* If 400 with field errors, display specialized breakdown */}
                  {response?.status === 400 && response.data?.fieldErrors && (
                    <div className="border border-amber-500/30 bg-amber-500/5 rounded-lg p-3 space-y-2">
                      <div className="text-xs font-semibold text-amber-400 flex items-center gap-2">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Hibernate Validator Field Violations ({response.data.fieldErrors.length})
                      </div>
                      <div className="divide-y divide-amber-500/10 text-xs">
                        {response.data.fieldErrors.map((err: any, idx: number) => (
                          <div key={idx} className="py-1.5 flex items-start justify-between gap-2">
                            <span className="font-mono text-amber-300 font-medium shrink-0">
                              {err.field}
                            </span>
                            <span className="text-slate-300 text-right">{err.message}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <pre className="p-3 text-xs font-mono text-slate-200 bg-slate-950 border border-slate-800 rounded-lg overflow-x-auto max-h-[380px] leading-relaxed">
                    {JSON.stringify(response?.data, null, 2)}
                  </pre>
                </div>
              )}

              {activeTab === 'headers' && (
                <div className="space-y-2">
                  <div className="text-xs text-slate-400 mb-2">HTTP Response Headers:</div>
                  <div className="border border-slate-800 rounded-lg bg-slate-950 divide-y divide-slate-800/80 font-mono text-xs">
                    {Object.entries(response?.headers || {}).map(([key, value]) => (
                      <div key={key} className="p-2.5 flex items-center justify-between">
                        <span className="text-slate-400">{key}:</span>
                        <span className="text-emerald-400 font-semibold">{value}</span>
                      </div>
                    ))}
                    <div className="p-2.5 flex items-center justify-between">
                      <span className="text-slate-400">Server:</span>
                      <span className="text-slate-300">Apache-Tomcat/10.1.28 (Spring Boot)</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'sql' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Recent Hibernate SQL Statements</span>
                    <span className="text-[11px] font-mono text-emerald-400">show-sql: true</span>
                  </div>
                  <div className="space-y-2 max-h-[380px] overflow-y-auto font-mono text-xs">
                    {queryLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-2.5 rounded border border-slate-800 bg-slate-950 space-y-1"
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-500">
                          <span>{log.timestamp}</span>
                          <span className="tabular-nums text-slate-400">{log.executionTimeMs}ms</span>
                        </div>
                        <div className="text-emerald-400 break-words">{log.sql}</div>
                        {log.parameters.length > 0 && (
                          <div className="text-[11px] text-slate-400">
                            binding params: [{log.parameters.join(', ')}]
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
