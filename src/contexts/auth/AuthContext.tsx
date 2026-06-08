"use client";

import React, { createContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

/**
 * Tipo do contexto de autenticação.
 * Disponibiliza sessão, usuário e estado de carregamento globalmente.
 */
export interface AuthContextType {
  /** Sessão atual do Supabase Auth (null se não autenticado) */
  session: Session | null;
  /** Usuário autenticado (null se não autenticado) */
  user: User | null;
  /** Indica se a sessão ainda está sendo carregada */
  loading: boolean;
  /** Atalho booleano: true se há usuário autenticado */
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider de autenticação.
 *
 * Gerencia o ciclo de vida da sessão Supabase:
 * - Busca a sessão inicial ao montar
 * - Escuta mudanças de auth state (login, logout, refresh)
 * - Disponibiliza user, session e loading para toda a árvore
 *
 * Envolver a aplicação com este provider no App.tsx.
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        // Erro silencioso - usuário simplesmente não estará autenticado
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const value: AuthContextType = {
    session,
    user,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};