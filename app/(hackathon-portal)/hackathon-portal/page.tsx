import { checkHackathonRole, getHackathonSettings, getHackathonTeams, getEvaluators, getVolunteers } from "@/lib/actions/hackathon"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ClipboardList, QrCode, Settings, Radio, UserCheck, Users, Timer, ChevronRight, BarChart3, Activity, MapPin, ShieldAlert } from "lucide-react"
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
        badge?: string
    }[] = []

    if (role === 'organizer') {
        cards.push(
            {
                title: "Manage Hackathon",
                desc: "Full root access: Teams, scheduling, parameters, and global endpoints.",
                href: "/hackathon-portal/manage",
                icon: Settings,
                bgColor: "bg-white text-black",
                badge: "ROOT",
            },
            {
                title: "Evaluate Teams",
                desc: "Grade targets across rubric parameters in the active deployment phase.",
                href: "/hackathon-portal/evaluate",
                icon: ClipboardList,
                bgColor: "bg-[#00FF41] text-black", // Acid Green
            },
            {
                title: "Participant Verify",
                desc: "Execute QR handshakes for check-in, checkout, and ration tracking.",
                href: "/hackathon-portal/scan",
                icon: QrCode,
                bgColor: "bg-[#FF6B00] text-black", // Saffron
            },
            {
                title: "Volunteer Command",
                desc: "Track agent attendance and verify shift authorizations.",
                href: "/hackathon-portal/volunteer-scan",
                icon: UserCheck,
                bgColor: "bg-[#03030F] text-white", // Space Blue
            },
            {
                title: "Live Dashboard",
                desc: "Access the public viewport: Countdown, flight plan, and active directives.",
                href: "/hackathon/live",
                icon: Radio,
                bgColor: "bg-[#00FF41] text-black", // Acid Green
            },
            {
                title: "Checkpoint Scanner",
                desc: "Validate personnel movements and specific geographic checkpoints.",
                href: "/hackathon-portal/attendance-scan",
                icon: MapPin,
                bgColor: "bg-white text-black",
            },
        )
    }

    if (role === 'evaluator') {
        cards.push({
            title: "Evaluate Teams",
            desc: "Grade targets across rubric parameters in the active deployment phase.",
            href: "/hackathon-portal/evaluate",
            icon: ClipboardList,
            bgColor: "bg-[#00FF41] text-black", 
        })
    }

    if (role === 'volunteer') {
        cards.push({
            title: "Participant Verify",
            desc: "Execute QR handshakes for check-in, checkout, and ration tracking.",
            href: "/hackathon-portal/scan",
            icon: QrCode,
            bgColor: "bg-[#FF6B00] text-black", 
        })
        cards.push({
            title: "Checkpoint Scanner",
            desc: "Validate personnel movements and specific geographic checkpoints.",
            href: "/hackathon-portal/attendance-scan",
            icon: MapPin,
            bgColor: "bg-[#03030F] text-white", 
        })
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-[1200px] mx-auto px-4 py-16">
                
                {/* NEO-BRUTALIST HEADER */}
                <div className="mb-16 border-b-4 border-black pb-8 flex items-end justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-widest mb-4">
                            <ShieldAlert className="w-4 h-4 text-[#FF6B00]" />
                            {role} CLEARANCE
                        </div>
                        <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter text-black uppercase leading-none">
                            <span className="text-[#FF6B00] block text-xl mb-2 font-mono tracking-widest">Operator:</span>
                            {user?.name || 'Authorized User'}
                        </h1>
                    </div>
                </div>

                {/* SYSTEM DIAGNOSTICS (STATS) */}
                {role === 'organizer' && (
                    <div className="mb-16">
                        <h2 className="text-xl font-heading font-black uppercase tracking-tight text-black mb-6">System Diagnostics</h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: "Target Squads", val: stats.teams, icon: Users, color: "bg-[#00FF41]" },
                                { label: "Evaluators", val: stats.evaluators, icon: BarChart3, color: "bg-[#FF6B00]" },
                                { label: "Active Agents", val: stats.volunteers, icon: Activity, color: "bg-[#03030F] text-white" },
                            ].map((s, i) => (
                                <div key={i} className={`border-4 border-black p-6 ${s.color} neo-border relative overflow-hidden group hover:scale-[1.02] transition-transform`}>
                                    <s.icon className="absolute -bottom-4 -right-4 w-24 h-24 opacity-20 group-hover:scale-110 transition-transform" />
                                    <div className="text-xs font-black uppercase tracking-widest mb-4 relative z-10">{s.label}</div>
                                    <div className="text-5xl font-mono font-black tracking-tighter relative z-10">{s.val}</div>
                                </div>
                            ))}

                            <div className="border-4 border-black p-6 bg-white neo-border col-span-2 lg:col-span-1">
                                <div className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Timer className="w-4 h-4 text-red-500" /> Count to Zero
                                </div>
                                <div className="text-3xl font-mono font-black tracking-tighter text-red-500">
                                    <LiveTimer timerEnd={stats.timerEnd} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* COMMAND MODULES */}
                <div>
                    <h2 className="text-xl font-heading font-black uppercase tracking-tight text-black mb-6 border-b-2 border-black pb-2 inline-block">Command Modules</h2>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cards.map((card, i) => (
                            <Link href={card.href} key={i}>
                                <div className={`spring-btn border-4 border-black ${card.bgColor} neo-border p-8 h-full flex flex-col justify-between group cursor-pointer relative`}>
                                    
                                    <div className="flex justify-between items-start mb-12 relative z-10">
                                        <card.icon className="w-12 h-12 stroke-[2px]" />
                                        {card.badge && (
                                            <span className="px-3 py-1 text-xs font-black uppercase tracking-widest border-2 border-black bg-[#FF6B00] text-black">
                                                {card.badge}
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="relative z-10 mt-auto">
                                        <h3 className="text-3xl font-heading font-black tracking-tight uppercase mb-2 group-hover:-translate-y-1 transition-transform">
                                            {card.title}
                                        </h3>
                                        <p className="font-sans font-bold opacity-80 text-sm leading-relaxed mb-6">
                                            {card.desc}
                                        </p>
                                        <div className="flex items-center text-xs font-black uppercase tracking-widest gap-2 bg-black text-white w-fit px-4 py-2 group-hover:gap-4 transition-all">
                                            Execute <ChevronRight className="w-4 h-4" />
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
