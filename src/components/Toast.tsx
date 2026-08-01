import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full px-4 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-indigo-500 shrink-0" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success':
        return 'border-emerald-500/40 bg-emerald-50/90 dark:bg-gray-900/95 text-emerald-900 dark:text-emerald-100';
      case 'error':
        return 'border-rose-500/40 bg-rose-50/90 dark:bg-gray-900/95 text-rose-900 dark:text-rose-100';
      default:
        return 'border-indigo-500/40 bg-indigo-50/90 dark:bg-gray-900/95 text-indigo-900 dark:text-indigo-100';
    }
  };

  return (
    <div
      className={`pointer-events-auto p-3.5 rounded-2xl border shadow-lg backdrop-blur-md flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${getBorderColor()}`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {getIcon()}
        <span className="text-xs font-bold truncate">{toast.text}</span>
      </div>

      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0"
      >
        <X className="w-3.5 h-3.5 opacity-60 hover:opacity-100" />
      </button>
    </div>
  );
};
