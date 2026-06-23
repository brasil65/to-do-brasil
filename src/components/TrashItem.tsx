"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";

interface TrashItemProps {
  id: string;
  title: string;
  onRestore: () => void;
  onPermanentDelete: () => void;
}

/**
 * Item visualizado na lixeira com opções de restaurar ou excluir permanentemente.
 */
const TrashItem = ({ id, title, onRestore, onPermanentDelete }: TrashItemProps) => {
  const restoreTask = async () => {
    const { error } = await supabase
      .from("tasks")
      .update({ deleted_at: null })
      .eq("id", id);

    if (error) {
      showError("Erro ao restaurar tarefa");
    } else {
      showSuccess("Tarefa restaurada");
      onRestore();
    }
  };

  const permanentDelete = async () => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) {
      showError("Erro ao excluir tarefa");
    } else {
      showSuccess("Tarefa excluída permanentemente");
      onPermanentDelete();
    }
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/40 opacity-75 hover:opacity-100 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate line-through">
          {title}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={restoreTask}
          className="h-8 w-8 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
          title="Restaurar"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={permanentDelete}
          className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20"
          title="Excluir permanentemente"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TrashItem;
