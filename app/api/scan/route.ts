import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { token, userId, eventId } = body

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
            return NextResponse.json({ success: false, message: 'Already checked in' }, { status: 400 })
        }

        // 3. Mark as attended
        const { error: updateError } = await supabase
            .from('registrations')
            .update({ attended: true })
            .eq('id', registration.id)

        if (updateError) {
            return NextResponse.json({ success: false, message: 'Failed to update' }, { status: 500 })
        }

        // 4. Get User Name from next_auth schema
        const { data: user } = await supabase
            .schema('next_auth' as unknown as 'public')
            .from('users')
            .select('name')
            .eq('id', userId)
            .single()

        return NextResponse.json({
            success: true,
            message: 'Check-in successful',
            userName: user?.name || 'Attendee'
        })

    } catch (err) {
        console.error('Scan Error:', err)
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
    }
}
