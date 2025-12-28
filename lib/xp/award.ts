/**
 * XP Module - Awards and tracks XP for event attendance
 */

import { createClient } from '@supabase/supabase-js'
import { calculateEventXP, canCalculateXP, type EventXPData } from './calculator'

// ==========================================
// Types
// ==========================================

export interface XPAwardResult {
    success: boolean
    xpAwarded: number
    message: string
    breakdown?: string
}

// ==========================================
// Helper - Get Supabase client
// ==========================================

function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

// ==========================================
// Check if XP already awarded
// ==========================================

export async function hasXPBeenAwarded(
    userId: string,
    eventId: string
): Promise<boolean> {
    const supabase = getSupabase()

    const { data } = await supabase
        .from('xp_awards')
        .select('id')
        .eq('user_id', userId)
        .eq('event_id', eventId)
        .single()

    return !!data
}

// ==========================================
// Award XP for event attendance
// ==========================================

export async function awardXPForAttendance(
    userId: string,
    eventId: string,
    eventData: EventXPData
): Promise<XPAwardResult> {
    const supabase = getSupabase()

    // 1. Check if XP already awarded (prevent double XP)
    const alreadyAwarded = await hasXPBeenAwarded(userId, eventId)
    if (alreadyAwarded) {
        return {
            success: false,
            xpAwarded: 0,
            message: 'XP already awarded for this event'
        }
    }

    // 2. Validate event data for XP calculation
    if (!canCalculateXP(eventData)) {
        return {
            success: false,
            xpAwarded: 0,
            message: 'Event missing required fields for XP calculation'
        }
    }

    // 3. Calculate XP
    const { finalXP, breakdown } = calculateEventXP(eventData)

    // 4. Record XP award (prevents future duplicates)
    const { error: awardError } = await supabase
        .from('xp_awards')
        .insert({
            user_id: userId,
            event_id: eventId,
            xp_amount: finalXP
        })

    if (awardError) {
        // Handle unique constraint violation (double award attempt)
        if (awardError.code === '23505') {
            return {
                success: false,
                xpAwarded: 0,
                message: 'XP already awarded for this event'
            }
        }
        console.error('XP Award Error:', awardError)
        return {
            success: false,
            xpAwarded: 0,
            message: 'Failed to record XP award'
        }
    }

    // 5. Update user's total XP points
    const { error: updateError } = await supabase
        .schema('next_auth' as unknown as 'public')
        .from('users')
        .update({
            xp_points: supabase.rpc('increment_xp', { user_id: userId, amount: finalXP })
        })
        .eq('id', userId)

    // Fallback: Direct increment if RPC doesn't exist
    if (updateError) {
        // Get current XP and add
        const { data: user } = await supabase
            .schema('next_auth' as unknown as 'public')
            .from('users')
            .select('xp_points')
            .eq('id', userId)
            .single()

        const currentXP = user?.xp_points || 0
        const newXP = currentXP + finalXP

        const { error: fallbackError } = await supabase
            .schema('next_auth' as unknown as 'public')
            .from('users')
            .update({ xp_points: newXP })
            .eq('id', userId)

        if (fallbackError) {
            console.error('XP Update Error:', fallbackError)
            // XP was recorded in xp_awards, so we don't fail completely
            // but the user's total may not be updated
        }
    }

    return {
        success: true,
        xpAwarded: finalXP,
        message: `Awarded ${finalXP} XP`,
        breakdown
    }
}

/**
 * Get total XP awarded to a user across all events
 */
export async function getUserTotalAwardedXP(userId: string): Promise<number> {
    const supabase = getSupabase()

    const { data, error } = await supabase
        .from('xp_awards')
        .select('xp_amount')
        .eq('user_id', userId)

    if (error || !data) {
        return 0
    }

    return data.reduce((sum, award) => sum + award.xp_amount, 0)
}

/**
 * Get XP awards for a specific event
 */
export async function getEventXPAwards(eventId: string): Promise<{ userId: string; amount: number }[]> {
    const supabase = getSupabase()

    const { data, error } = await supabase
        .from('xp_awards')
        .select('user_id, xp_amount')
        .eq('event_id', eventId)

    if (error || !data) {
        return []
    }

    return data.map(award => ({
        userId: award.user_id,
        amount: award.xp_amount
    }))
}
