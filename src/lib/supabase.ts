import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yepzfyknrqkkoepwkgts.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllcHpmeWtucnFra29lcHdrZ3RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4OTA2MjgsImV4cCI6MjA4NjQ2NjYyOH0.euMCfiu8G-i9Voqkz21_F_L8vbGmkAmg0ktKc-lDQew'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
