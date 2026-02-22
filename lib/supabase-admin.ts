import 'server-only';
import { createClient } from '@supabase/supabase-js';

// Admin client for server-side operations that need to bypass RLS
// Ownership is enforced manually in API handlers using NextAuth session.
// NEVER import this file in client components.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_service_key';

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
