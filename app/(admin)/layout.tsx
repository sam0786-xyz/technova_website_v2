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

    // Only super_admin can access the admin dashboard
    // Admin role should use the scanner only
    if (session.user.role !== 'super_admin') {
        return (
            <div className="flex h-screen items-center justify-center bg-black">
                <div className="text-center p-8 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl max-w-md">
                    <h1 className="text-2xl font-bold text-red-400">Access Restricted</h1>
                    <p className="text-gray-400 mt-2">
                        {session.user.role === 'admin'
                            ? "As an admin, you have access to the event scanner only."
                            : "You do not have permission to access this area."}
                    </p>
                    <div className="flex gap-4 justify-center mt-6">
                        {session.user.role === 'admin' && (
                            <Link href="/scan" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                                Go to Scanner
                            </Link>
                        )}
                        <Link href="/" className="text-blue-400 hover:text-blue-300 underline">
                            Return Home
                        </Link>
                    </div>
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
                            <img src={session.user.image} alt={session.user.name || ''} className="w-10 h-10 rounded-full border border-white/20" referrerPolicy="no-referrer" />
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
