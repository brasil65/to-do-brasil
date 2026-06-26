"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import TaskForm from "@/components/TaskForm";
import TaskItem from "@/components/TaskItem";
import StatsOverview from "@/components/StatsOverview";
import { Trash2, X, ListTodo, User, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
        return new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime();
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
    return filter === "all" || task.status === filter;
  });

  const completedCount = activeTasks.filter((t) => t.status === "completed").length;
  const pendingCount = activeTasks.length - completedCount;

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1920&q=80')`,
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-950/90 to-indigo-950/95"
          aria-hidden="true"
        />
        {/* Decorative orbs */}
        <div
          className="absolute top-20 left-10 w-72 h-72 bg-blue-500/8 rounded-full blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/8 rounded-full blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-3xl"
          aria-hidden="true"
        />
      </div>

      {/* Sidebar */}
      <Sidebar
        isOpen={isOpen}
        isDesktop={isDesktop}
        onClose={close}
        onToggle={toggle}
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      {/* Main content */}
      <div
        className={`relative z-10 min-h-screen transition-all duration-300 ${
          isDesktop ? "ml-[260px]" : ""
        }`}
      >
        <main className="max-w-2xl mx-auto px-4 pt-6 lg:pt-6 pb-24 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            {user && (
              <div className="flex items-center gap-3">
                <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-xl border border-white/10">
                  <User className="h-5 w-5 text-blue-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {user.user_metadata?.full_name || "Estudante"}
                  </p>
                  <p className="text-xs text-slate-400">{maskEmail(user.email || "")}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-medium text-slate-300">ADS Edition</span>
            </div>
          </div>

          {currentView === "dashboard" && (
            <>
              {/* Stats */}
              <StatsOverview
                total={activeTasks.length}
                completed={completedCount}
                pending={pendingCount}
              />

              {/* Task Form */}
              <section>
                <TaskForm onTaskCreated={fetchTasks} />
              </section>

              {/* Task List */}
              <section className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <ListTodo className="h-4 w-4 text-blue-400" />
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                      Minhas Tarefas
                    </h2>
                  </div>
                  {completedCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setConfirmClear(true)}
                      className="h-8 text-[11px] font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg px-3"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                      Limpar Feitas
                    </Button>
                  )}
                </div>

                {/* Filter Tabs */}
                <Tabs
                  defaultValue="all"
                  className="w-full"
                  onValueChange={(val) => setFilter(val as FilterStatus)}
                >
                  <TabsList className="grid w-full grid-cols-3 bg-white/5 backdrop-blur-sm border border-white/8 p-1 h-11 rounded-xl">
                    <TabsTrigger
                      value="all"
                      className="rounded-lg text-xs font-semibold text-slate-300 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg"
                    >
                      Todas
                    </TabsTrigger>
                    <TabsTrigger
                      value="pending"
                      className="rounded-lg text-xs font-semibold text-slate-300 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg"
                    >
                      Pendentes
                    </TabsTrigger>
                    <TabsTrigger
                      value="completed"
                      className="rounded-lg text-xs font-semibold text-slate-300 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg"
                    >
                      Concluídas
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                {/* Task items */}
                <div className="space-y-2.5">
                  {loading ? (
                    [1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-20 w-full rounded-2xl bg-white/5" />
                    ))
                  ) : filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                      <TaskItem key={task.id} task={task} onUpdate={fetchTasks} />
                    ))
                  ) : (
                    <div className="text-center py-20 px-6 rounded-3xl border border-dashed border-white/10 bg-white/5 backdrop-blur-sm">
                      <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <ListTodo className="h-7 w-7 text-slate-400" />
                      </div>
                      <h3 className="text-white font-bold mb-1">Nenhuma tarefa</h3>
                      <p className="text-slate-400 text-sm max-w-[220px] mx-auto">
                        {filter === "all"
                          ? "Adicione sua primeira tarefa acima!"
                          : `Sem tarefas ${
                              filter === "pending" ? "pendentes" : "concluídas"
                            }.`}
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
            <section className="space-y-4">
              <div className="flex items-center gap-2.5">
                <Trash2 className="h-4 w-4 text-rose-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
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
                <div className="text-center py-20 px-6 rounded-3xl border border-dashed border-white/10 bg-white/5 backdrop-blur-sm">
                  <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="h-7 w-7 text-slate-400" />
                  </div>
                  <h3 className="text-white font-bold mb-1">Lixeira vazia</h3>
                  <p className="text-slate-400 text-sm max-w-[220px] mx-auto">
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