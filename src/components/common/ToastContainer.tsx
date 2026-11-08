import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Info, Sparkles, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        return (
          <div
            key={toast.id}
            className="pointer-events-auto p-3.5 rounded-2xl bg-[#1f152e]/95 backdrop-blur-xl border border-purple-500/30 shadow-2xl shadow-purple-950/80 flex items-start gap-3 transition-all animate-in slide-in-from-right-4 duration-300"
          >
            <div className="p-1.5 rounded-xl bg-purple-500/20 text-[#CC09E6] shrink-0 mt-0.5">
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : toast.type === 'info' ? (
                <Info className="w-4 h-4 text-cyan-400" />
              ) : (
                <Sparkles className="w-4 h-4 text-[#CC09E6]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-white tracking-wide">{toast.title}</h4>
              <p className="text-[11px] text-purple-200/80 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-purple-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
