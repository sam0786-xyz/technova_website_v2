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
            <div className="flex h-screen items-center justify-center bg-gray-50">
                {/* Background grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />
                <div className="text-center p-10 rounded-2xl bg-white border border-gray-200 max-w-md relative shadow-sm z-10">
                    <div className="mx-auto w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-6">
                        <ShieldCheck className="w-8 h-8 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mt-4">Access Restricted</h1>
                    <p className="text-gray-500 mt-3 leading-relaxed">
                        You do not have access to the Hackathon internal portal. Contact the organizers to get added as an evaluator or volunteer.
                    </p>
                    <Link href="/" className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-xl text-gray-700 font-medium transition-all duration-300 shadow-sm hover:shadow">
                        <ArrowLeft className="w-4 h-4" /> Return Home
                    </Link>
                </div>
            </div>
        )
    }

    const roleBadgeConfig = {
        organizer: {
            bg: 'bg-indigo-50',
            text: 'text-indigo-700',
            border: 'border-indigo-200',
            icon: ShieldCheck,
            label: 'Organizer'
        },
        evaluator: {
            bg: 'bg-emerald-50',
            text: 'text-emerald-700',
            border: 'border-emerald-200',
            icon: ClipboardCheck,
            label: 'Evaluator'
        },
        volunteer: {
            bg: 'bg-amber-50',
            text: 'text-amber-700',
            border: 'border-amber-200',
            icon: RadioIcon,
            label: 'Volunteer'
        },
    }

    const badge = roleBadgeConfig[role]
    const RoleIcon = badge.icon

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 selection:bg-blue-100 selection:text-blue-900 font-sans">
            {/* Premium Light Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-600 hover:text-gray-900 px-4 py-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition-all rounded-lg group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> 
                            <span className="hidden sm:inline">Portal Exit</span>
                        </Link>
                        <div className="w-px h-6 bg-gray-200" />
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
                                <Zap className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h1 className="font-bold text-sm text-gray-900 leading-tight">Admin & Evaluation</h1>
                                <p className="text-[10px] text-gray-500 leading-tight hidden sm:block font-medium uppercase tracking-wider">Innovate Bharat 2026</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${badge.border} ${badge.bg}`}>
                            <RoleIcon className={`w-3.5 h-3.5 ${badge.text}`} />
                            <span className={`text-[10px] font-bold ${badge.text} tracking-wider uppercase`}>{badge.label}</span>
                        </div>
                        <div className="hidden sm:flex items-center gap-2.5 pl-4 border-l border-gray-200">
                            <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-xs font-bold text-white shadow-sm ring-2 ring-white">
                                {session.user.name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <span className="text-sm text-gray-700 font-semibold">{session.user.name}</span>
                        </div>
                    </div>
                </div>
            </header>
            {children}
        </div>
    )
}
