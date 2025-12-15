'use server'

import { createClient } from '@/lib/supabase/server'

export type LeaderboardUser = {
    id: string
    name: string
    email: string
    xp_points: number
    system_id?: string // Assuming this might exist based on reference, optional for now
    role?: string
}

export async function getLeaderboardData() {
    const supabase = createClient()

    const { data: users, error } = await supabase
        .schema('next_auth')
        .from('users')
        .select('id, name, email, xp_points, role')
        .order('xp_points', { ascending: false })
        .limit(100)

    if (error) {
        console.error('Error fetching leaderboard:', error)
        return []
    }

    return users as LeaderboardUser[]
}
