import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Exportamos uma flag para identificar se o Supabase está configurado corretamente
export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Valores dummy seguros apenas para evitar que a inicialização do Supabase quebre 
// na raiz do bundle quando as variáveis de ambiente reais estiverem vazias.
const fallbackUrl = "https://placeholder-project.supabase.co";
const fallbackKey = "placeholder-anon-key-preventing-fatal-initialization-errors";

export const supabase = createClient(
  isSupabaseConfigured ? SUPABASE_URL : fallbackUrl,
  isSupabaseConfigured ? SUPABASE_ANON_KEY : fallbackKey
);