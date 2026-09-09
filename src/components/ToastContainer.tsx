import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
            case 'warning':
              return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
            case 'error':
              return <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />;
            default:
              return <Info className="w-4 h-4 text-cyan-400 shrink-0" />;
          }
        };

        const getBorderColor = () => {
          switch (toast.type) {
            case 'success':
              return 'border-emerald-500/40 bg-slate-900/95';
            case 'warning':
              return 'border-amber-500/40 bg-slate-900/95';
            case 'error':
              return 'border-rose-500/40 bg-slate-900/95';
            default:
              return 'border-cyan-500/40 bg-slate-900/95';
          }
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl border shadow-xl backdrop-blur-md flex items-start gap-3 transition-all animate-in slide-in-from-bottom-2 duration-200 ${getBorderColor()}`}
          >
            <div className="mt-0.5">{getIcon()}</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-100">{toast.title}</div>
              <div className="text-xs text-slate-300 leading-snug mt-0.5">{toast.message}</div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-slate-400 hover:text-slate-200 shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
