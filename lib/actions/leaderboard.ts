'use server'

import { createAdminClient } from '@/lib/supabase/server'

export type LeaderboardUser = {
    id: string
    name: string
    email: string
    image?: string | null
    xp_points: number
    system_id?: string
    role?: string
}

export async function getLeaderboardData() {
    const supabase = createAdminClient()

    const { data: users, error } = await supabase
        .schema('next_auth')
        .from('users')
        .select('id, name, email, image, xp_points, role')
        .order('xp_points', { ascending: false })
        .limit(100)

    if (error) {
        console.error('Error fetching leaderboard:', error)
        return []
    }

    return users as LeaderboardUser[]
}
