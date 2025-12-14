import QRCode from 'qrcode'
import { v4 as uuidv4 } from 'uuid'

export interface QRTokenData {
    token: string
    userId: string
    eventId: string
    createdAt: string
}

export async function generateQRToken(userId: string, eventId: string): Promise<{ token: string, qrDataUrl: string }> {
    const token = uuidv4()

    const payload: QRTokenData = {
        token,
        userId,
        eventId,
        createdAt: new Date().toISOString()
    }

    // Generate QR Code as Data URL
    const qrDataUrl = await QRCode.toDataURL(JSON.stringify(payload), {
        width: 300,
        margin: 2,
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
