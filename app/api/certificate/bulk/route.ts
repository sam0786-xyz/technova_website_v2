import { NextRequest } from 'next/server'
import { createClient } from "@supabase/supabase-js"
import { auth } from "@/lib/auth"
import JSZip from 'jszip'
import { generateCertificateWithTemplate } from '@/lib/certificates/generate'
import { formatDateShort } from '@/lib/utils'
import { checkRateLimit, getClientIdentifier } from '@/lib/rate-limit'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Rate limit: 2 bulk downloads per minute (more restrictive for heavy operation)
const RATE_LIMIT_CONFIG = { limit: 2, windowSeconds: 60 }

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function GET(request: NextRequest) {
    // Auth check FIRST (before rate limit to avoid unnecessary tracking)
    const session = await auth()
    if (!session || !['admin', 'super_admin'].includes(session.user.role)) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limiting
    const clientId = getClientIdentifier(request, session.user.id)
    const rateLimitResult = checkRateLimit(clientId, RATE_LIMIT_CONFIG)

    if (!rateLimitResult.success) {
        return Response.json(
            { error: 'Rate limit exceeded. Please wait before downloading again.' },
            { status: 429 }
        )
    }

    const searchParams = request.nextUrl.searchParams
    const eventId = searchParams.get('eventId')

    // Validate eventId format to prevent injection
    if (!eventId || !UUID_REGEX.test(eventId)) {
        return Response.json({ error: 'Invalid Event ID format' }, { status: 400 })
    }

    try {
        // Get event details
        const { data: event } = await supabase
            .from('events')
            .select('title, start_time, club_id, club:clubs!events_club_id_fkey(name)')
            .eq('id', eventId)
            .single()

        if (!event) {
            return Response.json({ error: 'Event not found' }, { status: 404 })
        }

        const clubData = event.club as { name: string }[] | { name: string } | null
        const clubName = Array.isArray(clubData) ? clubData[0]?.name : clubData?.name

        // Get template
        const { data: template } = await supabase
            .from('certificate_templates')
            .select('*')
            .eq('event_id', eventId)
            .single()

        // Get signed URL for template if needed
        let templateUrl = template?.template_url || null
        if (templateUrl) {
            try {
                const url = new URL(templateUrl)
                const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/certificates\/(.+)/)
                if (pathMatch && pathMatch[1]) {
                    const { data: signedData } = await supabase.storage
                        .from('certificates')
                        .createSignedUrl(pathMatch[1], 300) // 5 minutes for bulk
                    if (signedData?.signedUrl) {
                        templateUrl = signedData.signedUrl
                    }
                }
            } catch (e) {
                console.log('Could not generate signed URL:', e)
            }
        }

        // Get all certificates for this event
        const { data: certificates, error: certError } = await supabase
            .from('certificates')
            .select('id, certificate_id, user_id, certificate_type, role_title')
            .eq('event_id', eventId)
            .eq('status', 'valid')

        if (certError || !certificates || certificates.length === 0) {
            return Response.json({ error: 'No certificates found' }, { status: 404 })
        }

        // Get user details
        const userIds = certificates.map(c => c.user_id)
        const { data: users } = await supabase
            .schema('next_auth')
            .from('users')
            .select('id, name, email')
            .in('id', userIds)

        const userMap = new Map(users?.map(u => [u.id, u]) || [])

        // Create ZIP
        const zip = new JSZip()
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.technovashardauniversity.in'

        // Generate each certificate and add to ZIP
        for (const cert of certificates) {
            const user = userMap.get(cert.user_id)
            if (!user) continue

            try {
                const pdfBytes = await generateCertificateWithTemplate(
                    templateUrl,
                    template?.qr_region || null,
                    template?.text_regions || [],
                    {
                        participantName: user.name || 'Participant',
                        eventName: event.title || 'Event',
                        eventDate: formatDateShort(event.start_time || new Date().toISOString()),
                        certificateId: cert.certificate_id,
                        organizerName: clubName || 'Technova',
                        roleTitle: cert.role_title || undefined
                    },
                    baseUrl
                )

                // Sanitize filename
                const safeName = (user.name || 'participant').replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30)
                const fileName = `${safeName}_${cert.certificate_id}.pdf`

                zip.file(fileName, pdfBytes)
            } catch (genError) {
                console.error(`Error generating certificate ${cert.certificate_id}:`, genError)
                // Continue with other certificates
            }
        }

        // Generate ZIP as ArrayBuffer
        const zipBuffer = await zip.generateAsync({
            type: 'arraybuffer',
            compression: 'DEFLATE',
            compressionOptions: { level: 6 }
        })

        // Safe event name for filename
        const safeEventName = (event.title || 'event').replace(/[^a-zA-Z0-9]/g, '_').substring(0, 40)
        const zipFileName = `certificates_${safeEventName}_${new Date().toISOString().split('T')[0]}.zip`

        return new Response(zipBuffer, {
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': `attachment; filename="${zipFileName}"`,
                'Content-Length': zipBuffer.byteLength.toString()
            }
        })

    } catch (error) {
        console.error('Bulk download error:', error)
        return Response.json({ error: 'Failed to generate certificates' }, { status: 500 })
    }
}
