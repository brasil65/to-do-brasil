"use client";

import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { Loader2 } from "lucide-react";

/**
 * Rota protegida que exige autenticação.
 *
 * - Se `loading`: exibe spinner centralizado
 * - Se não autenticado: redireciona para /login, preservando a rota original
 * - Se autenticado: renderiza o conteúdo filho via <Outlet />
 *
 * Uso em App.tsx:
 * ```tsx
 * <Route element={<ProtectedRoute />}>
 *   <Route path="/" element={<Index />} />
 * </Route>
 * ```
 */
const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;