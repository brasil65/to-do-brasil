"use client";

import React from "react";
import { ListTodo, Trash2, X, LogOut, PanelLeftClose, PanelLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess } from "@/utils/toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  isDesktop: boolean;
  onClose: () => void;
  onToggle: () => void;
  currentView: "dashboard" | "trash";
  onViewChange: (view: "dashboard" | "trash") => void;
}

/**
 * Sidebar com navegação entre dashboard e lixeira.
 * Design glassmorphism com tema escuro.
 */
const Sidebar = ({
  isOpen,
  isDesktop,
  onClose,
  onToggle,
  currentView,
  onViewChange,
}: SidebarProps) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    showSuccess("Logout realizado!");
  };

  const navItems = [
    { id: "dashboard" as const, label: "Tarefas", icon: ListTodo },
    { id: "trash" as const, label: "Lixeira", icon: Trash2 },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      {!isDesktop && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="fixed top-4 left-4 z-50 h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/15"
        >
          {isOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
        </Button>
      )}

      {/* Overlay for mobile */}
      {isOpen && !isDesktop && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-[260px] flex flex-col transition-transform duration-300",
          "bg-slate-900/80 backdrop-blur-xl border-r border-white/8",
          isDesktop ? "translate-x-0" : isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/8">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/20">
              <ListTodo className="h-4.5 w-4.5 text-primary" />
            </div>
            <span className="text-base font-bold text-white">FlowTasks</span>
          </div>
          {!isDesktop && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onViewChange(item.id);
                if (!isDesktop) onClose();
              }}
              className={cn(
                "w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                currentView === item.id
                  ? "bg-primary/15 text-primary border border-primary/20"
                  : "text-slate-300 hover:text-white hover:bg-white/5 border border-transparent"
              )}
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200"
          >
            <LogOut className="h-4.5 w-4.5" />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;