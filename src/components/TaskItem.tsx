"use client";

import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { Check, Trash2, Calendar, Flag, Pencil } from "lucide-react";
import { format, isPast, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import EditTaskDialog from "@/components/EditTaskDialog";

interface Task {
  id: string;
  title: string;
  status: string;
  due_date: string | null;
  priority: string;
  category?: string;
  created_at?: string;
}

interface TaskItemProps {
  task: Task;
  onUpdate: () => void;
}

const CATEGORY_STYLES: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  work: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400", label: "Trabalho" },
  personal: { bg: "bg-violet-500/10", text: "text-violet-400", dot: "bg-violet-400", label: "Pessoal" },
  health: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", label: "Saúde" },
  urgent: { bg: "bg-rose-500/10", text: "text-rose-400", dot: "bg-rose-400", label: "Urgente" },
};

const PRIORITY_CONFIG: Record<string, { color: string; label: string }> = {
  low: { color: "text-blue-400", label: "Baixa" },
  medium: { color: "text-amber-400", label: "Média" },
  high: { color: "text-rose-400", label: "Alta" },
};

/**
 * Card de tarefa com design moderno, cores por categoria,
 * indicador de prioridade e ações de completar/editar/deletar.
 */
const TaskItem = ({ task, onUpdate }: TaskItemProps) => {
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const catStyle = CATEGORY_STYLES[task.category || "personal"] || CATEGORY_STYLES.personal;
  const priStyle = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const isCompleted = task.status === "completed";

  const isOverdue =
    task.due_date && !isCompleted && isPast(new Date(task.due_date)) && !isToday(new Date(task.due_date));
  const isDueToday = task.due_date && isToday(new Date(task.due_date));

  const toggleStatus = async () => {
    setLoading(true);
    const newStatus = isCompleted ? "pending" : "completed";
    const { error } = await supabase.from("tasks").update({ status: newStatus }).eq("id", task.id);
    setLoading(false);

    if (error) {
      showError("Erro ao atualizar tarefa");
    } else {
      showSuccess(newStatus === "completed" ? "Tarefa concluída!" : "Tarefa reaberta");
      onUpdate();
    }
  };

  const deleteTask = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("tasks")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", task.id);
    setLoading(false);

    if (error) {
      showError("Erro ao deletar tarefa");
    } else {
      showSuccess("Tarefa movida para lixeira");
      onUpdate();
    }
    setConfirmDelete(false);
  };

  return (
    <>
      <div
        className={cn(
          "group relative flex items-start gap-3 rounded-2xl border border-white/8 bg-white/5 backdrop-blur-sm p-4 transition-all duration-200 hover:bg-white/8 hover:border-white/15",
          isCompleted && "opacity-60"
        )}
      >
        {/* Category color accent */}
        <div className={cn("absolute left-0 top-4 bottom-4 w-1 rounded-full", catStyle.dot)} />

        {/* Checkbox */}
        <button
          onClick={toggleStatus}
          disabled={loading}
          className={cn(
            "mt-0.5 flex-shrink-0 h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200",
            isCompleted
              ? "bg-primary border-primary scale-95"
              : "border-white/20 hover:border-primary/50 hover:bg-primary/10"
          )}
          aria-label={isCompleted ? "Reabrir tarefa" : "Concluir tarefa"}
        >
          {isCompleted && <Check className="h-3.5 w-3.5 text-white" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "text-sm font-medium leading-snug transition-all",
              isCompleted ? "line-through text-muted-foreground" : "text-foreground"
            )}
          >
            {task.title}
          </p>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {/* Category badge */}
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                catStyle.bg,
                catStyle.text
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", catStyle.dot)} />
              {catStyle.label}
            </span>

            {/* Priority */}
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
              <Flag className={cn("h-3 w-3 fill-current", priStyle.color)} />
              {priStyle.label}
            </span>

            {/* Due date */}
            {task.due_date && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-[10px] font-medium",
                  isOverdue ? "text-rose-400" : isDueToday ? "text-amber-400" : "text-muted-foreground"
                )}
              >
                <Calendar className="h-3 w-3" />
                {isDueToday ? "Hoje" : format(new Date(task.due_date), "dd/MM")}
                {isOverdue && " (atrasada)"}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setEditOpen(true)}
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10"
            aria-label="Editar tarefa"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setConfirmDelete(true)}
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10"
            aria-label="Deletar tarefa"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Edit dialog */}
      <EditTaskDialog
        task={task}
        open={editOpen}
        onOpenChange={setEditOpen}
        onUpdate={onUpdate}
      />

      {/* Confirm delete dialog */}
      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mover para lixeira?</AlertDialogTitle>
            <AlertDialogDescription>
              A tarefa &quot;{task.title}&quot; será movida para a lixeira.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteTask}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              Mover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TaskItem;