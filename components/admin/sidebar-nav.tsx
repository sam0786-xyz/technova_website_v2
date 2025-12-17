'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, Users, BarChart, Settings, Home } from "lucide-react"

export function SidebarNav() {
    const pathname = usePathname()

    const isActive = (path: string) => {
        if (!pathname) return false
        return pathname === path || pathname.startsWith(`${path}/`)
    }

    return (
        <nav className="flex-1 p-4 space-y-2">
            <Link href="/" className="flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                <Home className="w-5 h-5" /> Back to App
            </Link>

            <div className="pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Manage</div>

            <Link
                href="/admin/dashboard"
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive('/admin/dashboard')
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                    }`}
            >
                <BarChart className="w-5 h-5" /> Overview
            </Link>

            <Link
                href="/admin/events"
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive('/admin/events')
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                    }`}
            >
                <Calendar className="w-5 h-5" /> Events
            </Link>

            <div className="pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">System</div>

            <Link
                href="/admin/settings"
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive('/admin/settings')
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                    }`}
            >
                <Settings className="w-5 h-5" /> Settings
            </Link>
        </nav>
    )
}
