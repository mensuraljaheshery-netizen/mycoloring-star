import { createClient } from '@supabase/supabase-js';

const url =
  process.env.NEXT_PUBLIC_NEXT_PUBLIC_SUPABASE_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://jjvjojevlxqykdzlpvqv.supabase.co';
const key =
  process.env.NEXT_PUBLIC_SUPABASE_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

export const supabase = createClient(url, key);
