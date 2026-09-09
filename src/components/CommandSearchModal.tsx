import React, { useState, useEffect, useRef } from 'react';
import { useApp, NavigationTab } from '../context/AppContext';
import {
  Search,
  Database,
  FileText,
  ShieldAlert,
  CheckCircle2,
  Sliders,
  History,
  X,
  ArrowRight,
} from 'lucide-react';

interface SearchResultItem {
  id: string;
  category: 'Dataset' | 'Document' | 'PII Finding' | 'Quality Issue' | 'Rule' | 'Audit Event';
  title: string;
  subtitle: string;
  tab: NavigationTab;
  meta?: string;
  badge?: string;
  badgeColor?: string;
}

export const CommandSearchModal: React.FC = () => {
  const {
    isCommandSearchOpen,
    setIsCommandSearchOpen,
    setActiveTab,
    setSelectedDatasetId,
    setSelectedDocumentId,
    datasets,
    documents,
    piiFindings,
    qualityIssues,
    qaRules,
    auditTrail,
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandSearchOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandSearchOpen]);

  if (!isCommandSearchOpen) return null;

  // Aggregate searchable items
  const allItems: SearchResultItem[] = [
    ...datasets.map(d => ({
      id: d.id,
      category: 'Dataset' as const,
      title: d.name,
      subtitle: `${d.rows.toLocaleString()} rows • ${d.format} • Score: ${d.qualityScore}%`,
      tab: 'data-explorer' as NavigationTab,
      meta: d.department,
      badge: `${d.piiCount} PII`,
      badgeColor: 'bg-rose-500/20 text-rose-300',
    })),
    ...documents.map(doc => ({
      id: doc.id,
      category: 'Document' as const,
      title: doc.title,
      subtitle: `${doc.format} • ${doc.fileSize} • Status: ${doc.status}`,
      tab: 'document-review' as NavigationTab,
      meta: doc.department,
      badge: `${doc.piiCount} Entities`,
      badgeColor: 'bg-amber-500/20 text-amber-300',
    })),
    ...piiFindings.map(pii => ({
      id: pii.id,
      category: 'PII Finding' as const,
      title: `${pii.piiType}: ${pii.sampleValue}`,
      subtitle: `${pii.source} • Confidence: ${pii.confidence}% • Status: ${pii.status}`,
      tab: 'privacy-scanner' as NavigationTab,
      meta: pii.severity,
      badge: pii.severity,
      badgeColor: pii.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300',
    })),
    ...qualityIssues.map(issue => ({
      id: issue.id,
      category: 'Quality Issue' as const,
      title: `${issue.id}: ${issue.issueType}`,
      subtitle: `${issue.datasetName} • Dimension: ${issue.dimension} • Status: ${issue.status}`,
      tab: 'quality-center' as NavigationTab,
      meta: issue.severity,
      badge: issue.status,
      badgeColor: issue.status === 'Open' ? 'bg-blue-500/20 text-blue-300' : 'bg-emerald-500/20 text-emerald-300',
    })),
    ...qaRules.map(rule => ({
      id: rule.id,
      category: 'Rule' as const,
      title: `${rule.id}: ${rule.name}`,
      subtitle: `Target: ${rule.targetDataset} • Pass Rate: ${rule.passRate}%`,
      tab: 'rules-policies' as NavigationTab,
      meta: rule.category,
      badge: rule.isEnabled ? 'Active' : 'Disabled',
      badgeColor: rule.isEnabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-300',
    })),
    ...auditTrail.map(aud => ({
      id: aud.id,
      category: 'Audit Event' as const,
      title: `${aud.user}: ${aud.action}`,
      subtitle: `${aud.targetName} • ${aud.timestamp}`,
      tab: 'audit-trail' as NavigationTab,
      meta: aud.userRole,
    })),
  ];

  const filtered = query.trim()
    ? allItems.filter(
        item =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase()) ||
          (item.meta && item.meta.toLowerCase().includes(query.toLowerCase()))
      )
    : allItems.slice(0, 8);

  const handleSelect = (item: SearchResultItem) => {
    if (item.category === 'Dataset') {
      setSelectedDatasetId(item.id);
    } else if (item.category === 'Document') {
      setSelectedDocumentId(item.id);
    }
    setActiveTab(item.tab);
    setIsCommandSearchOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      handleSelect(filtered[selectedIndex]);
    }
  };

  const getCategoryIcon = (category: SearchResultItem['category']) => {
    switch (category) {
      case 'Dataset':
        return Database;
      case 'Document':
        return FileText;
      case 'PII Finding':
        return ShieldAlert;
      case 'Quality Issue':
        return CheckCircle2;
      case 'Rule':
        return Sliders;
      case 'Audit Event':
        return History;
      default:
        return Search;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/60">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search all datasets, documents, PII entities, QA rules, audit logs..."
            className="flex-1 bg-transparent border-none outline-none text-slate-100 placeholder-slate-500 text-sm"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-mono text-slate-400 bg-slate-800 border border-slate-700 rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              <Search className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
              <p>No results found matching "{query}"</p>
              <p className="text-xs text-slate-500 mt-1">
                Try searching for "SSN", "Customer", "employee", "anomalies", or "rules"
              </p>
            </div>
          ) : (
            filtered.map((item, index) => {
              const Icon = getCategoryIcon(item.category);
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={`${item.category}-${item.id}-${index}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between gap-3 transition-colors ${
                    isSelected
                      ? 'bg-cyan-500/15 border border-cyan-500/30 text-white'
                      : 'hover:bg-slate-800/60 text-slate-300 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-cyan-500/30 text-cyan-300' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-200 truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    <ArrowRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600'
                      }`}
                    />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">
                ↑
              </kbd>{' '}
              <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">
                ↓
              </kbd>{' '}
              to navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">
                ↵
              </kbd>{' '}
              to select
            </span>
          </div>
          <span className="text-slate-500">Quick Global Index (100% Realtime)</span>
        </div>
      </div>
    </div>
  );
};
