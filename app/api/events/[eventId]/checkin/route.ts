import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { awardDailyXP } from '@/lib/xp'
import { auth } from '@/lib/auth'
import { checkRateLimit, getClientIdentifier } from '@/lib/rate-limit'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Manual check-in API for offline events
 * This allows admins to check-in participants without requiring QR code scanning
 * Useful when QR scanning fails or for managing offline event attendance
 */
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ eventId: string }> }
) {
    // Security: Verify only admins can mark attendance
    const session = await auth()
    if (!session || !session.user || !['admin', 'super_admin'].includes(session.user.role)) {
        return NextResponse.json({ success: false, message: 'Unauthorized - Admin access required' }, { status: 401 })
    }

    // Rate limiting: 30 check-ins per minute per user
    const rateLimit = checkRateLimit(
        getClientIdentifier(req, session.user.id),
        { limit: 30, windowSeconds: 60 }
    )
    if (!rateLimit.success) {
        return NextResponse.json({
            success: false,
            message: 'Too many requests. Please slow down.'
        }, { status: 429 })
    }

    try {
        const { eventId } = await params
        const body = await req.json()
        const { registrationId } = body

        if (!registrationId) {
            return NextResponse.json({ success: false, message: 'Registration ID is required' }, { status: 400 })
        }

        // 1. Find Registration
        const { data: registration, error: regError } = await supabase
            .from('registrations')
            .select('*, events(*)')
            .eq('id', registrationId)
            .eq('event_id', eventId)
            .single()

        if (regError || !registration) {
            return NextResponse.json({ success: false, message: 'Registration not found' }, { status: 404 })
        }

        // 2. Check if already marked
        if (registration.attended) {
            // Get user name for display
            const { data: existingUser } = await supabase
                .schema('next_auth' as unknown as 'public')
                .from('users')
                .select('name')
                .eq('id', registration.user_id)
                .single()

            return NextResponse.json({
                success: false,
                message: 'Already checked in',
                userName: existingUser?.name || 'Attendee'
            }, { status: 400 })
        }

        // 3. Mark as attended
        const { error: updateError } = await supabase
            .from('registrations')
            .update({ attended: true })
            .eq('id', registration.id)

        if (updateError) {
            return NextResponse.json({ success: false, message: 'Failed to update attendance' }, { status: 500 })
        }

        // 4. Award daily XP for attendance (distributes XP across event days)
        const xpResult = await awardDailyXP(registration.user_id, eventId, {
            event_type: registration.events?.event_type,
            difficulty_level: registration.events?.difficulty_level,
            start_time: registration.events?.start_time,
            end_time: registration.events?.end_time,
            is_multi_day: registration.events?.is_multi_day
        })

        // 5. Get User Name from next_auth schema
        const { data: user } = await supabase
            .schema('next_auth' as unknown as 'public')
            .from('users')
            .select('name')
            .eq('id', registration.user_id)
            .single()

        return NextResponse.json({
            success: true,
            message: 'Manual check-in successful',
            userName: user?.name || 'Attendee',
            xpAwarded: xpResult.xpAwarded,
            xpMessage: xpResult.message,
            // Daily XP distribution info
            dailyXP: xpResult.dailyXP,
            eventDays: xpResult.eventDays,
            daysCheckedIn: xpResult.daysCheckedIn,
            remainingDays: xpResult.remainingDays
        })

    } catch (err) {
        console.error('Manual Check-in Error:', err)
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
    }
}
