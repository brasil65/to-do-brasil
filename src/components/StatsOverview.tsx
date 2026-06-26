"use client";

import React from "react";
import { CheckCircle2, Circle, Clock, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface StatsOverviewProps {
  total: number;
  completed: number;
  pending: number;
}

/**
 * Cards de estatísticas do dashboard com gradiente azul e visual moderno.
 * Exibe progresso geral e contagens de tarefas feitas, pendentes e total.
 */
const StatsOverview = ({ total, completed, pending }: StatsOverviewProps) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Main progress card with blue gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-900 p-6 rounded-3xl shadow-lg shadow-blue-600/20 dark:shadow-blue-900/30">
        {/* Decorative circles */}
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/5 rounded-full" />

        <div className="relative flex items-center justify-between mb-5">
          <div className="space-y-1">
            <h3 className="text-xs font-black text-blue-200 uppercase tracking-[0.2em]">
              Progresso Diário
            </h3>
            <p className="text-4xl font-black text-white">{percentage}%</p>
          </div>
          <div className="bg-white/15 p-3.5 rounded-2xl backdrop-blur-sm">
            <TrendingUp className="h-7 w-7 text-white" />
          </div>
        </div>

        <Progress
          value={percentage}
          className="h-2.5 rounded-full bg-white/20 [&>div]:bg-white"
        />

        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="text-center p-3 bg-white/10 backdrop-blur-sm rounded-2xl">
            <CheckCircle2 className="h-4 w-4 mx-auto mb-1.5 text-blue-200" />
            <p className="text-lg font-bold text-white leading-tight">
              {completed}
            </p>
            <p className="text-[9px] font-bold text-blue-200 uppercase tracking-tighter">
              Feitas
            </p>
          </div>
          <div className="text-center p-3 bg-white/10 backdrop-blur-sm rounded-2xl">
            <Circle className="h-4 w-4 mx-auto mb-1.5 text-amber-300" />
            <p className="text-lg font-bold text-white leading-tight">
              {pending}
            </p>
            <p className="text-[9px] font-bold text-blue-200 uppercase tracking-tighter">
              Fila
            </p>
          </div>
          <div className="text-center p-3 bg-white/10 backdrop-blur-sm rounded-2xl">
            <Clock className="h-4 w-4 mx-auto mb-1.5 text-blue-200" />
            <p className="text-lg font-bold text-white leading-tight">
              {total}
            </p>
            <p className="text-[9px] font-bold text-blue-200 uppercase tracking-tighter">
              Total
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
