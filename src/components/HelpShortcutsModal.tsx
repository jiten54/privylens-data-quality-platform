import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Keyboard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Cpu,
  FileCheck,
} from 'lucide-react';

export const HelpShortcutsModal: React.FC = () => {
  const { isHelpModalOpen, setIsHelpModalOpen } = useApp();

  if (!isHelpModalOpen) return null;

  const shortcuts = [
    { keys: ['⌘', 'K'], desc: 'Open Global Command Search across all resources' },
    { keys: ['ESC'], desc: 'Dismiss active modal, search palette, or alert drawer' },
    { keys: ['Tab'], desc: 'Cycle focus across tables, data columns, and action items' },
    { keys: ['Space'], desc: 'Toggle redaction on highlighted document entity' },
  ];

  const qualityDimensions = [
    { name: 'Accuracy', desc: 'Values agree with verified ground truth, valid currencies, and ranges.' },
    { name: 'Completeness', desc: 'No missing mandatory fields, null spikes, or omitted region codes.' },
    { name: 'Consistency', desc: 'No conflicting definitions across merged CRM or billing pipelines.' },
    { name: 'Validity', desc: 'Strict syntax adherence (RFC 5322 email, ISO 3166 countries, SSN format).' },
    { name: 'Uniqueness', desc: 'Zero unapproved duplicate primary keys or multiple customer identity cards.' },
    { name: 'Relevance', desc: 'Features strictly necessary for business purpose & AI training alignment.' },
    { name: 'Timeliness', desc: 'Transactions and events ingested within strict freshness SLA windows.' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">PrivyLens Enterprise Knowledge & Architecture</h2>
              <p className="text-xs text-slate-400">Governance standards, quality dimensions & shortcuts</p>
            </div>
          </div>
          <button
            onClick={() => setIsHelpModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar text-xs">
          {/* Section: Platform Capabilities */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4" /> Core Platform Capabilities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl">
                <div className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  Data Quality Assurance
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Automated profiling, anomaly detection, statistical distribution analysis, and custom validation rules across Parquet, CSV, and SQL.
                </p>
              </div>

              <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl">
                <div className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-rose-400" />
                  Privacy & PII Discovery
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Deep scanning for Government IDs, SSNs, Passports, IBANs, and health data with one-click HMAC tokenization and redaction.
                </p>
              </div>

              <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl">
                <div className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                  AI Dataset Evaluation
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Human-in-the-loop review queues, hallucination detection, ground-truth calibration, and privacy leakage filters for LLM training.
                </p>
              </div>
            </div>
          </div>

          {/* Section: 7 Quality Dimensions */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> The 7 Enterprise Quality Dimensions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {qualityDimensions.map(dim => (
                <div
                  key={dim.name}
                  className="p-2.5 bg-slate-950/50 border border-slate-800 rounded-lg flex items-start gap-2.5"
                >
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shrink-0">
                    {dim.name}
                  </span>
                  <p className="text-slate-400 text-[11px] leading-snug">{dim.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Keyboard Shortcuts */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-2">
              <Keyboard className="w-4 h-4" /> Keyboard Shortcuts
            </h3>
            <div className="space-y-1.5">
              {shortcuts.map(sc => (
                <div
                  key={sc.desc}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-800/40 border border-slate-800"
                >
                  <span className="text-slate-300 text-xs">{sc.desc}</span>
                  <div className="flex items-center gap-1">
                    {sc.keys.map(k => (
                      <kbd
                        key={k}
                        className="px-2 py-1 text-xs font-mono font-semibold bg-slate-900 border border-slate-700 text-cyan-300 rounded shadow-sm"
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>PrivyLens Compliance Engine v2.6 • SOC 2 Type II / ISO 42001 / GDPR Ready</span>
          <button
            onClick={() => setIsHelpModalOpen(false)}
            className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
