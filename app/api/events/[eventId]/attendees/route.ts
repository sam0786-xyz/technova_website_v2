import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ eventId: string }> }
) {
    try {
        const session = await auth()

        if (!session || !['admin', 'super_admin'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { eventId } = await params

        // Fetch all registrations for this event with user details
        const { data: registrations, error: regError } = await supabase
            .from('registrations')
            .select('id, user_id, attended, created_at')
            .eq('event_id', eventId)
            .order('created_at', { ascending: false })

        if (regError) {
            console.error('Error fetching registrations:', regError)
            return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 })
        }

        if (!registrations || registrations.length === 0) {
            return NextResponse.json({ attendees: [] })
        }

        // Get user details from next_auth schema
        const userIds = registrations.map(r => r.user_id)

        const { data: users, error: userError } = await supabase
            .schema('next_auth' as unknown as 'public')
            .from('users')
            .select('id, name, email, image')
            .in('id', userIds)

        if (userError) {
            console.error('Error fetching users:', userError)
        }

        // Map users to registrations
        const userMap = new Map(users?.map(u => [u.id, u]) || [])

        const attendees = registrations.map(reg => {
            const user = userMap.get(reg.user_id)
            return {
                id: reg.id,
                name: user?.name || 'Unknown',
                email: user?.email || '',
                image: user?.image,
                attended: reg.attended || false,
                registered_at: reg.created_at
            }
        })

        return NextResponse.json({ attendees })
    } catch (error) {
        console.error('Error:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
