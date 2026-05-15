# Correção do Banco de Dados

Execute o código abaixo no SQL Editor do Supabase para adicionar as colunas faltantes que o aplicativo está tentando utilizar:

```sql
-- Adiciona colunas de Categoria e Prioridade
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'personal',
ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium';

-- Permite que a tarefa seja criada sem um user_id obrigatório (opcional)
ALTER TABLE tasks 
ALTER COLUMN user_id DROP NOT NULL;
```

Isso resolverá o erro `PGRST204` (Column not found in schema cache).