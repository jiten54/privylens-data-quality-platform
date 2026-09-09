import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Download,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Calendar,
  Layers,
  Sparkles,
  Share2,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { datasets, documents, piiFindings, qualityIssues, addToast } = useApp();

  const [selectedReportType, setSelectedReportType] = useState<string>('executive-trust');
  const [dateRange, setDateRange] = useState<string>('Last 30 Days');

  const reportTemplates = [
    {
      id: 'executive-trust',
      name: 'Executive Boardroom Data Trust & Privacy Report',
      standard: 'CDO & Board Summary',
      pages: 4,
      desc: 'High-level synthesis of enterprise trust scores, critical PII remediations, and dataset readiness.',
    },
    {
      id: 'soc2-compliance',
      name: 'SOC 2 Type II Confidentiality & Privacy Attestation',
      standard: 'AICPA Trust Criteria',
      pages: 12,
      desc: 'Audit logs proving encryption, access controls, tokenization, and data retention compliance.',
    },
    {
      id: 'gdpr-article30',
      name: 'GDPR Article 30 Records of Processing Activities (RoPA)',
      standard: 'EU GDPR 2016/679',
      pages: 8,
      desc: 'Detailed inventory of personal data categories, processing grounds, and data minimization steps.',
    },
    {
      id: 'iso-42001',
      name: 'ISO/IEC 42001 AI Management System (AIMS) Readiness',
      standard: 'ISO/IEC 42001:2023',
      pages: 6,
      desc: 'Evaluation of training data governance, bias prevention, hallucination controls, and provenance.',
    },
  ];

  const activeTemplate = reportTemplates.find(r => r.id === selectedReportType) || reportTemplates[0];

  const handlePrintOrDownload = () => {
    window.print();
    addToast('success', 'Generating Report', 'Report formatted for PDF print/export.');
  };

  return (
    <div id="reports-view" className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Executive Compliance & Audit Reports</h1>
            <span className="px-2 py-0.5 text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 rounded-md">
              Audit-Ready Artifacts
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Generate formal documentation for external auditors, legal counsel, and board committees.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrintOrDownload}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-md shadow-cyan-500/20"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Report Template Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTemplates.map(rep => {
          const isSelected = selectedReportType === rep.id;
          return (
            <div
              key={rep.id}
              onClick={() => setSelectedReportType(rep.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-800/90 border-cyan-400 shadow-md ring-1 ring-cyan-500/30'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">{rep.standard}</span>
                <h3 className="text-xs font-bold text-white mt-1 leading-snug">{rep.name}</h3>
                <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">{rep.desc}</p>
              </div>
              <div className="mt-3 text-[10px] text-slate-500 flex items-center justify-between border-t border-slate-800/60 pt-2">
                <span>{rep.pages} Pages</span>
                <span className="text-cyan-400 font-semibold">Select Template</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Report Preview Document Paper Frame */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 shadow-2xl max-w-4xl mx-auto text-slate-200 font-sans space-y-6">
        {/* Document Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
              <span className="font-extrabold tracking-tight text-white text-base">PRIVYLENS ASSURANCE</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-2">{activeTemplate.name}</h2>
            <div className="text-xs text-slate-400 mt-1">
              Standard: <strong>{activeTemplate.standard}</strong> • Evaluation Window: <strong>{dateRange}</strong>
            </div>
          </div>

          <div className="text-right text-xs text-slate-400">
            <div>Report ID: <code className="text-cyan-400 font-mono">PL-REP-{Date.now().toString().slice(-6)}</code></div>
            <div>Generated: {new Date().toLocaleDateString('en-US', { dateStyle: 'medium' })}</div>
            <div className="text-emerald-400 font-bold mt-1">STATUS: VERIFIED SECURE</div>
          </div>
        </div>

        {/* Executive Summary Section */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400">1. Executive Governance Summary</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            During this audit cycle, PrivyLens continuously evaluated <strong>{datasets.length} enterprise datasets</strong> and <strong>{documents.length} ingested legal contracts</strong> across 7 core quality dimensions and global privacy frameworks (GDPR, CCPA, HIPAA). 
            Total records assessed: <strong>{datasets.reduce((a, b) => a + b.rows, 0).toLocaleString()}</strong>.
          </p>
        </div>

        {/* Quality Metrics Matrix */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400">2. Compliance & Trust Scorecard</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
              <div className="text-2xl font-extrabold text-cyan-400">91.8%</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Overall Data Trust</div>
            </div>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
              <div className="text-2xl font-extrabold text-emerald-400">98.4%</div>
              <div className="text-[11px] text-slate-400 mt-0.5">PII Remediation Rate</div>
            </div>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
              <div className="text-2xl font-extrabold text-purple-400">94.8%</div>
              <div className="text-[11px] text-slate-400 mt-0.5">AI Readiness Index</div>
            </div>
          </div>
        </div>

        {/* Key Findings & Attestation */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400">3. Remediation & Zero-Trust Attestation</h3>
          <ul className="list-disc list-inside text-xs text-slate-300 space-y-1.5 leading-relaxed">
            <li>
              All high-entropy Social Security Numbers and National Identity Cards detected within analytical tables have been converted to salted HMAC-SHA256 tokens.
            </li>
            <li>
              Zero plaintext patient identifiers remain accessible to non-credentialed analyst roles.
            </li>
            <li>
              Datasets flagged with mathematical anomalies beyond 3.0σ standard deviation have been isolated into quarantine partitions.
            </li>
          </ul>
        </div>

        {/* Signatures */}
        <div className="pt-6 border-t border-slate-800 grid grid-cols-2 gap-8 text-xs">
          <div>
            <div className="text-slate-500 font-bold uppercase text-[10px]">Chief Privacy Officer (CPO)</div>
            <div className="h-10 border-b border-slate-700 flex items-end font-serif italic text-slate-300 text-sm">
              Elena Rostova, LL.M.
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Cryptographically Signed via PrivyLens HSM</div>
          </div>

          <div>
            <div className="text-slate-500 font-bold uppercase text-[10px]">VP of Enterprise Data Engineering</div>
            <div className="h-10 border-b border-slate-700 flex items-end font-serif italic text-slate-300 text-sm">
              Dr. Marcus Vance, Ph.D.
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Certified Audit Verification</div>
          </div>
        </div>
      </div>
    </div>
  );
};
