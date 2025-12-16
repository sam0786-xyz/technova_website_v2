import { auth } from "@/lib/auth"
import { getLeaderboardData } from "@/lib/actions/leaderboard"
import { Leaderboard } from "@/components/dashboard/leaderboard"
import { StatsCards } from "@/components/dashboard/stats-cards"

export default async function DashboardPage() {
    const session = await auth()
    const leaderboardData = await getLeaderboardData()

    return (
        <div className="min-h-screen bg-black p-6 md:p-8 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{session?.user?.name}</span>
                    </h1>
                    <p className="text-gray-400 mt-1">Here's your activity overview and ranking.</p>
                </div>
                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 backdrop-blur-md">
                    Season 2025-2026
                </div>
            </div>

            {/* Stats Overview */}
            <StatsCards
                xp={session?.user?.xp_points || 0}
                role={session?.user?.role || 'Member'}
            />

            {/* Leaderboard Section */}
            <Leaderboard initialUsers={leaderboardData} />

            {/* Background Decorative Elements */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
            </div>
        </div>
    )
}
