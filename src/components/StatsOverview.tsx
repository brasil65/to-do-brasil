"use client";

import React from "react";
import { CheckCircle2, Circle, Clock, Flame, Sparkles } from "lucide-react";

interface StatsOverviewProps {
  total: number;
  completed: number;
  pending: number;
}

/**
 * Componente de anel circular animado que exibe o progresso.
 */
const CircularProgress = ({ percentage }: { percentage: number }) => {
  const radius = 54;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-36 h-36">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        {/* Track */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-white/10"
        />
        {/* Progress ring */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-white">{percentage}%</span>
        <span className="text-[9px] font-bold text-blue-200 uppercase tracking-widest">
          concluído
        </span>
      </div>
    </div>
  );
};

/**
 * Card de estatísticas renovado com imagem de fundo, anel circular e visual premium.
 */
const StatsOverview = ({ total, completed, pending }: StatsOverviewProps) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const isAllDone = total > 0 && completed === total;

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Main progress card */}
      <div className="relative overflow-hidden rounded-3xl shadow-xl shadow-blue-600/15 dark:shadow-blue-900/20">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700/90 via-blue-600/85 to-blue-800/95" />
        {/* Decorative elements */}
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 -right-16 w-24 h-24 bg-white/5 rounded-full" />
        <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/5 rounded-full" />

        <div className="relative z-10 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Flame className="h-4 w-4 text-amber-300" />
                <h3 className="text-[10px] font-black text-blue-200 uppercase tracking-[0.25em]">
                  Progresso Diário
                </h3>
              </div>
              <p className="text-sm font-medium text-blue-100/80">
                {isAllDone
                  ? "Parabéns! Tudo feito! 🎉"
                  : completed > 0
                  ? "Continue assim, você está indo bem!"
                  : total > 0
                  ? "Comece suas tarefas de hoje"
                  : "Adicione sua primeira tarefa"}
              </p>
            </div>
            <Sparkles className="h-5 w-5 text-blue-200/40" />
          </div>

          {/* Circular progress + stats row */}
          <div className="flex items-center gap-6">
            <CircularProgress percentage={percentage} />

            <div className="flex-1 grid grid-cols-3 gap-2">
              <div className="text-center p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10">
                <CheckCircle2 className="h-4 w-4 mx-auto mb-1.5 text-emerald-300" />
                <p className="text-xl font-black text-white leading-tight">
                  {completed}
                </p>
                <p className="text-[8px] font-bold text-blue-200 uppercase tracking-tight">
                  Feitas
                </p>
              </div>
              <div className="text-center p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10">
                <Circle className="h-4 w-4 mx-auto mb-1.5 text-blue-200" />
                <p className="text-xl font-black text-white leading-tight">
                  {pending}
                </p>
                <p className="text-[8px] font-bold text-blue-200 uppercase tracking-tight">
                  Pendentes
                </p>
              </div>
              <div className="text-center p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10">
                <Clock className="h-4 w-4 mx-auto mb-1.5 text-blue-200" />
                <p className="text-xl font-black text-white leading-tight">
                  {total}
                </p>
                <p className="text-[8px] font-bold text-blue-200 uppercase tracking-tight">
                  Total
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
