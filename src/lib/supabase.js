import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://teaiezgbecvdqxysjcfd.supabase.co';

const supabaseKey = 'sb_publishable_XVY3N_y2Pr4yNj0Bnuga-A_Lshoa2DF';

export const supabase = createClient(supabaseUrl, supabaseKey);
