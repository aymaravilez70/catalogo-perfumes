import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://aetgatjyqesjaxzvmgou.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_WlAAatd_uIADkwSKcjRYtw_rsEZKW3X';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
