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
    source?: string  // 'attendance' | 'feedback' | 'referral' etc.
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

    // 1. Get XP Awards (Generic)
    const { data: awards } = await supabase
        .from('xp_awards')
        .select(`
            xp_amount,
            awarded_at,
            event_id,
            source,
            events (id, title, start_time)
        `)
        .eq('user_id', userId)
        .order('awarded_at', { ascending: false })
        .limit(20)

    // 2. Get Attended Registrations (Official Attendance)
    const { data: attended } = await supabase
        .from('registrations')
        .select(`
            id,
            event_id,
            created_at,
            events (id, title, start_time)
        `)
        .eq('user_id', userId)
        .eq('attended', true)
        .order('created_at', { ascending: false })
        .limit(20)

    // 3. Get Feedback Responses (Implicit Attendance/Participation)
    const { data: feedback } = await supabase
        .from('feedback_responses')
        .select(`
            id,
            xp_awarded,
            submitted_at,
            form:event_feedback_forms(
                event_id,
                event:events(id, title, start_time)
            )
        `)
        .eq('user_id', userId)
        .eq('xp_awarded', true)
        .order('submitted_at', { ascending: false })
        .limit(20)

    // Merge and Deduplicate Events
    const eventMap = new Map<string, RecentEventParticipation>()

    // Helper to add event
    const addEvent = (eventId: string, title: string, dateStr: string, xp: number, source?: string) => {
        if (!eventId) return
        // If event already exists, add XP and update source if different
        const existing = eventMap.get(eventId)
        if (existing) {
            existing.xpEarned += xp
            if (source && existing.source && !existing.source.includes(source)) {
                existing.source = `${existing.source}, ${source}`
            }
            return
        }
        eventMap.set(eventId, {
            eventId,
            eventTitle: title,
            eventDate: new Date(dateStr).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }),
            xpEarned: xp,
            source: source || 'attendance'
        })
    }

    // Process Awards (from xp_awards table - includes source)
    awards?.forEach(a => {
        if (a.event_id && a.events) {
            const source = (a as any).source || 'event'
            addEvent(a.event_id, (a.events as any).title, (a.events as any).start_time || a.awarded_at, a.xp_amount, source)
        }
    })

    // Process Attendance
    attended?.forEach(a => {
        if (a.event_id && a.events) {
            // Default attendance XP if not found via award
            addEvent(a.event_id, (a.events as any).title, (a.events as any).start_time, 50, 'attendance')
        }
    })

    // Process Feedback
    feedback?.forEach(f => {
        const event = (f.form as any)?.event
        const eventId = (f.form as any)?.event_id
        if (eventId && event) {
            // Default feedback XP if not found via award
            addEvent(eventId, event.title, event.start_time, 15, 'feedback')
        }
    })

    const recentEvents: RecentEventParticipation[] = Array.from(eventMap.values())
        .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())
        .slice(0, 10)

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
