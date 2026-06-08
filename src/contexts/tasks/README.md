# Tasks Context

## Estrutura

```
src/contexts/tasks/
├── README.md          ← Este arquivo
├── components/         → Componentes da feature
├── hooks/              → Hooks da feature
├── services/           → Serviços de API (supabase queries)
└── tasks.types.ts      → Tipos TypeScript
```

## Tabelas utilizadas

- `public.tasks` — Tarefas do usuário

## Dependências

- `src/contexts/auth/` — Autenticação (useAuth, AuthProvider)
- `src/integrations/supabase/client.ts` — Cliente Supabase

## Decisões técnicas

- Ordenação: pendentes primeiro (por prioridade e data), depois concluídas.
- Mutações via `supabase.from().insert().update().delete()` diretas.
- Acesso restrito: rota `/` protegida por `<ProtectedRoute>`.