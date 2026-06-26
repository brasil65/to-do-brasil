"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon, Loader2, Flag, Tag, X } from "lucide-react";
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
  { id: "work", label: "Trabalho", color: "bg-blue-500" },
  { id: "personal", label: "Pessoal", color: "bg-violet-500" },
  { id: "health", label: "Saúde", color: "bg-emerald-500" },
  { id: "urgent", label: "Urgente", color: "bg-rose-500" },
];

/**
 * Barra flutuante de adição de tarefa com design pill-shaped.
 * Opções de data, prioridade e categoria integradas de forma compacta.
 */
const TaskForm = ({ onTaskCreated }: TaskFormProps) => {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("personal");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

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
      setExpanded(false);
      onTaskCreated();
    }
  };

  const priorityConfig: Record<string, { label: string; color: string }> = {
    low: { label: "Baixa", color: "text-blue-400" },
    medium: { label: "Média", color: "text-amber-400" },
    high: { label: "Alta", color: "text-rose-400" },
  };

  const categoryColor = CATEGORIES.find((c) => c.id === category)?.color || "bg-violet-500";

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={cn(
          "relative flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 transition-all duration-300",
          expanded && "ring-2 ring-primary/30 bg-white/10"
        )}
      >
        {/* Main input row */}
        <div className="flex items-center gap-3">
          <div className={cn("h-8 w-1 rounded-full transition-colors", categoryColor)} />
          <Input
            placeholder="Adicionar nova tarefa..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setExpanded(true)}
            className="flex-1 border-0 bg-transparent h-10 px-0 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
          />
          <Button
            type="submit"
            disabled={loading || !title.trim()}
            size="icon"
            className="rounded-xl h-10 w-10 p-0 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-5 w-5" />}
          </Button>
        </div>

        {/* Expanded options */}
        {expanded && (
          <div className="flex flex-wrap items-center gap-2 pt-1 animate-fade-in">
            <div className="h-4 w-px bg-white/10 mr-1" />

            {/* Date picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 rounded-lg text-xs font-medium px-3 gap-1.5 transition-colors",
                    dueDate
                      ? "bg-primary/15 text-primary hover:bg-primary/25"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}
                >
                  <CalendarIcon className="h-3.5 w-3.5" />
                  {dueDate ? format(dueDate, "dd/MM") : "Data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
              </PopoverContent>
            </Popover>

            {/* Priority */}
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="h-8 w-auto rounded-lg text-xs font-medium px-3 border-0 bg-transparent hover:bg-white/5 gap-1.5 focus:ring-0">
                <div className="flex items-center gap-1.5">
                  <Flag className={cn("h-3.5 w-3.5 fill-current", priorityConfig[priority]?.color)} />
                  <SelectValue placeholder="Prioridade" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="low" className="text-xs">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-400" />
                    Baixa
                  </span>
                </SelectItem>
                <SelectItem value="medium" className="text-xs">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    Média
                  </span>
                </SelectItem>
                <SelectItem value="high" className="text-xs">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-rose-400" />
                    Alta
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Category */}
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-8 w-auto rounded-lg text-xs font-medium px-3 border-0 bg-transparent hover:bg-white/5 gap-1.5 focus:ring-0">
                <div className="flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Categoria" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id} className="text-xs">
                    <span className="flex items-center gap-2">
                      <span className={cn("h-2 w-2 rounded-full", cat.color)} />
                      {cat.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear date */}
            {dueDate && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setDueDate(undefined)}
                className="h-8 w-8 rounded-lg p-0 text-muted-foreground hover:text-foreground hover:bg-white/5"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        )}
      </div>
    </form>
  );
};

export default TaskForm;