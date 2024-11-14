import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = 'https://gdtlwojrrjlckinedisg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkdGx3b2pycmpsY2tpbmVkaXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEyNzk1MjMsImV4cCI6MjA0Njg1NTUyM30.izPjuKHA8EvdccimZdM54golwknLVn6DP5NtIk2u5q0';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);