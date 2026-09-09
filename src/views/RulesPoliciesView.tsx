import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QARule } from '../types';
import {
  Sliders,
  Plus,
  Search,
} from 'lucide-react';

export const RulesPoliciesView: React.FC = () => {
  const { qaRules, toggleQARule, createQARule, addToast } = useApp();

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddRuleModalOpen, setIsAddRuleModalOpen] = useState(false);

  // New Rule Form State
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleCategory, setNewRuleCategory] = useState<'Data Quality' | 'PII' | 'Privacy' | 'Security' | 'Compliance' | 'AI Evaluation'>('Data Quality');
  const [newRuleSeverity, setNewRuleSeverity] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [newRuleCondition, setNewRuleCondition] = useState('');
  const [newRuleTarget, setNewRuleTarget] = useState('All Customer Datasets');

  const filteredRules = qaRules.filter(r => {
    if (categoryFilter !== 'all' && r.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.condition.toLowerCase().includes(q) ||
        r.targetDataset.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName.trim()) return;

    createQARule({
      name: newRuleName,
      category: newRuleCategory,
      severity: newRuleSeverity,
      condition: newRuleCondition,
      targetDataset: newRuleTarget,
    });

    addToast('success', 'Policy Enforced', `Rule "${newRuleName}" deployed to ingestion pipelines.`);
    setIsAddRuleModalOpen(false);
    setNewRuleName('');
    setNewRuleCondition('');
  };

  return (
    <div id="rules-policies-view" className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Governance Policies & QA Rule Engine</h1>
            <span className="px-2 py-0.5 text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 rounded-md">
              Runtime Enforcement
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure automated validation thresholds, mandatory PII masking expressions, and ETL quarantine triggers.
          </p>
        </div>

        <button
          onClick={() => setIsAddRuleModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-md shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Create Policy Rule</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search active policy rules..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs flex-wrap">
          {(['all', 'Data Quality', 'PII', 'Privacy', 'Compliance', 'AI Evaluation'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                categoryFilter === cat
                  ? 'bg-cyan-500/20 text-cyan-300'
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              {cat === 'all' ? 'All Rules' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Rule Cards */}
      <div className="space-y-3">
        {filteredRules.map(rule => (
          <div
            key={rule.id}
            className={`p-4 bg-slate-900 border rounded-2xl transition-all ${
              rule.isEnabled ? 'border-slate-800' : 'border-slate-800/40 opacity-60'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                      rule.severity === 'CRITICAL'
                        ? 'bg-rose-500 text-white'
                        : rule.severity === 'HIGH'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-blue-500 text-white'
                    }`}
                  >
                    {rule.severity}
                  </span>
                  <span className="text-xs font-bold text-cyan-400 font-mono">[{rule.category}]</span>
                  <h3 className="text-sm font-bold text-white">{rule.name}</h3>
                </div>

                <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs">
                  <span className="text-slate-500 text-[10px] font-bold uppercase">Trigger Condition:</span>
                  <div className="font-mono text-xs text-slate-300 mt-0.5">{rule.condition}</div>
                </div>

                <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-3 pt-1">
                  <span>Enforced on: <strong className="text-slate-300">{rule.targetDataset}</strong></span>
                  <span>•</span>
                  <span>Pass Rate: <strong className="text-emerald-400">{rule.passRate}%</strong></span>
                  <span>•</span>
                  <span>Violations intercepted: <strong className="text-rose-400">{rule.failedCount.toLocaleString()}</strong></span>
                  <span>•</span>
                  <span>Author: <span className="text-slate-400">{rule.author}</span></span>
                </div>
              </div>

              {/* Toggle switch */}
              <div className="flex items-center gap-3 shrink-0 self-end lg:self-center">
                <button
                  onClick={() => toggleQARule(rule.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    rule.isEnabled
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {rule.isEnabled ? 'Enforced (Active)' : 'Disabled'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Rule Modal Dialog */}
      {isAddRuleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6">
            <h3 className="text-base font-bold text-white mb-1">Define Governance Rule</h3>
            <p className="text-xs text-slate-400 mb-4">
              Deploy automated continuous quality or privacy validation checks across incoming datasets.
            </p>

            <form onSubmit={handleAddRule} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Rule Name</label>
                <input
                  type="text"
                  required
                  value={newRuleName}
                  onChange={e => setNewRuleName(e.target.value)}
                  placeholder="e.g. Reject Null ISO Country Codes"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Category</label>
                  <select
                    value={newRuleCategory}
                    onChange={e => setNewRuleCategory(e.target.value as any)}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none"
                  >
                    <option value="Data Quality">Data Quality</option>
                    <option value="PII">PII</option>
                    <option value="Privacy">Privacy</option>
                    <option value="Compliance">Compliance</option>
                    <option value="AI Evaluation">AI Evaluation</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Severity</label>
                  <select
                    value={newRuleSeverity}
                    onChange={e => setNewRuleSeverity(e.target.value as any)}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Target Dataset</label>
                <input
                  type="text"
                  required
                  value={newRuleTarget}
                  onChange={e => setNewRuleTarget(e.target.value)}
                  placeholder="e.g. customer_kyc_master.parquet"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Trigger Condition (Logic / Regex)</label>
                <input
                  type="text"
                  required
                  value={newRuleCondition}
                  onChange={e => setNewRuleCondition(e.target.value)}
                  placeholder="e.g. country_code NOT IN ('US','GB','DE','CA')"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-cyan-300 outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddRuleModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl"
                >
                  Deploy Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
