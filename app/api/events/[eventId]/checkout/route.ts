import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { checkRateLimit, getClientIdentifier } from '@/lib/rate-limit'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Check-out API for removing attendees who leave early
 * This reverses a check-in: sets attended=false and removes the daily_checkin record for today
 */
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ eventId: string }> }
) {
    // Security: Verify only admins can checkout
    const session = await auth()
    if (!session || !session.user || !['admin', 'super_admin'].includes(session.user.role)) {
        return NextResponse.json({ success: false, message: 'Unauthorized - Admin access required' }, { status: 401 })
    }

    // Rate limiting
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

        if (!registration.attended) {
            return NextResponse.json({ success: false, message: 'Attendee is not checked in' }, { status: 400 })
        }

        // 2. Remove the daily_checkin record for today
        const today = new Date().toISOString().split('T')[0]
        await supabase
            .from('daily_checkins')
            .delete()
            .eq('user_id', registration.user_id)
            .eq('event_id', eventId)
            .eq('checkin_date', today)

        // 3. Check if there are any remaining daily_checkin records
        const { data: remainingCheckins } = await supabase
            .from('daily_checkins')
            .select('id')
            .eq('user_id', registration.user_id)
            .eq('event_id', eventId)

        // 4. If no remaining check-ins, set attended to false
        if (!remainingCheckins || remainingCheckins.length === 0) {
            await supabase
                .from('registrations')
                .update({ attended: false })
                .eq('id', registration.id)
        }

        // 5. Deduct XP that was awarded for today's check-in
        // Find the xp_transactions for today
        const { data: todayXP } = await supabase
            .from('xp_transactions')
            .select('id, xp_amount, user_id')
            .eq('user_id', registration.user_id)
            .eq('event_id', eventId)
            .gte('created_at', `${today}T00:00:00`)
            .lte('created_at', `${today}T23:59:59`)

        if (todayXP && todayXP.length > 0) {
            // Delete today's XP transactions for this event
            await supabase
                .from('xp_transactions')
                .delete()
                .eq('user_id', registration.user_id)
                .eq('event_id', eventId)
                .gte('created_at', `${today}T00:00:00`)
                .lte('created_at', `${today}T23:59:59`)

            // Recalculate user's total XP
            const totalDeducted = todayXP.reduce((sum, t) => sum + (t.xp_amount || 0), 0)
            if (totalDeducted > 0) {
                const { data: userProfile } = await supabase
                    .from('user_profiles')
                    .select('total_xp')
                    .eq('user_id', registration.user_id)
                    .single()

                if (userProfile) {
                    await supabase
                        .from('user_profiles')
                        .update({ total_xp: Math.max(0, (userProfile.total_xp || 0) - totalDeducted) })
                        .eq('user_id', registration.user_id)
                }
            }
        }

        // 6. Get user name for response
        const { data: user } = await supabase
            .schema('next_auth' as unknown as 'public')
            .from('users')
            .select('name')
            .eq('id', registration.user_id)
            .single()

        return NextResponse.json({
            success: true,
            message: `${user?.name || 'Attendee'} has been checked out successfully`,
            userName: user?.name || 'Attendee'
        })

    } catch (err) {
        console.error('Checkout Error:', err)
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
    }
}
