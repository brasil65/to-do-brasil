import React from "react";
import { ListTodo, CheckCircle2, Sparkles } from "lucide-react";

/**
 * Branding area displayed on the left side in desktop layout.
 * Shows logo, app name, tagline, and feature highlights.
 * Only visible on lg+ screens.
 */
export const AuthBranding: React.FC = () => {
  const features = [
    { icon: CheckCircle2, text: "Organize tarefas com simplicidade" },
    { icon: Sparkles, text: "Interface intuitiva e moderna" },
  ];

  return (
    <div className="hidden lg:flex lg:flex-col lg:justify-between h-full p-12 xl:p-16">
      {/* Top - Logo and Brand */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20">
            <ListTodo className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">FlowTasks</span>
        </div>
      </div>

      {/* Center - Welcome Message */}
      <div className="my-auto">
        <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
          Organize suas tarefas
          <br />
          <span className="bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
            de forma simples
          </span>
        </h1>
        <p className="text-lg text-slate-300 mb-10 max-w-md leading-relaxed">
          Simplifique seu dia a dia com uma ferramenta poderosa e intuitiva para gerenciar suas tarefas.
        </p>

        {/* Feature list */}
        <div className="space-y-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center">
                <feature.icon className="h-5 w-5 text-blue-300" />
              </div>
              <span className="text-slate-200 text-sm font-medium">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom - Footer */}
      <div>
        <p className="text-sm text-slate-400">
          © {new Date().getFullYear()} FlowTasks. Desenvolvido por FREDERICO BRASIL.
        </p>
      </div>
    </div>
  );
};
