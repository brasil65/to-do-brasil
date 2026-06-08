"use client";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/auth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

/**
 * Componente raiz da aplicação.
 *
 * Providers (de fora para dentro):
 * - QueryClientProvider: cache e gerenciamento de dados da API
 * - ThemeProvider: suporte a tema claro/escuro
 * - TooltipProvider: contexto para tooltips shadcn/ui
 * - AuthProvider: sessão e autenticação Supabase
 * - BrowserRouter: roteamento SPA
 *
 * Rotas:
 * - /login → Página de login (pública)
 * - /register → Página de cadastro (pública)
 * - / → Página principal (protegida)
 * - * → 404 (pública)
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              {/* Rotas públicas */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Rotas protegidas */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Index />} />
              </Route>

              {/* Fallback 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;