import { getUser } from "@/lib/auth/supabase-server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Calendar, Users, BarChart, Settings, Home } from "lucide-react"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await getUser()

    if (!user) {
        redirect("/login")
    }

    // Basic Role Gate (Refine with DB check later if needed)
    if (user.role === 'student') {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
                    <p>You do not have permission to view this area.</p>
                    <Link href="/dashboard" className="text-blue-500 underline mt-4 block">Return to Dashboard</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r hidden md:flex flex-col">
                <div className="p-6 border-b">
                    <h2 className="font-bold text-xl">Technova Admin</h2>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-gray-50">
                        <Home className="w-5 h-5" /> Back to App
                    </Link>
                    <div className="pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Manage</div>
                    <Link href="/admin/dashboard" className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 text-blue-700 font-medium">
                        <BarChart className="w-5 h-5" /> Overview
                    </Link>
                    <Link href="/admin/events" className="flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-gray-50">
                        <Calendar className="w-5 h-5" /> Events
                    </Link>
                    <Link href="/admin/registrations" className="flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-gray-50">
                        <Users className="w-5 h-5" /> Registrations
                    </Link>
                    <div className="pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">System</div>
                    <Link href="/admin/settings" className="flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-gray-50">
                        <Settings className="w-5 h-5" /> Settings
                    </Link>
                </nav>
                <div className="p-4 border-t">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200" />
                        <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-auto">
                {children}
            </main>
        </div>
    )
}
