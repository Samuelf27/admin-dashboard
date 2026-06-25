import { useEffect, useState } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import StatCard from '../components/StatCard';
import { api } from '../lib/api';
import type { Metric, SalesPoint, CategorySlice } from '../lib/types';

const PIE_COLORS = ['#6366f1', '#22d3ee', '#34d399', '#f59e0b'];

export default function Dashboard() {
  const [metrics, setMetrics] = useState<Metric[] | null>(null);
  const [sales, setSales] = useState<SalesPoint[] | null>(null);
  const [cats, setCats] = useState<CategorySlice[] | null>(null);

  useEffect(() => {
    api.getMetrics().then(setMetrics);
    api.getSales().then(setSales);
    api.getCategories().then(setCats);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Visão geral</h1>
        <p className="text-sm text-slate-500">Acompanhe os principais indicadores do negócio.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics
          ? metrics.map((m) => <StatCard key={m.label} metric={m} />)
          : Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[118px]" />)}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
          <h2 className="mb-4 font-semibold">Receita vs. Despesa</h2>
          {sales ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={sales} margin={{ left: -20, right: 8 }}>
                <defs>
                  <linearGradient id="r" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="d" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b833" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', background: '#1e293b', color: '#fff' }} />
                <Area type="monotone" dataKey="receita" stroke="#6366f1" strokeWidth={2} fill="url(#r)" />
                <Area type="monotone" dataKey="despesa" stroke="#22d3ee" strokeWidth={2} fill="url(#d)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <Skeleton className="h-[280px]" />
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 font-semibold">Receita por categoria</h2>
          {cats ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={cats} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {cats.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Legend iconType="circle" />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', background: '#1e293b', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <Skeleton className="h-[280px]" />
          )}
        </div>
      </div>
    </div>
  );
}

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800 ${className}`} />;
}
