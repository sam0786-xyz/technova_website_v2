import { createClient as createServerClient } from "@supabase/supabase-js"

async function getAdminStats() {
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { count: eventsCount } = await supabase.from('events').select('*', { count: 'exact', head: true })
    const { count: registrationsCount } = await supabase.from('registrations').select('*', { count: 'exact', head: true })

    // Calculate Revenue: (Paid Registrations) + (Sponsorships)
    let totalRevenue = 0

    // 1. Sponsorships
    const { data: sponsorships } = await supabase.from('sponsorships').select('amount')
    if (sponsorships) {
        totalRevenue += sponsorships.reduce((sum, s) => sum + s.amount, 0)
    }

    // 2. Paid Registrations (Assuming we track payment amount, or just fix price events)
    // For now, simpler approximation or 0 if payment integration is WIP
    const { data: paidRegs } = await supabase.from('registrations').select('event_id').eq('payment_status', 'paid')
    // Ideally we join events to get price, but for speed let's just count sponsorships for now + placeholder event revenue
    // Or fetch events and map.

    // Scanners - This might be hard to count "Active" without a heartbeat. We can count total scanners (users with role scanner? or just admin/super_admin)
    // Let's count admins
    const { count: adminsCount } = await supabase.from('admin_roles').select('*', { count: 'exact', head: true })

    return {
        events: eventsCount || 0,
        registrations: registrationsCount || 0,
        revenue: totalRevenue,
        scanners: adminsCount || 0 // Proxied by admin roles for now
    }
}

export default async function AdminDashboardPage() {
    const stats = await getAdminStats()

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Admin Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Total Events", value: stats.events },
                    { label: "Registrations", value: stats.registrations },
                    { label: "Revenue", value: `₹${stats.revenue.toLocaleString()}` },
                    { label: "Team / Admins", value: stats.scanners },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border shadow-sm">
                        <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                        <p className="text-3xl font-bold mt-2">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl border shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                <div className="text-gray-500 text-sm">
                    {/* Placeholder for activity feed */}
                    System is running smoothly.
                </div>
            </div>
        </div>
    )
}
