import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ===========================================
// SUPABASE CONFIGURATION
// ===========================================
// Replace these placeholder values with your actual Supabase credentials
// You can find these in your Supabase project settings:
// https://app.supabase.com/project/_/settings/api
// ===========================================

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are configured
const isConfigured = SUPABASE_URL.startsWith('http') && SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY";

// Create Supabase client only if configured, otherwise create a mock
export const supabase: SupabaseClient = isConfigured 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null as unknown as SupabaseClient;

export const isSupabaseConfigured = isConfigured;

// ===========================================
// DATABASE SCHEMA REQUIRED
// ===========================================
// Make sure you have created a "notes" table in Supabase with:
// 
// CREATE TABLE notes (
//   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//   user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
//   content TEXT NOT NULL,
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
// );
// 
// And enable Row Level Security (RLS):
// 
// ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
// 
// CREATE POLICY "Users can view their own notes"
//   ON notes FOR SELECT
//   USING (auth.uid() = user_id);
// 
// CREATE POLICY "Users can insert their own notes"
//   ON notes FOR INSERT
//   WITH CHECK (auth.uid() = user_id);
// 
// CREATE POLICY "Users can delete their own notes"
//   ON notes FOR DELETE
//   USING (auth.uid() = user_id);
// ===========================================

// Type definitions for our data
export interface Note {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
}
