'use client'

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { SidebarNav } from "./sidebar-nav"

export function AdminShell({ children, userName, userRole, userImage }: {
    children: React.ReactNode,
    userName?: string | null,
    userRole?: string | null,
    userImage?: string | null,
}) {
    const [sidebarOpen, setSidebarOpen] = useState(true)

    return (
        <div className="flex min-h-screen bg-black">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed md:sticky top-0 left-0 z-40 h-screen
                w-64 bg-zinc-900/50 border-r border-white/10 flex flex-col backdrop-blur-xl
                transition-transform duration-200 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:-translate-x-full'}
            `}>
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <h2 className="font-bold text-xl text-white">Technova Admin</h2>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <SidebarNav />
                <div className="p-4 border-t border-white/10 mt-auto">
                    <div className="flex items-center gap-3">
                        {userImage ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={userImage} alt={userName || ''} className="w-10 h-10 rounded-full border border-white/20" referrerPolicy="no-referrer" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-600/30 flex items-center justify-center text-blue-400 font-bold">
                                {userName?.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div>
                            <p className="text-sm font-medium text-white">{userName}</p>
                            <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {/* Toggle button when sidebar is hidden */}
                {!sidebarOpen && (
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-zinc-800 border border-white/10 text-gray-400 hover:text-white hover:bg-zinc-700 transition-colors shadow-lg"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                )}
                {children}
            </main>
        </div>
    )
}
