import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { checkHackathonRole } from "@/lib/actions/hackathon"
import Link from "next/link"
import { ArrowLeft, Zap, ShieldCheck, ClipboardCheck, Radio as RadioIcon } from "lucide-react"

export default async function HackathonPortalLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session) {
        redirect("/login")
    }

    const { role } = await checkHackathonRole()

    if (role === 'none') {
        return (
            <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-950">
                {/* Background grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />
                <div className="text-center p-10 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-2xl max-w-md relative shadow-2xl">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                        <ShieldCheck className="w-8 h-8 text-red-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-red-400 mt-4">Access Restricted</h1>
                    <p className="text-gray-400 mt-3 leading-relaxed">
                        You do not have access to the Hackathon Portal. Contact the organizers to get added as an evaluator or volunteer.
                    </p>
                    <Link href="/" className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-white font-medium transition-all duration-300">
                        <ArrowLeft className="w-4 h-4" /> Return Home
                    </Link>
                </div>
            </div>
        )
    }

    const roleBadgeConfig = {
        organizer: {
            bg: 'bg-gradient-to-r from-purple-500/20 to-violet-500/20',
            text: 'text-purple-300',
            border: 'border-purple-500/30',
            icon: ShieldCheck,
            label: 'Organizer',
            glow: 'shadow-[0_0_15px_rgba(139,92,246,0.15)]',
        },
        evaluator: {
            bg: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20',
            text: 'text-blue-300',
            border: 'border-blue-500/30',
            icon: ClipboardCheck,
            label: 'Evaluator',
            glow: 'shadow-[0_0_15px_rgba(59,130,246,0.15)]',
        },
        volunteer: {
            bg: 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20',
            text: 'text-emerald-300',
            border: 'border-emerald-500/30',
            icon: RadioIcon,
            label: 'Volunteer',
            glow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]',
        },
    }

    const badge = roleBadgeConfig[role]
    const RoleIcon = badge.icon

    return (
        <div className="min-h-screen bg-[#F7F8FA] text-gray-900">
            {/* Premium Dark Header */}
            <header className="sticky top-0 z-50 bg-[#0F0F14]/95 backdrop-blur-2xl border-b border-white/[0.08]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> 
                            <span className="hidden sm:inline">Back</span>
                        </Link>
                        <div className="w-px h-6 bg-white/10" />
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-900/30">
                                <Zap className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h1 className="font-bold text-base text-white leading-tight">Hackathon Portal</h1>
                                <p className="text-[10px] text-gray-500 leading-tight hidden sm:block">Innovate Bharat 2026</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${badge.border} ${badge.bg} ${badge.glow} backdrop-blur-sm`}>
                            <RoleIcon className={`w-3.5 h-3.5 ${badge.text}`} />
                            <span className={`text-xs font-bold ${badge.text} tracking-wide uppercase`}>{badge.label}</span>
                        </div>
                        <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-white/10">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-xs font-bold text-white border border-white/10">
                                {session.user.name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <span className="text-sm text-gray-300 font-medium">{session.user.name}</span>
                        </div>
                    </div>
                </div>
            </header>
            {children}
        </div>
    )
}
