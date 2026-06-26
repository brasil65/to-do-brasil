"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Task {
  id: string;
  title: string;
  due_date: string | null;
  priority: string;
}

interface EditTaskDialogProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

/**
 * Modal de edição de tarefa com título, data e prioridade.
 * Tema azul nos botões e campos de foco.
 */
const EditTaskDialog = ({ task, open, onOpenChange, onUpdate }: EditTaskDialogProps) => {
  const [title, setTitle] = useState(task.title);
  const [dueDate, setDueDate] = useState<Date | undefined>(
    task.due_date ? new Date(task.due_date) : undefined
  );
  const [priority, setPriority] = useState(task.priority || "medium");
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleUpdate = async () => {
    if (!title.trim()) return;

    setLoading(true);
    const { error } = await supabase
      .from("tasks")
      .update({
        title,
        due_date: dueDate?.toISOString() || null,
        priority,
      })
      .eq("id", task.id);

    setLoading(false);
    if (error) {
      showError("Erro ao atualizar tarefa");
    } else {
      showSuccess("Tarefa atualizada!");
      onUpdate();
      onOpenChange(false);
    }
  };

  const priorityColors = {
    low: "text-blue-500",
    medium: "text-amber-500",
    high: "text-rose-500",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Editar Tarefa</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
              Título
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="O que precisa ser feito?"
              className="rounded-xl bg-muted border-none h-12 focus-visible:ring-2 focus-visible:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
                Data
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-medium rounded-xl bg-muted border-none h-12",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "dd/MM/yyyy") : <span>Sem data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
                Prioridade
              </label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="w-full rounded-xl bg-muted border-none h-12 font-medium focus:ring-2 focus:ring-primary/20">
                  <div className="flex items-center gap-2">
                    <Flag className={cn("h-4 w-4 fill-current", priorityColors[priority as keyof typeof priorityColors])} />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter className="flex gap-2 sm:gap-0 mt-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="flex-1 sm:flex-none rounded-xl">
            Cancelar
          </Button>
          <Button
            onClick={() => setConfirmOpen(true)}
            disabled={loading}
            className="flex-1 sm:flex-none rounded-xl px-10 shadow-lg shadow-primary/20"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar Alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Salvar alterações?</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja salvar as alterações em{" "}
              <span className="font-semibold text-foreground">"{title}"</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleUpdate} className="bg-primary hover:bg-primary/90">
              Salvar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
};

export default EditTaskDialog;
