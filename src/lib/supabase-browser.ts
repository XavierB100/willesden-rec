import { createClient } from "@supabase/supabase-js";

declare global {
  // Keeps React Strict Mode and dev hot reload from creating competing auth clients.
  var willesdenSupabaseClient: ReturnType<typeof createClient> | undefined;
}

export function createBrowserSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  globalThis.willesdenSupabaseClient ??= createClient(url, key);
  return globalThis.willesdenSupabaseClient;
}
