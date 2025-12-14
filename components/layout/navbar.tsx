'use client'

import { UserNav } from "../auth/user-nav"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, LayoutDashboard } from "lucide-react"

interface NavbarProps {
    user?: {
        name?: string | null
        email?: string | null
        image?: string | null
    }
}

export function Navbar({ user }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false)

    const publicLinks = [
        { href: "/", label: "Home" },
        { href: "/events", label: "Events" },
        { href: "/clubs", label: "Clubs" },
        { href: "/leadership", label: "Leadership" },
    ]

    const authLinks = [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/admin/dashboard", label: "Admin" },
        { href: "/admin/events", label: "Events" },
        { href: "/scan", label: "Scanner" },
    ]

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="bg-blue-600 px-2 py-1 rounded text-sm">T</span>
                        Technova
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {publicLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-all"
                            >
                                {link.label}
                            </Link>
                        ))}

                        <div className="w-px h-6 bg-gray-700 mx-2" />

                        {authLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-gray-400 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all text-sm"
                            >
                                {link.label}
                            </Link>
                        ))}

                        {user ? (
                            <div className="ml-2">
                                <UserNav user={user} />
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg"
                    >
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Links */}
                {isOpen && (
                    <div className="md:hidden py-4 space-y-1 border-t border-white/10">
                        {publicLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="block text-gray-300 hover:text-white hover:bg-white/10 py-3 px-4 rounded-lg"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}

                        <div className="border-t border-white/10 my-2 pt-2">
                            <p className="text-xs text-gray-500 px-4 mb-2">Member Area</p>
                            {authLinks.map(link => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="block text-gray-400 hover:text-white hover:bg-white/10 py-3 px-4 rounded-lg"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {user ? (
                            <div className="border-t border-white/10 mt-4 pt-4 px-4">
                                <UserNav user={user} />
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="block bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg text-center font-medium mx-4 mt-4"
                                onClick={() => setIsOpen(false)}
                            >
                                Login
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </nav>
    )
}
