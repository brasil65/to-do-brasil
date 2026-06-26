"use client";

import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Página 404 com tema azul consistente com o restante da aplicação.
 */
const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-950 dark:via-slate-950 dark:to-blue-950">
      <div className="text-center px-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-3xl mb-6">
          <AlertTriangle className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-6xl font-black text-primary mb-2">404</h1>
        <p className="text-xl text-foreground font-semibold mb-2">
          Página não encontrada
        </p>
        <p className="text-muted-foreground mb-8 max-w-xs mx-auto">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link to="/">
          <Button className="rounded-xl shadow-lg shadow-primary/20 h-12 px-6 font-semibold">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Início
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
