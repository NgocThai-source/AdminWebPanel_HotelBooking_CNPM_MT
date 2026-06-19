import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://akdpqpazdxzxaneixolr.supabase.co";
const supabaseAnonKey = "sb_publishable_iQ4exd-7Nm__-uRtj9thiw_b5YFS9td";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);