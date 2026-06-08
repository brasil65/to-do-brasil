# Auth Context

## Estrutura

```
src/contexts/auth/
├── README.md           ← Este arquivo
├── AuthContext.tsx     → Context e Provider de autenticação
├── auth.types.ts       → Tipos TypeScript
├── auth-types.ts       → Re-exportação centralizada de tipos
└── hooks/
    └── useAuth.ts      → Hook useAuth()
```

## Responsabilidades

- Gerenciar sessão do Supabase Auth
- Escutar mudanças de estado de autenticação
- Disponibilizar `user`, `session`, `loading` e `isAuthenticated` globalmente

## Dependências

- `@supabase/supabase-js` — Cliente Supabase (via `src/integrations/supabase/client.ts`)
- `next-themes` — Já instalado, usado pelo ThemeToggle

## Decisões técnicas

- **Sem service_role no frontend**: Apenas `anon` key é usada
- **Sem `console.log`**: Erros de auth são silenciosos (usuário não autenticado = sem sessão)
- **Redirecionamento**: Feito no `ProtectedRoute` e nas pages de Login/Register