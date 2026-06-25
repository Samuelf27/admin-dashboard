import { useEffect, useMemo, useState } from 'react';
import {
  Plus, Search, Pencil, Trash2, ArrowUpDown, ChevronLeft, ChevronRight, Loader2,
} from 'lucide-react';
import Modal from '../components/Modal';
import { useToast } from '../components/Toast';
import { api } from '../lib/api';
import type { User, Role, Status } from '../lib/types';

const ROLES: Role[] = ['Admin', 'Editor', 'Viewer'];
const STATUSES: Status[] = ['Ativo', 'Inativo', 'Pendente'];
const PER_PAGE = 8;

const STATUS_STYLE: Record<Status, string> = {
  Ativo: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  Inativo: 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  Pendente: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
};

type SortKey = keyof Pick<User, 'name' | 'email' | 'role' | 'status' | 'createdAt'>;
type FormState = { name: string; email: string; role: Role; status: Status };
const EMPTY: FormState = { name: '', email: '', role: 'Viewer', status: 'Ativo' };

export default function Users() {
  const { notify } = useToast();
  const [users, setUsers] = useState<User[] | null>(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'name', dir: 'asc' });
  const [page, setPage] = useState(1);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { api.listUsers().then(setUsers); }, []);

  const filtered = useMemo(() => {
    if (!users) return [];
    const q = search.toLowerCase();
    const list = users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    list.sort((a, b) => {
      const cmp = String(a[sort.key]).localeCompare(String(b[sort.key]), 'pt-BR');
      return sort.dir === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [users, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function toggleSort(key: SortKey) {
    setSort((s) => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }));
  }

  function openCreate() {
    setEditing(null); setForm(EMPTY); setErrors({}); setModalOpen(true);
  }
  function openEdit(u: User) {
    setEditing(u);
    setForm({ name: u.name, email: u.email, role: u.role, status: u.status });
    setErrors({}); setModalOpen(true);
  }

  function validate(): boolean {
    const e: typeof errors = {};
    if (form.name.trim().length < 3) e.name = 'Informe ao menos 3 caracteres.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = 'E-mail inválido.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSave(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      if (editing) {
        const updated = await api.updateUser(editing.id, form);
        setUsers((list) => (list ?? []).map((u) => (u.id === updated.id ? updated : u)));
        notify('Usuário atualizado com sucesso.');
      } else {
        const created = await api.createUser(form);
        setUsers((list) => [created, ...(list ?? [])]);
        notify('Usuário criado com sucesso.');
      }
      setModalOpen(false);
    } catch {
      notify('Erro ao salvar usuário.', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(u: User) {
    if (!confirm(`Remover ${u.name}?`)) return;
    try {
      await api.deleteUser(u.id);
      setUsers((list) => (list ?? []).filter((x) => x.id !== u.id));
      notify('Usuário removido.', 'info');
    } catch {
      notify('Erro ao remover.', 'error');
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Usuários</h1>
          <p className="text-sm text-slate-500">{filtered.length} usuário(s) encontrado(s).</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
          <Plus className="h-4 w-4" /> Novo usuário
        </button>
      </div>

      {/* Busca */}
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Buscar por nome ou e-mail..."
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900"
        />
      </div>

      {/* Tabela */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-800/50">
              <tr>
                {([['name', 'Nome'], ['email', 'E-mail'], ['role', 'Cargo'], ['status', 'Status'], ['createdAt', 'Criado em']] as [SortKey, string][]).map(
                  ([key, label]) => (
                    <th key={key} className="px-5 py-3">
                      <button onClick={() => toggleSort(key)} className="flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-200">
                        {label} <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                  ),
                )}
                <th className="px-5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users === null ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
                    <td colSpan={6} className="px-5 py-4"><div className="h-5 animate-pulse rounded bg-slate-200 dark:bg-slate-800" /></td>
                  </tr>
                ))
              ) : pageItems.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-slate-400">Nenhum usuário encontrado.</td></tr>
              ) : (
                pageItems.map((u) => (
                  <tr key={u.id} className="border-b border-slate-100 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-3 font-medium">{u.name}</td>
                    <td className="px-5 py-3 text-slate-500">{u.email}</td>
                    <td className="px-5 py-3">{u.role}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[u.status]}`}>{u.status}</span>
                    </td>
                    <td className="px-5 py-3 text-slate-500">{u.createdAt}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(u)} className="rounded-lg p-2 text-slate-400 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-500/10" aria-label="Editar">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(u)} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10" aria-label="Remover">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 text-sm dark:border-slate-800">
          <span className="text-slate-500">Página {page} de {totalPages}</span>
          <div className="flex gap-1">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg border border-slate-200 p-1.5 disabled:opacity-40 dark:border-slate-700">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-lg border border-slate-200 p-1.5 disabled:opacity-40 dark:border-slate-700">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal de criar/editar */}
      <Modal open={modalOpen} title={editing ? 'Editar usuário' : 'Novo usuário'} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <Field label="Nome" error={errors.name}>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input" placeholder="Nome completo" />
          </Field>
          <Field label="E-mail" error={errors.email}>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input" placeholder="email@empresa.com" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Cargo">
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })} className="input">
                {ROLES.map((r) => <option key={r}>{r}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Status })} className="input">
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          <div className="mt-2 flex justify-end gap-2">
            <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium dark:border-slate-700">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />} Salvar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-rose-500">{error}</span>}
    </label>
  );
}
