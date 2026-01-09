'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { unstable_cache } from 'next/cache'

export interface PublicProfileData {
    id: string
    name: string
    email?: string | null
    image?: string | null
    xp_points: number
    role?: string
    year?: number
    branch?: string
    course?: string
    skills?: string[]
    // Social Links
    github_url?: string | null
    linkedin_url?: string | null
    portfolio_url?: string | null
    kaggle_url?: string | null
    leetcode_url?: string | null
    codeforces_url?: string | null
    codechef_url?: string | null
    gfg_url?: string | null
    hackerrank_url?: string | null
    rank: number
    percentile: number
    totalUsers: number
}

export interface RecentEventParticipation {
    eventId: string
    eventTitle: string
    eventDate: string
    xpEarned: number
}

export interface PublicProfileResponse {
    profile: PublicProfileData | null
    recentEvents: RecentEventParticipation[]
    xpHistory: { date: string; xp: number; cumulativeXp: number }[]
}

/**
 * Fetch public profile data for a user
 */
async function fetchPublicProfileFromDB(userId: string): Promise<PublicProfileResponse> {
    const supabase = createAdminClient()

    // Get user profile
    const { data: user, error: userError } = await supabase
        .schema('next_auth')
        .from('users')
        .select('id, name, email, image, xp_points, role, year, branch, course')
        .eq('id', userId)
        .single()

    if (userError || !user) {
        console.error('Error fetching user profile:', userError)
        return { profile: null, recentEvents: [], xpHistory: [] }
    }

    // Get user's rank
    const { count: higherCount } = await supabase
        .schema('next_auth')
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gt('xp_points', user.xp_points)

    const { count: totalCount } = await supabase
        .schema('next_auth')
        .from('users')
        .select('*', { count: 'exact', head: true })

    const rank = (higherCount || 0) + 1
    const totalUsers = totalCount || 1
    const percentile = Math.round(((totalUsers - rank) / totalUsers) * 100)

    // Get user's skills and social links from profile table if exists
    const { data: profileData } = await supabase
        .from('profiles')
        .select('skills, github_url, linkedin_url, portfolio_url, kaggle_url, leetcode_url, codeforces_url, codechef_url, gfg_url, hackerrank_url')
        .eq('id', userId)
        .single()

    // Get recent events (last 10)
    const { data: awards } = await supabase
        .from('xp_awards')
        .select(`
            xp_amount,
            awarded_at,
            event_id,
            events (id, title, start_time)
        `)
        .eq('user_id', userId)
        .order('awarded_at', { ascending: false })
        .limit(10)

    const recentEvents: RecentEventParticipation[] = (awards || []).map(award => ({
        eventId: award.event_id,
        eventTitle: (award.events as any)?.title || 'Unknown Event',
        eventDate: new Date((award.events as any)?.start_time || award.awarded_at).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        }),
        xpEarned: award.xp_amount
    }))

    // Get XP history for chart (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: historyAwards } = await supabase
        .from('xp_awards')
        .select('xp_amount, awarded_at')
        .eq('user_id', userId)
        .gte('awarded_at', thirtyDaysAgo.toISOString())
        .order('awarded_at', { ascending: true })

    // Group by date
    const dateMap = new Map<string, number>()
        ; (historyAwards || []).forEach(award => {
            const date = new Date(award.awarded_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short'
            })
            dateMap.set(date, (dateMap.get(date) || 0) + award.xp_amount)
        })

    let cumulativeXp = 0
    const xpHistory = Array.from(dateMap.entries()).map(([date, xp]) => {
        cumulativeXp += xp
        return { date, xp, cumulativeXp }
    })

    return {
        profile: {
            ...user,
            skills: profileData?.skills || [],
            github_url: profileData?.github_url || null,
            linkedin_url: profileData?.linkedin_url || null,
            portfolio_url: profileData?.portfolio_url || null,
            kaggle_url: profileData?.kaggle_url || null,
            leetcode_url: profileData?.leetcode_url || null,
            codeforces_url: profileData?.codeforces_url || null,
            codechef_url: profileData?.codechef_url || null,
            gfg_url: profileData?.gfg_url || null,
            hackerrank_url: profileData?.hackerrank_url || null,
            rank,
            percentile,
            totalUsers
        },
        recentEvents,
        xpHistory
    }
}

/**
 * Get public profile with caching
 */
export async function getPublicProfile(userId: string): Promise<PublicProfileResponse> {
    const getCachedProfile = unstable_cache(
        () => fetchPublicProfileFromDB(userId),
        [`public-profile-${userId}`],
        {
            revalidate: 60,
            tags: ['profile', `user-${userId}`]
        }
    )

    return getCachedProfile()
}
