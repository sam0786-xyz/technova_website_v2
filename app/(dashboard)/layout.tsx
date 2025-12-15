import { auth } from "@/lib/auth"
import Link from "next/link"
import { redirect } from "next/navigation"
import { UserNav } from "@/components/auth/user-nav"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session) {
        redirect("/login")
    }

    // Force onboarding if system_id is missing, but only for students
    if (!session.user.system_id && session.user.role === 'student') {
        redirect("/onboarding")
    }

    return (
        <div className="flex min-h-screen flex-col bg-black text-white">
            <header className="border-b border-white/10 bg-black/50 backdrop-blur-md p-4 flex justify-between items-center sticky top-0 z-50">
                <Link href="/" className="font-bold text-xl text-white">Technova</Link>
                <div className="flex items-center gap-4">
                    <UserNav user={session.user} />
                </div>
            </header>
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    )
}
