import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-lg shadow-lg border backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-3 ${
              isSuccess 
                ? 'bg-[#0B132B]/95 text-white border-[#C59B51]/40' 
                : isError 
                ? 'bg-rose-950/95 text-white border-rose-600/40' 
                : 'bg-stone-900/95 text-white border-stone-700/50'
            }`}
          >
            <div className="flex items-center gap-3">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#ECC88A] shrink-0" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
              {!isSuccess && !isError && <Info className="w-5 h-5 text-sky-400 shrink-0" />}
              <span className="text-xs sm:text-sm font-medium leading-snug">{toast.title}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 p-1 rounded-md text-stone-400 hover:text-white transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
