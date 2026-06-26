"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import TaskForm from "@/components/TaskForm";
import TaskItem from "@/components/TaskItem";
import StatsOverview from "@/components/StatsOverview";
import { Filter, Search, Trash2, X, ListTodo, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { showSuccess, showError } from "@/utils/toast";
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
import { useAuth } from "@/components/AuthProvider";
import TrashSection from "@/components/TrashSection";
import Sidebar from "@/components/Sidebar";
import { useSidebar } from "@/hooks/useSidebar";

interface Task {
  id: string;
  title: string;
  status: string;
  due_date: string | null;
  priority: string;
  category?: string;
  deleted_at: string | null;
  created_at?: string;
}

type FilterStatus = "all" | "pending" | "completed";

/**
 * Trunca o email para exibição, mostrando apenas os 3 primeiros caracteres
 * e o domínio. Protege privacidade em cenários de dispositivo compartilhado.
 *
 * Ex: "joao.silva@empresa.com" → "joa***@empresa.com"
 */
const maskEmail = (email: string): string => {
  const [localPart, domain] = email.split("@");
  if (!domain) return "***";
  const visible = localPart.substring(0, 3);
  return `${visible}***@${domain}`;
};

const Index = () => {
  const { user } = useAuth();
  const { isOpen, isDesktop, toggle, close } = useSidebar();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);
  const [currentView, setCurrentView] = useState<"dashboard" | "trash">("dashboard");

  const fetchTasks = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      const priorityMap: Record<string, number> = { high: 3, medium: 2, low: 1 };

      const sorted = [...data].sort((a, b) => {
        if (a.status !== b.status) {
          return a.status === "pending" ? -1 : 1;
        }
        if (a.status === "pending") {
          if (a.priority !== b.priority) {
            return (priorityMap[b.priority] || 0) - (priorityMap[a.priority] || 0);
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
    if (!user) return;

    const { error } = await supabase
      .from("tasks")
      .update({ deleted_at: new Date().toISOString() })
      .eq("status", "completed")
      .eq("user_id", user.id)
      .is("deleted_at", null);

    if (error) {
      showError("Erro ao limpar tarefas");
    } else {
      showSuccess("Tarefas concluídas movidas para a lixeira");
      fetchTasks();
    }
  };

  const emptyTrash = async () => {
    if (!user) return;

    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("user_id", user.id)
      .not("deleted_at", "is", null);

    if (error) {
      showError("Erro ao esvaziar lixeira");
    } else {
      showSuccess("Lixeira esvaziada");
      fetchTasks();
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const activeTasks = tasks.filter((t) => !t.deleted_at);
  const deletedTasks = tasks.filter((t) => !!t.deleted_at);

  const filteredTasks = activeTasks.filter((task) => {
    const matchesFilter = filter === "all" || task.status === filter;
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const completedCount = activeTasks.filter((t) => t.status === "completed").length;
  const pendingCount = activeTasks.length - completedCount;

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar
        isOpen={isOpen}
        isDesktop={isDesktop}
        onClose={close}
        onToggle={toggle}
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      {/* Main content area */}
      <div
        className={`min-h-screen transition-all duration-300 ${
          isDesktop ? "ml-[260px]" : ""
        }`}
      >
        <main className="max-w-2xl mx-auto px-4 pt-16 lg:pt-8 pb-20 space-y-6">
          {/* User info */}
          {user && (
            <div className="flex items-center gap-3 px-1 pt-2">
              <div className="bg-primary/10 p-2 rounded-xl">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {user.user_metadata?.full_name || "Usuário"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {maskEmail(user.email)}
                </p>
              </div>
            </div>
          )}

          {currentView === "dashboard" && (
            <>
              <StatsOverview
                total={activeTasks.length}
                completed={completedCount}
                pending={pendingCount}
              />

              {/* Search */}
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Pesquisar tarefas..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-11 rounded-2xl bg-card border-border shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Task Form */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <div className="h-4 w-1 bg-primary rounded-full" />
                  <h2 className="text-xs font-black text-foreground/70 uppercase tracking-widest">
                    Adicionar Tarefa
                  </h2>
                </div>
                <TaskForm onTaskCreated={fetchTasks} />
              </section>

              {/* Task List */}
              <section className="space-y-5">
                <div className="flex flex-col gap-4 px-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ListTodo className="h-4 w-4 text-primary" />
                      <h2 className="text-xs font-black text-foreground/70 uppercase tracking-widest">
                        Minha Lista
                      </h2>
                    </div>
                    <div className="flex items-center gap-4">
                      {completedCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setConfirmClear(true)}
                          className="h-7 text-[10px] font-bold text-destructive hover:text-destructive hover:bg-destructive/10 uppercase tracking-wider px-2"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Limpar Feitas
                        </Button>
                      )}
                    </div>
                  </div>

                  <Tabs
                    defaultValue="all"
                    className="w-full"
                    onValueChange={(val) => setFilter(val as FilterStatus)}
                  >
                    <TabsList className="grid w-full grid-cols-3 bg-muted p-1 h-11 rounded-xl">
                      <TabsTrigger value="all" className="rounded-lg text-xs font-semibold">
                        Todas
                      </TabsTrigger>
                      <TabsTrigger value="pending" className="rounded-lg text-xs font-semibold">
                        Pendentes
                      </TabsTrigger>
                      <TabsTrigger value="completed" className="rounded-lg text-xs font-semibold">
                        Concluídas
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="space-y-3">
                  {loading ? (
                    [1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-20 w-full rounded-2xl" />
                    ))
                  ) : filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                      <TaskItem key={task.id} task={task} onUpdate={fetchTasks} />
                    ))
                  ) : (
                    <div className="text-center py-16 px-6 bg-card rounded-3xl border border-dashed border-border shadow-sm animate-in fade-in duration-500">
                      <div className="bg-muted w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Filter className="h-7 w-7 text-muted-foreground" />
                      </div>
                      <h3 className="text-foreground font-bold mb-1">Fim da lista</h3>
                      <p className="text-muted-foreground text-sm max-w-[200px] mx-auto">
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

              {deletedTasks.length > 0 && (
                <TrashSection
                  deletedTasks={deletedTasks}
                  onRefresh={fetchTasks}
                  onEmptyTrash={emptyTrash}
                />
              )}
            </>
          )}

          {currentView === "trash" && (
            <section className="space-y-5">
              <div className="flex items-center gap-2 px-1">
                <Trash2 className="h-4 w-4 text-destructive" />
                <h2 className="text-xs font-black text-foreground/70 uppercase tracking-widest">
                  Lixeira
                </h2>
              </div>
              {deletedTasks.length > 0 ? (
                <TrashSection
                  deletedTasks={deletedTasks}
                  onRefresh={fetchTasks}
                  onEmptyTrash={emptyTrash}
                />
              ) : (
                <div className="text-center py-16 px-6 bg-card rounded-3xl border border-dashed border-border shadow-sm">
                  <div className="bg-muted w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <h3 className="text-foreground font-bold mb-1">Lixeira vazia</h3>
                  <p className="text-muted-foreground text-sm max-w-[200px] mx-auto">
                    Nenhuma tarefa na lixeira.
                  </p>
                </div>
              )}
            </section>
          )}
        </main>
      </div>

      {/* Confirm clear dialog */}
      <AlertDialog open={confirmClear} onOpenChange={setConfirmClear}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Limpar concluídas?</AlertDialogTitle>
            <AlertDialogDescription>
              Todas as tarefas concluídas serão movidas para a lixeira.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={clearCompleted}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              Limpar concluídas
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
