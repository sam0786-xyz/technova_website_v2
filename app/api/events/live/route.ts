import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
    try {
        const session = await auth()

        if (!session || !['admin', 'super_admin'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Fetch all live events (not past events, status is 'live')
        const { data: events, error } = await supabase
            .from('events')
            .select('id, title, start_time, end_time, banner')
            .eq('status', 'live')
            .eq('is_past_event', false)
            .order('start_time', { ascending: true })

        if (error) {
            console.error('Error fetching events:', error)
            return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
        }

        return NextResponse.json({ events: events || [] })
    } catch (error) {
        console.error('Error:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
