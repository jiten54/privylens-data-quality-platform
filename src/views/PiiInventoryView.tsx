import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Layers,
  Shield,
  Lock,
  Download,
  Search,
  Filter,
  CheckCircle2,
  FileSpreadsheet,
  AlertCircle,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const PiiInventoryView: React.FC = () => {
  const { piiFindings, datasets, addToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');

  const inventoryItems = [
    {
      id: 'INV-01',
      entityName: 'Social Security Number (SSN)',
      category: 'Government Identifier',
      tier: 'Tier 1 - Restricted',
      occurrences: 420,
      datasetsCount: 1,
      retentionPeriod: '7 Years (Mandatory)',
      encryptionState: 'AES-256 (In Flight)',
      regulation: 'HIPAA, GDPR, CCPA',
      primaryOwner: 'People Ops / HR',
      minimizationAdvice: 'Hash with customer-specific salt; do not replicate to data lake.',
    },
    {
      id: 'INV-02',
      entityName: 'Bank Account & IBAN Numbers',
      category: 'Financial PII',
      tier: 'Tier 1 - Restricted',
      occurrences: 1840,
      datasetsCount: 2,
      retentionPeriod: '5 Years (SOX/GLBA)',
      encryptionState: 'Tokenized Vault',
      regulation: 'PCI-DSS, GLBA',
      primaryOwner: 'Treasury & Payments',
      minimizationAdvice: 'Replace with payment provider token before downstream BI analytics.',
    },
    {
      id: 'INV-03',
      entityName: 'Corporate & Customer Email Addresses',
      category: 'Direct Contact Info',
      tier: 'Tier 2 - Confidential',
      occurrences: 32000,
      datasetsCount: 4,
      retentionPeriod: '3 Years Active',
      encryptionState: 'Standard Column Masking',
      regulation: 'GDPR, CAN-SPAM',
      primaryOwner: 'Marketing & Sales Ops',
      minimizationAdvice: 'Apply partial masking (e.g. j***@company.com) for reporting users.',
    },
    {
      id: 'INV-04',
      entityName: 'Passport Numbers & Expiry',
      category: 'Government Identifier',
      tier: 'Tier 1 - Restricted',
      occurrences: 512,
      datasetsCount: 1,
      retentionPeriod: 'Duration of Contract',
      encryptionState: 'AES-GCM-256',
      regulation: 'GDPR Art. 9, AML/KYC',
      primaryOwner: 'Compliance & Legal',
      minimizationAdvice: 'Quarantine immediately from AI training corpora.',
    },
    {
      id: 'INV-05',
      entityName: 'Internal Employee IDs',
      category: 'Internal Identifier',
      tier: 'Tier 3 - Internal',
      occurrences: 14200,
      datasetsCount: 3,
      retentionPeriod: 'Permanent Employment Record',
      encryptionState: 'Cleartext Internal',
      regulation: 'Internal Policy',
      primaryOwner: 'Engineering Infrastructure',
      minimizationAdvice: 'Acceptable for internal operational telemetry.',
    },
    {
      id: 'INV-06',
      entityName: 'Physical Residential Addresses',
      category: 'Geographic Location',
      tier: 'Tier 2 - Confidential',
      occurrences: 8410,
      datasetsCount: 2,
      retentionPeriod: '3 Years Post-Termination',
      encryptionState: 'Coarse-Grained Zip Only',
      regulation: 'CCPA, GDPR',
      primaryOwner: 'Logistics & HR',
      minimizationAdvice: 'Aggregate to State/Postal district for ML feature engineering.',
    },
  ];

  const filteredInventory = inventoryItems.filter(item => {
    if (tierFilter !== 'all' && !item.tier.includes(tierFilter)) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        item.entityName.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.regulation.toLowerCase().includes(q) ||
        item.primaryOwner.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportCatalog = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Entity Name,Category,Tier,Occurrences,Datasets,Retention,Encryption,Regulations,Owner',
        ...inventoryItems.map(
          i =>
            `"${i.entityName}","${i.category}","${i.tier}","${i.occurrences}","${i.datasetsCount}","${i.retentionPeriod}","${i.encryptionState}","${i.regulation}","${i.primaryOwner}"`
        ),
      ].join('\n');
    const encoded = encodeURI(csvContent);
    const a = document.createElement('a');
    a.href = encoded;
    a.download = `PrivyLens_Enterprise_PII_Catalog_${Date.now()}.csv`;
    a.click();
    addToast('success', 'Catalog Exported', 'Enterprise Data Catalog downloaded.');
  };

  return (
    <div id="pii-inventory-view" className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Enterprise PII Inventory & Data Catalog</h1>
            <span className="px-2 py-0.5 text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 rounded-md">
              Data Lineage & Governance
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Centrally cataloged sensitive entities, retention obligations, encryption states, and legal jurisdiction mappings.
          </p>
        </div>

        <button
          onClick={handleExportCatalog}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 transition-colors self-start lg:self-center"
        >
          <Download className="w-4 h-4 text-slate-400" />
          <span>Export Catalog (CSV)</span>
        </button>
      </div>

      {/* Tier Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900 border border-rose-500/30 rounded-2xl">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-rose-300 uppercase tracking-wider text-[11px]">Tier 1 - Restricted</span>
            <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
              <Lock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white">2,772 Instances</div>
          <p className="text-xs text-slate-400 mt-1">
            SSNs, Passports, Bank Accounts. Prohibited in AI training corpora without explicit cryptohash.
          </p>
        </div>

        <div className="p-4 bg-slate-900 border border-amber-500/30 rounded-2xl">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">Tier 2 - Confidential</span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Shield className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white">40,410 Instances</div>
          <p className="text-xs text-slate-400 mt-1">
            Personal Emails, Home Addresses, Phone Numbers. Masked for operational BI users.
          </p>
        </div>

        <div className="p-4 bg-slate-900 border border-cyan-500/30 rounded-2xl">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-cyan-300 uppercase tracking-wider text-[11px]">Tier 3 - Internal</span>
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white">14,200 Instances</div>
          <p className="text-xs text-slate-400 mt-1">
            Employee Badge IDs, Department Tags, Internal Roles. Controlled internal access only.
          </p>
        </div>
      </div>

      {/* Catalog Search & Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm space-y-4 p-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full sm:w-80">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search catalog by entity, regulation, or owner..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setTierFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                tierFilter === 'all' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              All Tiers
            </button>
            <button
              onClick={() => setTierFilter('Tier 1')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                tierFilter === 'Tier 1' ? 'bg-rose-500/20 text-rose-300' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              Tier 1
            </button>
            <button
              onClick={() => setTierFilter('Tier 2')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                tierFilter === 'Tier 2' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              Tier 2
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                <th className="p-3 font-semibold uppercase tracking-wider text-[10px]">Entity Type</th>
                <th className="p-3 font-semibold uppercase tracking-wider text-[10px]">Tier</th>
                <th className="p-3 font-semibold uppercase tracking-wider text-[10px]">Count</th>
                <th className="p-3 font-semibold uppercase tracking-wider text-[10px]">Retention SLA</th>
                <th className="p-3 font-semibold uppercase tracking-wider text-[10px]">Encryption State</th>
                <th className="p-3 font-semibold uppercase tracking-wider text-[10px]">Regulations</th>
                <th className="p-3 font-semibold uppercase tracking-wider text-[10px]">Minimization Guidance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {filteredInventory.map(item => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-sans font-bold text-white">
                    <div>{item.entityName}</div>
                    <span className="text-[10px] text-slate-500 font-normal">{item.category}</span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.tier.includes('Tier 1')
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : item.tier.includes('Tier 2')
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      }`}
                    >
                      {item.tier}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-slate-200">{item.occurrences.toLocaleString()}</td>
                  <td className="p-3 text-slate-400 font-sans text-xs">{item.retentionPeriod}</td>
                  <td className="p-3 text-emerald-400 font-semibold">{item.encryptionState}</td>
                  <td className="p-3 text-slate-300 font-sans text-xs">{item.regulation}</td>
                  <td className="p-3 text-slate-400 font-sans text-xs max-w-xs">{item.minimizationAdvice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
