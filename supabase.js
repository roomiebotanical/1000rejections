

// ==================================================
// SUPABASE CONNECTION
// ==================================================

import {
  createClient
} from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";


// --------------------------------------------------
// YOUR SUPABASE PROJECT
// --------------------------------------------------
//
// Find these in:
// Supabase → Project Settings → API
//
// Use the "Project URL"
// and the "Publishable key" / "anon key"
//
// DO NOT use the service_role key here.
// --------------------------------------------------

const SUPABASE_URL =
  "https://nnssnaygfmkjrcjtanal.supabase.co";


const SUPABASE_KEY =
  "sb_publishable_JZGUcJbH-BzJuLQI3GCkag_plUJra_A";


// Create Supabase client

export const supabase =
  createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );