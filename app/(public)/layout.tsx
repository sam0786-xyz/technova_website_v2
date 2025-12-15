import { Navbar } from "@/components/layout/navbar"
import { getUser } from "@/lib/auth/supabase-server"

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await getUser()

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar user={user || undefined} />
            <main className="flex-1">
                {children}
            </main>
        </div>
    )
}
