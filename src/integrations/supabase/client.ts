import { createClient } from '@supabase/supabase-js';

// Obtém as credenciais das variáveis de ambiente com o prefixo VITE_
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://jtfmkkaapsvthslsseem.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0Zm1ra2FhcHN2dGhzbHNzZWVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MTcyMzQsImV4cCI6MjA5NDI5MzIzNH0.TKdwmDcfyw4qYaX9_QW4iyzlqDJM9TS8PKiasN2AN-0";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);