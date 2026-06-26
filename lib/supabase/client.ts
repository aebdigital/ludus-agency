import { createClient } from "@supabase/supabase-js";

// Browser Supabase client. Connects to the SAME project as aeb_cms
// (project ref: ngifengeshwvyzhqvprn) — Ludus is just another tenant/site.
// Security is enforced by RLS on the ludus_* tables, so the public anon key
// is safe to ship to the browser.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY (see .env.local)"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// The site slug this CRM is scoped to inside the shared project.
export const LUDUS_SITE_SLUG = "ludus";
