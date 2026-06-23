"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon, Loader2, Flag, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskFormProps {
  onTaskCreated: () => void;
}

const CATEGORIES = [
  { id: "work", label: "Trabalho", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
  { id: "personal", label: "Pessoal", color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" },
  { id: "health", label: "Saúde", color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
  { id: "urgent", label: "Urgente", color: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" },
];

const TaskForm = ({ onTaskCreated }: TaskFormProps) => {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("personal");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      showError("Sessão expirada. Faça login novamente.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("tasks").insert([
      {
        title: title.trim(),
        due_date: dueDate?.toISOString() || null,
        priority,
        category,
        status: "pending",
        user_id: user.id,
      },
    ]);

    setLoading(false);
    if (error) {
      showError(`Erro: ${error.message}`);
    } else {
      showSuccess("Tarefa criada!");
      setTitle("");
      setDueDate(undefined);
      setPriority("medium");
      onTaskCreated();
    }
  };

  const priorityColors = {
    low: "text-blue-500",
    medium: "text-amber-500",
    high: "text-rose-500",
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-1">
      <div className="flex gap-2">
        <Input
          placeholder="O que você precisa fazer?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 rounded-xl bg-white dark:bg-slate-900 border-none shadow-sm h-12 px-4 focus-visible:ring-2 focus-visible:ring-primary/20"
        />
        <Button
          type="submit"
          disabled={loading || !title.trim()}
          className="rounded-xl h-12 w-12 p-0 shadow-lg shadow-primary/20"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-6 w-6" />}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 rounded-full text-[10px] font-bold uppercase tracking-wider px-3",
                dueDate ? "bg-primary/10 text-primary hover:bg-primary/20" : "text-slate-400 hover:text-slate-600 dark:text-slate-500"
              )}
            >
              <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
              {dueDate ? format(dueDate, "dd/MM") : "Data"}
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

        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="h-8 w-auto rounded-full text-[10px] font-bold uppercase tracking-wider px-3 border-none bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 shadow-none focus:ring-0">
            <div className="flex items-center gap-1.5">
              <Flag className={cn("h-3 w-3 fill-current", priorityColors[priority as keyof typeof priorityColors])} />
              <SelectValue placeholder="Prioridade" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="low" className="text-xs">Baixa</SelectItem>
            <SelectItem value="medium" className="text-xs">Média</SelectItem>
            <SelectItem value="high" className="text-xs">Alta</SelectItem>
          </SelectContent>
        </Select>

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="h-8 w-auto rounded-full text-[10px] font-bold uppercase tracking-wider px-3 border-none bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 shadow-none focus:ring-0">
            <div className="flex items-center gap-1.5">
              <Tag className="h-3 w-3 text-slate-400" />
              <SelectValue placeholder="Categoria" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {CATEGORIES.map(cat => (
              <SelectItem key={cat.id} value={cat.id} className="text-xs">{cat.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </form>
  );
};

export default TaskForm;