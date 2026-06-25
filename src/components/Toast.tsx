import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';
interface Toast { id: number; type: ToastType; message: string; }

interface ToastCtx { notify: (message: string, type?: ToastType) => void; }
const Ctx = createContext<ToastCtx | null>(null);

let counter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback((message: string, type: ToastType = 'success') => {
    const id = ++counter;
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const remove = (id: number) => setToasts((t) => t.filter((x) => x.id !== id));

  const ICON = { success: CheckCircle2, error: XCircle, info: Info };
  const COLOR = {
    success: 'text-emerald-500',
    error: 'text-rose-500',
    info: 'text-brand-500',
  };

  return (
    <Ctx.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
        {toasts.map((t) => {
          const Icon = ICON[t.type];
          return (
            <div
              key={t.id}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg dark:border-slate-700 dark:bg-slate-800 animate-[slideIn_.2s_ease]"
            >
              <Icon className={`h-5 w-5 shrink-0 ${COLOR[t.type]}`} />
              <span className="text-sm font-medium">{t.message}</span>
              <button onClick={() => remove(t.id)} className="ml-2 text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useToast deve ser usado dentro de ToastProvider');
  return ctx;
}
