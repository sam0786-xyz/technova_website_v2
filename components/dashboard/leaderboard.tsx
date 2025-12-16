'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LeaderboardUser } from '@/lib/actions/leaderboard'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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

            {/* Top 3 Podium (2 - 1 - 3 Arrangement) */}
            {!searchTerm && topThree.length > 0 && (
                <div className="flex justify-center items-end gap-4 md:gap-8 pt-12 pb-8 mb-8">
                    {/* 2nd Place (Left) */}
                    {topThree[1] && (
                        <div className="flex flex-col items-center z-10">
                            <div className="relative mb-4">
                                <Avatar className="w-20 h-20 md:w-24 md:h-24 border-4 border-gray-400 shadow-[0_0_20px_rgba(156,163,175,0.3)]">
                                    <AvatarImage src={topThree[1].image || ""} alt={topThree[1].name} />
                                    <AvatarFallback className="bg-gray-800 text-gray-400 text-2xl font-bold">
                                        {topThree[1].name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-black font-bold text-sm border-2 border-gray-900">
                                    2
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <h3 className="font-bold text-gray-200 text-base md:text-lg text-center max-w-[120px] truncate">{topThree[1].name}</h3>
                                <p className="text-cyan-400 font-mono text-sm md:text-base font-medium">{topThree[1].xp_points} XP</p>
                            </div>
                            {/* Podium Block */}
                            <div className="w-24 md:w-32 h-32 md:h-40 bg-gradient-to-t from-gray-900/80 to-gray-800/50 rounded-t-lg border-t border-x border-gray-700/50 mt-4 backdrop-blur-sm" />
                        </div>
                    )}

                    {/* 1st Place (Center, Highest) */}
                    {topThree[0] && (
                        <div className="flex flex-col items-center z-20 -mx-2 md:mx-0 order-first md:order-none">
                            <div className="relative mb-4">
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-yellow-400 animate-bounce">
                                    <Trophy className="w-8 h-8 fill-yellow-400" />
                                </div>
                                <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.4)] ring-4 ring-yellow-500/20">
                                    <AvatarImage src={topThree[0].image || ""} alt={topThree[0].name} />
                                    <AvatarFallback className="bg-gray-800 text-yellow-400 text-3xl font-bold">
                                        {topThree[0].name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-lg border-4 border-gray-900">
                                    1
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <h3 className="font-bold text-white text-lg md:text-xl text-center max-w-[150px] truncate">{topThree[0].name}</h3>
                                <p className="text-cyan-400 font-mono text-base md:text-lg font-bold">{topThree[0].xp_points} XP</p>
                            </div>
                            {/* Podium Block */}
                            <div className="w-28 md:w-40 h-40 md:h-52 bg-gradient-to-t from-yellow-900/40 to-yellow-600/20 rounded-t-lg border-t border-x border-yellow-500/30 mt-4 backdrop-blur-md relative overflow-hidden">
                                <div className="absolute inset-0 bg-yellow-400/5" />
                            </div>
                        </div>
                    )}

                    {/* 3rd Place (Right) */}
                    {topThree[2] && (
                        <div className="flex flex-col items-center z-10">
                            <div className="relative mb-4">
                                <Avatar className="w-20 h-20 md:w-24 md:h-24 border-4 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                                    <AvatarImage src={topThree[2].image || ""} alt={topThree[2].name} />
                                    <AvatarFallback className="bg-gray-800 text-orange-500 text-2xl font-bold">
                                        {topThree[2].name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-black font-bold text-sm border-2 border-gray-900">
                                    3
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <h3 className="font-bold text-gray-200 text-base md:text-lg text-center max-w-[120px] truncate">{topThree[2].name}</h3>
                                <p className="text-cyan-400 font-mono text-sm md:text-base font-medium">{topThree[2].xp_points} XP</p>
                            </div>
                            {/* Podium Block */}
                            <div className="w-24 md:w-32 h-24 md:h-32 bg-gradient-to-t from-gray-900/80 to-gray-800/50 rounded-t-lg border-t border-x border-gray-700/50 mt-4 backdrop-blur-sm" />
                        </div>
                    )}
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
