import { checkHackathonRole } from "@/lib/actions/hackathon"
import { getHackathonTeams, getEvaluators, getVolunteers, getHackathonSettings } from "@/lib/actions/hackathon"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ClipboardList, QrCode, Settings, Radio, UserCheck, Users, Timer, ChevronRight, BarChart3, Activity, MapPin } from "lucide-react"
import LiveTimer from "./components/LiveTimer"

export default async function HackathonPortalHub() {
    const { role, user } = await checkHackathonRole()
    if (role === 'none') redirect("/")

    // Fetch stats for organizer view
    let stats = { teams: 0, evaluators: 0, volunteers: 0, timerEnd: null as string | null }
    if (role === 'organizer') {
        const [teams, evaluators, volunteers, settings] = await Promise.all([
            getHackathonTeams(),
            getEvaluators(),
            getVolunteers(),
            getHackathonSettings()
        ])
        stats.teams = teams?.length || 0
        stats.evaluators = evaluators?.length || 0
        stats.volunteers = volunteers?.length || 0
        stats.timerEnd = settings?.timer_end || null
    }

    const cards: {
        title: string
        desc: string
        href: string
        icon: any
        iconBg: string
        iconColor: string
        borderHover: string
        badge?: string
    }[] = []

    if (role === 'organizer') {
        cards.push(
            {
                title: "Manage Hackathon",
                desc: "Teams, evaluators, volunteers, timer, schedule, and data downloads",
                href: "/hackathon-portal/manage",
                icon: Settings,
                iconBg: "bg-gradient-to-br from-purple-500 to-violet-600",
                iconColor: "text-white",
                borderHover: "hover:border-purple-300 hover:shadow-purple-500/10",
                badge: "Admin",
            },
            {
                title: "Evaluate Teams",
                desc: "Score teams across rubric categories and evaluation rounds",
                href: "/hackathon-portal/evaluate",
                icon: ClipboardList,
                iconBg: "bg-gradient-to-br from-blue-500 to-cyan-600",
                iconColor: "text-white",
                borderHover: "hover:border-blue-300 hover:shadow-blue-500/10",
            },
            {
                title: "Verify & Track",
                desc: "QR scan for participant check-in, checkout, and meal tracking",
                href: "/hackathon-portal/scan",
                icon: QrCode,
                iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600",
                iconColor: "text-white",
                borderHover: "hover:border-emerald-300 hover:shadow-emerald-500/10",
            },
            {
                title: "Volunteer Scanner",
                desc: "Scan volunteer QR codes to track attendance and shifts",
                href: "/hackathon-portal/volunteer-scan",
                icon: UserCheck,
                iconBg: "bg-gradient-to-br from-violet-500 to-purple-600",
                iconColor: "text-white",
                borderHover: "hover:border-violet-300 hover:shadow-violet-500/10",
            },
            {
                title: "Live Dashboard",
                desc: "View the public-facing 24hr timer, schedule, and announcements",
                href: "/hackathon/live",
                icon: Radio,
                iconBg: "bg-gradient-to-br from-amber-500 to-orange-600",
                iconColor: "text-white",
                borderHover: "hover:border-amber-300 hover:shadow-amber-500/10",
            },
            {
                title: "Attendance Scanner",
                desc: "Scan attendee QR codes to track event attendance at checkpoints",
                href: "/hackathon-portal/attendance-scan",
                icon: MapPin,
                iconBg: "bg-gradient-to-br from-pink-500 to-rose-600",
                iconColor: "text-white",
                borderHover: "hover:border-pink-300 hover:shadow-pink-500/10",
            },
        )
    }

    if (role === 'evaluator') {
        cards.push({
            title: "Evaluate Teams",
            desc: "Score teams across rubric categories and evaluation rounds",
            href: "/hackathon-portal/evaluate",
            icon: ClipboardList,
            iconBg: "bg-gradient-to-br from-blue-500 to-cyan-600",
            iconColor: "text-white",
            borderHover: "hover:border-blue-300 hover:shadow-blue-500/10",
        })
    }

    if (role === 'volunteer') {
        cards.push({
            title: "Verify & Track",
            desc: "QR scan for participant check-in, checkout, and meal tracking",
            href: "/hackathon-portal/scan",
            icon: QrCode,
            iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600",
            iconColor: "text-white",
            borderHover: "hover:border-emerald-300 hover:shadow-emerald-500/10",
        })
        cards.push({
            title: "Attendance Scanner",
            desc: "Scan attendee QR codes at event checkpoints",
            href: "/hackathon-portal/attendance-scan",
            icon: MapPin,
            iconBg: "bg-gradient-to-br from-pink-500 to-rose-600",
            iconColor: "text-white",
            borderHover: "hover:border-pink-300 hover:shadow-pink-500/10",
        })
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* Welcome Section */}
            <div className="mb-8 sm:mb-10">
                <p className="text-sm font-medium text-gray-500 mb-1">Welcome back,</p>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {user?.name || 'Team Member'}
                </h1>
            </div>

            {/* Quick Stats (Organizer only) */}
            {role === 'organizer' && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
                    <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                                <Users className="w-4.5 h-4.5 text-blue-600" />
                            </div>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Teams</span>
                        </div>
                        <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.teams}</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                                <BarChart3 className="w-4.5 h-4.5 text-amber-600" />
                            </div>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Evaluators</span>
                        </div>
                        <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.evaluators}</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                                <Activity className="w-4.5 h-4.5 text-emerald-600" />
                            </div>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Volunteers</span>
                        </div>
                        <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.volunteers}</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center">
                                <Timer className="w-4.5 h-4.5 text-rose-600" />
                            </div>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Time Left</span>
                        </div>
                        <p className="text-2xl sm:text-3xl font-bold text-gray-900 font-mono tracking-tight"><LiveTimer timerEnd={stats.timerEnd} /></p>
                    </div>
                </div>
            )}

            {/* Action Cards */}
            <div className="mb-4">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Quick Actions</h2>
            </div>
            <div className={`grid gap-4 ${cards.length > 2 ? 'sm:grid-cols-2 lg:grid-cols-3' : cards.length === 1 ? 'max-w-md' : 'sm:grid-cols-2 max-w-2xl'}`}>
                {cards.map((card) => (
                    <Link key={card.href} href={card.href} className="group">
                        <div className={`bg-white rounded-2xl border border-gray-200/80 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${card.borderHover} cursor-pointer h-full relative overflow-hidden`}>
                            {/* Subtle gradient overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/0 to-gray-100/0 group-hover:from-gray-50/50 group-hover:to-gray-100/30 transition-all duration-500 rounded-2xl" />
                            
                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <card.icon className={`w-6 h-6 ${card.iconColor}`} />
                                    </div>
                                    {card.badge && (
                                        <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 rounded-full border border-purple-100">
                                            {card.badge}
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1.5 group-hover:text-gray-700 transition-colors">{card.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed mb-4">{card.desc}</p>
                                <div className="flex items-center gap-1.5 text-sm font-medium text-gray-400 group-hover:text-gray-600 transition-colors">
                                    Open <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
