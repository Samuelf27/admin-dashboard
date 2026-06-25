export type Role = 'Admin' | 'Editor' | 'Viewer';
export type Status = 'Ativo' | 'Inativo' | 'Pendente';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  createdAt: string;
}

export interface Metric {
  label: string;
  value: string;
  delta: number; // variação % vs período anterior
  icon: 'users' | 'revenue' | 'orders' | 'conversion';
}

export interface SalesPoint {
  month: string;
  receita: number;
  despesa: number;
}

export interface CategorySlice {
  name: string;
  value: number;
}
