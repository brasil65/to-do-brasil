import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import { ListTodo, Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { showSuccess, showError } from "@/utils/toast";

/**
 * Authentication form component with login/register tabs,
 * field validation, loading states, and glassmorphism styling.
 */
export const AuthForm: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    if (user && !authLoading) {
      navigate("/", { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showError("Preencha todos os campos");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      showError(error.message);
    } else {
      showSuccess("Login realizado com sucesso!");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      showError("Preencha todos os campos");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });
    setLoading(false);

    if (error) {
      showError(error.message);
    } else {
      showSuccess("Cadastro realizado! Verifique seu email.");
      setMode("login");
    }
  };

  if (user) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 lg:p-8">
      {/* Mobile Logo (visible below lg) */}
      <div className="lg:hidden text-center mb-6">
        <div className="inline-flex items-center gap-2 mb-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 shadow-lg shadow-blue-500/30">
            <ListTodo className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">FlowTasks</span>
        </div>
        <p className="text-sm text-slate-300">Organize suas tarefas de forma simples</p>
      </div>

      {/* Glassmorphism Card */}
      <div className="w-full max-w-md animate-fade-in">
        <div className="relative rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl shadow-black/20 dark:bg-slate-900/40 overflow-hidden">
          {/* Card internal glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

          <div className="relative p-8 pt-10">
            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white dark:text-white mb-1">
                {mode === "login" ? "Bem-vindo de volta" : "Criar conta"}
              </h2>
              <p className="text-sm text-slate-300 dark:text-slate-400">
                {mode === "login"
                  ? "Entre na sua conta para continuar"
                  : "Preencha os dados para se cadastrar"}
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex rounded-2xl bg-white/10 dark:bg-slate-800/50 p-1.5 mb-8">
              <button
                onClick={() => setMode("login")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  mode === "login"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
                aria-selected={mode === "login"}
                role="tab"
              >
                Entrar
              </button>
              <button
                onClick={() => setMode("register")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  mode === "register"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
                aria-selected={mode === "register"}
                role="tab"
              >
                Cadastrar
              </button>
            </div>

            {/* */}
            <div className={mode === "login" ? "animate-fade-in" : "hidden"}>
              <form onSubmit={handleLogin} className="space-y-5">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-sm font-medium text-slate-200">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      className={`pl-11 h-12 rounded-2xl bg-white/10 dark:bg-slate-800/50 border-white/15 text-white placeholder:text-slate-500 transition-all duration-200 ${
                        focusedField === "email"
                          ? "border-blue-400 ring-2 ring-blue-400/20"
                          : "border-white/15 hover:border-white/25"
                      }`}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-sm font-medium text-slate-200">
                    Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      className={`pl-11 h-12 rounded-2xl bg-white/10 dark:bg-slate-800/50 border-white/15 text-white placeholder:text-slate-500 transition-all duration-200 ${
                        focusedField === "password"
                          ? "border-blue-400 ring-2 ring-blue-400/20"
                          : "border-white/15 hover:border-white/25"
                      }`}
                    />
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-2xl font-semibold text-base bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Entrando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Entrar
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>
            </div>

            <div className={mode === "register" ? "animate-fade-in" : "hidden"}>
              <form onSubmit={handleRegister} className="space-y-5">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="register-name" className="text-sm font-medium text-slate-200">
                    Nome
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Seu nome"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      className={`pl-11 h-12 rounded-2xl bg-white/10 dark:bg-slate-800/50 border-white/15 text-white placeholder:text-slate-500 transition-all duration-200 ${
                        focusedField === "name"
                          ? "border-blue-400 ring-2 ring-blue-400/20"
                          : "border-white/15 hover:border-white/25"
                      }`}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-sm font-medium text-slate-200">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      className={`pl-11 h-12 rounded-2xl bg-white/10 dark:bg-slate-800/50 border-white/15 text-white placeholder:text-slate-500 transition-all duration-200 ${
                        focusedField === "email"
                          ? "border-blue-400 ring-2 ring-blue-400/20"
                          : "border-white/15 hover:border-white/25"
                      }`}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-sm font-medium text-slate-200">
                    Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      className={`pl-11 h-12 rounded-2xl bg-white/10 dark:bg-slate-800/50 border-white/15 text-white placeholder:text-slate-500 transition-all duration-200 ${
                        focusedField === "password"
                          ? "border-blue-400 ring-2 ring-blue-400/20"
                          : "border-white/15 hover:border-white/25"
                      }`}
                    />
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-2xl font-semibold text-base bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Criando conta...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Criar conta
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-xs text-center text-slate-400">
                Ao continuar, você concorda com nossos{" "}
                <a href="#" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                  Termos de Uso
                </a>{" "}
                e{" "}
                <a href="#" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                  Política de Privacidade
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
