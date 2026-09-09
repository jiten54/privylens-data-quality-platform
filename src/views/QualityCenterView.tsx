import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QualityDimension, QualityIssue } from '../types';
import {
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Search,
  Filter,
  UserCheck,
  MessageSquare,
  Sparkles,
  Check,
  X,
  ArrowRight,
  Code,
  FileSpreadsheet,
  ChevronRight,
  Clock,
} from 'lucide-react';

export const QualityCenterView: React.FC = () => {
  const {
    qualityIssues,
    resolveQualityIssue,
    assignQualityIssue,
    ignoreQualityIssue,
    addQualityIssueComment,
    datasets,
    availableUsers,
    addToast,
    setSelectedDatasetId,
    setActiveTab,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDimension, setSelectedDimension] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeIssueId, setActiveIssueId] = useState<string | null>(
    qualityIssues.length > 0 ? qualityIssues[0].id : null
  );

  const [commentInput, setCommentInput] = useState('');

  const dimensions: QualityDimension[] = [
    'Accuracy',
    'Completeness',
    'Consistency',
    'Validity',
    'Uniqueness',
    'Relevance',
    'Timeliness',
  ];

  const filteredIssues = qualityIssues.filter(issue => {
    if (selectedDimension !== 'all' && issue.dimension !== selectedDimension) return false;
    if (selectedSeverity !== 'all' && issue.severity !== selectedSeverity) return false;
    if (selectedStatus !== 'all' && issue.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        issue.issueType.toLowerCase().includes(q) ||
        issue.datasetName.toLowerCase().includes(q) ||
        issue.description.toLowerCase().includes(q) ||
        issue.owner.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const activeIssue = qualityIssues.find(i => i.id === activeIssueId) || qualityIssues[0];

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeIssue || !commentInput.trim()) return;
    addQualityIssueComment(activeIssue.id, commentInput.trim());
    setCommentInput('');
  };

  return (
    <div id="quality-center-view" className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Data Quality Center & Issue Resolver</h1>
            <span className="px-2 py-0.5 text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 rounded-md">
              7 Governance Dimensions
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Audit rule violations, duplicate primary keys, null values, and syntax drift with AI remediation snippets.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
            Open Issues: <strong className="text-amber-400">{qualityIssues.filter(i => i.status === 'Open').length}</strong>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
            Resolved: <strong className="text-emerald-400">{qualityIssues.filter(i => i.status === 'Resolved').length}</strong>
          </span>
        </div>
      </div>

      {/* 7 Dimensions Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {dimensions.map(dim => {
          const count = qualityIssues.filter(i => i.dimension === dim && i.status !== 'Resolved').length;
          const isSelected = selectedDimension === dim;

          return (
            <button
              key={dim}
              onClick={() => setSelectedDimension(isSelected ? 'all' : dim)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{dim}</div>
              <div className="text-base font-extrabold text-white mt-1 flex items-baseline justify-between">
                <span>{count > 0 ? `${count} Issues` : 'Clean'}</span>
                {count > 0 && <span className="w-2 h-2 rounded-full bg-amber-400"></span>}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Split Layout: Issue List on Left, Deep Investigation Drawer on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Filterable Quality Issues (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          {/* Search & Filter Bar */}
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search quality issues..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <select
                value={selectedSeverity}
                onChange={e => setSelectedSeverity(e.target.value)}
                className="flex-1 px-2 py-1 bg-slate-950 border border-slate-800 rounded text-slate-300 text-xs outline-none"
              >
                <option value="all">All Severities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>

              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="flex-1 px-2 py-1 bg-slate-950 border border-slate-800 rounded text-slate-300 text-xs outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="Open">Open</option>
                <option value="Investigating">Investigating</option>
                <option value="Resolved">Resolved</option>
                <option value="Ignored">Ignored</option>
              </select>
            </div>
          </div>

          {/* Issue Cards List */}
          <div className="space-y-2.5 max-h-[620px] overflow-y-auto custom-scrollbar pr-1">
            {filteredIssues.map(issue => {
              const isSelected = activeIssue?.id === issue.id;
              const isCritical = issue.severity === 'CRITICAL';
              const isHigh = issue.severity === 'HIGH';

              return (
                <div
                  key={issue.id}
                  onClick={() => setActiveIssueId(issue.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-400 shadow-md ring-1 ring-cyan-500/20'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                          isCritical
                            ? 'bg-rose-500 text-white'
                            : isHigh
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-blue-500 text-white'
                        }`}
                      >
                        {issue.severity}
                      </span>
                      <span className="text-xs font-bold text-white truncate max-w-[200px]">
                        {issue.issueType}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        issue.status === 'Resolved'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {issue.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-2">
                    {issue.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/60">
                    <span>{issue.datasetName}</span>
                    <span className="font-mono text-cyan-400 font-semibold">{issue.dimension}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Investigation Workspace (7 Cols) */}
        <div className="lg:col-span-7">
          {activeIssue ? (
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-sm space-y-5">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-500">{activeIssue.id}</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-cyan-500/20 text-cyan-300">
                      Dimension: {activeIssue.dimension}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-white mt-1">{activeIssue.issueType}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Target Dataset: {activeIssue.datasetName}</p>
                </div>

                {/* Workflow Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => resolveQualityIssue(activeIssue.id)}
                    disabled={activeIssue.status === 'Resolved'}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      activeIssue.status === 'Resolved'
                        ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{activeIssue.status === 'Resolved' ? 'Resolved' : 'Mark Resolved'}</span>
                  </button>

                  <button
                    onClick={() => ignoreQualityIssue(activeIssue.id)}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl border border-slate-700"
                  >
                    Ignore
                  </button>
                </div>
              </div>

              {/* Summary Metrics */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-[10px] font-bold uppercase text-slate-500">Affected Records</span>
                  <div className="text-sm font-extrabold text-white mt-0.5">
                    {activeIssue.affectedRows.toLocaleString()} rows
                  </div>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-[10px] font-bold uppercase text-slate-500">Current Assignee</span>
                  <div className="text-sm font-bold text-cyan-300 mt-0.5 truncate">{activeIssue.owner}</div>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-[10px] font-bold uppercase text-slate-500">Reported</span>
                  <div className="text-xs text-slate-300 mt-1">{activeIssue.createdAt}</div>
                </div>
              </div>

              {/* Description & Impact */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Root Cause & Description
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  {activeIssue.description}
                </p>
              </div>

              {/* AI Remediation / SQL Patch */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Automated Remediation Script (SQL / dbt)
                  </h4>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(activeIssue.suggestedFix);
                      addToast('success', 'Copied', 'Remediation script copied to clipboard.');
                    }}
                    className="text-[11px] text-slate-400 hover:text-white"
                  >
                    Copy Code
                  </button>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-cyan-300 overflow-x-auto">
                  <code>{activeIssue.suggestedFix}</code>
                </div>
              </div>

              {/* Assignee Quick Reassignment */}
              <div className="flex items-center justify-between p-3 bg-slate-950/50 border border-slate-800 rounded-xl text-xs">
                <span className="text-slate-400 font-medium">Reassign to team specialist:</span>
                <select
                  value={activeIssue.owner}
                  onChange={e => assignQualityIssue(activeIssue.id, e.target.value)}
                  className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded text-slate-200 text-xs outline-none"
                >
                  {availableUsers.map(u => (
                    <option key={u.id} value={u.name}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* Audit Comments Thread */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Investigation Thread & Notes ({activeIssue.comments.length})
                </h4>

                <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                  {activeIssue.comments.length === 0 ? (
                    <div className="text-xs text-slate-500 italic">No notes logged yet.</div>
                  ) : (
                    activeIssue.comments.map(c => (
                      <div key={c.id} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs">
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                          <strong className="text-slate-300">{c.author}</strong>
                          <span>{c.timestamp}</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{c.content}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Comment Form */}
                <form onSubmit={handlePostComment} className="flex gap-2">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={e => setCommentInput(e.target.value)}
                    placeholder="Log finding, JIRA ticket ID, or root-cause notes..."
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    disabled={!commentInput.trim()}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs transition-colors"
                  >
                    Post
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500">Select an issue to investigate</div>
          )}
        </div>
      </div>
    </div>
  );
};
