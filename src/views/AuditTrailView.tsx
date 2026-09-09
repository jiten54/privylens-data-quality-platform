import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AuditEvent } from '../types';
import {
  Clock,
  Download,
  Search,
} from 'lucide-react';

export const AuditTrailView: React.FC = () => {
  const { auditTrail, addToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [targetTypeFilter, setTargetTypeFilter] = useState('all');

  const filteredLogs = auditTrail.filter(log => {
    if (roleFilter !== 'all' && log.userRole !== roleFilter) return false;
    if (targetTypeFilter !== 'all' && log.targetType !== targetTypeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.user.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.targetName.toLowerCase().includes(q) ||
        log.reason.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportLogs = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Timestamp,User,Role,Action,TargetType,TargetName,PreviousValue,NewValue,Reason',
        ...filteredLogs.map(
          l =>
            `"${l.timestamp}","${l.user}","${l.userRole}","${l.action}","${l.targetType}","${l.targetName}","${l.previousValue}","${l.newValue}","${l.reason}"`
        ),
      ].join('\n');
    const encoded = encodeURI(csvContent);
    const a = document.createElement('a');
    a.href = encoded;
    a.download = `PrivyLens_Immutable_Audit_Trail_${Date.now()}.csv`;
    a.click();
    addToast('success', 'Audit Exported', 'Downloaded complete immutable audit trail.');
  };

  return (
    <div id="audit-trail-view" className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Immutable Audit Trail & Forensics</h1>
            <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-md">
              WORM Compliant (Write Once, Read Many)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tamper-proof event journal tracking every redaction, rule modification, permission change, and dataset export.
          </p>
        </div>

        <button
          onClick={handleExportLogs}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 transition-colors"
        >
          <Download className="w-4 h-4 text-slate-400" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search audit actions, users, targets, or reasons..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs flex-wrap">
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 text-xs outline-none"
          >
            <option value="all">All Roles</option>
            <option value="Chief Data Officer">Chief Data Officer</option>
            <option value="Privacy Officer">Privacy Officer</option>
            <option value="Lead Data Analyst">Lead Data Analyst</option>
            <option value="Compliance Auditor">Compliance Auditor</option>
          </select>

          <select
            value={targetTypeFilter}
            onChange={e => setTargetTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 text-xs outline-none"
          >
            <option value="all">All Target Types</option>
            <option value="Dataset">Dataset</option>
            <option value="Document">Document</option>
            <option value="PII">PII</option>
            <option value="Quality Issue">Quality Issue</option>
            <option value="Rule">Rule</option>
            <option value="System">System</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400">
                <th className="p-3.5 font-semibold uppercase tracking-wider text-[10px]">Timestamp</th>
                <th className="p-3.5 font-semibold uppercase tracking-wider text-[10px]">Actor & Role</th>
                <th className="p-3.5 font-semibold uppercase tracking-wider text-[10px]">Action Performed</th>
                <th className="p-3.5 font-semibold uppercase tracking-wider text-[10px]">Target Resource</th>
                <th className="p-3.5 font-semibold uppercase tracking-wider text-[10px]">Type</th>
                <th className="p-3.5 font-semibold uppercase tracking-wider text-[10px]">Delta (Prev → Next)</th>
                <th className="p-3.5 font-semibold uppercase tracking-wider text-[10px]">Reason & Context</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                  <td className="p-3.5 font-sans">
                    <div className="font-bold text-white">{log.user}</div>
                    <span className="text-[10px] text-slate-500 font-mono">{log.userRole}</span>
                  </td>
                  <td className="p-3.5 text-cyan-300 font-semibold">{log.action}</td>
                  <td className="p-3.5 text-slate-200 font-sans font-medium">{log.targetName}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {log.targetType}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-400">
                    <span className="text-rose-400">{log.previousValue || 'none'}</span>
                    <span className="text-slate-600 mx-1.5">→</span>
                    <span className="text-emerald-400 font-bold">{log.newValue}</span>
                  </td>
                  <td className="p-3.5 font-sans text-xs text-slate-400 max-w-xs">{log.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
