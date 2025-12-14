import QRCode from 'qrcode'
import { v4 as uuidv4 } from 'uuid'

// Minimized interface for QR Payload
export interface QRTokenData {
    t: string  // token
    u: string  // userId
    e: string  // eventId
    n: string  // name
    sid: string // system_id
    y: string  // year
    c: string  // course
    s: string  // section
    em: string // email
    d: string  // createdAt
}

export async function generateQRToken(
    userId: string,
    eventId: string,
    userData: {
        name: string,
        system_id: string,
        year: string,
        course: string,
        section: string,
        email: string
    },
    existingToken?: string
): Promise<{ token: string, qrDataUrl: string }> {
    const token = existingToken || uuidv4()

    const payload: QRTokenData = {
        t: token,
        u: userId,
        e: eventId,
        n: userData.name,
        sid: userData.system_id,
        y: userData.year,
        c: userData.course,
        s: userData.section,
        em: userData.email,
        d: new Date().toISOString()
    }

    // Generate QR Code as Data URL
    const qrDataUrl = await QRCode.toDataURL(JSON.stringify(payload), {
        width: 600,
        margin: 2,
        errorCorrectionLevel: 'L',
        color: {
            dark: '#000000',
            light: '#ffffff'
        }
    })

    return { token, qrDataUrl }
}

export async function generateQRBuffer(data: string): Promise<Buffer> {
    return await QRCode.toBuffer(data, {
        width: 300,
        margin: 2
    })
}
