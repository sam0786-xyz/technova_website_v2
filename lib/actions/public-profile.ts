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

// Renamed to XPHistoryItem to better reflect that it includes all XP, not just events
export interface RecentEventParticipation {
    eventId?: string  // Optional - null for referrals and other non-event XP
    eventTitle: string
    eventDate: string
    xpEarned: number
    source?: string  // 'attendance' | 'feedback' | 'referral' | 'registration' etc.
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

    // Helper function to get readable label for source (defined early to avoid hoisting issues)
    function getSourceLabel(source: string | null): string {
        const labels: Record<string, string> = {
            'feedback': 'Feedback Bonus',
            'attendance': 'Attendance XP',
            'referral': 'Referral Bonus',
            'registration': 'Registration Bonus',
            'daily_checkin': 'Daily Check-in',
            'bonus': 'Bonus XP'
        }
        return labels[source || ''] || 'XP Award'
    }

    // 1. Get ALL XP Awards (no limit - we want complete history)
    // Using simpler query that works even if some columns don't exist
    const { data: awards, error: awardsError } = await supabase
        .from('xp_awards')
        .select('id, xp_amount, awarded_at, event_id, source')
        .eq('user_id', userId)
        .order('awarded_at', { ascending: false })

    if (awardsError) {
        console.error('[XP History] Awards query error:', awardsError.message)
    }

    // Fetch event details separately for awards with event_id
    const eventIds = (awards || []).filter(a => a.event_id).map(a => a.event_id)
    let eventsMap: Record<string, { title: string; start_time: string }> = {}

    if (eventIds.length > 0) {
        const { data: events } = await supabase
            .from('events')
            .select('id, title, start_time')
            .in('id', eventIds)

        events?.forEach(e => {
            eventsMap[e.id] = { title: e.title, start_time: e.start_time }
        })
    }

    // 2. Get Referral XP (where user is the referrer)
    const { data: referrals, error: referralsError } = await supabase
        .from('referrals')
        .select('id, xp_awarded, created_at')
        .eq('referrer_id', userId)
        .gt('xp_awarded', 0)
        .order('created_at', { ascending: false })

    if (referralsError) {
        console.error('[XP History] Referrals query error:', referralsError.message)
    }

    // Build XP history list - each item is a separate XP entry
    const xpItems: RecentEventParticipation[] = []

    // Process XP Awards
    awards?.forEach(a => {
        const event = a.event_id ? eventsMap[a.event_id] : null
        const hasEvent = !!event
        const eventTitle = hasEvent
            ? event.title
            : getSourceLabel(a.source) || 'XP Award'
        const eventDate = hasEvent
            ? event.start_time
            : a.awarded_at

        xpItems.push({
            eventId: hasEvent ? a.event_id : undefined,
            eventTitle,
            eventDate: new Date(eventDate).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }),
            xpEarned: a.xp_amount,
            source: a.source || (hasEvent ? 'event' : 'bonus')
        })
    })

    // Process Referral XP
    referrals?.forEach(r => {
        xpItems.push({
            eventId: undefined,
            eventTitle: 'Referral Bonus',
            eventDate: new Date(r.created_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }),
            xpEarned: r.xp_awarded,
            source: 'referral'
        })
    })

    console.log(`[XP History] User ${userId}: ${awards?.length || 0} awards, ${referrals?.length || 0} referrals, ${xpItems.length} total items`)

    // Sort by date descending and take recent ones for display
    const recentEvents: RecentEventParticipation[] = xpItems
        .sort((a, b) => {
            // Parse dates for sorting (format: "10 Jan 2026")
            const parseDate = (d: string) => {
                const parts = d.split(' ')
                const months: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 }
                return new Date(parseInt(parts[2]), months[parts[1]], parseInt(parts[0])).getTime()
            }
            return parseDate(b.eventDate) - parseDate(a.eventDate)
        })
        .slice(0, 20)  // Show up to 20 recent items

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
