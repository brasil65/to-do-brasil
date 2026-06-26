"use client";

import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { RotateCcw, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Task {
  id: string;
  title: string;
  status: string;
  due_date: string | null;
  priority: string;
  category?: string;
  deleted_at: string | null;
}

interface TrashItemProps {
  task: Task;
  onUpdate: () => void;
}

/**
 * Item da lixeira com ações de restaurar e deletar permanentemente.
 * Design consistente com o tema escuro.
 */
const TrashItem = ({ task, onUpdate }: TrashItemProps) => {
  const [loading, setLoading] = useState(false);

  const restoreTask = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("tasks")
      .update({ deleted_at: null })
      .eq("id", task.id);
    setLoading(false);

    if (error) {
      showError("Erro ao restaurar tarefa");
    } else {
      showSuccess("Tarefa restaurada!");
      onUpdate();
    }
  };

  const permanentDelete = async () => {
    setLoading(true);
    const { error } = await supabase.from("tasks").delete().eq("id", task.id);
    setLoading(false);

    if (error) {
      showError("Erro ao deletar tarefa");
    } else {
      showSuccess("Tarefa deletada permanentemente");
      onUpdate();
    }
  };

  return (
    <div className="group flex items-center gap-3 rounded-2xl border border-white/8 bg-white/5 backdrop-blur-sm p-4 transition-all duration-200 hover:bg-white/8">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-300 truncate line-through">
          {task.title}
        </p>
        {task.deleted_at && (
          <p className="text-[10px] text-slate-500 mt-1">
            Deletada em {format(new Date(task.deleted_at), "dd/MM/yyyy HH:mm")}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="sm"
          onClick={restoreTask}
          disabled={loading}
          className="h-8 rounded-lg text-xs font-medium text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 px-3"
        >
          <RotateCcw className="h-3.5 w-3.5 mr-1" />
          Restaurar
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={permanentDelete}
          disabled={loading}
          className="h-8 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-3"
        >
          <Trash2 className="h-3.5 w-3.5 mr-1" />
          Deletar
        </Button>
      </div>
    </div>
  );
};

export default TrashItem;