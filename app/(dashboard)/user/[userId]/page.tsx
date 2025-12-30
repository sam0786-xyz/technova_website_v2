import { notFound } from 'next/navigation'
import { getPublicProfile } from '@/lib/actions/public-profile'
import Link from 'next/link'
import { Home, ChevronRight, Trophy, TrendingUp, Calendar, Award, ArrowLeft } from 'lucide-react'
import { PublicProfileChart } from './chart'

interface PageProps {
    params: Promise<{ userId: string }>
}

export default async function PublicProfilePage({ params }: PageProps) {
    const { userId } = await params
    const { profile, recentEvents, xpHistory } = await getPublicProfile(userId)

    if (!profile) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-black">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative container mx-auto py-8 px-4 max-w-4xl">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm mb-6">
                    <Link href="/" className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors">
                        <Home className="w-4 h-4" />
                        Home
                    </Link>
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                    <Link href="/leaderboard" className="text-gray-400 hover:text-white transition-colors">
                        Leaderboard
                    </Link>
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                    <span className="text-white font-medium">{profile.name}</span>
                </nav>

                {/* Back Button */}
                <Link
                    href="/leaderboard"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Leaderboard
                </Link>

                {/* Profile Header */}
                <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-6">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        {/* Avatar */}
                        <div className="relative">
                            {profile.image ? (
                                <img
                                    src={profile.image}
                                    alt={profile.name}
                                    className="w-28 h-28 rounded-full object-cover border-4 border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.3)]"
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center border-4 border-blue-500/30">
                                    <span className="text-4xl font-bold text-white">
                                        {profile.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                            {profile.rank <= 10 && (
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                                    <Trophy className="w-4 h-4 text-black" />
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold text-white mb-2">{profile.name}</h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                                {profile.role && (
                                    <span className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full text-sm text-blue-300 capitalize">
                                        {profile.role}
                                    </span>
                                )}
                                {profile.year && (
                                    <span className="px-3 py-1 bg-purple-600/20 border border-purple-500/30 rounded-full text-sm text-purple-300">
                                        Year {profile.year}
                                    </span>
                                )}
                                {profile.branch && (
                                    <span className="px-3 py-1 bg-green-600/20 border border-green-500/30 rounded-full text-sm text-green-300">
                                        {profile.branch}
                                    </span>
                                )}
                            </div>

                            {/* Skills */}
                            {profile.skills && profile.skills.length > 0 && (
                                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                    {profile.skills.slice(0, 5).map((skill) => (
                                        <span key={skill} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400">
                                            {skill}
                                        </span>
                                    ))}
                                    {profile.skills.length > 5 && (
                                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-500">
                                            +{profile.skills.length - 5} more
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-5 text-center">
                        <div className="w-10 h-10 rounded-xl bg-yellow-600/20 flex items-center justify-center mx-auto mb-3">
                            <Trophy className="w-5 h-5 text-yellow-400" />
                        </div>
                        <p className="text-2xl font-bold text-white">#{profile.rank}</p>
                        <p className="text-gray-500 text-xs uppercase tracking-wide mt-1">Rank</p>
                    </div>

                    <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-5 text-center">
                        <div className="w-10 h-10 rounded-xl bg-cyan-600/20 flex items-center justify-center mx-auto mb-3">
                            <Award className="w-5 h-5 text-cyan-400" />
                        </div>
                        <p className="text-2xl font-bold text-cyan-400">{profile.xp_points}</p>
                        <p className="text-gray-500 text-xs uppercase tracking-wide mt-1">Total XP</p>
                    </div>

                    <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-5 text-center">
                        <div className="w-10 h-10 rounded-xl bg-green-600/20 flex items-center justify-center mx-auto mb-3">
                            <TrendingUp className="w-5 h-5 text-green-400" />
                        </div>
                        <p className="text-2xl font-bold text-green-400">Top {100 - profile.percentile}%</p>
                        <p className="text-gray-500 text-xs uppercase tracking-wide mt-1">Percentile</p>
                    </div>

                    <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-5 text-center">
                        <div className="w-10 h-10 rounded-xl bg-purple-600/20 flex items-center justify-center mx-auto mb-3">
                            <Calendar className="w-5 h-5 text-purple-400" />
                        </div>
                        <p className="text-2xl font-bold text-white">{recentEvents.length}</p>
                        <p className="text-gray-500 text-xs uppercase tracking-wide mt-1">Events</p>
                    </div>
                </div>

                {/* XP Chart */}
                {xpHistory.length > 0 && (
                    <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                            <TrendingUp className="w-5 h-5 text-cyan-400" />
                            XP Progression (Last 30 Days)
                        </h2>
                        <PublicProfileChart data={xpHistory} />
                    </div>
                )}

                {/* Recent Events */}
                <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                        <Calendar className="w-5 h-5 text-purple-400" />
                        Recent Event Participation
                    </h2>

                    {recentEvents.length > 0 ? (
                        <div className="space-y-3">
                            {recentEvents.map((event, idx) => (
                                <Link
                                    key={`${event.eventId}-${idx}`}
                                    href={`/events/${event.eventId}`}
                                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group"
                                >
                                    <div>
                                        <p className="font-medium text-white group-hover:text-cyan-300 transition-colors">
                                            {event.eventTitle}
                                        </p>
                                        <p className="text-sm text-gray-500">{event.eventDate}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-cyan-400 font-bold">+{event.xpEarned} XP</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No events attended yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
