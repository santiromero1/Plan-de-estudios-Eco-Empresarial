/* supabase.ts — cliente único de Supabase para toda la app.
   Las credenciales viven en .env.local (no se commitean):
     VITE_SUPABASE_URL       = https://<tu-proyecto>.supabase.co
     VITE_SUPABASE_ANON_KEY  = eyJ...  (clave pública/anon, segura con RLS)
   En Vercel/Netlify se cargan como Environment Variables. */

import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    'Faltan VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. ' +
      'Copialas desde Supabase (Settings → API) a tu archivo .env.local.',
  );
}

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
