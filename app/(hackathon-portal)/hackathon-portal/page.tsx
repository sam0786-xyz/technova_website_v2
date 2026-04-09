import { checkHackathonRole, getHackathonSettings, getHackathonTeams, getEvaluators, getVolunteers } from "@/lib/actions/hackathon"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ClipboardList, QrCode, Settings, Radio, UserCheck, Users, Timer, ChevronRight, BarChart3, Activity, MapPin, ShieldAlert, DoorOpen } from "lucide-react"
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
        bgColor: string
        accentColor: string
        badge?: string
    }[] = []

    if (role === 'organizer') {
        cards.push(
            {
                title: "Manage Hackathon",
                desc: "Full access to teams, scheduling, grading parameters, and settings.",
                href: "/hackathon-portal/manage",
                icon: Settings,
                bgColor: "bg-white",
                accentColor: "text-indigo-600 bg-indigo-50",
                badge: "ROOT",
            },
            {
                title: "Evaluate Teams",
                desc: "Grade targets across rubric parameters in the active deployment phase.",
                href: "/hackathon-portal/evaluate",
                icon: ClipboardList,
                bgColor: "bg-white",
                accentColor: "text-emerald-600 bg-emerald-50",
            },
            {
                title: "Participant Verify",
                desc: "Execute QR handshakes for check-in, checkout, and ration tracking.",
                href: "/hackathon-portal/scan",
                icon: QrCode,
                bgColor: "bg-white",
                accentColor: "text-orange-600 bg-orange-50",
            },
            {
                title: "Volunteer Command",
                desc: "Track agent attendance and verify shift authorizations.",
                href: "/hackathon-portal/volunteer-scan",
                icon: UserCheck,
                bgColor: "bg-white",
                accentColor: "text-blue-600 bg-blue-50",
            },
            {
                title: "Live Dashboard",
                desc: "Access the public viewport: Countdown, flight plan, and active directives.",
                href: "/hackathon/live",
                icon: Radio,
                bgColor: "bg-white",
                accentColor: "text-rose-600 bg-rose-50",
            },
            {
                title: "Checkpoint Scanner",
                desc: "Validate personnel movements and specific geographic checkpoints.",
                href: "/hackathon-portal/attendance-scan",
                icon: MapPin,
                bgColor: "bg-white",
                accentColor: "text-violet-600 bg-violet-50",
            },
            {
                title: "Gate Scanner",
                desc: "Track entry/exit movements at the venue gate with timestamped logs.",
                href: "/hackathon-portal/gate-scan",
                icon: DoorOpen,
                bgColor: "bg-white",
                accentColor: "text-teal-600 bg-teal-50",
            },
        )
    }

    if (role === 'evaluator') {
        cards.push({
            title: "Evaluate Teams",
            desc: "Grade targets across rubric parameters in the active deployment phase.",
            href: "/hackathon-portal/evaluate",
            icon: ClipboardList,
            bgColor: "bg-white",
            accentColor: "text-emerald-600 bg-emerald-50"
        })
    }

    if (role === 'volunteer') {
        cards.push({
            title: "Participant Verify",
            desc: "Execute QR handshakes for check-in, checkout, and ration tracking.",
            href: "/hackathon-portal/scan",
            icon: QrCode,
            bgColor: "bg-white",
            accentColor: "text-orange-600 bg-orange-50", 
        })
        cards.push({
            title: "Checkpoint Scanner",
            desc: "Validate personnel movements and specific geographic checkpoints.",
            href: "/hackathon-portal/attendance-scan",
            icon: MapPin,
            bgColor: "bg-white",
            accentColor: "text-violet-600 bg-violet-50", 
        })
        cards.push({
            title: "Gate Scanner",
            desc: "Track entry/exit movements at the venue gate with timestamped logs.",
            href: "/hackathon-portal/gate-scan",
            icon: DoorOpen,
            bgColor: "bg-white",
            accentColor: "text-teal-600 bg-teal-50",
        })
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
                
                {/* POLISHED HEADER */}
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 rounded-full shadow-sm text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-6">
                        <ShieldAlert className="w-3.5 h-3.5 text-indigo-500" />
                        {role} CLEARANCE
                    </div>
                    <div className="flex items-end justify-between">
                        <div>
                            <h2 className="text-xl text-gray-500 font-medium mb-1">Welcome back,</h2>
                            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
                                {user?.name || 'Authorized User'}
                            </h1>
                        </div>
                    </div>
                </div>

                {/* SYSTEM DIAGNOSTICS (STATS) */}
                {role === 'organizer' && (
                    <div className="mb-12">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: "Target Squads", val: stats.teams, icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
                                { label: "Evaluators", val: stats.evaluators, icon: BarChart3, color: "text-emerald-600", bg: "bg-emerald-50" },
                                { label: "Active Agents", val: stats.volunteers, icon: Activity, color: "text-blue-600", bg: "bg-blue-50" },
                            ].map((s, i) => (
                                <div key={i} className={`bg-white border border-gray-200 rounded-2xl p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-all`}>
                                    <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center mb-4`}>
                                        <s.icon className="w-5 h-5" />
                                    </div>
                                    <div className="text-3xl font-bold tracking-tight text-gray-900 mb-1">{s.val}</div>
                                    <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{s.label}</div>
                                </div>
                            ))}

                            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm col-span-2 lg:col-span-1 flex flex-col justify-center items-center text-center">
                                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                    <Timer className="w-3.5 h-3.5 text-rose-500" /> Countdown
                                </div>
                                <div className="text-3xl font-bold tracking-tight text-rose-600 tabular-nums">
                                    <LiveTimer timerEnd={stats.timerEnd} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* COMMAND MODULES */}
                <div>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6 px-1">Command Modules</h2>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {cards.map((card, i) => (
                            <Link href={card.href} key={i} className="block group">
                                <div className={`${card.bgColor} border border-gray-200 rounded-2xl p-6 h-full flex flex-col justify-between shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300 transform group-hover:-translate-y-1`}>
                                    
                                    <div className="flex justify-between items-start mb-8">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.accentColor}`}>
                                            <card.icon className="w-6 h-6 stroke-[2px]" />
                                        </div>
                                        {card.badge && (
                                            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-red-50 text-red-600 border border-red-100">
                                                {card.badge}
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="mt-auto">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                                            {card.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 leading-relaxed mb-6">
                                            {card.desc}
                                        </p>
                                        <div className="flex items-center text-sm font-semibold text-indigo-600 gap-1.5 group-hover:gap-2.5 transition-all">
                                            Open Module <ChevronRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}
