import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  // We are directly pasting the strings here just to test
  const supabaseUrl = "https://tpmlrytsfquuaidxxtiy.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwbWxyeXRzZnF1dWFpZHh4dGl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNTk1NjMsImV4cCI6MjA5NjgzNTU2M30.ZNrbRIm5cuZDMY0czvKnHCj2yaishxZW6Mw9X370Zfs";

  return createBrowserClient(supabaseUrl, supabaseKey);
}