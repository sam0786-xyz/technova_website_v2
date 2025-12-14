import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export async function generateCertificate(
    userName: string,
    eventTitle: string,
    eventDate: string
): Promise<Uint8Array> {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create()

    // Add a page (A4 landscape)
    const page = pdfDoc.addPage([842, 595]) // A4 landscape in points

    // Get fonts
    const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)
    const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman)

    const { width, height } = page.getSize()

    // Draw border
    page.drawRectangle({
        x: 30,
        y: 30,
        width: width - 60,
        height: height - 60,
        borderColor: rgb(0.1, 0.3, 0.6),
        borderWidth: 3,
    })

    // Inner border
    page.drawRectangle({
        x: 40,
        y: 40,
        width: width - 80,
        height: height - 80,
        borderColor: rgb(0.6, 0.7, 0.8),
        borderWidth: 1,
    })

    // Title
    page.drawText('CERTIFICATE OF PARTICIPATION', {
        x: width / 2 - 200,
        y: height - 120,
        size: 28,
        font: timesRomanBold,
        color: rgb(0.1, 0.2, 0.5),
    })

    // Subtitle
    page.drawText('This is to certify that', {
        x: width / 2 - 80,
        y: height - 200,
        size: 16,
        font: timesRoman,
        color: rgb(0.3, 0.3, 0.3),
    })

    // User Name
    const nameWidth = timesRomanBold.widthOfTextAtSize(userName, 36)
    page.drawText(userName, {
        x: (width - nameWidth) / 2,
        y: height - 260,
        size: 36,
        font: timesRomanBold,
        color: rgb(0, 0, 0),
    })

    // Line under name
    page.drawLine({
        start: { x: width / 2 - 150, y: height - 275 },
        end: { x: width / 2 + 150, y: height - 275 },
        thickness: 1,
        color: rgb(0.3, 0.3, 0.3),
    })

    // Participation text
    page.drawText('has successfully participated in', {
        x: width / 2 - 100,
        y: height - 320,
        size: 16,
        font: timesRoman,
        color: rgb(0.3, 0.3, 0.3),
    })

    // Event Title
    const eventWidth = timesRomanBold.widthOfTextAtSize(eventTitle, 24)
    page.drawText(eventTitle, {
        x: (width - eventWidth) / 2,
        y: height - 370,
        size: 24,
        font: timesRomanBold,
        color: rgb(0.1, 0.3, 0.6),
    })

    // Date
    page.drawText(`held on ${eventDate}`, {
        x: width / 2 - 60,
        y: height - 420,
        size: 14,
        font: timesRoman,
        color: rgb(0.4, 0.4, 0.4),
    })

    // Footer
    page.drawText('Technova - SET Technical Society', {
        x: width / 2 - 100,
        y: 80,
        size: 12,
        font: timesRoman,
        color: rgb(0.5, 0.5, 0.5),
    })

    page.drawText('Sharda University', {
        x: width / 2 - 50,
        y: 60,
        size: 10,
        font: timesRoman,
        color: rgb(0.6, 0.6, 0.6),
    })

    // Serialize the PDF to bytes
    return await pdfDoc.save()
}
