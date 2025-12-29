'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ChartProps {
    data: { date: string; xp: number; cumulativeXp: number }[]
}

export function PublicProfileChart({ data }: ChartProps) {
    return (
        <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="publicXpGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis
                        dataKey="date"
                        stroke="#6b7280"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#6b7280"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                                const d = payload[0].payload
                                return (
                                    <div className="bg-gray-800 border border-white/10 rounded-xl p-3 shadow-xl">
                                        <p className="text-gray-400 text-xs">{label}</p>
                                        <p className="text-cyan-400 font-bold">+{d.xp} XP</p>
                                        <p className="text-gray-500 text-xs">Total: {d.cumulativeXp} XP</p>
                                    </div>
                                )
                            }
                            return null
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="cumulativeXp"
                        stroke="#06b6d4"
                        strokeWidth={2}
                        fill="url(#publicXpGradient)"
                        dot={{ fill: '#06b6d4', strokeWidth: 0, r: 3 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
