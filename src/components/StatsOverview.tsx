"use client";

import React from "react";
import { CheckCircle2, Circle, Clock, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface StatsOverviewProps {
  total: number;
  completed: number;
  pending: number;
}

const StatsOverview = ({ total, completed, pending }: StatsOverviewProps) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1">
            <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Progresso Diário</h3>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{percentage}%</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-2xl">
            <TrendingUp className="h-6 w-6 text-emerald-500" />
          </div>
        </div>
        <Progress value={percentage} className="h-2 rounded-full bg-slate-100 dark:bg-slate-800" />
        <div className="grid grid-cols-3 gap-2 mt-6">
          <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
            <CheckCircle2 className="h-4 w-4 mx-auto mb-1 text-emerald-500" />
            <p className="text-lg font-bold dark:text-white leading-tight">{completed}</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Feitas</p>
          </div>
          <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
            <Circle className="h-4 w-4 mx-auto mb-1 text-amber-500" />
            <p className="text-lg font-bold dark:text-white leading-tight">{pending}</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Fila</p>
          </div>
          <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
            <Clock className="h-4 w-4 mx-auto mb-1 text-blue-500" />
            <p className="text-lg font-bold dark:text-white leading-tight">{total}</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Total</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;