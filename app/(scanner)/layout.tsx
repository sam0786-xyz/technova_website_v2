import { getUser } from "@/lib/auth/supabase-server"
import { redirect } from "next/navigation"

export default async function ScannerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await getUser()

    // Only admins can access scanner
    if (!user || user.role === 'student') {
        redirect('/login')
    }

    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
