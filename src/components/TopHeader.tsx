import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  Search,
  Bell,
  HelpCircle,
  Sun,
  Moon,
  ShieldAlert,
  ChevronRight,
  UserCheck,
  Check,
} from 'lucide-react';

export const TopHeader: React.FC = () => {
  const {
    activeTab,
    currentUser,
    setUserRole,
    theme,
    toggleTheme,
    setIsCommandSearchOpen,
    isNotificationsDrawerOpen,
    setIsNotificationsDrawerOpen,
    setIsHelpModalOpen,
    notifications,
    maskAllPII,
    piiFindings,
  } = useApp();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const unmaskedPiiCount = piiFindings.filter(p => !p.isMasked && p.status === 'Unresolved').length;

  const roles: UserRole[] = ['Admin', 'Data Analyst', 'Privacy Officer', 'Reviewer', 'Manager'];

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'overview':
        return 'Executive Command Center';
      case 'data-explorer':
        return 'Data Explorer & Profiling';
      case 'document-review':
        return 'Document Review & Redaction';
      case 'privacy-scanner':
        return 'Privacy Scanner & Detection';
      case 'pii-inventory':
        return 'Enterprise PII Inventory';
      case 'quality-center':
        return 'Quality Center & QA Rules';
      case 'anomaly-monitor':
        return 'Anomaly Monitor & Drift Detection';
      case 'ai-evaluation':
        return 'AI Training Data Evaluation';
      case 'reports':
        return 'Stakeholder Reports & Audits';
      case 'audit-trail':
        return 'Cryptographic Audit Trail';
      case 'rules-policies':
        return 'Rules & Compliance Policies';
      case 'integrations':
        return 'Enterprise Integrations';
      case 'settings':
        return 'Workspace & RBAC Settings';
      default:
        return 'Overview';
    }
  };

  return (
    <header
      id="top-header"
      className="h-14 bg-slate-900/90 dark:bg-slate-950/90 border-b border-slate-800/80 px-4 flex items-center justify-between gap-4 backdrop-blur-md sticky top-0 z-30 select-none"
    >
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs min-w-0">
        <span className="text-slate-400 font-medium">PrivyLens</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-slate-200 font-semibold truncate">{getBreadcrumbTitle()}</span>
        <span className="hidden md:inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700/60">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          Cluster: US-East-1 (Prod)
        </span>
      </div>

      {/* Center: Global Search Bar */}
      <div className="flex-1 max-w-md hidden sm:block">
        <button
          id="global-search-trigger-btn"
          onClick={() => setIsCommandSearchOpen(true)}
          className="w-full flex items-center justify-between px-3 py-1.5 bg-slate-800/60 hover:bg-slate-800/90 text-slate-400 hover:text-slate-200 rounded-lg border border-slate-700/60 text-xs transition-all shadow-inner group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            <span>Search datasets, documents, PII findings, rules...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-900 border border-slate-700 text-slate-400 rounded">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Quick Mask All PII Button if unmasked findings exist */}
        {unmaskedPiiCount > 0 && (
          <button
            id="quick-mask-all-btn"
            onClick={() => maskAllPII()}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-medium rounded-lg transition-colors"
            title="Immediately mask all critical unmasked PII records"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Mask All PII ({unmaskedPiiCount})</span>
          </button>
        )}

        {/* Role Switcher Pill */}
        <div className="relative">
          <button
            id="role-switcher-btn"
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline text-slate-400">Role:</span>
            <span className="text-cyan-300 font-semibold">{currentUser.role}</span>
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2.5 py-1.5 border-b border-slate-800">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Persona Role
                </div>
                <div className="text-[10px] text-slate-500">Test Role-Based Access Controls</div>
              </div>
              <div className="py-1">
                {roles.map(r => (
                  <button
                    key={r}
                    onClick={() => {
                      setUserRole(r);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 text-xs rounded-lg flex items-center justify-between transition-colors ${
                      currentUser.role === r
                        ? 'bg-cyan-500/20 text-cyan-200 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{r}</div>
                      <div className="text-[10px] text-slate-400">
                        {r === 'Admin' && 'Full permissions & rule editing'}
                        {r === 'Data Analyst' && 'Data profiling, queries & QA'}
                        {r === 'Privacy Officer' && 'PII masking & regulatory export'}
                        {r === 'Reviewer' && 'Document annotations & AI queues'}
                        {r === 'Manager' && 'Executive reporting & audit oversight'}
                      </div>
                    </div>
                    {currentUser.role === r && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Button */}
        <button
          id="notifications-drawer-btn"
          onClick={() => setIsNotificationsDrawerOpen(!isNotificationsDrawerOpen)}
          className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
          title="Notifications & Alerts"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse ring-2 ring-slate-900"></span>
          )}
        </button>

        {/* Help & Shortcuts Button */}
        <button
          id="help-shortcuts-btn"
          onClick={() => setIsHelpModalOpen(true)}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
          title="Documentation & Keyboard Shortcuts"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Theme Toggle Button */}
        <button
          id="theme-toggle-btn"
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
        </button>
      </div>
    </header>
  );
};
