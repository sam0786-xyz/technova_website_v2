'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LeaderboardUser } from '@/lib/actions/leaderboard'

interface LeaderboardProps {
    initialUsers: LeaderboardUser[]
}

export function Leaderboard({ initialUsers }: LeaderboardProps) {
    const [searchTerm, setSearchTerm] = useState('')

    const filteredUsers = initialUsers.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const topThree = filteredUsers.slice(0, 3)
    const rest = filteredUsers.slice(3)

    return (
        <div className="w-full bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Trophy className="w-6 h-6 text-yellow-400" />
                        Technova Leaderboard
                    </h2>
                    <p className="text-gray-400 text-sm">Top performers this season</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search name or System ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-800/50 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all"
                    />
                </div>
            </div>

            {/* Top 3 Podium (Only show if no search or search yields top results) */}
            {!searchTerm && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 pb-4">
                    {topThree.map((user, index) => (
                        <div key={user.id} className={cn("relative order-last md:order-none", index === 0 ? "md:-mt-8 order-first" : "")}>
                            <div className={cn(
                                "relative flex flex-col items-center p-6 rounded-2xl border backdrop-blur-md overflow-hidden",
                                index === 0 ? "bg-gradient-to-b from-yellow-500/10 to-transparent border-yellow-500/20" :
                                    index === 1 ? "bg-gradient-to-b from-gray-300/10 to-transparent border-gray-400/20" :
                                        "bg-gradient-to-b from-orange-700/10 to-transparent border-orange-700/20"
                            )}>
                                <div className={cn(
                                    "w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mb-3 border-2 shadow-[0_0_15px_rgba(0,0,0,0.5)]",
                                    index === 0 ? "bg-yellow-500/20 border-yellow-400 text-yellow-400 shadow-yellow-500/20" :
                                        index === 1 ? "bg-gray-400/20 border-gray-300 text-gray-300 shadow-gray-400/20" :
                                            "bg-orange-600/20 border-orange-500 text-orange-500 shadow-orange-500/20"
                                )}>
                                    {index + 1}
                                </div>
                                <h3 className="font-bold text-white text-lg truncate w-full text-center">{user.name}</h3>
                                <p className="text-gray-400 text-xs mb-2">{user.email}</p>
                                <div className="px-4 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-mono text-cyan-300">
                                    {user.xp_points} XP
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* List View */}
            <div className="rounded-2xl border border-white/5 bg-black/20 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-gray-400 text-xs uppercase font-medium">
                        <tr>
                            <th className="px-6 py-4">Rank</th>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4 text-right">XP Points</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredUsers.slice(searchTerm ? 0 : 3).map((user, idx) => (
                            <motion.tr
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                key={user.id}
                                className="hover:bg-white/5 transition-colors group"
                            >
                                <td className="px-6 py-4 text-gray-500 font-mono text-sm">
                                    #{searchTerm ? idx + 1 : idx + 4}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-200 group-hover:text-cyan-300 transition-colors">{user.name}</p>
                                            <p className="text-xs text-gray-500 truncate max-w-[150px]">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right font-mono text-cyan-300 font-medium">
                                    {user.xp_points}
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No users found matching "{searchTerm}"
                    </div>
                )}
            </div>
        </div>
    )
}
