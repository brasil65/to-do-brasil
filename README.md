# FlowTasks

> Um aplicativo moderno de gerenciamento de tarefas (to-do list) com autenticação, lixeira, prioridades e visualização de estatísticas.

---

## Objetivo

O FlowTasks é uma aplicação web para controle de tarefas pessoais, focado em simplicidade e produtividade. Permite que estudantes e profissionais organizem suas atividades com prioridades, datas de vencimento e categorização visual.

---

## Funcionalidades

- **Autenticação** — Login e registro via Supabase Auth (email/senha)
- **CRUD de tarefas** — Criar, editar, concluir e excluir tarefas
- **Prioridades** — Alta, média e baixa, com ordenação automática
- **Filtros** — Visualizar todas, pendentes ou concluídas
- **Lixeira** — Soft delete com opção de restauração ou exclusão permanente
- **Estatísticas** — Painel com contagem de tarefas totais, pendentes e concluídas
- **Limpeza em lote** — Mover todas as concluídas para a lixeira de uma vez
- **Interface responsiva** — Sidebar colapsável, layout adaptável para mobile e desktop
- **Tema escuro** — Visual moderno com gradientes e glassmorphism

---

## Stack Tecnológica

| Camada | Tecnologia |
|--------|------------|
| Front-end | React 18, TypeScript, Vite |
| UI | shadcn/ui, Tailwind CSS, Radix UI |
| Ícones | lucide-react |
| Formulários | React Hook Form + Zod |
| Roteamento | React Router |
| Estado/Dados | TanStack Query |
| Autenticação | Supabase Auth |
| Back-end | Supabase (PostgreSQL, RLS, PostgREST) |
| Notificações | sonner |
| Temas | next-themes |

---

## Estrutura do Projeto

```
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── AuthProvider.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── Sidebar.tsx
│   │   ├── StatsOverview.tsx
│   │   ├── TaskForm.tsx
│   │   ├── TaskItem.tsx
│   │   ├── TrashItem.tsx
│   │   ├── TrashSection.tsx
│   │   └── ui/              # shadcn/ui (não modificar)
│   ├── pages/               # Páginas (composição apenas)
│   │   ├── Index.tsx
│   │   ├── Login.tsx
│   │   └── NotFound.tsx
│   ├── hooks/               # Hooks customizados
│   ├── lib/                 # Utilitários
│   ├── integrations/        # Clientes externos (Supabase)
│   ├── App.tsx              # Rotas
│   └── main.tsx             # Entry point
├── supabase/
│   └── migrations/          # Migrations do banco
├── docs/                    # Guias de boas práticas
├── AI_RULES.md              # Regras do projeto
└── package.json
```

---

## Instalação e Configuração

### Pré-requisitos

- Node.js 18+
- npm ou pnpm
- Uma conta no [Supabase](https://supabase.com)

### Passo a passo

```bash
# 1. Clone o repositório
git clone <repo-url>
cd flowtasks

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
```

### Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
```

> **Importante:** Nunca exponha a `service_role` key no front-end. Use apenas a `anon` key.

### Configuração do Supabase

1. Crie um novo projeto no Supabase
2. Execute a migration `supabase/migrations/` para criar a tabela `tasks`
3. Configure as políticas de RLS (Row Level Security) conforme `docs/backend.md`
4. Habilite autenticação por email no painel do Supabase

### Rodando o projeto

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview
```

A aplicação estará disponível em `http://localhost:5173`.

---

## Guia de Uso

1. **Registro/Login** — Crie uma conta ou faça login com email e senha
2. **Criar tarefa** — Preencha o título, selecione prioridade e data de vencimento
3. **Gerenciar tarefas** — Filtre por status, marque como concluída ou exclua
4. **Lixeira** — Tarefas excluídas vão para a lixeira; restaure ou exclua permanentemente
5. **Estatísticas** — Acompanhe seu progresso no painel superior

---

## Arquitetura

### Front-end

- **Componentes** — Pequenos e focados (máx. 150 linhas). Lógica extraída para hooks quando necessário.
- **Páginas** — Apenas composição de componentes (máx. 120 linhas). Sem lógica direta.
- **Estado** — Context API para auth; TanStack Query para dados do servidor.
- **Roteamento** — React Router com rotas protegidas (`ProtectedRoute`).
- **Estilização** — Tailwind CSS com classes condicionais via `cn()`. Sem CSS customizado.

### Back-end (Supabase)

- **Tabela `tasks`** — Armazena todas as tarefas com `user_id` para isolamento
- **RLS (Row Level Security)** — Usuários só acessam suas próprias tarefas
- **Soft delete** — Coluna `deleted_at` para funcionalidade de lixeira
- **Grants** — Permissões explícitas para `authenticated` e `service_role`

### Segurança

- `.env` nunca commitado (no `.gitignore`)
- Apenas `anon` key no front-end
- RLS policies impedem acesso cruzado entre usuários
- Validação de inputs com Zod antes do envio

---

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch: `feature/*` ou `fix/*`
3. Faça commits com mensagens claras
4. Abra um Pull Request para `main`

### Regras de código

- TypeScript estrito — sem `any`
- JSDoc em componentes, hooks e funções utilitárias
- Comentários explicam o *porquê*, nunca o óbvio
- Named exports para componentes de feature
- Imports absolutos com alias `@/`

---

## Licença

Projeto acadêmico — uso educacional.
