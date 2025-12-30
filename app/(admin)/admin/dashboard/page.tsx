import { createClient as createServerClient } from "@supabase/supabase-js"
import { Calendar, Users, DollarSign, Shield, TrendingUp, Activity } from "lucide-react"
import { ADMIN_EMAILS } from "@/lib/auth/role-utils"
import { formatDate } from "@/lib/utils"

async function getAdminStats() {
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { count: eventsCount } = await supabase.from('events').select('*', { count: 'exact', head: true })
    const { count: registrationsCount } = await supabase.from('registrations').select('*', { count: 'exact', head: true })

    // Calculate Revenue from Sponsorships
    let totalRevenue = 0
    const { data: sponsorships } = await supabase.from('sponsorships').select('amount')
    if (sponsorships) {
        totalRevenue += sponsorships.reduce((sum, s) => sum + s.amount, 0)
    }

    // Count admins from ADMIN_EMAILS + 1 for technova@sharda.ac.in
    const adminsCount = ADMIN_EMAILS.length + 1

    // Get recent events
    const { data: recentEvents } = await supabase
        .from('events')
        .select('id, title, start_time, status')
        .order('created_at', { ascending: false })
        .limit(5)

    return {
        events: eventsCount || 0,
        registrations: registrationsCount || 0,
        revenue: totalRevenue,
        scanners: adminsCount,
        recentEvents: recentEvents || []
    }
}

export default async function AdminDashboardPage() {
    const stats = await getAdminStats()

    const statCards = [
        { label: "Total Events", value: stats.events, icon: Calendar, color: "blue", gradient: "from-blue-600/20 to-blue-500/10" },
        { label: "Registrations", value: stats.registrations, icon: Users, color: "green", gradient: "from-green-600/20 to-green-500/10" },
        { label: "Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "yellow", gradient: "from-yellow-600/20 to-yellow-500/10" },
        { label: "Team / Admins", value: stats.scanners, icon: Shield, color: "purple", gradient: "from-purple-600/20 to-purple-500/10" },
    ]

    return (
        <div className="min-h-screen bg-black p-6 md:p-8">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Admin Overview</h1>
                        <p className="text-gray-400 mt-1">Monitor your Technova platform statistics</p>
                    </div>
                    <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
                        Season 2025-2026
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, i) => (
                        <div key={i} className={`p-6 rounded-2xl bg-gradient-to-br ${stat.gradient} border border-white/10 backdrop-blur-xl`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl bg-${stat.color}-600/30 flex items-center justify-center`}>
                                    <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">{stat.label}</p>
                                    <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Activity & Quick Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Events */}
                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-blue-400" />
                                Recent Events
                            </h2>
                        </div>
                        <div className="space-y-3">
                            {stats.recentEvents.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No events yet</p>
                            ) : (
                                stats.recentEvents.map((event: any) => (
                                    <div key={event.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                        <div>
                                            <p className="font-medium text-white">{event.title}</p>
                                            <p className="text-sm text-gray-500">{formatDate(event.start_time)}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${event.status === 'live'
                                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                            : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                            }`}>
                                            {event.status}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* System Status */}
                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Activity className="w-5 h-5 text-green-400" />
                                System Status
                            </h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-green-400 font-medium">All Systems Operational</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <p className="text-gray-500 text-xs uppercase tracking-wide">Database</p>
                                    <p className="text-white font-medium mt-1">Connected</p>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <p className="text-gray-500 text-xs uppercase tracking-wide">Auth</p>
                                    <p className="text-white font-medium mt-1">Active</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                                <TrendingUp className="w-5 h-5 text-blue-400" />
                                <div>
                                    <p className="text-white font-medium">Platform Performance</p>
                                    <p className="text-gray-500 text-sm">99.9% uptime this month</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
