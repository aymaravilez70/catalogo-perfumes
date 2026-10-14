import { createClient } from '@supabase/supabase-js';

// Joufab Parfums - Supabase Project (Active, Clean & Free Tier)
const supabaseUrl = 'https://aetgatjyqesjaxzvmgou.supabase.co';
const supabaseAnonKey = 'sb_publishable_WlAAatd_uIADkwSKcjRYtw_rsEZKW3X';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

