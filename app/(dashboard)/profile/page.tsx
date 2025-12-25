import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getProfileData } from "@/lib/actions/profile"
import Link from "next/link"
import { User, Mail, Hash, GraduationCap, BookOpen, Phone, Sparkles, Pencil, Trophy, Calendar, Award, ArrowRight, Home, ChevronRight } from "lucide-react"

export default async function ProfilePage() {
    const session = await auth()
    if (!session) redirect("/login")

    const data = await getProfileData()

    const yearLabel = (year: number) => {
        switch (year) {
            case 1: return "1st Year"
            case 2: return "2nd Year"
            case 3: return "3rd Year"
            case 4: return "4th Year"
            case 5: return "5th Year"
            default: return `Year ${year}`
        }
    }

    return (
        <div className="min-h-screen bg-black">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative container mx-auto py-8 px-4 max-w-5xl">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm mb-6">
                    <Link href="/" className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors">
                        <Home className="w-4 h-4" />
                        Home
                    </Link>
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                    <span className="text-white font-medium">Profile</span>
                </nav>

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-white">My Profile</h1>
                    <Link
                        href="/profile/edit"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]"
                    >
                        <Pencil className="w-4 h-4" />
                        Edit Profile
                    </Link>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Left Column - User Info */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Profile Card */}
                        <div className="p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 text-center">
                            {/* Avatar */}
                            <div className="relative inline-block mb-4">
                                {session.user.image ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img
                                        src={session.user.image}
                                        alt={session.user.name || "User"}
                                        className="w-28 h-28 rounded-full object-cover border-4 border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.3)]"
                                    />
                                ) : (
                                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center border-4 border-blue-500/30">
                                        <span className="text-4xl font-bold text-white">
                                            {session.user.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 rounded-full text-xs font-medium text-white capitalize shadow-lg">
                                    {session.user.role}
                                </div>
                            </div>

                            {/* Name & Email */}
                            <h2 className="text-2xl font-bold text-white mb-1">{session.user.name}</h2>
                            <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
                                <Mail className="w-4 h-4" />
                                {session.user.email}
                            </p>

                            {/* Badges */}
                            <div className="flex flex-wrap justify-center gap-2 mt-4">
                                {data?.system_id && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300">
                                        <Hash className="w-3 h-3 text-blue-400" />
                                        {data.system_id}
                                    </span>
                                )}
                                {data?.course && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300">
                                        <BookOpen className="w-3 h-3 text-purple-400" />
                                        {data.course}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* XP Card */}
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 rounded-xl bg-blue-600/30 flex items-center justify-center">
                                    <Trophy className="w-7 h-7 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs uppercase tracking-wide">Total XP</p>
                                    <p className="text-4xl font-bold text-white">{session.user.xp_points || 0}</p>
                                </div>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2.5">
                                <div
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all"
                                    style={{ width: `${Math.min((session.user.xp_points || 0) / 100 * 100, 100)}%` }}
                                />
                            </div>
                            <p className="text-gray-400 text-xs mt-2">Next level: 100 XP</p>
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
                                <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center mx-auto mb-3">
                                    <GraduationCap className="w-5 h-5 text-blue-400" />
                                </div>
                                <p className="text-2xl font-bold text-white">{data?.year ? yearLabel(data.year) : "—"}</p>
                                <p className="text-gray-500 text-xs uppercase tracking-wide mt-1">Year</p>
                            </div>

                            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
                                <div className="w-10 h-10 rounded-xl bg-purple-600/20 flex items-center justify-center mx-auto mb-3">
                                    <User className="w-5 h-5 text-purple-400" />
                                </div>
                                <p className="text-2xl font-bold text-white">{data?.section || "—"}</p>
                                <p className="text-gray-500 text-xs uppercase tracking-wide mt-1">Section</p>
                            </div>

                            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
                                <div className="w-10 h-10 rounded-xl bg-green-600/20 flex items-center justify-center mx-auto mb-3">
                                    <Phone className="w-5 h-5 text-green-400" />
                                </div>
                                <p className="text-lg font-bold text-white">{data?.mobile || "—"}</p>
                                <p className="text-gray-500 text-xs uppercase tracking-wide mt-1">Mobile</p>
                            </div>

                            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
                                <div className="w-10 h-10 rounded-xl bg-yellow-600/20 flex items-center justify-center mx-auto mb-3">
                                    <Trophy className="w-5 h-5 text-yellow-400" />
                                </div>
                                <p className="text-2xl font-bold text-white">{session.user.xp_points || 0}</p>
                                <p className="text-gray-500 text-xs uppercase tracking-wide mt-1">XP Points</p>
                            </div>
                        </div>

                        {/* Activity Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-white">Activity</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-green-600/20 flex items-center justify-center">
                                            <Calendar className="w-6 h-6 text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-white">0</p>
                                            <p className="text-gray-400 text-sm">Events Attended</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-purple-600/20 flex items-center justify-center">
                                            <Award className="w-6 h-6 text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-white">0</p>
                                            <p className="text-gray-400 text-sm">Certificates Earned</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <Link href="/events" className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group">
                                        <span className="text-gray-300">Browse Events</span>
                                        <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                    </Link>
                                    <Link href="/leaderboard" className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group">
                                        <span className="text-gray-300">View Leaderboard</span>
                                        <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                    </Link>
                                    <Link href="/buddy-finder" className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group">
                                        <span className="text-gray-300">Find Teammates</span>
                                        <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                                    <Sparkles className="w-5 h-5 text-blue-400" />
                                    Skills & Interests
                                </h3>
                                <Link href="/profile/edit" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                                    Edit →
                                </Link>
                            </div>

                            {data?.skills && data.skills.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {data.skills.map((skill: string) => (
                                        <span
                                            key={skill}
                                            className="px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-full text-sm text-blue-300 hover:bg-blue-600/30 transition-colors"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <Sparkles className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                                    <p className="text-gray-500 text-sm">No skills added yet.</p>
                                    <Link href="/profile/edit" className="text-blue-400 text-sm hover:underline">Add some skills!</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
