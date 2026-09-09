import React from 'react';
import { useApp, NavigationTab } from '../context/AppContext';
import {
  LayoutDashboard,
  Database,
  FileText,
  ShieldAlert,
  FolderLock,
  CheckCircle2,
  Activity,
  Cpu,
  FileSpreadsheet,
  History,
  Sliders,
  Network,
  Settings,
  ShieldCheck,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeColor?: string;
  group?: string;
}

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentWorkspace,
    setCurrentWorkspace,
    workspaces,
    currentUser,
    piiFindings,
    qualityIssues,
    anomalies,
    aiExamples,
    documents,
  } = useApp();

  const [workspaceMenuOpen, setWorkspaceMenuOpen] = React.useState(false);

  const unmaskedPiiCount = piiFindings.filter(p => !p.isMasked && p.status === 'Unresolved').length;
  const openQualityIssuesCount = qualityIssues.filter(q => q.status === 'Open' || q.status === 'Investigating').length;
  const pendingDocsCount = documents.filter(d => d.status === 'In Review' || d.status === 'Pending Review').length;
  const pendingAICount = aiExamples.filter(a => a.reviewerDecision === 'Pending' || a.reviewerDecision === 'Needs Correction').length;
  const activeAnomaliesCount = anomalies.filter(a => a.status === 'Detected' || a.status === 'Investigating').length;

  const navItems: NavItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      group: 'Core',
    },
    {
      id: 'data-explorer',
      label: 'Data Explorer',
      icon: Database,
      group: 'Core',
    },
    {
      id: 'document-review',
      label: 'Document Review',
      icon: FileText,
      badge: pendingDocsCount > 0 ? pendingDocsCount : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      group: 'Core',
    },
    {
      id: 'privacy-scanner',
      label: 'Privacy Scanner',
      icon: ShieldAlert,
      badge: unmaskedPiiCount > 0 ? unmaskedPiiCount : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      group: 'Privacy & Security',
    },
    {
      id: 'pii-inventory',
      label: 'PII Inventory',
      icon: FolderLock,
      group: 'Privacy & Security',
    },
    {
      id: 'quality-center',
      label: 'Quality Center',
      icon: CheckCircle2,
      badge: openQualityIssuesCount > 0 ? openQualityIssuesCount : undefined,
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      group: 'Quality Assurance',
    },
    {
      id: 'anomaly-monitor',
      label: 'Anomaly Monitor',
      icon: Activity,
      badge: activeAnomaliesCount > 0 ? activeAnomaliesCount : undefined,
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      group: 'Quality Assurance',
    },
    {
      id: 'ai-evaluation',
      label: 'AI Evaluation',
      icon: Cpu,
      badge: pendingAICount > 0 ? pendingAICount : undefined,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      group: 'AI Governance',
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileSpreadsheet,
      group: 'Governance & Auditing',
    },
    {
      id: 'audit-trail',
      label: 'Audit Trail',
      icon: History,
      group: 'Governance & Auditing',
    },
    {
      id: 'rules-policies',
      label: 'Rules & Policies',
      icon: Sliders,
      group: 'Management',
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: Network,
      group: 'Management',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      group: 'Management',
    },
  ];

  return (
    <aside
      id="app-sidebar"
      className="w-64 bg-slate-900/95 dark:bg-slate-950 border-r border-slate-800/80 flex flex-col h-screen shrink-0 select-none backdrop-blur-md transition-colors duration-200"
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400/40">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-tight text-white text-base">PrivyLens</span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded">
                  v2.6
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">Data Quality & Privacy</p>
            </div>
          </div>
        </div>

        {/* Workspace Selector */}
        <div className="mt-3 relative">
          <button
            id="workspace-selector-btn"
            onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
            className="w-full flex items-center justify-between px-2.5 py-1.5 bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white rounded-md border border-slate-700/60 text-xs transition-colors"
          >
            <div className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="truncate font-medium">{currentWorkspace}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {workspaceMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50 p-1 py-1.5 space-y-0.5">
              <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Switch Organization
              </div>
              {workspaces.map(ws => (
                <button
                  key={ws}
                  onClick={() => {
                    setCurrentWorkspace(ws);
                    setWorkspaceMenuOpen(false);
                  }}
                  className={`w-full text-left px-2 py-1.5 text-xs rounded flex items-center justify-between ${
                    ws === currentWorkspace
                      ? 'bg-cyan-500/15 text-cyan-300 font-medium'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="truncate">{ws}</span>
                  {ws === currentWorkspace && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1 custom-scrollbar">
        {navItems.map((item, idx) => {
          const isActive = activeTab === item.id;
          const showGroup = idx === 0 || item.group !== navItems[idx - 1].group;

          return (
            <React.Fragment key={item.id}>
              {showGroup && item.group && (
                <div className="px-2.5 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {item.group}
                </div>
              )}
              <button
                id={`nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <item.icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded border ${
                      item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            </React.Fragment>
          );
        })}
      </nav>

      {/* Footer / User Profile & Compliance Status */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Guardrails:</span>
          </div>
          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded">
            Enforced
          </span>
        </div>

        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-slate-200 truncate">{currentUser.name}</div>
            <div className="text-[10px] text-cyan-400 font-medium truncate">{currentUser.role}</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
