"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { showSuccess, showError } from "@/utils/toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TaskFormProps {
  onTaskCreated: () => void;
}

const TaskForm = ({ onTaskCreated }: TaskFormProps) => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !user) return;

    setLoading(true);
    const { error } = await supabase.from("tasks").insert([
      {
        title: title.trim(),
        user_id: user.id,
        due_date: dueDate?.toISOString() || null,
        status: "pending",
      },
    ]);

    setLoading(false);
    if (error) {
      showError("Erro ao criar tarefa");
    } else {
      showSuccess("Tarefa criada!");
      setTitle("");
      setDueDate(undefined);
      onTaskCreated();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-1">
      <div className="flex gap-2">
        <Input
          placeholder="O que você precisa fazer?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 rounded-xl bg-white border-none shadow-sm h-12 px-4 focus-visible:ring-2 focus-visible:ring-primary/20"
        />
        <Button 
          type="submit" 
          disabled={loading || !title.trim()} 
          className="rounded-xl h-12 w-12 p-0 shadow-lg shadow-primary/20"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-6 w-6" />}
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 rounded-full text-[11px] font-bold uppercase tracking-wider px-3",
                dueDate ? "bg-primary/10 text-primary hover:bg-primary/20" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
              {dueDate ? format(dueDate, "dd/MM/yyyy") : "Adicionar data"}
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
        
        {dueDate && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setDueDate(undefined)}
            className="h-8 w-8 p-0 rounded-full text-slate-400 hover:text-destructive"
          >
            ×
          </Button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;