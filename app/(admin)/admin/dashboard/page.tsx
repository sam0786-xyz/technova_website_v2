export default function AdminDashboardPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Admin Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Total Events", value: "12" },
                    { label: "Registrations", value: "1,204" },
                    { label: "Revenue", value: "₹45,000" },
                    { label: "Active Scanners", value: "8" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border shadow-sm">
                        <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                        <p className="text-3xl font-bold mt-2">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl border shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                <div className="text-gray-500 text-sm">No recent activity found.</div>
            </div>
        </div>
    )
}
