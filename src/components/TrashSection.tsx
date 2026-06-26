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
 * Tema azul nos elementos visuais.
 */
const TrashSection = ({ deletedTasks, onRefresh, onEmptyTrash }: TrashSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="space-y-4 animate-in fade-in duration-500">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-1 w-full group"
      >
        <div className="h-4 w-1 bg-primary/50 rounded-full" />
        <h2 className="text-xs font-black text-muted-foreground uppercase tracking-widest flex-1 text-left">
          Lixeira
        </h2>
        <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
          {deletedTasks.length}
        </span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
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
                className="h-7 text-[10px] font-bold text-destructive hover:text-destructive hover:bg-destructive/10 uppercase tracking-wider px-2"
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
