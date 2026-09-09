import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PIIFinding, PIIType, Severity } from '../types';
import {
  ShieldAlert,
  Lock,
  Download,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Check,
  X,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const PrivacyScannerView: React.FC = () => {
  const {
    piiFindings,
    maskPIIFinding,
    maskAllPII,
    updatePIIStatus,
    addToast,
    datasets,
    setActiveTab,
    setSelectedDatasetId,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [inspectFinding, setInspectFinding] = useState<PIIFinding | null>(null);

  const piiTypes: PIIType[] = [
    'Government ID',
    'Passport Number',
    'Social Security Number',
    'Credit Card Number',
    'Bank Account / IBAN',
    'Email Address',
    'Phone Number',
    'Physical Address',
    'Full Name',
    'Date of Birth',
    'IP Address',
    'Employee ID',
    'Health / Medical Record',
    'Salary / Financial Identifier',
  ];

  const filteredFindings = piiFindings.filter(item => {
    if (selectedSeverity !== 'all' && item.severity !== selectedSeverity) return false;
    if (selectedType !== 'all' && item.piiType !== selectedType) return false;
    if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.piiType.toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.sampleValue.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const unmaskedCount = piiFindings.filter(p => !p.isMasked && p.status === 'Unresolved').length;
  const criticalCount = piiFindings.filter(p => p.severity === 'CRITICAL' && !p.isMasked).length;

  const handleExportFindings = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'ID,PII Type,Severity,Confidence,Source,Location,Status,Department,Recommendation',
        ...filteredFindings.map(
          f =>
            `"${f.id}","${f.piiType}","${f.severity}","${f.confidence}%","${f.source}","${f.location}","${f.status}","${f.department}","${f.recommendedAction}"`
        ),
      ].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encodedUri;
    link.download = `PrivyLens_PII_Audit_Findings_${Date.now()}.csv`;
    link.click();
    addToast('success', 'Exported', 'PII inventory and risk findings exported to CSV.');
  };

  return (
    <div id="privacy-scanner-view" className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Privacy Scanner & PII Defense Center</h1>
            <span className="px-2 py-0.5 text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 rounded-md">
              Zero-Trust Masking Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated discovery of Government IDs, Passports, Bank Accounts, IP addresses, and Health records across structured and unstructured pipelines.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {unmaskedCount > 0 && (
            <button
              onClick={() => maskAllPII()}
              className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition-colors shadow-lg shadow-rose-600/20"
            >
              <Lock className="w-4 h-4" />
              <span>Mask All Unresolved ({unmaskedCount})</span>
            </button>
          )}

          <button
            onClick={handleExportFindings}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>Export Findings</span>
          </button>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[10px] uppercase font-bold text-slate-400">Total Scanned Entities</div>
          <div className="text-2xl font-extrabold text-white mt-1">{piiFindings.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Across 5 enterprise data sources</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[10px] uppercase font-bold text-slate-400">Critical High Risk</div>
          <div className="text-2xl font-extrabold text-rose-400 mt-1">{criticalCount}</div>
          <div className="text-[11px] text-rose-400/80 mt-1">Government IDs & Bank Accounts</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[10px] uppercase font-bold text-slate-400">Cryptographically Masked</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">
            {piiFindings.filter(p => p.isMasked).length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">HMAC-SHA256 Tokenized</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[10px] uppercase font-bold text-slate-400">Average Confidence</div>
          <div className="text-2xl font-extrabold text-cyan-400 mt-1">98.1%</div>
          <div className="text-[11px] text-slate-400 mt-1">Regex & NER Ensemble</div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative flex-1 w-full md:w-auto">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search PII by entity type, dataset name, location..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Severity filter */}
          <select
            value={selectedSeverity}
            onChange={e => setSelectedSeverity(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 text-xs outline-none"
          >
            <option value="all">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 text-xs outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Unresolved">Unresolved</option>
            <option value="Masked">Masked</option>
            <option value="Verified">Verified</option>
            <option value="Ignored">Ignored</option>
          </select>

          <span className="text-slate-500 text-[11px]">
            {filteredFindings.length} findings
          </span>
        </div>
      </div>

      {/* Findings Cards / Table Grid */}
      <div className="space-y-3">
        {filteredFindings.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-2xl">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
            <p className="text-sm font-semibold text-slate-200">No matching PII findings</p>
            <p className="text-xs text-slate-500 mt-1">All sensitive records under selected criteria are protected.</p>
          </div>
        ) : (
          filteredFindings.map(finding => {
            const isCritical = finding.severity === 'CRITICAL';
            const isHigh = finding.severity === 'HIGH';

            return (
              <div
                key={finding.id}
                className={`p-4 bg-slate-900 border rounded-2xl transition-all ${
                  finding.isMasked
                    ? 'border-slate-800 opacity-90'
                    : isCritical
                    ? 'border-rose-500/40 bg-gradient-to-r from-rose-950/20 to-slate-900'
                    : isHigh
                    ? 'border-amber-500/40'
                    : 'border-slate-800'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Info Header */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                          isCritical
                            ? 'bg-rose-500 text-white'
                            : isHigh
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-blue-500 text-white'
                        }`}
                      >
                        {finding.severity}
                      </span>
                      <h3 className="text-sm font-bold text-white truncate">{finding.piiType}</h3>
                      <span className="text-[11px] font-mono text-cyan-400">
                        Confidence: {finding.confidence}%
                      </span>
                      <span className="text-[10px] text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {finding.department}
                      </span>
                    </div>

                    {/* Source & Location */}
                    <div className="text-xs text-slate-400 flex flex-wrap items-center gap-2">
                      <span>Source: <strong className="text-slate-200">{finding.source}</strong></span>
                      <span className="text-slate-600">•</span>
                      <span>Location: <code className="text-cyan-300 font-mono text-[11px]">{finding.location}</code></span>
                    </div>

                    {/* Value Sample & Mask preview */}
                    <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-2 max-w-xl">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-500">Value State:</span>
                        <div className="font-mono text-xs text-slate-200 mt-0.5">
                          {finding.isMasked ? (
                            <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                              <Lock className="w-3.5 h-3.5 text-emerald-400" />
                              {finding.maskedValue} (Cryptographically Masked)
                            </span>
                          ) : (
                            <span className="text-rose-300 font-bold select-all">{finding.sampleValue}</span>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0">{finding.detectedAt}</span>
                    </div>

                    {/* Recommendation note */}
                    <div className="text-xs text-slate-300 flex items-start gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{finding.recommendedAction}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                    {!finding.isMasked ? (
                      <button
                        onClick={() => maskPIIFinding(finding.id)}
                        className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-md shadow-rose-600/20"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Mask Field</span>
                      </button>
                    ) : (
                      <span className="px-3 py-1.5 bg-slate-800 text-emerald-400 font-semibold text-xs rounded-xl border border-emerald-500/30 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" /> Masked & Safe
                      </span>
                    )}

                    <button
                      onClick={() => updatePIIStatus(finding.id, 'Verified')}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
                    >
                      Verify
                    </button>

                    <button
                      onClick={() => updatePIIStatus(finding.id, 'Ignored')}
                      className="px-2.5 py-2 text-slate-400 hover:text-slate-200 text-xs rounded-xl hover:bg-slate-800"
                    >
                      Ignore
                    </button>

                    <button
                      onClick={() => {
                        setSelectedDatasetId(finding.datasetId);
                        setActiveTab('data-explorer');
                      }}
                      className="p-2 text-slate-400 hover:text-cyan-300 rounded-xl hover:bg-slate-800"
                      title="Inspect dataset row in Data Explorer"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
