import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const getSupabaseClient = (): SupabaseClient => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};
