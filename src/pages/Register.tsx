"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { ListTodo, Mail, Lock, User, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Schema de validação do formulário de cadastro.
 * Nome: mínimo 2 caracteres.
 * Email: formato válido.
 * Senha: mínimo 6 caracteres.
 * Confirmar senha: deve ser igual à senha.
 */
const registerSchema = z
  .object({
    fullName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres."),
    email: z.string().email("Email inválido."),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
    confirmPassword: z.string().min(1, "Confirme sua senha."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

/**
 * Página de Cadastro (Registro).
 *
 * - Valida nome, email, senha e confirmação com Zod
 * - Cria conta via Supabase Auth (signUp)
 * - Redireciona para "/" após cadastro bem-sucedido
 * - Exibe link para a página de login
 */
const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
        },
      },
    });

    setLoading(false);

    if (error) {
      showError(`Erro ao criar conta: ${error.message}`);
    } else {
      showSuccess("Conta criada com sucesso! Você já pode entrar.");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center px-4 py-8">
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

      {/* Card de Cadastro */}
      <Card className="w-full max-w-md rounded-3xl border-none shadow-xl shadow-slate-200/50 dark:shadow-none">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              Criar sua conta
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Comece a organizar suas tarefas agora
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Campo Nome */}
            <div className="space-y-2">
              <Label
                htmlFor="fullName"
                className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1"
              >
                Nome
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Seu nome completo"
                  {...register("fullName")}
                  className="pl-10 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border-none focus-visible:ring-2 focus-visible:ring-primary/20"
                />
              </div>
              {errors.fullName && (
                <p className="text-xs text-rose-500 ml-1">{errors.fullName.message}</p>
              )}
            </div>

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
                  placeholder="Mínimo 6 caracteres"
                  {...register("password")}
                  className="pl-10 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border-none focus-visible:ring-2 focus-visible:ring-primary/20"
                />
              </div>
              {errors.password && (
                <p className="text-xs text-rose-500 ml-1">{errors.password.message}</p>
              )}
            </div>

            {/* Campo Confirmar Senha */}
            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1"
              >
                Confirmar Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repita a senha"
                  {...register("confirmPassword")}
                  className="pl-10 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border-none focus-visible:ring-2 focus-visible:ring-primary/20"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-rose-500 ml-1">{errors.confirmPassword.message}</p>
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
                  Criar conta
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Link para Login */}
          <div className="text-center mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Já tem uma conta?{" "}
              <Link
                to="/login"
                className="text-primary font-semibold hover:underline"
              >
                Entrar
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;