import type { User, Metric, SalesPoint, CategorySlice, Role, Status } from './types';

/**
 * Camada de API simulada (mock) com latência artificial.
 * A interface foi desenhada para ser trocada por um back-end real
 * (ex.: a br-validator-api) sem mudar os componentes.
 */

const delay = <T>(data: T, ms = 450): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), ms));

const ROLES: Role[] = ['Admin', 'Editor', 'Viewer'];
const STATUSES: Status[] = ['Ativo', 'Inativo', 'Pendente'];
const FIRST = ['Ana', 'Bruno', 'Carla', 'Diego', 'Eduarda', 'Felipe', 'Gabriela', 'Henrique', 'Isabela', 'João', 'Larissa', 'Marcos', 'Natália', 'Otávio', 'Paula', 'Rafael', 'Sofia', 'Thiago'];
const LAST = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Lima', 'Pereira', 'Costa', 'Almeida', 'Ferreira', 'Rodrigues'];
const slug = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function seedUsers(n = 47): User[] {
  const out: User[] = [];
  for (let i = 0; i < n; i++) {
    const first = FIRST[i % FIRST.length];
    const last = LAST[(i * 3) % LAST.length];
    const d = new Date(2025, (i % 12), ((i * 7) % 27) + 1);
    out.push({
      id: crypto.randomUUID(),
      name: `${first} ${last}`,
      email: `${slug(first)}.${slug(last)}${i}@empresa.com`,
      role: ROLES[i % ROLES.length],
      status: STATUSES[i % STATUSES.length],
      createdAt: d.toISOString().slice(0, 10),
    });
  }
  return out;
}

// "Banco" em memória (persistido na sessão)
let users: User[] = seedUsers();

export const api = {
  async login(email: string, password: string): Promise<{ token: string; name: string }> {
    await delay(null, 600);
    if (!email.includes('@') || password.length < 4) {
      throw new Error('Credenciais inválidas.');
    }
    return { token: 'mock.jwt.token', name: 'Samuel Ferreira' };
  },

  async listUsers(): Promise<User[]> {
    return delay(users);
  },

  async createUser(input: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    await delay(null, 350);
    const user: User = { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString().slice(0, 10) };
    users = [user, ...users];
    return structuredClone(user);
  },

  async updateUser(id: string, input: Partial<User>): Promise<User> {
    await delay(null, 350);
    users = users.map((u) => (u.id === id ? { ...u, ...input } : u));
    return structuredClone(users.find((u) => u.id === id)!);
  },

  async deleteUser(id: string): Promise<void> {
    await delay(null, 300);
    users = users.filter((u) => u.id !== id);
  },

  async getMetrics(): Promise<Metric[]> {
    return delay([
      { label: 'Usuários ativos', value: String(users.filter((u) => u.status === 'Ativo').length), delta: 12.5, icon: 'users' },
      { label: 'Receita (mês)', value: 'R$ 84.2k', delta: 8.1, icon: 'revenue' },
      { label: 'Pedidos', value: '1.284', delta: -3.2, icon: 'orders' },
      { label: 'Conversão', value: '3,8%', delta: 1.4, icon: 'conversion' },
    ]);
  },

  async getSales(): Promise<SalesPoint[]> {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'];
    return delay(months.map((m, i) => ({
      month: m,
      receita: 30 + Math.round(Math.sin(i) * 8 + i * 5),
      despesa: 18 + Math.round(Math.cos(i) * 5 + i * 3),
    })));
  },

  async getCategories(): Promise<CategorySlice[]> {
    return delay([
      { name: 'Assinaturas', value: 42 },
      { name: 'Serviços', value: 28 },
      { name: 'Produtos', value: 18 },
      { name: 'Outros', value: 12 },
    ]);
  },
};
