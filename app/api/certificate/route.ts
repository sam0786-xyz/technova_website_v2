import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateCertificateWithTemplate } from '@/lib/certificates/generate'
import { auth } from '@/lib/auth'
import { formatDateShort } from '@/lib/utils'
import { checkRateLimit, getClientIdentifier } from '@/lib/rate-limit'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Rate limit: 5 requests per minute per IP
const RATE_LIMIT_CONFIG = { limit: 5, windowSeconds: 60 }

export async function GET(req: NextRequest) {
    // Rate limiting
    const clientId = getClientIdentifier(req)
    const rateLimitResult = checkRateLimit(clientId, RATE_LIMIT_CONFIG)

    if (!rateLimitResult.success) {
        return Response.json(
            { error: 'Rate limit exceeded. Please try again later.' },
            {
                status: 429,
                headers: {
                    'X-RateLimit-Limit': RATE_LIMIT_CONFIG.limit.toString(),
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': Math.ceil(rateLimitResult.resetTime / 1000).toString(),
                    'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString()
                }
            }
        )
    }

    const { searchParams } = new URL(req.url)
    const eventId = searchParams.get('eventId')
    const certificateId = searchParams.get('id')

    // Input validation patterns
    const CERT_ID_REGEX = /^[A-Z0-9]{8}$/  // 8-char alphanumeric
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

    // Option 1: Download by certificate ID (can be public for sharing)
    if (certificateId) {
        // Validate certificate ID format to prevent injection
        if (!CERT_ID_REGEX.test(certificateId)) {
            return Response.json({ error: 'Invalid certificate ID format' }, { status: 400 })
        }
        return await handleCertificateById(certificateId)
    }

    // Option 2: Download by event ID (requires auth)
    if (eventId) {
        // Validate UUID format
        if (!UUID_REGEX.test(eventId)) {
            return Response.json({ error: 'Invalid event ID format' }, { status: 400 })
        }
        return await handleCertificateByEventId(eventId)
    }

    return Response.json({ error: 'Event ID or Certificate ID required' }, { status: 400 })
}

async function handleCertificateById(certificateId: string) {
    // Get certificate details
    const { data: certificate, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('certificate_id', certificateId)
        .single()

    if (error || !certificate) {
        return Response.json({ error: 'Certificate not found' }, { status: 404 })
    }

    if (certificate.status === 'revoked') {
        return Response.json({ error: 'Certificate has been revoked' }, { status: 403 })
    }

    // Get event details
    const { data: event } = await supabase
        .from('events')
        .select('title, start_time, club_id, club:clubs!events_club_id_fkey(name)')
        .eq('id', certificate.event_id)
        .single()

    // Get user details
    const { data: user } = await supabase
        .schema('next_auth')
        .from('users')
        .select('name')
        .eq('id', certificate.user_id)
        .single()

    // Get template
    const { data: template } = await supabase
        .from('certificate_templates')
        .select('*')
        .eq('event_id', certificate.event_id)
        .single()

    // Increment download count
    await supabase
        .from('certificates')
        .update({ downloaded_count: (certificate.downloaded_count || 0) + 1 })
        .eq('id', certificate.id)

    // Get signed URL for template if needed
    let templateUrl = template?.template_url || null
    if (templateUrl) {
        // Extract path from the public URL and create a signed URL
        try {
            const url = new URL(templateUrl)
            const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/certificates\/(.+)/)
            if (pathMatch && pathMatch[1]) {
                const { data: signedData } = await supabase.storage
                    .from('certificates')
                    .createSignedUrl(pathMatch[1], 60) // 60 seconds validity
                if (signedData?.signedUrl) {
                    templateUrl = signedData.signedUrl
                }
            }
        } catch (e) {
            console.log('Could not generate signed URL, using original:', e)
        }
    }

    // Generate certificate
    const clubData = event?.club as { name: string }[] | { name: string } | null
    const clubName = Array.isArray(clubData) ? clubData[0]?.name : clubData?.name

    const pdfBytes = await generateCertificateWithTemplate(
        templateUrl,
        template?.qr_region || null,
        template?.text_regions || [],
        {
            participantName: user?.name || 'Participant',
            eventName: event?.title || 'Event',
            eventDate: formatDateShort(event?.start_time || new Date().toISOString()),
            certificateId: certificate.certificate_id,
            organizerName: clubName || 'Technova'
        },
        process.env.NEXT_PUBLIC_APP_URL
    )

    // Return PDF
    const arrayBuffer = pdfBytes.buffer.slice(
        pdfBytes.byteOffset,
        pdfBytes.byteOffset + pdfBytes.byteLength
    ) as ArrayBuffer

    const fileName = `certificate-${certificate.certificate_id}.pdf`

    return new Response(arrayBuffer, {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${fileName}"`
        }
    })
}

async function handleCertificateByEventId(eventId: string) {
    const session = await auth()
    if (!session) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has a certificate for this event
    const { data: certificate, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('event_id', eventId)
        .single()

    if (error || !certificate) {
        // Fallback: Check if user attended (for legacy/unconfigured events)
        const { data: registration } = await supabase
            .from('registrations')
            .select('*, events(*)')
            .eq('user_id', session.user.id)
            .eq('event_id', eventId)
            .eq('attended', true)
            .single()

        if (!registration) {
            return Response.json({ error: 'Not attended or no certificate issued' }, { status: 403 })
        }

        // Generate legacy certificate (no template)
        const pdfBytes = await generateCertificateWithTemplate(
            null,
            null,
            [],
            {
                participantName: session.user.name || 'Participant',
                eventName: registration.events.title,
                eventDate: formatDateShort(registration.events.start_time),
                certificateId: '', // No ID for legacy
                organizerName: 'Technova'
            }
        )

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

    if (certificate.status === 'revoked') {
        return Response.json({ error: 'Certificate has been revoked' }, { status: 403 })
    }

    // Use the certificate ID based download
    return handleCertificateById(certificate.certificate_id)
}
