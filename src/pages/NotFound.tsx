"use client";

import { Link } from "react-router-dom";
import { Home, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth";

/**
 * Página 404 - Não Encontrada.
 *
 * Exibe mensagem amigável com opções de navegação:
 * - Voltar ao início (se autenticado)
 * - Ir para login (se não autenticado)
 */
const NotFound = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="text-center">
        <h1 className="text-8xl font-black text-slate-200 dark:text-slate-800 mb-4">404</h1>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Página não encontrada</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs mx-auto">
          Oops! A página que você procura não existe ou foi movida.
        </p>
        <div className="flex items-center justify-center gap-3">
          {isAuthenticated ? (
            <Link to="/">
              <Button className="rounded-xl">
                <Home className="mr-2 h-4 w-4" />
                Voltar ao Início
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button className="rounded-xl">
                <LogIn className="mr-2 h-4 w-4" />
                Fazer Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;