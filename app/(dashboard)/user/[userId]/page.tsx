import { notFound } from 'next/navigation'
import { getPublicProfile } from '@/lib/actions/public-profile'
import Link from 'next/link'
import { Home, ChevronRight, Trophy, TrendingUp, Calendar, Award, ArrowLeft, Mail } from 'lucide-react'
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
                            <h1 className="text-3xl font-bold text-white mb-1">{profile.name}</h1>
                            {profile.email && (
                                <p className="text-gray-400 text-sm flex items-center justify-center md:justify-start gap-1.5 mb-3">
                                    <Mail className="w-4 h-4" />
                                    {profile.email}
                                </p>
                            )}
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
                                {profile.course && (
                                    <span className="px-3 py-1 bg-cyan-600/20 border border-cyan-500/30 rounded-full text-sm text-cyan-300">
                                        {profile.course}
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
                                    {profile.skills.map((skill) => (
                                        <span key={skill} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Social Links */}
                            {(profile.linkedin_url || profile.github_url || profile.portfolio_url ||
                                profile.kaggle_url || profile.leetcode_url || profile.codeforces_url || profile.codechef_url ||
                                profile.gfg_url || profile.hackerrank_url) && (
                                    <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4 pt-4 border-t border-white/10">
                                        {profile.linkedin_url && (
                                            <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"
                                                className="w-9 h-9 rounded-lg bg-[#0077B5]/20 hover:bg-[#0077B5]/40 flex items-center justify-center transition-all group" title="LinkedIn">
                                                <svg className="w-4 h-4 text-[#0077B5] group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                                </svg>
                                            </a>
                                        )}
                                        {profile.github_url && (
                                            <a href={profile.github_url} target="_blank" rel="noopener noreferrer"
                                                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all group" title="GitHub">
                                                <svg className="w-4 h-4 text-white group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                </svg>
                                            </a>
                                        )}
                                        {profile.portfolio_url && (
                                            <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer"
                                                className="w-9 h-9 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/40 flex items-center justify-center transition-all group" title="Portfolio">
                                                <svg className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <line x1="2" y1="12" x2="22" y2="12"></line>
                                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                                </svg>
                                            </a>
                                        )}
                                        {profile.kaggle_url && (
                                            <a href={profile.kaggle_url} target="_blank" rel="noopener noreferrer"
                                                className="w-9 h-9 rounded-lg bg-[#20BEFF]/20 hover:bg-[#20BEFF]/40 flex items-center justify-center transition-all group" title="Kaggle">
                                                <svg className="w-4 h-4 text-[#20BEFF] group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.282.18.046.149.034.255-.036.315l-6.555 6.344 6.836 8.507c.095.104.117.208.073.312" />
                                                </svg>
                                            </a>
                                        )}
                                        {profile.leetcode_url && (
                                            <a href={profile.leetcode_url} target="_blank" rel="noopener noreferrer"
                                                className="w-9 h-9 rounded-lg bg-[#FFA116]/20 hover:bg-[#FFA116]/40 flex items-center justify-center transition-all group" title="LeetCode">
                                                <svg className="w-4 h-4 text-[#FFA116] group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
                                                </svg>
                                            </a>
                                        )}
                                        {profile.codeforces_url && (
                                            <a href={profile.codeforces_url} target="_blank" rel="noopener noreferrer"
                                                className="w-9 h-9 rounded-lg bg-[#1F8ACB]/20 hover:bg-[#1F8ACB]/40 flex items-center justify-center transition-all group" title="Codeforces">
                                                <svg className="w-4 h-4 text-[#1F8ACB] group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M4.5 7.5C5.328 7.5 6 8.172 6 9v10.5c0 .828-.672 1.5-1.5 1.5h-3C.672 21 0 20.328 0 19.5V9c0-.828.672-1.5 1.5-1.5h3zm9-4.5c.828 0 1.5.672 1.5 1.5v15c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5v-15c0-.828.672-1.5 1.5-1.5h3zm9 7.5c.828 0 1.5.672 1.5 1.5v7.5c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5V12c0-.828.672-1.5 1.5-1.5h3z" />
                                                </svg>
                                            </a>
                                        )}
                                        {profile.codechef_url && (
                                            <a href={profile.codechef_url} target="_blank" rel="noopener noreferrer"
                                                className="w-9 h-9 rounded-lg bg-[#5B4638]/30 hover:bg-[#5B4638]/50 flex items-center justify-center transition-all group" title="CodeChef">
                                                <svg className="w-4 h-4 text-[#c9a97d] group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M11.007 0c-.787.031-1.515.37-2.222.685a12.27 12.27 0 01-1.864.703c-.635.176-1.3.354-1.814.726-.19.138-.36.306-.546.449-.051.02-.104.048-.156.073a4.861 4.861 0 00-.755.475c-.474.375-.868.839-1.202 1.353-.586.903-.997 1.918-1.261 2.967-.346 1.376-.397 2.83-.118 4.224.272 1.353.817 2.645 1.587 3.791.134.196.233.428.401.6.123.026.211-.104.273-.195.282-.4.54-.814.763-1.246.228-.44.413-.906.636-1.34.015-.027.034-.056.026-.09a.323.323 0 00-.133-.158c-.236-.2-.51-.362-.782-.49-.547-.266-1.146-.43-1.69-.69-.39-.186-.795-.44-1.047-.81-.104-.121-.225-.285-.155-.45.097-.217.342-.32.546-.398.348-.137.716-.207 1.08-.263.39-.059.784-.082 1.178-.092l.445-.012z" />
                                                </svg>
                                            </a>
                                        )}
                                        {profile.gfg_url && (
                                            <a href={profile.gfg_url} target="_blank" rel="noopener noreferrer"
                                                className="w-9 h-9 rounded-lg bg-[#2F8D46]/20 hover:bg-[#2F8D46]/40 flex items-center justify-center transition-all group" title="GeeksforGeeks">
                                                <svg className="w-4 h-4 text-[#2F8D46] group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M21.45 14.315c-.143.28-.334.532-.565.745a3.691 3.691 0 0 1-1.104.695 4.51 4.51 0 0 1-3.116-.016 3.79 3.79 0 0 1-2.135-2.078l3.763-.003a2.4 2.4 0 0 0 .48-.047.865.865 0 0 0 .465-.278c.127-.157.19-.363.19-.618V12.7a.921.921 0 0 0-.19-.618.865.865 0 0 0-.465-.278 2.41 2.41 0 0 0-.48-.047H11.99a.73.73 0 0 1-.513-.213.73.73 0 0 1-.213-.513v-.015a.97.97 0 0 1 .232-.612.97.97 0 0 1 .595-.378 2.11 2.11 0 0 1 .488-.056h5.897c.18 0 .345-.003.495-.01a2.1 2.1 0 0 0 .46-.057.825.825 0 0 0 .37-.198.704.704 0 0 0 .202-.358 2.85 2.85 0 0 0 .042-.564V5.56a.921.921 0 0 0-.19-.618.865.865 0 0 0-.465-.278 2.41 2.41 0 0 0-.48-.047H11.99a5.88 5.88 0 0 0-2.328.455 5.884 5.884 0 0 0-1.934 1.305 6.067 6.067 0 0 0-1.295 1.954 6.19 6.19 0 0 0-.465 2.37c0 .842.157 1.637.47 2.385.313.749.755 1.404 1.327 1.965.571.562 1.247 1.006 2.028 1.335a6.476 6.476 0 0 0 2.495.491h.94z" />
                                                </svg>
                                            </a>
                                        )}
                                        {profile.hackerrank_url && (
                                            <a href={profile.hackerrank_url} target="_blank" rel="noopener noreferrer"
                                                className="w-9 h-9 rounded-lg bg-[#00EA64]/20 hover:bg-[#00EA64]/40 flex items-center justify-center transition-all group" title="HackerRank">
                                                <svg className="w-4 h-4 text-[#00EA64] group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 0c1.285 0 9.75 4.886 10.392 6 .645 1.115.645 10.885 0 12S13.287 24 12 24s-9.75-4.885-10.395-6c-.641-1.115-.641-10.885 0-12C2.25 4.886 10.715 0 12 0zm2.295 6.799c-.141 0-.258.115-.258.258v3.875H9.963V6.908h.701a.136.136 0 0 0 .094-.229l-1.97-2.022a.136.136 0 0 0-.191 0l-1.97 2.022a.136.136 0 0 0 .094.229h.701v10.035c0 .143.115.258.258.258h1.97c.143 0 .258-.115.258-.258v-3.876h4.074v4.026h-.701a.136.136 0 0 0-.094.229l1.97 2.022a.136.136 0 0 0 .191 0l1.97-2.022a.136.136 0 0 0-.094-.229h-.701V6.908a.26.26 0 0 0-.258-.109h-1.97z" />
                                                </svg>
                                            </a>
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
