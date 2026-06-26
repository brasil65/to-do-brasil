"use client";

import React from "react";
import {
  LayoutDashboard,
  ListTodo,
  Trash2,
  LogOut,
  Moon,
  Sun,
  X,
  ListChecks,
  Menu,
} from "lucide-react";
import { useTheme } from "next-themes";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
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
 * Componente de navegação lateral (sidebar).
 * Desktop: sidebar fixa de 260px.
 * Mobile: overlay com backdrop escuro e botão de fechar.
 */
const Sidebar = ({
  isOpen,
  isDesktop,
  onClose,
  onToggle,
  currentView,
  onViewChange,
}: SidebarProps) => {
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showError("Erro ao sair");
    } else {
      showSuccess("Até logo!");
    }
  };

  const handleViewChange = (view: "dashboard" | "trash") => {
    onViewChange(view);
    if (!isDesktop) onClose();
  };

  const navItems = [
    {
      id: "dashboard" as const,
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "trash" as const,
      label: "Lixeira",
      icon: Trash2,
    },
  ];

  return (
    <>
      {/* Mobile hamburger button */}
      {!isDesktop && (
        <button
          onClick={onToggle}
          className="fixed top-4 left-4 z-50 p-2.5 bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/20 lg:hidden"
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}

      {/* Backdrop overlay for mobile */}
      {!isDesktop && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-[260px] flex flex-col transition-transform duration-300 ease-in-out",
          "bg-sidebar text-sidebar-foreground",
          isDesktop
            ? "translate-x-0"
            : isOpen
            ? "translate-x-0"
            : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-xl text-primary-foreground shadow-lg shadow-primary/20">
              <ListChecks className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">
                FlowTasks
              </h1>
              <p className="text-[10px] text-sidebar-foreground/70 font-medium uppercase tracking-wider">
                Produtividade
              </p>
            </div>
          </div>
          {!isDesktop && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground/70 hover:text-white transition-colors"
              aria-label="Fechar menu"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleViewChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-white"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-sidebar-border space-y-1">
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-white transition-all duration-200"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
            {theme === "light" ? "Modo Escuro" : "Modo Claro"}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-sidebar-foreground/80 hover:bg-destructive hover:text-white transition-all duration-200"
          >
            <LogOut className="h-5 w-5" />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
