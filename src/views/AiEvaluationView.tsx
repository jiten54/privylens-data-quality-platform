import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AIExampleItem } from '../types';
import {
  Cpu,
  Check,
  XCircle,
  AlertTriangle,
  Lock,
  Sparkles,
  Search,
  Download,
} from 'lucide-react';

export const AiEvaluationView: React.FC = () => {
  const { aiExamples, evaluateAIExample, addToast } = useApp();

  const [activeExampleId, setActiveExampleId] = useState<string>(
    aiExamples.length > 0 ? aiExamples[0].id : ''
  );
  const [filterDecision, setFilterDecision] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const activeExample = aiExamples.find(e => e.id === activeExampleId) || aiExamples[0];

  const filteredExamples = aiExamples.filter(item => {
    if (filterDecision !== 'all' && item.reviewerDecision !== filterDecision) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.input.toLowerCase().includes(q) ||
        item.aiOutput.toLowerCase().includes(q) ||
        item.modelDataset.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const acceptedCount = aiExamples.filter(e => e.reviewerDecision === 'Accepted').length;
  const rejectedCount = aiExamples.filter(e => e.reviewerDecision === 'Rejected').length;

  const handleExportSafeCorpus = () => {
    const safeData = aiExamples.filter(e => e.reviewerDecision === 'Accepted');
    const jsonl = safeData
      .map(item => JSON.stringify({ prompt: item.input, response: item.aiOutput, validated: true }))
      .join('\n');
    const blob = new Blob([jsonl], { type: 'application/jsonl;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PrivyLens_Sanitized_Training_Corpus.jsonl`;
    a.click();
    addToast('success', 'Exported Corpus', `Exported ${safeData.length} gold-standard training pairs.`);
  };

  return (
    <div id="ai-evaluation-view" className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">AI Training & RAG Evaluation Studio</h1>
            <span className="px-2 py-0.5 text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30 rounded-md">
              LLM Governance & Alignment
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Human-in-the-loop review queues to intercept PII leakage, hallucinations, and copyright drift before model fine-tuning.
          </p>
        </div>

        <button
          onClick={handleExportSafeCorpus}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs transition-colors shadow-md shadow-purple-600/20"
        >
          <Download className="w-4 h-4" />
          <span>Export Cleaned JSONL ({acceptedCount})</span>
        </button>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[10px] uppercase font-bold text-slate-400">Total Prompts Evaluated</div>
          <div className="text-2xl font-extrabold text-white mt-1">{aiExamples.length} Pairs</div>
          <div className="text-[11px] text-slate-400 mt-1">Instruction fine-tuning set</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[10px] uppercase font-bold text-slate-400">Accepted For Training</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">{acceptedCount}</div>
          <div className="text-[11px] text-emerald-400/80 mt-1">Free of PII & Toxic Tokens</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[10px] uppercase font-bold text-slate-400">Quarantined / Rejected</div>
          <div className="text-2xl font-extrabold text-rose-400 mt-1">{rejectedCount}</div>
          <div className="text-[11px] text-rose-400/80 mt-1">PII Leakage or Hallucination</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[10px] uppercase font-bold text-slate-400">Reviewer Consensus</div>
          <div className="text-2xl font-extrabold text-cyan-400 mt-1">94.8%</div>
          <div className="text-[11px] text-slate-400 mt-1">Inter-annotator agreement</div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Review Queue List (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          {/* Controls */}
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search prompts or completions..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs flex-wrap">
              {(['all', 'Pending', 'Accepted', 'Rejected', 'Needs Correction'] as const).map(tabKey => (
                <button
                  key={tabKey}
                  onClick={() => setFilterDecision(tabKey)}
                  className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors ${
                    filterDecision === tabKey
                      ? 'bg-purple-500/20 text-purple-300 font-bold'
                      : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {tabKey === 'all' ? 'All' : tabKey}
                </button>
              ))}
            </div>
          </div>

          {/* Cards */}
          <div className="space-y-2.5 max-h-[580px] overflow-y-auto custom-scrollbar pr-1">
            {filteredExamples.map(item => {
              const isSelected = activeExample?.id === item.id;
              const hasPii = item.privacyStatus === 'PII Leak Detected';

              return (
                <div
                  key={item.id}
                  onClick={() => setActiveExampleId(item.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-purple-400 shadow-md ring-1 ring-purple-500/20'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-[10px] text-purple-400 font-semibold">{item.id}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        item.reviewerDecision === 'Accepted'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : item.reviewerDecision === 'Rejected'
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {item.reviewerDecision}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-200 line-clamp-1 mb-1">
                    {item.input}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                    <span className="text-slate-500 truncate max-w-[150px]">{item.category}</span>
                    <div className="flex items-center gap-2">
                      <span className={hasPii ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                        {item.privacyStatus}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Detailed Human Review Workspace (7 Cols) */}
        <div className="lg:col-span-7">
          {activeExample ? (
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-sm space-y-5">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-purple-400 font-bold">{activeExample.id}</span>
                    <span className="text-xs text-slate-400">• Dataset: {activeExample.modelDataset}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1">LLM Response Pair Evaluation</h3>
                </div>

                {/* Decision Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => evaluateAIExample(activeExample.id, 'Accepted')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" /> Accept for Training
                  </button>

                  <button
                    onClick={() => evaluateAIExample(activeExample.id, 'Rejected')}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Quarantine
                  </button>
                </div>
              </div>

              {/* Status Badges */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div
                  className={`p-3 rounded-xl border ${
                    activeExample.privacyStatus === 'PII Leak Detected'
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold text-slate-500">Privacy Status</span>
                  <div className="text-base font-extrabold mt-0.5">{activeExample.privacyStatus}</div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Quality Score: <strong>{activeExample.qualityScore}%</strong>
                  </p>
                </div>

                <div className="p-3 rounded-xl border bg-slate-950 border-slate-800 text-slate-300">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Annotator Agreement</span>
                  <div className="text-base font-extrabold mt-0.5 text-cyan-400">{activeExample.agreementScore}%</div>
                  <p className="text-[11px] text-slate-400 mt-1">Cross-referenced against verified ground truth</p>
                </div>
              </div>

              {/* Prompt Box */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
                  Instruction / User Prompt
                </span>
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 leading-relaxed select-all">
                  {activeExample.input}
                </div>
              </div>

              {/* Expected Output */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-1.5 block">
                  Expected Ground Truth (Target)
                </span>
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-emerald-300 leading-relaxed select-all">
                  {activeExample.expectedOutput}
                </div>
              </div>

              {/* Candidate Model Output */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 mb-1.5 block">
                  Candidate Model Completion
                </span>
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-cyan-200 leading-relaxed select-all">
                  {activeExample.aiOutput}
                </div>
              </div>

              {/* AI Evaluation Guidance */}
              <div className="p-3.5 bg-purple-500/10 border border-purple-500/20 rounded-xl text-xs text-purple-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  Evaluation Finding & Reason
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {activeExample.reason}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
