import { createClient } from '@supabase/supabase-js';

// Use placeholder strings during SSR/build if env vars aren't present to prevent build crashes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_anon_key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations that need to bypass RLS
// (Ownership is enforced manually in API handlers using NextAuth session)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_service_key';
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
