'use server'

import { createClient } from "@supabase/supabase-js"

async function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

const SLUG_TO_DB_NAME: Record<string, string> = {
    "ai-robotics": "AI & Robotics",
    "aws-cloud": "AWS Cloud",
    "cyber-pirates": "CyberPirates",
    "datapool": "Datapool",
    "game-drifters": "Game Drifters",
    "gdg": "GDG on Campus",
    "github": "GitHub Club",
    "pixelance": "PiXelance"
}

export async function getPastEvents(slug: string) {
    const dbName = SLUG_TO_DB_NAME[slug]
    if (!dbName) return []

    const supabase = await getSupabase()

    // 1. Get Club ID
    const { data: club } = await supabase.from('clubs').select('id').eq('name', dbName).single()
    if (!club) return []

    // 2. Get Past Events for this Club (or Co-Hosted)
    // Show events that:
    // - Are explicitly marked as past by admins via is_past_event flag
    // - Have show_on_club_page enabled (or null for backward compatibility)
    const { data: events } = await supabase.from('events')
        .select(`
            *,
            club:clubs!events_club_id_fkey(name, logo_url)
        `)
        .or(`club_id.eq.${club.id},co_host_club_id.eq.${club.id}`)
        .eq('is_past_event', true) // Only events explicitly marked as past
        .or('show_on_club_page.eq.true,show_on_club_page.is.null') // Only if enabled or not set (backward compat)
        .order('end_time', { ascending: false })

    return events || []
}
