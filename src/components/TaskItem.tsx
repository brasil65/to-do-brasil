"use client";

import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Calendar, Pencil, Flag, AlertCircle } from "lucide-react";
import { format, isPast, isToday } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { cn } from "@/lib/utils";
import EditTaskDialog from "./EditTaskDialog";

interface Task {
  id: string;
  title: string;
  status: string;
  due_date: string | null;
  priority: string;
  category?: string;
  deleted_at: string | null;
}

interface TaskItemProps {
  task: Task;
  onUpdate: () => void;
}

const CATEGORIES: Record<string, { label: string; color: string }> = {
  work: { label: "Trabalho", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  personal: { label: "Pessoal", color: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400" },
  health: { label: "Saúde", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  urgent: { label: "Urgente", color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400" },
};

/**
 * Item individual de tarefa com ações de toggle, editar e remover.
 * Cores de prioridade e bordas adaptadas ao tema azul.
 */
const TaskItem = ({ task, onUpdate }: TaskItemProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const isCompleted = task.status === "completed";

  const dueDate = task.due_date ? new Date(task.due_date) : null;
  const isOverdue = dueDate && isPast(dueDate) && !isToday(dueDate) && !isCompleted;

  const toggleStatus = async () => {
    const newStatus = isCompleted ? "pending" : "completed";
    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", task.id);

    if (error) {
      showError("Erro ao atualizar tarefa");
    } else {
      onUpdate();
    }
  };

  const deleteTask = async () => {
    const { error } = await supabase
      .from("tasks")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", task.id);
    if (error) {
      showError("Erro ao remover tarefa");
    } else {
      showSuccess("Tarefa movida para a lixeira");
      onUpdate();
    }
  };

  const priorityConfig = {
    low: { color: "text-blue-500", label: "Baixa" },
    medium: { color: "text-amber-500", label: "Média" },
    high: { color: "text-rose-500", label: "Alta" },
  };

  const currentPriority = priorityConfig[task.priority as keyof typeof priorityConfig] || priorityConfig.medium;
  const currentCategory = CATEGORIES[task.category || "personal"];

  return (
    <>
      <div
        className={cn(
          "flex items-center gap-3 p-4 bg-card rounded-2xl shadow-sm border group transition-all hover:shadow-md hover:border-primary/20 animate-in fade-in slide-in-from-bottom-2 duration-300",
          isOverdue
            ? "border-rose-200 dark:border-rose-900/30 bg-rose-50/30 dark:bg-rose-900/5"
            : "border-border"
        )}
      >
        <Checkbox
          checked={isCompleted}
          onCheckedChange={toggleStatus}
          className="h-6 w-6 rounded-full border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-1.5 mb-0.5">
            <p
              className={cn(
                "text-base font-semibold truncate transition-all",
                isCompleted
                  ? "text-muted-foreground line-through opacity-60"
                  : "text-foreground"
              )}
            >
              {task.title}
            </p>
            {currentCategory && (
              <span className={cn("text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded-md", currentCategory.color)}>
                {currentCategory.label}
              </span>
            )}
            {isOverdue && (
              <span className="flex items-center gap-0.5 text-[8px] font-black uppercase tracking-tighter bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 px-1.5 py-0.5 rounded-md">
                <AlertCircle className="h-2 w-2" />
                Atrasado
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {dueDate && (
              <div
                className={cn(
                  "flex items-center text-[10px] font-medium uppercase tracking-wider",
                  isOverdue ? "text-rose-500" : "text-muted-foreground"
                )}
              >
                <Calendar className="h-3 w-3 mr-1" />
                {format(dueDate, "dd/MM")}
              </div>
            )}
            <div className={cn("flex items-center text-[10px] font-bold uppercase tracking-wider", currentPriority.color)}>
              <Flag className="h-3 w-3 mr-1 fill-current" />
              {currentPriority.label}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditDialogOpen(true)}
            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Mover para a lixeira?</AlertDialogTitle>
                <AlertDialogDescription>
                  A tarefa{" "}
                  <span className="font-semibold text-foreground">"{task.title}"</span>{" "}
                  será movida para a lixeira.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={deleteTask}
                  className="bg-destructive hover:bg-destructive/90 text-white"
                >
                  Mover para lixeira
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <EditTaskDialog
        task={task}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUpdate={onUpdate}
      />
    </>
  );
};

export default TaskItem;
