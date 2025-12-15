import { getUser } from "@/lib/auth/supabase-server"

export default async function DashboardPage() {
    const user = await getUser()

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-xl shadow-sm border">
                    <h3 className="text-sm font-medium text-gray-500">My XP</h3>
                    <p className="text-3xl font-bold mt-2">{user?.xp_points || 0}</p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-sm border">
                    <h3 className="text-sm font-medium text-gray-500">Events Attended</h3>
                    <p className="text-3xl font-bold mt-2">0</p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-sm border">
                    <h3 className="text-sm font-medium text-gray-500">Role</h3>
                    <p className="text-3xl font-bold mt-2 capitalize">{user?.role}</p>
                </div>
            </div>
        </div>
    )
}
