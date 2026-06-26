import React from "react";
import { CheckCircle2, Clock, ListTodo } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsOverviewProps {
  total: number;
  completed: number;
  pending: number;
}

/**
 * Cards de estatísticas com design moderno e glassmorphism.
 * Cores suaves com ícones temáticos para estudantes.
 */
const StatsOverview = ({ total, completed, pending }: StatsOverviewProps) => {
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    {
      label: "Total",
      value: total,
      icon: ListTodo,
      iconColor: "text-blue-400",
      bgGlow: "bg-blue-500/10",
    },
    {
      label: "Pendentes",
      value: pending,
      icon: Clock,
      iconColor: "text-amber-400",
      bgGlow: "bg-amber-500/10",
    },
    {
      label: "Concluídas",
      value: completed,
      icon: CheckCircle2,
      iconColor: "text-emerald-400",
      bgGlow: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="rounded-2xl border border-white/8 bg-white/5 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Progresso Geral
          </span>
          <span className="text-sm font-bold text-primary">{completionRate}%</span>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-indigo-400 transition-all duration-700 ease-out"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <p className="text-[11px] text-muted-foreground mt-2">
          {completed} de {total} tarefas concluídas
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="relative rounded-2xl border border-white/8 bg-white/5 backdrop-blur-sm p-3 text-center overflow-hidden group hover:bg-white/8 transition-all duration-200"
          >
            {/* Glow effect */}
            <div
              className={cn(
                "absolute -top-4 -right-4 w-16 h-16 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity",
                stat.bgGlow
              )}
            />
            <stat.icon className={cn("h-5 w-5 mx-auto mb-2", stat.iconColor)} />
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsOverview;