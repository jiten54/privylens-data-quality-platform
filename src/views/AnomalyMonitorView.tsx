import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AnomalyItem } from '../types';
import {
  Activity,
  AlertTriangle,
  Sliders,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  Sparkles,
  Search,
  Filter,
  Check,
  Eye,
} from 'lucide-react';

export const AnomalyMonitorView: React.FC = () => {
  const {
    anomalies,
    acknowledgeAnomaly,
    resolveAnomaly,
    addToast,
    datasets,
    setSelectedDatasetId,
    setActiveTab,
  } = useApp();

  const [confidenceCutoff, setConfidenceCutoff] = useState<number>(85);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredAnomalies = anomalies.filter(a => {
    if (a.confidence < confidenceCutoff) return false;
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (typeFilter !== 'all' && a.type !== typeFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        a.columnName.toLowerCase().includes(q) ||
        a.datasetName.toLowerCase().includes(q) ||
        a.whatChanged.toLowerCase().includes(q) ||
        a.whyUnusual.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div id="anomaly-monitor-view" className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Statistical Anomaly & Drift Monitor</h1>
            <span className="px-2 py-0.5 text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded-md">
              Z-Score & Kolmogorov-Smirnov Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Detect distribution drift, extreme mathematical outliers, negative amounts, and statistical outliers before downstream model consumption.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
            Detected Outliers: <strong className="text-amber-400">{filteredAnomalies.length}</strong>
          </span>
        </div>
      </div>

      {/* Threshold Controller Sliders */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">
          <Sliders className="w-4 h-4 text-cyan-400" /> Statistical Sensitivity Controls
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-semibold">Anomaly Filter Threshold:</span>
              <span className="font-mono font-bold text-cyan-400">{confidenceCutoff}% Confidence</span>
            </div>
            <input
              type="range"
              min="70"
              max="99"
              step="1"
              value={confidenceCutoff}
              onChange={e => setConfidenceCutoff(parseInt(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>70% (Include Edge Suspects)</span>
              <span>85% (Balanced Enterprise)</span>
              <span>99% (High Certainty)</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-slate-300 font-semibold">Active Algorithmic Detectors</div>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-2 py-1 bg-slate-950 border border-slate-800 rounded text-[11px] text-cyan-300 font-mono">
                ✓ Isolation Forest
              </span>
              <span className="px-2 py-1 bg-slate-950 border border-slate-800 rounded text-[11px] text-cyan-300 font-mono">
                ✓ Student's t-test Drift
              </span>
              <span className="px-2 py-1 bg-slate-950 border border-slate-800 rounded text-[11px] text-cyan-300 font-mono">
                ✓ Median Absolute Deviation (MAD)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Scatter / Distribution Plot */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-white">Mathematical Outlier Dispersion Plot</h2>
            <p className="text-xs text-slate-400">Values plotted against standard baseline distribution curve</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span> Expected Mean
            </span>
            <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Flagged Outliers
            </span>
          </div>
        </div>

        <div className="h-44 w-full relative bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 700 140" preserveAspectRatio="none">
            {/* Bell curve baseline */}
            <path
              d="M 20 120 Q 200 120 280 90 T 350 20 T 420 90 Q 500 120 680 120"
              fill="none"
              stroke="#334155"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            {/* Standard Range Box */}
            <rect x="250" y="15" width="200" height="110" fill="#06b6d4" fillOpacity="0.04" />
            <line x1="350" y1="15" x2="350" y2="125" stroke="#06b6d4" strokeWidth="1" strokeOpacity="0.4" />

            {/* Inlier Dots */}
            {[...Array(40)].map((_, i) => {
              const cx = 270 + ((i * 19) % 160);
              const cy = 40 + ((i * 31) % 75);
              return <circle key={i} cx={cx} cy={cy} r="2.5" fill="#64748b" opacity="0.6" />;
            })}

            {/* Outlier Nodes */}
            <circle cx="90" cy="115" r="5" fill="#f59e0b" className="animate-pulse" />
            <text x="75" y="105" fill="#f59e0b" fontSize="10" fontFamily="monospace">-$450 (Invalid Neg)</text>

            <circle cx="630" cy="95" r="6" fill="#f43f5e" className="animate-pulse" />
            <text x="590" y="85" fill="#f43f5e" fontSize="10" fontFamily="monospace">$894,000 (Z: 5.4σ)</text>

            <circle cx="670" cy="110" r="5" fill="#f59e0b" />
            <text x="635" y="125" fill="#f59e0b" fontSize="10" fontFamily="monospace">Age: 142</text>
          </svg>
        </div>
      </div>

      {/* Flagged Anomaly List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Flagged Records for Inspection ({filteredAnomalies.length})
        </h3>

        {filteredAnomalies.map(anomaly => (
          <div
            key={anomaly.id}
            className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {anomaly.type}
                </span>
                <span className="text-sm font-bold text-white">{anomaly.title}</span>
                <span className="text-xs text-slate-500 font-mono">({anomaly.metricDelta})</span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="p-1.5 px-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Column:</span>
                  <span className="ml-2 font-mono font-bold text-cyan-400">{anomaly.columnName}</span>
                </div>

                <div className="p-1.5 px-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Dataset:</span>
                  <span className="ml-2 font-mono text-slate-300">{anomaly.datasetName}</span>
                </div>

                <div className="p-1.5 px-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Confidence:</span>
                  <span className="ml-2 font-mono text-emerald-400 font-bold">{anomaly.confidence}%</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                {anomaly.whatChanged} {anomaly.whyUnusual}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              <button
                onClick={() => resolveAnomaly(anomaly.id)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1 shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark Mitigated</span>
              </button>

              <button
                onClick={() => acknowledgeAnomaly(anomaly.id)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700"
              >
                Acknowledge
              </button>

              <button
                onClick={() => {
                  const ds = datasets.find(d => d.name === anomaly.datasetName);
                  if (ds) setSelectedDatasetId(ds.id);
                  setActiveTab('data-explorer');
                }}
                className="p-2 text-slate-400 hover:text-cyan-300 rounded-xl hover:bg-slate-800"
                title="View in spreadsheet"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
