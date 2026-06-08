"use client";

import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import type { AuthContextType } from "../auth-types";

/**
 * Hook para acessar o contexto de autenticação.
 *
 * Retorna o usuário atual, a sessão e estado de carregamento.
 * Disponibilizado pelo <AuthProvider> que envolve a aplicação.
 *
 * @returns {AuthContextType} Objeto com session, user e loading.
 *
 * @example
 * ```tsx
 * const { user, loading, isAuthenticated } = useAuth();
 *
 * if (loading) return <Skeleton />;
 * if (!isAuthenticated) return <Navigate to="/login" />;
 * return <Dashboard user={user} />;
 * ```
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um <AuthProvider>");
  }

  return context;
};