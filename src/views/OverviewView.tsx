import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Cpu,
  FileText,
  Database,
  AlertTriangle,
  ShieldAlert,
  ArrowUpRight,
  UserCheck,
  MessageSquare,
  Eye,
  Check,
  TrendingUp,
  BarChart3,
  RefreshCw,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const OverviewView: React.FC = () => {
  const {
    datasets,
    documents,
    piiFindings,
    qualityIssues,
    anomalies,
    aiExamples,
    maskAllPII,
    maskPIIFinding,
    resolveQualityIssue,
    assignQualityIssue,
    ignoreQualityIssue,
    addQualityIssueComment,
    setActiveTab,
    setSelectedDatasetId,
    addToast,
    availableUsers,
  } = useApp();

  const [assignDropdownId, setAssignDropdownId] = useState<string | null>(null);
  const [commentModalIssueId, setCommentModalIssueId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Compute live executive metrics
  const totalRecords = datasets.reduce((acc, d) => acc + d.rows, 0);
  const totalDocsReviewed = documents.filter(d => d.status === 'Approved' || d.status === 'Redacted & Cleared').length;
  const criticalPiiCount = piiFindings.filter(p => p.severity === 'CRITICAL' && !p.isMasked).length;
  const openQualityIssues = qualityIssues.filter(q => q.status === 'Open' || q.status === 'Investigating');

  // Overall Trust Score calculation
  const avgQualityScore = Math.round(datasets.reduce((acc, d) => acc + d.qualityScore, 0) / datasets.length);
  const privacyComplianceScore = Math.max(
    10,
    Math.round(100 - (criticalPiiCount * 12 + piiFindings.filter(p => !p.isMasked).length * 4))
  );
  const aiReadinessScore = Math.round(
    (aiExamples.filter(a => a.reviewerDecision === 'Accepted').length / Math.max(1, aiExamples.length)) * 100
  );
  const overallDataTrustScore = Math.round((avgQualityScore * 0.45 + privacyComplianceScore * 0.35 + aiReadinessScore * 0.2));

  const qualityDimensions = [
    { name: 'Accuracy', score: 92, benchmark: 90, color: 'text-cyan-400' },
    { name: 'Completeness', score: 86, benchmark: 90, color: 'text-blue-400' },
    { name: 'Consistency', score: 89, benchmark: 85, color: 'text-indigo-400' },
    { name: 'Validity', score: 88, benchmark: 95, color: 'text-purple-400' },
    { name: 'Uniqueness', score: 91, benchmark: 90, color: 'text-emerald-400' },
    { name: 'Relevance', score: 96, benchmark: 90, color: 'text-teal-400' },
    { name: 'Timeliness', score: 94, benchmark: 92, color: 'text-amber-400' },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    addToast('info', 'Refreshing Telemetry', 'Fetching real-time quality and privacy sensor streams...');
    setTimeout(() => {
      setIsRefreshing(false);
      addToast('success', 'Refreshed', 'All executive metrics updated.');
    }, 800);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentModalIssueId || !commentText.trim()) return;
    addQualityIssueComment(commentModalIssueId, commentText.trim());
    setCommentModalIssueId(null);
    setCommentText('');
  };

  return (
    <div id="overview-view" className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Command Center Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-white tracking-tight">Executive Command Center</h1>
            <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md">
              Real-time Ingestion Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Unified visibility into enterprise data trust, automated PII protection, multi-format document reviews, and AI model evaluation queues.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Refresh Telemetry</span>
          </button>

          {criticalPiiCount > 0 && (
            <button
              onClick={() => maskAllPII()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Mask All Critical PII ({criticalPiiCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero Metric Cards (Stripe / Datadog Inspired) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Trust Score Card */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Overall Data Trust Score</span>
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{overallDataTrustScore}</span>
            <span className="text-xs font-bold text-cyan-400">/ 100</span>
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 ml-auto border border-cyan-500/30">
              Grade A
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5" /> +2.4% vs last week
            </span>
            <span>Target: &gt;90.0</span>
          </div>
          {/* Subtle progress track */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full" style={{ width: `${overallDataTrustScore}%` }}></div>
          </div>
        </div>

        {/* Data Quality Score Card */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Data Quality Score</span>
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{avgQualityScore}%</span>
            <span className="text-xs font-medium text-slate-400">avg across {datasets.length} sets</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span className="text-amber-400 font-medium">
              {openQualityIssues.length} active issues
            </span>
            <span>7 Dimensions</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${avgQualityScore}%` }}></div>
          </div>
        </div>

        {/* Privacy Compliance Score */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Privacy Compliance Score</span>
            <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
              <Lock className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{privacyComplianceScore}%</span>
            <span className={`text-xs font-bold ${criticalPiiCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {criticalPiiCount > 0 ? `${criticalPiiCount} Critical PII` : 'Zero Leaks'}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>GDPR • CCPA • HIPAA</span>
            <span className="text-slate-300 font-medium">{piiFindings.length} Total Detected</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className={`h-full rounded-full ${criticalPiiCount > 0 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${privacyComplianceScore}%` }}></div>
          </div>
        </div>

        {/* AI Dataset Readiness */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px]">AI Dataset Readiness</span>
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <Cpu className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{aiReadinessScore}%</span>
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-300 ml-auto border border-purple-500/30">
              Human-in-the-Loop
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>45k Training Prompts</span>
            <span className="text-emerald-400 font-medium">94.8% Agreement</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-purple-500 h-full rounded-full" style={{ width: `${aiReadinessScore}%` }}></div>
          </div>
        </div>
      </div>

      {/* Secondary Operational Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-slate-900/60 border border-slate-800/80 rounded-xl flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-800 text-slate-300">
            <Database className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-base font-bold text-white leading-tight">{totalRecords.toLocaleString()}</div>
            <div className="text-[11px] text-slate-400">Records Analyzed</div>
          </div>
        </div>

        <div className="p-3.5 bg-slate-900/60 border border-slate-800/80 rounded-xl flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-800 text-slate-300">
            <FileText className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <div className="text-base font-bold text-white leading-tight">{documents.length} Docs ({totalDocsReviewed} Cleared)</div>
            <div className="text-[11px] text-slate-400">Documents Ingested</div>
          </div>
        </div>

        <div className="p-3.5 bg-slate-900/60 border border-slate-800/80 rounded-xl flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-800 text-slate-300">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-base font-bold text-white leading-tight">{openQualityIssues.length} Issues</div>
            <div className="text-[11px] text-slate-400">Open Quality Tickets</div>
          </div>
        </div>

        <div className="p-3.5 bg-slate-900/60 border border-slate-800/80 rounded-xl flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-800 text-slate-300">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div>
            <div className="text-base font-bold text-white leading-tight">{criticalPiiCount} Critical Items</div>
            <div className="text-[11px] text-slate-400">Unmasked PII Exposed</div>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Quality Dimensions & Trends */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quality Dimensions Matrix */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  Enterprise Quality Dimensions Breakdown
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Evaluated across 7 standard governance dimensions against enterprise SLAs
                </p>
              </div>
              <button
                onClick={() => setActiveTab('quality-center')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
              >
                <span>Quality Center</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {qualityDimensions.map(dim => (
                <div key={dim.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-200">{dim.name}</span>
                      <span className="text-[10px] text-slate-500">Benchmark: {dim.benchmark}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-100">{dim.score}%</span>
                      {dim.score >= dim.benchmark ? (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1 rounded">
                          Pass
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1 rounded">
                          Under SLA
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        dim.score >= dim.benchmark ? 'bg-cyan-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${dim.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Trends Visualization */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Telemetry Trends: Quality vs PII Remediation (Last 7 Days)
                </h2>
                <p className="text-xs text-slate-400">
                  Continuous pipeline score vs daily masked sensitive records
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Quality Score %
                </span>
                <span className="flex items-center gap-1.5 text-rose-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span> Masked Records
                </span>
              </div>
            </div>

            {/* Custom SVG Responsive Area & Bar Chart */}
            <div className="h-48 w-full pt-2">
              <svg className="w-full h-full" viewBox="0 0 700 160" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="qualityGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Horizontal Grid Lines */}
                <line x1="0" y1="20" x2="700" y2="20" stroke="#1e293b" strokeDasharray="3 3" />
                <line x1="0" y1="60" x2="700" y2="60" stroke="#1e293b" strokeDasharray="3 3" />
                <line x1="0" y1="100" x2="700" y2="100" stroke="#1e293b" strokeDasharray="3 3" />
                <line x1="0" y1="140" x2="700" y2="140" stroke="#1e293b" strokeDasharray="3 3" />

                {/* Bars for Masked Records: Day 1 to 7 */}
                <rect x="35" y="90" width="28" height="50" rx="3" fill="#f43f5e" opacity="0.4" />
                <rect x="135" y="70" width="28" height="70" rx="3" fill="#f43f5e" opacity="0.4" />
                <rect x="235" y="110" width="28" height="30" rx="3" fill="#f43f5e" opacity="0.4" />
                <rect x="335" y="60" width="28" height="80" rx="3" fill="#f43f5e" opacity="0.4" />
                <rect x="435" y="85" width="28" height="55" rx="3" fill="#f43f5e" opacity="0.4" />
                <rect x="535" y="45" width="28" height="95" rx="3" fill="#f43f5e" opacity="0.4" />
                <rect x="635" y="30" width="28" height="110" rx="3" fill="#f43f5e" opacity="0.6" />

                {/* Area Gradient for Quality Curve */}
                <path
                  d="M 50 80 Q 150 70 250 55 T 450 45 T 650 25 L 650 140 L 50 140 Z"
                  fill="url(#qualityGrad)"
                />
                {/* Line Path */}
                <path
                  d="M 50 80 Q 150 70 250 55 T 450 45 T 650 25"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Data Points */}
                <circle cx="50" cy="80" r="4" fill="#06b6d4" className="ring-4 ring-cyan-500/20" />
                <circle cx="250" cy="55" r="4" fill="#06b6d4" />
                <circle cx="450" cy="45" r="4" fill="#06b6d4" />
                <circle cx="650" cy="25" r="5" fill="#06b6d4" stroke="#fff" strokeWidth="2" />
              </svg>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 px-4">
                <span>Sep 2 (82.1%)</span>
                <span>Sep 3 (84.5%)</span>
                <span>Sep 4 (86.0%)</span>
                <span>Sep 5 (87.2%)</span>
                <span>Sep 6 (88.9%)</span>
                <span>Sep 7 (90.4%)</span>
                <span className="font-bold text-cyan-400">Today (91.8%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Severity Breakdown & Review Productivity */}
        <div className="space-y-6">
          {/* Issue Severity Distribution */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-sm">
            <h3 className="text-sm font-bold text-white mb-1">Active Issues by Severity</h3>
            <p className="text-xs text-slate-400 mb-4">Risk stratification across quality & privacy</p>

            <div className="space-y-2.5">
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span className="text-xs font-semibold text-rose-300">CRITICAL</span>
                </div>
                <span className="font-mono text-xs font-bold text-white">
                  {piiFindings.filter(p => p.severity === 'CRITICAL' && !p.isMasked).length +
                    qualityIssues.filter(q => q.severity === 'CRITICAL' && q.status === 'Open').length}{' '}
                  items
                </span>
              </div>

              <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="text-xs font-semibold text-amber-300">HIGH</span>
                </div>
                <span className="font-mono text-xs font-bold text-white">
                  {qualityIssues.filter(q => q.severity === 'HIGH').length} items
                </span>
              </div>

              <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <span className="text-xs font-semibold text-blue-300">MEDIUM</span>
                </div>
                <span className="font-mono text-xs font-bold text-white">
                  {qualityIssues.filter(q => q.severity === 'MEDIUM').length} items
                </span>
              </div>

              <div className="p-2.5 bg-slate-800/60 border border-slate-700/60 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                  <span className="text-xs font-semibold text-slate-300">LOW / INFO</span>
                </div>
                <span className="font-mono text-xs font-bold text-white">
                  {qualityIssues.filter(q => q.severity === 'LOW' || q.severity === 'INFO').length} items
                </span>
              </div>
            </div>
          </div>

          {/* AI Dataset Readiness Gauge */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white">AI Training Readiness</h3>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded">
                Verified Safe
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Evaluating instruction-tuning corpora against leakage of personal data and toxic outputs.
            </p>

            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Human Reviewer Agreement:</span>
                <span className="font-bold text-cyan-400">94.8%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Gold-Standard Examples:</span>
                <span className="font-bold text-white">1,250 Verified</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Quarantine Barrier:</span>
                <span className="font-bold text-rose-400">540 Rejected Prompts</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('ai-evaluation')}
              className="mt-4 w-full py-2 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Open AI Evaluation Workspace</span>
            </button>
          </div>
        </div>
      </div>

      {/* Priority Actions Section (MANDATED REQUIREMENT) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <h2 className="text-sm font-bold text-white">Priority Actions & Remediation Queue</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Urgent issues requiring immediate data analyst or privacy officer intervention
            </p>
          </div>
          <span className="text-xs font-medium text-slate-400">
            Showing top {Math.min(5, qualityIssues.length + 1)} high-risk findings
          </span>
        </div>

        {/* Priority Action Cards */}
        <div className="space-y-3">
          {/* Card 1: CRITICAL Government ID in employee_roster.csv */}
          <div className="p-4 bg-slate-950/60 border border-rose-500/30 rounded-xl hover:border-rose-500/60 transition-all">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="px-2 py-1 text-[10px] font-extrabold rounded bg-rose-500 text-white uppercase tracking-wider shrink-0 mt-0.5">
                  CRITICAL
                </span>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    Government ID detected in employee_roster.csv
                    <span className="text-[10px] text-rose-400 font-medium">
                      Confidence: 99.8% • 420 plaintext records
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Unmasked Social Security Numbers (e.g. 984-21-4491) stored in unencrypted analytical column. Mandatory compliance violation under HIPAA/GDPR.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                <button
                  onClick={() => {
                    setSelectedDatasetId('ds-employee-roster');
                    setActiveTab('privacy-scanner');
                  }}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>View</span>
                </button>

                <button
                  onClick={() => maskPIIFinding('pii-001')}
                  className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Mask / Resolve</span>
                </button>

                <button
                  onClick={() => {
                    setCommentModalIssueId('ISSUE-QA-401');
                  }}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Comment</span>
                </button>
              </div>
            </div>
          </div>

          {/* Dynamic Render for Quality Issues */}
          {qualityIssues.slice(1, 4).map(issue => {
            const isCritical = issue.severity === 'CRITICAL';
            const isHigh = issue.severity === 'HIGH';

            return (
              <div
                key={issue.id}
                className={`p-4 bg-slate-950/60 border rounded-xl transition-all ${
                  isCritical
                    ? 'border-rose-500/30 hover:border-rose-500/50'
                    : isHigh
                    ? 'border-amber-500/30 hover:border-amber-500/50'
                    : 'border-blue-500/30 hover:border-blue-500/50'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span
                      className={`px-2 py-1 text-[10px] font-extrabold rounded uppercase tracking-wider shrink-0 mt-0.5 ${
                        isCritical
                          ? 'bg-rose-500 text-white'
                          : isHigh
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-blue-500 text-white'
                      }`}
                    >
                      {issue.severity}
                    </span>

                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-2">
                        {issue.issueType} in {issue.datasetName}
                        <span className="text-[10px] text-slate-400 font-medium">
                          Dimension: {issue.dimension} • {issue.affectedRows.toLocaleString()} rows affected
                        </span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {issue.description}
                      </p>
                      <div className="mt-1 text-[11px] text-slate-500 flex items-center gap-3">
                        <span>Owner: <strong className="text-slate-300">{issue.owner}</strong></span>
                        <span>Status: <strong className="text-cyan-400">{issue.status}</strong></span>
                        {issue.comments.length > 0 && (
                          <span className="text-slate-400 flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" /> {issue.comments.length}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center relative">
                    <button
                      onClick={() => {
                        setSelectedDatasetId(issue.datasetId);
                        setActiveTab('quality-center');
                      }}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      <span>View</span>
                    </button>

                    {/* Assign Dropdown Trigger */}
                    <div className="relative">
                      <button
                        onClick={() => setAssignDropdownId(assignDropdownId === issue.id ? null : issue.id)}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 flex items-center gap-1"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                        <span>Assign</span>
                      </button>

                      {assignDropdownId === issue.id && (
                        <div className="absolute right-0 bottom-full mb-1 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-50 p-1">
                          <div className="px-2 py-1 text-[10px] font-bold text-slate-500 uppercase">
                            Assign Specialist
                          </div>
                          {availableUsers.map(user => (
                            <button
                              key={user.id}
                              onClick={() => {
                                assignQualityIssue(issue.id, user.name);
                                setAssignDropdownId(null);
                              }}
                              className="w-full text-left px-2 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded flex items-center justify-between"
                            >
                              <span>{user.name}</span>
                              <span className="text-[10px] text-slate-500">{user.role}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Resolve Button */}
                    <button
                      onClick={() => resolveQualityIssue(issue.id)}
                      disabled={issue.status === 'Resolved'}
                      className={`px-2.5 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors ${
                        issue.status === 'Resolved'
                          ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{issue.status === 'Resolved' ? 'Resolved' : 'Resolve'}</span>
                    </button>

                    {/* Ignore Button */}
                    {issue.status !== 'Resolved' && (
                      <button
                        onClick={() => ignoreQualityIssue(issue.id)}
                        className="px-2 py-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg"
                        title="Mark issue as ignored / acceptable variance"
                      >
                        Ignore
                      </button>
                    )}

                    {/* Add Comment Button */}
                    <button
                      onClick={() => setCommentModalIssueId(issue.id)}
                      className="p-1.5 text-slate-400 hover:text-cyan-300 rounded-lg hover:bg-slate-800"
                      title="Add note / comment"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Comment Modal Dialog */}
      {commentModalIssueId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-5">
            <h3 className="text-sm font-bold text-white mb-1">Add Stakeholder Comment</h3>
            <p className="text-xs text-slate-400 mb-3">
              Post an operational update or root-cause finding to Issue #{commentModalIssueId}
            </p>
            <form onSubmit={handleCommentSubmit}>
              <textarea
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                rows={3}
                placeholder="Describe remediation steps, ETL patch version, or stakeholder approval..."
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
                autoFocus
              />
              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCommentModalIssueId(null)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 text-xs font-bold rounded-lg"
                >
                  Post Comment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
