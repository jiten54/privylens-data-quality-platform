import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DocumentAnnotation, DocumentItem } from '../types';
import {
  FileText,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Eye,
  Lock,
  Flag,
  MessageSquare,
  AlertTriangle,
  UserCheck,
  Download,
  Share2,
  Sparkles,
  ChevronRight,
  Send,
} from 'lucide-react';

export const DocumentReviewView: React.FC = () => {
  const {
    documents,
    selectedDocumentId,
    setSelectedDocumentId,
    selectedDocument,
    redactDocumentAnnotation,
    approveDocumentAnnotation,
    updateDocumentStatus,
    addToast,
    currentUser,
    availableUsers,
  } = useApp();

  const doc = selectedDocument || documents[0];

  const [activeAnnotationId, setActiveAnnotationId] = useState<string | null>(
    doc.annotations.length > 0 ? doc.annotations[0].id : null
  );
  const [commentInput, setCommentInput] = useState('');
  const [assigneeSelect, setAssigneeSelect] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');

  const activeAnnotation = doc.annotations.find(a => a.id === activeAnnotationId) || doc.annotations[0];

  const filteredAnnotations = doc.annotations.filter(a => {
    if (filterType === 'pii') return a.type === 'PII';
    if (filterType === 'compliance') return a.type === 'Compliance';
    if (filterType === 'unredacted') return !a.isRedacted && a.status !== 'Approved';
    return true;
  });

  const handleRedact = (annId: string) => {
    redactDocumentAnnotation(doc.id, annId);
  };

  const handleApprove = (annId: string) => {
    approveDocumentAnnotation(doc.id, annId);
  };

  const handleEscalate = (annId: string) => {
    addToast('warning', 'Escalated to Legal', `Entity escalated to Marcus Vance (Head of Legal Oversight)`);
  };

  const handleExportRedactedDoc = () => {
    const redactedContent = doc.contentSample
      .replace(/SSN: \d{3}-\d{2}-\d{4}/g, '[██████ REDACTED SSN ██████]')
      .replace(/Account #\d+-\d+/g, '[██████ REDACTED BANK ACCOUNT ██████]')
      .replace(/\$340,000/g, '[████ REDACTED COMP ████]')
      .replace(/482 Elmwood Terrace[^\n]*/g, '[████ REDACTED RESIDENTIAL ADDRESS ████]');

    const blob = new Blob([redactedContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `REDACTED_${doc.title}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    addToast('success', 'Document Exported', `Downloaded sanitized and redacted document.`);
  };

  return (
    <div id="document-review-view" className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header & Document Picker */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Document Review & Redaction Workspace</h1>
            <span className="px-2 py-0.5 text-xs font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30 rounded-md">
              AI-Assisted Entity Review
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Split-pane preview for contract compliance, automated sensitive entity masking, and legal sign-off.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Document Picker Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {documents.map(d => (
              <button
                key={d.id}
                onClick={() => {
                  setSelectedDocumentId(d.id);
                  setActiveAnnotationId(d.annotations[0]?.id || null);
                }}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                  d.id === doc.id
                    ? 'bg-slate-800 text-cyan-300 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {d.title.split('-')[0].trim()}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportRedactedDoc}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-md shadow-cyan-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Export Redacted PDF</span>
          </button>
        </div>
      </div>

      {/* Document Overview Strip */}
      <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-slate-500 text-[10px] uppercase font-bold">Document Title:</span>
            <div className="font-bold text-slate-100">{doc.title}</div>
          </div>
          <div className="hidden sm:block border-l border-slate-800 pl-4">
            <span className="text-slate-500 text-[10px] uppercase font-bold">Format / Size:</span>
            <div className="font-mono text-slate-300">{doc.format} • {doc.fileSize}</div>
          </div>
          <div className="hidden md:block border-l border-slate-800 pl-4">
            <span className="text-slate-500 text-[10px] uppercase font-bold">Department:</span>
            <div className="text-slate-300">{doc.department}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-slate-500 text-[10px] uppercase font-bold">Review Status:</span>
            <div className="font-bold text-cyan-400">{doc.status}</div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => updateDocumentStatus(doc.id, 'Approved')}
              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center gap-1 shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Approve Doc
            </button>
            <button
              onClick={() => updateDocumentStatus(doc.id, 'Rejected')}
              className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg flex items-center gap-1 shadow-sm"
            >
              <XCircle className="w-3.5 h-3.5" /> Reject
            </button>
          </div>
        </div>
      </div>

      {/* Split Workspace: Document Canvas on Left, AI Review Panel on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Document Preview (8 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                Page 1 of {doc.pageCount}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400 font-mono">100% Zoom (Fitted)</span>
            </div>
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Optical Character Recognition (OCR) Verified
            </span>
          </div>

          {/* Interactive Document Sheet Canvas */}
          <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-6 font-sans text-xs text-slate-300 leading-relaxed space-y-4 select-text relative shadow-inner overflow-y-auto max-h-[600px] custom-scrollbar">
            {/* Watermark badge */}
            <div className="text-[10px] font-mono uppercase tracking-widest text-slate-600 font-bold border-b border-slate-800/80 pb-2 flex justify-between">
              <span>PRIVYLENS AUDIT SANDBOX // CONFIDENTIAL</span>
              <span>CLASSIFICATION: HIGH RISK</span>
            </div>

            <div className="whitespace-pre-line font-serif text-slate-200 text-xs sm:text-sm leading-6">
              {doc.contentSample}
            </div>

            {/* Simulated Highlight Overlay Markers */}
            <div className="pt-4 border-t border-slate-800/80 space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Identified Sensitive Segments on this Page:
              </div>
              <div className="grid grid-cols-1 gap-2">
                {doc.annotations.map(ann => {
                  const isSelected = activeAnnotationId === ann.id;
                  return (
                    <div
                      key={ann.id}
                      onClick={() => setActiveAnnotationId(ann.id)}
                      className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'bg-cyan-500/15 border-cyan-500/50 shadow-md ring-1 ring-cyan-500/20'
                          : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            ann.isRedacted
                              ? 'bg-slate-500'
                              : ann.severity === 'CRITICAL'
                              ? 'bg-rose-500'
                              : 'bg-amber-500'
                          }`}
                        ></span>
                        <span className="font-mono text-xs font-semibold text-white truncate">
                          {ann.isRedacted ? '██████ [REDACTED BLACKOUT] ██████' : ann.text}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                          {ann.category}
                        </span>
                        {ann.isRedacted ? (
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                            Masked
                          </span>
                        ) : (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                              ann.severity === 'CRITICAL'
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            }`}
                          >
                            {ann.severity}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: AI-Assisted Review Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Entity Inspector Card */}
          {activeAnnotation ? (
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-sm space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-white">AI Detection Analysis</h3>
                  </div>
                  <span className="text-xs text-slate-400 mt-0.5 block">
                    Category: <strong className="text-cyan-300">{activeAnnotation.category}</strong>
                  </span>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                    activeAnnotation.isRedacted
                      ? 'bg-slate-800 text-slate-300 border-slate-700'
                      : activeAnnotation.severity === 'CRITICAL'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}
                >
                  {activeAnnotation.isRedacted ? 'REDACTED' : activeAnnotation.severity}
                </span>
              </div>

              {/* Text Sample */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-500">Detected Entity Text</span>
                <div className="font-mono text-xs text-white mt-1 select-all break-all">
                  {activeAnnotation.isRedacted ? '[PERMANENT BLACKOUT APPLIED]' : `"${activeAnnotation.text}"`}
                </div>
              </div>

              {/* Confidence & Recommendation */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Reviewer Confidence</span>
                  <div className="font-mono font-bold text-cyan-400 text-sm mt-0.5">{activeAnnotation.confidence}%</div>
                </div>
                <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Policy Category</span>
                  <div className="font-bold text-slate-200 text-xs mt-0.5">{activeAnnotation.type}</div>
                </div>
              </div>

              <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-xs text-cyan-200">
                <div className="font-bold mb-0.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  PrivyLens Recommendation
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">{activeAnnotation.recommendation}</p>
              </div>

              {/* Reviewer Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => handleRedact(activeAnnotation.id)}
                  disabled={activeAnnotation.isRedacted}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                    activeAnnotation.isRedacted
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{activeAnnotation.isRedacted ? 'Redacted' : 'Blackout Redact'}</span>
                </button>

                <button
                  onClick={() => handleApprove(activeAnnotation.id)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Approve Legit</span>
                </button>

                <button
                  onClick={() => handleEscalate(activeAnnotation.id)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1"
                >
                  <Flag className="w-3.5 h-3.5 text-amber-400" />
                  <span>Escalate</span>
                </button>
              </div>
            </div>
          ) : null}

          {/* Review Findings List & Filtering */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                All Document Findings ({doc.annotations.length})
              </h4>
              <div className="flex items-center gap-1 text-[11px]">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-2 py-0.5 rounded ${
                    filterType === 'all' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType('pii')}
                  className={`px-2 py-0.5 rounded ${
                    filterType === 'pii' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'
                  }`}
                >
                  PII
                </button>
                <button
                  onClick={() => setFilterType('compliance')}
                  className={`px-2 py-0.5 rounded ${
                    filterType === 'compliance' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'
                  }`}
                >
                  Compliance
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
              {filteredAnnotations.map(item => (
                <div
                  key={item.id}
                  onClick={() => setActiveAnnotationId(item.id)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    activeAnnotationId === item.id
                      ? 'bg-slate-800/90 border-cyan-500/50'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-200 truncate">{item.category}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                        item.isRedacted
                          ? 'bg-slate-800 text-slate-400 border-slate-700'
                          : item.severity === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {item.isRedacted ? 'Redacted' : item.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-1">
                    {item.isRedacted ? '[BLACKOUT REDACTION]' : item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
