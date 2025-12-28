import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function ScannerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    // Only admins/super_admins can access scanner
    if (!session || session.user.role === 'student') {
        redirect('/login')
    }

    // Just return children - root layout handles html/body
    return <>{children}</>
}
