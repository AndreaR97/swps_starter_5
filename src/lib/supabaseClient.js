import { createClient } from '@supabase/supabase-js';

//const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
//const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

const supabaseUrl = 'https://ktgjdmqonkpazjvjqomw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0Z2pkbXFvbmtwYXpqdmpxb213Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0NzYyNzAsImV4cCI6MjA0OTA1MjI3MH0.QF83cz1cf19hW-hh6oVIs12GoosnScrDnkw4RHEwqw8';

export const supabase = createClient(supabaseUrl, supabaseKey);
