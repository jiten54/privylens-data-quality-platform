import React, { useState } from 'react';
import { useApp, NavigationTab } from '../context/AppContext';
import {
  X,
  Bell,
  CheckCheck,
  ShieldAlert,
  AlertTriangle,
  Info,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export const NotificationsDrawer: React.FC = () => {
  const {
    isNotificationsDrawerOpen,
    setIsNotificationsDrawerOpen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setActiveTab,
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');

  if (!isNotificationsDrawerOpen) return null;

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'critical') return n.severity === 'CRITICAL';
    return true;
  });

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'HIGH':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      default:
        return <Info className="w-4 h-4 text-cyan-400" />;
    }
  };

  const handleAction = (tab?: string, notifId?: string) => {
    if (notifId) {
      markNotificationAsRead(notifId);
    }
    if (tab) {
      setActiveTab(tab as NavigationTab);
      setIsNotificationsDrawerOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100">Enterprise Incident & Alert Center</h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={markAllNotificationsAsRead}
              className="p-1.5 text-xs text-slate-400 hover:text-cyan-300 rounded hover:bg-slate-800 transition-colors flex items-center gap-1"
              title="Mark all as read"
            >
              <CheckCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Mark read</span>
            </button>
            <button
              onClick={() => setIsNotificationsDrawerOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex border-b border-slate-800 px-4 pt-2 gap-2 bg-slate-900">
          {(['all', 'unread', 'critical'] as const).map(tabKey => (
            <button
              key={tabKey}
              onClick={() => setFilter(tabKey)}
              className={`pb-2 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 capitalize ${
                filter === tabKey
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tabKey}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 custom-scrollbar">
          {filteredNotifications.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications found</p>
              <p className="text-xs text-slate-500 mt-1">All alerts are resolved or acknowledged.</p>
            </div>
          ) : (
            filteredNotifications.map(item => (
              <div
                key={item.id}
                className={`p-3 rounded-xl border transition-all ${
                  item.isRead
                    ? 'bg-slate-900/60 border-slate-800 text-slate-300'
                    : 'bg-slate-800/80 border-slate-700/90 text-white shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(item.severity)}
                    <span className="text-xs font-bold leading-tight">{item.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">{item.timestamp}</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-3">{item.message}</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                      item.severity === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : item.severity === 'HIGH'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                    }`}
                  >
                    {item.severity}
                  </span>

                  {item.linkTab && (
                    <button
                      onClick={() => handleAction(item.linkTab, item.id)}
                      className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <span>{item.actionLabel || 'Investigate'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Real-time webhook sync enabled</span>
          <span className="text-emerald-400 font-medium">SLAs 99.99%</span>
        </div>
      </div>
    </div>
  );
};
