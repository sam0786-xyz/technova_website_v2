import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Calendar, Users, BarChart, Settings, Home } from "lucide-react"
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

    // Basic Role Gate (Refine with DB check later if needed)
    if (session.user.role === 'student') {
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
                <SidebarNav />
                <div className="p-4 border-t">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200" />
                        <div>
                            <p className="text-sm font-medium">{session.user.name}</p>
                            <p className="text-xs text-gray-500 capitalize">{session.user.role}</p>
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
