import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { awardXPForAttendance } from '@/lib/xp'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        // Handle both legacy (long keys) and new (short keys) formats
        const token = body.token || body.t
        const userId = body.userId || body.u
        const eventId = body.eventId || body.e

        if (!token || !userId || !eventId) {
            return NextResponse.json({ success: false, message: 'Invalid QR data' }, { status: 400 })
        }

        // 1. Find Registration by token
        const { data: registration, error: regError } = await supabase
            .from('registrations')
            .select('*, events(*)')
            .eq('qr_token_id', token)
            .eq('user_id', userId)
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
                .eq('id', userId)
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
            return NextResponse.json({ success: false, message: 'Failed to update' }, { status: 500 })
        }

        // 4. Award XP for attendance
        const xpResult = await awardXPForAttendance(userId, eventId, {
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
            .eq('id', userId)
            .single()

        return NextResponse.json({
            success: true,
            message: 'Check-in successful',
            userName: user?.name || 'Attendee',
            xpAwarded: xpResult.xpAwarded,
            xpMessage: xpResult.message
        })

    } catch (err) {
        console.error('Scan Error:', err)
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
    }
}
