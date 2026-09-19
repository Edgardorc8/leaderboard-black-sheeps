// ============================================================
// Supabase Client — DTodoSales Enterprise Hub
// Configura tus credenciales en .env:
//   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
//   VITE_SUPABASE_ANON_KEY=tu-anon-key
// ============================================================
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Si no hay credenciales, el cliente no se inicializa
// y el app usará mock data automáticamente
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        realtime: {
          params: { eventsPerSecond: 10 },
        },
      })
    : null;

export const isSupabaseConfigured = !!supabase;
