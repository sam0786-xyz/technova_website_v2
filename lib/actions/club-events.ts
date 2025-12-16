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
    "pixelance": "Pixelance"
}

export async function getPastEvents(slug: string) {
    const dbName = SLUG_TO_DB_NAME[slug]
    if (!dbName) return []

    const supabase = await getSupabase()

    // 1. Get Club ID
    const { data: club } = await supabase.from('clubs').select('id').eq('name', dbName).single()
    if (!club) return []

    // 2. Get Past Events for this Club (or Co-Hosted)
    // "Past" means end_time has passed.
    const now = new Date().toISOString()

    const { data: events } = await supabase.from('events')
        .select('*')
        .or(`club_id.eq.${club.id},co_host_club_id.eq.${club.id}`)
        .lt('end_time', now)
        .eq('status', 'live') // Only public events
        .order('end_time', { ascending: false })

    return events || []
}
