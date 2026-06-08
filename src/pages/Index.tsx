"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import TaskForm from "@/components/TaskForm";
import TaskItem from "@/components/TaskItem";
import StatsOverview from "@/components/StatsOverview";
import { ListTodo, Filter, Search, Trash2, X, LayoutDashboard } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";
import { showSuccess, showError } from "@/utils/toast";
import { Button } from "@/components/ui/button";

interface Task {
  id: string;
  title: string;
  status: string;
  due_date: string | null;
  priority: string;
  category?: string;
}

type FilterStatus = "all" | "pending" | "completed";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      const priorityMap: Record<string, number> = { high: 3, medium: 2, low: 1 };
      
      const sorted = [...data].sort((a, b) => {
        if (a.status !== b.status) {
          return a.status === "pending" ? -1 : 1;
        }
        if (a.status === "pending") {
          if (a.priority !== b.priority) {
            return priorityMap[b.priority] - priorityMap[a.priority];
          }
          if (a.due_date && b.due_date) {
            return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
          }
          return a.due_date ? -1 : 1;
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      setTasks(sorted);
    }
    setLoading(false);
  };

  const clearCompleted = async () => {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("status", "completed");

    if (error) {
      showError("Erro ao limpar tarefas");
    } else {
      showSuccess("Tarefas concluídas removidas");
      fetchTasks();
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === "all" || task.status === filter;
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors duration-300">
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b dark:border-slate-800 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary p-2.5 rounded-xl text-primary-foreground shadow-lg shadow-primary/20">
              <ListTodo className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">FlowTasks</h1>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Produtividade</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-6 space-y-8">
        <StatsOverview 
          total={tasks.length} 
          completed={completedCount} 
          pending={pendingCount} 
        />

        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Pesquisar tarefas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 rounded-2xl bg-white dark:bg-slate-900 border-none shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20"
          />
          {search && (
            <button 
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <section className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <div className="h-4 w-1 bg-primary rounded-full" />
            <h2 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Adicionar Tarefa</h2>
          </div>
          <TaskForm onTaskCreated={fetchTasks} />
        </section>

        <section className="space-y-5">
          <div className="flex flex-col gap-4 px-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4 text-primary" />
                <h2 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Minha Lista</h2>
              </div>
              <div className="flex items-center gap-4">
                {completedCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearCompleted}
                    className="h-7 text-[10px] font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 uppercase tracking-wider px-2"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Limpar Feitas
                  </Button>
                )}
              </div>
            </div>
            
            <Tabs defaultValue="all" className="w-full" onValueChange={(val) => setFilter(val as FilterStatus)}>
              <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-900 p-1 h-11 rounded-xl">
                <TabsTrigger value="all" className="rounded-lg text-xs font-semibold">Todas</TabsTrigger>
                <TabsTrigger value="pending" className="rounded-lg text-xs font-semibold">Pendentes</TabsTrigger>
                <TabsTrigger value="completed" className="rounded-lg text-xs font-semibold">Concluídas</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-3">
            {loading ? (
              [1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)
            ) : filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TaskItem key={task.id} task={task} onUpdate={fetchTasks} />
              ))
            ) : (
              <div className="text-center py-16 px-6 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in duration-500">
                <div className="bg-slate-50 dark:bg-slate-800/50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Filter className="h-7 w-7 text-slate-300 dark:text-slate-600" />
                </div>
                <h3 className="text-slate-900 dark:text-white font-bold mb-1">Fim da lista</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-[200px] mx-auto">
                  {search 
                    ? `Nenhuma tarefa encontrada para "${search}"`
                    : filter === "all" 
                    ? "Você concluiu tudo! Tempo de descansar." 
                    : `Sem tarefas ${filter === "pending" ? "pendentes" : "concluídas"}.`}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;