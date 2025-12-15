import { getUser } from "@/lib/auth/supabase-server"
import Link from "next/link"
import { redirect } from "next/navigation"
import { UserNav } from "@/components/auth/user-nav"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await getUser()

    if (!user) {
        redirect("/login")
    }

    // Force onboarding if system_id is missing, but only for students
    if (!user.system_id && user.role === 'student') {
        redirect("/onboarding")
    }

    return (
        <div className="flex min-h-screen flex-col">
            <header className="border-b bg-white p-4 flex justify-between items-center">
                <Link href="/" className="font-bold text-xl">Technova</Link>
                <div className="flex items-center gap-4">
                    <UserNav user={user} />
                </div>
            </header>
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    )
}
