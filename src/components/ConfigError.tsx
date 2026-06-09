"use client";

import React, { useState } from "react";
import { AlertTriangle, KeyRound, Server, Copy, Check } from "lucide-react";

export const ConfigError = () => {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-50 dark:bg-amber-950 text-amber-500 rounded-2xl mb-2">
            <AlertTriangle className="h-8 w-8 animate-pulse" />
          </div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Configuração Pendente
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
            As variáveis de ambiente do Supabase não foram encontradas. Siga os passos abaixo para configurar e colocar o app no ar:
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-3 border border-slate-100 dark:border-slate-800">
            <h2 className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <Server className="h-4 w-4 text-primary" /> Ambiente Local (.env)
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Crie um arquivo <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-rose-500 font-bold">.env</code> na raiz do projeto com as chaves:
            </p>
            <div className="bg-slate-900 text-slate-200 p-3 rounded-xl text-[11px] font-mono relative overflow-x-auto">
              <button
                onClick={() => copyToClipboard("VITE_SUPABASE_URL=sua_url_do_supabase\nVITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase", "local")}
                className="absolute right-2 top-2 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Copiar código"
              >
                {copiedText === "local" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
              <pre>{`VITE_SUPABASE_URL=sua_url_aqui\nVITE_SUPABASE_ANON_KEY=sua_chave_aqui`}</pre>
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-3 border border-slate-100 dark:border-slate-800">
            <h2 className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-primary" /> Na Vercel (Produção)
            </h2>
            <ol className="list-decimal list-inside text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5 leading-relaxed">
              <li>Abra o painel do projeto na <strong>Vercel</strong>.</li>
              <li>Acesse <strong>Settings</strong> > <strong>Environment Variables</strong>.</li>
              <li>Insira as variáveis <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded text-primary font-bold">VITE_SUPABASE_URL</code> e <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded text-primary font-bold">VITE_SUPABASE_ANON_KEY</code>.</li>
              <li>Efetue um novo <strong>Redeploy</strong> na Vercel para aplicar as chaves.</li>
            </ol>
          </div>
        </div>

        <div className="pt-2 text-center">
          <p className="text-[10px] text-slate-400">
            Nenhuma credencial de acesso está exposta de forma insegura no código.
          </p>
        </div>
      </div>
    </div>
  );
};