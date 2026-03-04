import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { createClient as createServerClient } from "@supabase/supabase-js"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

function getSupabase() {
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

function buildQrEmailHtml(participantName: string, teamName: string, participantId: string) {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(participantId)}`

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style="margin:0; padding:0; background-color:#0a0a0a; font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a; padding:40px 0;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color:#111; border-radius:16px; border:1px solid #222; overflow:hidden;">
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #059669, #0d9488); padding:32px 40px; text-align:center;">
                                <h1 style="margin:0; color:#fff; font-size:28px; font-weight:800; letter-spacing:-0.5px;">
                                    🚀 Technova Hackathon
                                </h1>
                                <p style="margin:8px 0 0; color:rgba(255,255,255,0.85); font-size:14px;">
                                    Your Personal QR Code for Check-in & Meals
                                </p>
                            </td>
                        </tr>
                        
                        <!-- Body -->
                        <tr>
                            <td style="padding:40px;">
                                <p style="color:#e5e7eb; font-size:16px; margin:0 0 8px;">
                                    Hi <strong style="color:#fff;">${participantName}</strong>,
                                </p>
                                <p style="color:#9ca3af; font-size:14px; margin:0 0 32px; line-height:1.6;">
                                    Welcome to the Technova Hackathon! Below is your personal QR code for <strong style="color:#fff;">Team ${teamName}</strong>. 
                                    Please keep this email handy — you'll need to show this QR code during:
                                </p>
                                
                                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                                    <tr>
                                        <td style="padding:12px 16px; background:#059669; background:rgba(5,150,105,0.15); border-radius:12px 12px 0 0; border:1px solid rgba(5,150,105,0.2); border-bottom:none;">
                                            <p style="margin:0; color:#34d399; font-size:14px; font-weight:600;">✅ Registration Check-in</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:12px 16px; background:rgba(245,158,11,0.15); border:1px solid rgba(245,158,11,0.2); border-bottom:none;">
                                            <p style="margin:0; color:#fbbf24; font-size:14px; font-weight:600;">🍕 Meal Distribution (Lunch, Dinner, Snacks)</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:12px 16px; background:rgba(59,130,246,0.15); border-radius:0 0 12px 12px; border:1px solid rgba(59,130,246,0.2);">
                                            <p style="margin:0; color:#60a5fa; font-size:14px; font-weight:600;">🎯 Any logistics verification</p>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- QR Code -->
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td align="center" style="padding:32px; background:#1a1a1a; border-radius:16px; border:1px solid #333;">
                                            <img src="${qrUrl}" alt="Your QR Code" width="250" height="250" style="display:block; border-radius:8px; margin-bottom:16px;" />
                                            <p style="margin:0; color:#6b7280; font-size:11px; font-family:monospace; word-break:break-all;">
                                                ID: ${participantId}
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                                
                                <p style="color:#6b7280; font-size:12px; margin:24px 0 0; text-align:center; line-height:1.5;">
                                    💡 <strong style="color:#9ca3af;">Tip:</strong> Screenshot this QR code or save this email for quick access on hackathon day. You can also add it to your phone's photo gallery for easy scanning.
                                </p>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="padding:24px 40px; background:#0d0d0d; border-top:1px solid #222; text-align:center;">
                                <p style="margin:0; color:#4b5563; font-size:12px;">
                                    Technova — Technical Society, Sharda University
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>`
}

export async function POST() {
    const session = await auth()
    if (!session || !session.user || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = getSupabase()

    // Get all participants with their team info
    const { data: teams, error: teamsError } = await supabase
        .from('hackathon_teams')
        .select(`
            id, name,
            hackathon_participants (id, name, email)
        `)

    if (teamsError || !teams) {
        return NextResponse.json({ error: teamsError?.message || "Failed to fetch teams" }, { status: 500 })
    }

    let sent = 0
    let failed = 0
    const errors: string[] = []

    for (const team of teams) {
        const participants = (team as any).hackathon_participants || []

        for (const participant of participants) {
            if (!participant.email) {
                failed++
                errors.push(`${participant.name}: no email`)
                continue
            }

            // Rate limit: ~1.5 req/sec to stay safe with Resend
            if (sent > 0) {
                await delay(700)
            }

            let retries = 2
            while (retries > 0) {
                try {
                    const html = buildQrEmailHtml(participant.name, team.name, participant.id)

                    await resend.emails.send({
                        from: 'Technova <noreply@technovashardauniversity.in>',
                        to: participant.email,
                        subject: `🎫 Your Hackathon QR Code — ${participant.name} (${team.name})`,
                        html
                    })

                    sent++
                    console.log(`[QR Email] Sent ${sent} — ${participant.name} (${participant.email})`)
                    break
                } catch (err: any) {
                    retries--
                    if (err?.statusCode === 429 && retries > 0) {
                        console.log(`[QR Email] Rate limited, waiting 2s...`)
                        await delay(2000)
                    } else {
                        console.error(`[QR Email] Failed: ${participant.email}`, err?.message || err)
                        failed++
                        errors.push(`${participant.name}: ${err?.message || 'unknown error'}`)
                        break
                    }
                }
            }
        }
    }

    return NextResponse.json({
        success: true,
        sent,
        failed,
        errors: errors.slice(0, 10) // Return first 10 errors max
    })
}
