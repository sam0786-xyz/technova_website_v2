import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { DevSpaceTabs } from "@/components/layout/devspace-tabs"

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
        <div className="flex flex-col min-h-screen bg-black text-white dark">
            <Navbar user={session?.user} />
            <DevSpaceTabs />
            <main className="flex-1 pt-16">
                {children}
            </main>
        </div>
    )
}

