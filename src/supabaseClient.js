import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ojfyaolnrjmkbkcsnfwp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_86kFOYqLdl2-kptoyp6J0Q_PLOEyADo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
