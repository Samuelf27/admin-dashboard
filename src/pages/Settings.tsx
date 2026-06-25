import { useState } from 'react';
import { useTheme } from '../lib/theme';
import { useToast } from '../components/Toast';

export default function Settings() {
  const { dark, toggle } = useTheme();
  const { notify } = useToast();
  const [name, setName] = useState('Samuel Ferreira');
  const [email, setEmail] = useState('admin@empresa.com');
  const [notif, setNotif] = useState(true);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-sm text-slate-500">Gerencie sua conta e preferências.</p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 font-semibold">Perfil</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Nome</span>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">E-mail</span>
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
        </div>
        <button
          onClick={() => notify('Perfil salvo com sucesso.')}
          className="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Salvar alterações
        </button>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 font-semibold">Preferências</h2>
        <Row label="Tema escuro" desc="Alternar entre claro e escuro" checked={dark} onChange={toggle} />
        <Row label="Notificações por e-mail" desc="Receber alertas e resumos" checked={notif} onChange={() => setNotif((v) => !v)} />
      </section>
    </div>
  );
}

function Row({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-3 last:border-0 dark:border-slate-800">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-slate-500">{desc}</div>
      </div>
      <button
        onClick={onChange}
        className={`relative h-6 w-11 rounded-full transition ${checked ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-600'}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`} />
      </button>
    </div>
  );
}
