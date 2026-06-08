"use client";

import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { useAuth } from "@/contexts/auth";
import { ListTodo, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Schema de validação do formulário de login.
 * Email deve ser válido, senha deve ter pelo menos 6 caracteres.
 */
const loginSchema = z.object({
  email: z.string().email("Email inválido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

/**
 * Página de Login.
 *
 * - Valida email e senha com Zod
 * - Autentica via Supabase Auth (signInWithPassword)
 * - Redireciona para a rota original (se houver) ou para "/"
 * - Exibe link para a página de cadastro
 */
const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Redireciona se já estiver autenticado
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    setLoading(false);

    if (error) {
      showError(error.message === "Invalid login credentials"
        ? "Email ou senha incorretos."
        : `Erro ao entrar: ${error.message}`
      );
    } else {
      showSuccess("Login realizado com sucesso!");
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-primary p-3 rounded-2xl text-primary-foreground shadow-lg shadow-primary/20">
          <ListTodo className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
            FlowTasks
          </h1>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">
            Produtividade
          </p>
        </div>
      </div>

      {/* Card de Login */}
      <Card className="w-full max-w-md rounded-3xl border-none shadow-xl shadow-slate-200/50 dark:shadow-none">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              Bem-vindo de volta
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Entre na sua conta para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Campo Email */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1"
              >
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  {...register("email")}
                  className="pl-10 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border-none focus-visible:ring-2 focus-visible:ring-primary/20"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-500 ml-1">{errors.email.message}</p>
              )}
            </div>

            {/* Campo Senha */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1"
              >
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className="pl-10 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border-none focus-visible:ring-2 focus-visible:ring-primary/20"
                />
              </div>
              {errors.password && (
                <p className="text-xs text-rose-500 ml-1">{errors.password.message}</p>
              )}
            </div>

            {/* Botão Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl font-semibold shadow-lg shadow-primary/20 mt-2"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Entrar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Link para Cadastro */}
          <div className="text-center mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Não tem uma conta?{" "}
              <Link
                to="/register"
                className="text-primary font-semibold hover:underline"
              >
                Criar conta
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;