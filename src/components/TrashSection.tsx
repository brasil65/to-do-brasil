"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import TrashItem from "@/components/TrashItem";

interface DeletedTask {
  id: string;
  title: string;
}

interface TrashSectionProps {
  deletedTasks: DeletedTask[];
  onRefresh: () => void;
  onEmptyTrash: () => void;
}

/**
 * Seção colapsável "Lixeira" que lista tarefas excluídas com ações de restaurar ou excluir permanentemente.
 */
const TrashSection = ({ deletedTasks, onRefresh, onEmptyTrash }: TrashSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="space-y-4 animate-in fade-in duration-500">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-1 w-full group"
      >
        <div className="h-4 w-1 bg-rose-400 rounded-full" />
        <h2 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest flex-1 text-left">
          Lixeira
        </h2>
        <span className="text-[10px] font-bold bg-rose-100 dark:bg-rose-900/30 text-rose-500 px-2 py-0.5 rounded-full">
          {deletedTasks.length}
        </span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
        ) : (
          <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
        )}
      </button>

      {isOpen && (
        <div className="space-y-2">
          {deletedTasks.length > 1 && (
            <div className="flex justify-end px-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={onEmptyTrash}
                className="h-7 text-[10px] font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 uppercase tracking-wider px-2"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Esvaziar Lixeira
              </Button>
            </div>
          )}
          {deletedTasks.map((task) => (
            <TrashItem
              key={task.id}
              id={task.id}
              title={task.title}
              onRestore={onRefresh}
              onPermanentDelete={onRefresh}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default TrashSection;
