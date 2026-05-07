import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yvoggotdevmkcpsrcacb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2b2dnb3RkZXZta2Nwc3JjYWNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwMjIxNTEsImV4cCI6MjA5MzU5ODE1MX0.HaTGSaWtUhpHOSmpjQEv-YBQ-0YoBa6A7Q2L8YRjveA'

export const supabase = createClient(supabaseUrl, supabaseKey)
