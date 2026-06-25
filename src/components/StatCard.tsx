import { Users, DollarSign, ShoppingCart, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { Metric } from '../lib/types';

const ICONS = {
  users: Users,
  revenue: DollarSign,
  orders: ShoppingCart,
  conversion: TrendingUp,
};

export default function StatCard({ metric }: { metric: Metric }) {
  const Icon = ICONS[metric.icon];
  const up = metric.delta >= 0;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{metric.label}</span>
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-3 text-2xl font-bold">{metric.value}</div>
      <div className={`mt-1 flex items-center gap-1 text-sm font-medium ${up ? 'text-emerald-500' : 'text-rose-500'}`}>
        {up ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
        {Math.abs(metric.delta)}%
        <span className="font-normal text-slate-400">vs. mês anterior</span>
      </div>
    </div>
  );
}
