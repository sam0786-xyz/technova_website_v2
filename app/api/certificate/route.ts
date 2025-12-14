import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateCertificate } from '@/lib/certificates/generate'
import { auth } from '@/lib/auth'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
    const session = await auth()
    if (!session) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const eventId = searchParams.get('eventId')

    if (!eventId) {
        return Response.json({ error: 'Event ID required' }, { status: 400 })
    }

    // 1. Check if user attended this event
    const { data: registration } = await supabase
        .from('registrations')
        .select('*, events(*)')
        .eq('user_id', session.user.id)
        .eq('event_id', eventId)
        .eq('attended', true)
        .single()

    if (!registration) {
        return Response.json({ error: 'Not attended or not registered' }, { status: 403 })
    }

    // 2. Generate Certificate
    const pdfBytes = await generateCertificate(
        session.user.name || 'Participant',
        registration.events.title,
        new Date(registration.events.start_time).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    )

    // 3. Return PDF as Response with correct headers
    // Convert Uint8Array to ArrayBuffer for Response compatibility
    const arrayBuffer = pdfBytes.buffer.slice(
        pdfBytes.byteOffset,
        pdfBytes.byteOffset + pdfBytes.byteLength
    ) as ArrayBuffer

    return new Response(arrayBuffer, {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="certificate-${eventId}.pdf"`
        }
    })
}
