"use server";

import { createClient as createServerClient } from "@supabase/supabase-js";

async function getSupabase() {
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

export async function getClubs() {
    const supabase = await getSupabase();
    // Sort clubs alphabetically by name
    const { data } = await supabase.from('clubs').select('*').order('name', { ascending: true });
    return data || [];
}
