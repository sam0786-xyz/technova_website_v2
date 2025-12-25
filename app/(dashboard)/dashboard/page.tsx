import { auth } from "@/lib/auth"
import Link from "next/link"
import { ArrowRight, Calendar, Trophy, Users, Zap } from "lucide-react"

export default async function DashboardPage() {
    const session = await auth()

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">
                        Welcome back{session?.user.name ? `, ${session.user.name.split(' ')[0]}` : ''}!
                    </h1>
                    <p className="text-gray-400 mt-1">Here&apos;s what&apos;s happening with your Technova journey.</p>
                </div>
                <Link
                    href="/events"
                    className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                >
                    Explore Events
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 backdrop-blur-xl">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-600/30 flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-blue-400" />
                        </div>
                        <span className="text-sm text-gray-400">My XP</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{session?.user.xp_points || 0}</p>
                    <p className="text-xs text-gray-500 mt-1">Earn more by attending events</p>
                </div>

                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-green-600/20 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-green-500" />
                        </div>
                        <span className="text-sm text-gray-400">Events Attended</span>
                    </div>
                    <p className="text-3xl font-bold text-white">0</p>
                    <p className="text-xs text-gray-500 mt-1">This semester</p>
                </div>

                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center">
                            <Users className="w-5 h-5 text-purple-500" />
                        </div>
                        <span className="text-sm text-gray-400">Clubs Joined</span>
                    </div>
                    <p className="text-3xl font-bold text-white">0</p>
                    <p className="text-xs text-gray-500 mt-1">Explore clubs to join</p>
                </div>

                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-600/20 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-orange-500" />
                        </div>
                        <span className="text-sm text-gray-400">Role</span>
                    </div>
                    <p className="text-3xl font-bold text-white capitalize">{session?.user.role || 'Student'}</p>
                    <p className="text-xs text-gray-500 mt-1">Member since 2024</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Upcoming Events */}
                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">Upcoming Events</h2>
                        <Link href="/events" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                            View All →
                        </Link>
                    </div>

                    <div className="text-center py-8 text-gray-500">
                        <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No upcoming events</p>
                        <p className="text-xs mt-1">Check back soon!</p>
                    </div>
                </div>

                {/* My Registrations */}
                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">My Registrations</h2>
                        <Link href="/profile" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                            View Profile →
                        </Link>
                    </div>

                    <div className="text-center py-8 text-gray-500">
                        <Zap className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No registrations yet</p>
                        <p className="text-xs mt-1">Register for events to see them here</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
