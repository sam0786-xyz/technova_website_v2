import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { SidebarNav } from "@/components/admin/sidebar-nav"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session) {
        redirect("/login")
    }

    // Basic Role Gate
    if (session.user.role === 'student') {
        return (
            <div className="flex h-screen items-center justify-center bg-black">
                <div className="text-center p-8 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
                    <h1 className="text-2xl font-bold text-red-400">Access Denied</h1>
                    <p className="text-gray-400 mt-2">You do not have permission to view this area.</p>
                    <Link href="/leaderboard" className="text-blue-400 hover:text-blue-300 underline mt-4 block">Return to Dashboard</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-black">
            {/* Sidebar */}
            <aside className="w-64 bg-zinc-900/50 border-r border-white/10 hidden md:flex flex-col backdrop-blur-xl">
                <div className="p-6 border-b border-white/10">
                    <h2 className="font-bold text-xl text-white">Technova Admin</h2>
                </div>
                <SidebarNav />
                <div className="p-4 border-t border-white/10 mt-auto">
                    <div className="flex items-center gap-3">
                        {session.user.image ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={session.user.image} alt={session.user.name || ''} className="w-10 h-10 rounded-full border border-white/20" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-600/30 flex items-center justify-center text-blue-400 font-bold">
                                {session.user.name?.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div>
                            <p className="text-sm font-medium text-white">{session.user.name}</p>
                            <p className="text-xs text-gray-500 capitalize">{session.user.role}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    )
}
