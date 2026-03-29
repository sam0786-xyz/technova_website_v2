'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Users, Sparkles, Trophy, Code2, ArrowLeft, ChevronRight, ChevronDown, Star } from 'lucide-react'
import Link from 'next/link'

interface Team {
    id: string
    name: string
    team_code: string
    idea_title: string
    theme: string | null
    status: string
    table_number: number | null
    is_shortlisted: boolean
    project_objective: string | null
    member_count: number
    members: { name: string; role: string; college: string | null }[]
}

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]

export default function TeamsPage() {
    const [teams, setTeams] = useState<Team[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [themeFilter, setThemeFilter] = useState<string | null>(null)
    const [expandedTeam, setExpandedTeam] = useState<string | null>(null)

    useEffect(() => {
        fetch('/api/hackathon-teams')
            .then(r => r.json())
            .then(data => {
                setTeams(data.teams || [])
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    const allThemes = [...new Set(teams.map(t => t.theme).filter(Boolean))] as string[]

    const filtered = teams.filter(t => {
        const matchesSearch = !search ||
            t.name.toLowerCase().includes(search.toLowerCase()) ||
            t.idea_title?.toLowerCase().includes(search.toLowerCase()) ||
            t.team_code?.toLowerCase().includes(search.toLowerCase())
        const matchesTheme = !themeFilter || t.theme === themeFilter
        return matchesSearch && matchesTheme
    })

    const shortlisted = filtered.filter(t => t.is_shortlisted)
    const others = filtered.filter(t => !t.is_shortlisted)

    return (
        <div className="min-h-screen bg-[#050510] text-white font-sans">
            {/* Header */}
            <div className="border-b border-white/[0.06] bg-[#050510]/80 backdrop-blur-xl">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <Link href="/hackathon" className="text-white/30 hover:text-white/60 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-heading font-black uppercase tracking-tight flex items-center gap-2">
                                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
                                Teams Directory
                            </h1>
                            <p className="text-[10px] sm:text-xs text-white/30 tracking-widest uppercase mt-0.5">
                                Innovate Bharat Hackathon 2026
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/hackathon/update"
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-semibold text-xs uppercase tracking-wider transition-colors active:scale-[0.97]"
                    >
                        Update Your Team <ChevronRight className="w-3 h-3" />
                    </Link>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
                {/* Search & Filters */}
                <div className="flex flex-col md:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input
                            type="text"
                            placeholder="Search teams, ideas, or codes..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.12] focus:border-indigo-500/50 text-white pl-11 pr-4 py-3 text-sm rounded-xl focus:outline-none transition-colors placeholder:text-white/20"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => setThemeFilter(null)}
                            className={`px-3 py-2 text-[10px] font-semibold uppercase tracking-widest rounded-lg border transition-all duration-200 active:scale-[0.97] ${
                                !themeFilter
                                    ? 'bg-indigo-600 border-indigo-500 text-white'
                                    : 'bg-transparent border-white/[0.08] text-white/40 hover:border-white/[0.15] hover:text-white/60'
                            }`}
                        >
                            All
                        </button>
                        {allThemes.map(theme => (
                            <button
                                key={theme}
                                onClick={() => setThemeFilter(theme === themeFilter ? null : theme)}
                                className={`px-3 py-2 text-[10px] font-semibold uppercase tracking-widest rounded-lg border transition-all duration-200 active:scale-[0.97] ${
                                    themeFilter === theme
                                        ? 'bg-indigo-600 border-indigo-500 text-white'
                                        : 'bg-transparent border-white/[0.08] text-white/40 hover:border-white/[0.15] hover:text-white/60'
                                }`}
                            >
                                {theme}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 sm:mb-10">
                    {[
                        { val: teams.length, label: 'Total Teams', color: 'text-indigo-400' },
                        { val: teams.filter(t => t.is_shortlisted).length, label: 'Shortlisted', color: 'text-emerald-400' },
                        { val: teams.reduce((acc, t) => acc + t.member_count, 0), label: 'Participants', color: 'text-white' },
                        { val: allThemes.length, label: 'Themes', color: 'text-violet-400' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
                            <div className={`text-2xl font-heading font-black ${stat.color}`}>{stat.val}</div>
                            <div className="text-[9px] sm:text-[10px] font-medium text-white/30 uppercase tracking-widest mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-40 h-[2px] bg-white/[0.06] rounded-full overflow-hidden">
                            <motion.div
                                initial={{ x: '-100%' }}
                                animate={{ x: '100%' }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="w-1/2 h-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
                            />
                        </div>
                        <span className="text-xs text-white/20 uppercase tracking-widest">Loading teams</span>
                    </div>
                ) : (
                    <>
                        {/* Shortlisted Teams Section */}
                        {shortlisted.length > 0 && (
                            <div className="mb-10 sm:mb-12">
                                <div className="flex items-center gap-2.5 mb-5 sm:mb-6">
                                    <Trophy className="w-4.5 h-4.5 text-amber-400" />
                                    <h2 className="text-lg sm:text-xl font-heading font-bold uppercase tracking-tight text-white">
                                        Shortlisted Teams
                                    </h2>
                                    <span className="text-xs text-white/20 font-medium">({shortlisted.length})</span>
                                </div>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {shortlisted.map((team, idx) => (
                                        <TeamCard
                                            key={team.id}
                                            team={team}
                                            index={idx}
                                            expanded={expandedTeam === team.id}
                                            onToggle={() => setExpandedTeam(expandedTeam === team.id ? null : team.id)}
                                            isShortlisted
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* All Teams */}
                        <div>
                            <div className="flex items-center gap-2.5 mb-5 sm:mb-6">
                                <Code2 className="w-4.5 h-4.5 text-white/40" />
                                <h2 className="text-lg sm:text-xl font-heading font-bold uppercase tracking-tight">
                                    {shortlisted.length > 0 ? 'All Teams' : 'Registered Teams'}
                                </h2>
                                <span className="text-xs text-white/20 font-medium">({others.length})</span>
                            </div>
                            {others.length > 0 ? (
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {others.map((team, idx) => (
                                        <TeamCard
                                            key={team.id}
                                            team={team}
                                            index={idx}
                                            expanded={expandedTeam === team.id}
                                            onToggle={() => setExpandedTeam(expandedTeam === team.id ? null : team.id)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-white/20 text-sm">
                                    No teams match your filters
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

function TeamCard({ team, index, expanded, onToggle, isShortlisted = false }: {
    team: Team
    index: number
    expanded: boolean
    onToggle: () => void
    isShortlisted?: boolean
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT, delay: Math.min(index * 0.03, 0.4) }}
            className={`group bg-white/[0.02] hover:bg-white/[0.04] border rounded-xl transition-all duration-200 cursor-pointer active:scale-[0.99] ${
                isShortlisted
                    ? 'border-amber-500/20 hover:border-amber-500/40'
                    : 'border-white/[0.06] hover:border-white/[0.12]'
            }`}
            onClick={onToggle}
        >
            <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between mb-2.5">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-heading font-bold text-base text-white/90 group-hover:text-white truncate transition-colors">{team.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-semibold text-indigo-400 tracking-wider">{team.team_code}</span>
                            {team.table_number && (
                                <span className="text-[9px] text-emerald-400 bg-emerald-500/10 font-semibold px-1.5 py-0.5 rounded border border-emerald-500/20">
                                    TBL-{team.table_number}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                        {isShortlisted && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                        <ChevronDown className={`w-4 h-4 text-white/20 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
                    </div>
                </div>

                {team.idea_title && (
                    <p className="text-sm text-white/40 group-hover:text-white/60 transition-colors line-clamp-2 leading-relaxed mb-2.5">{team.idea_title}</p>
                )}

                <div className="flex items-center gap-3 text-[10px] font-semibold text-white/25 uppercase tracking-widest">
                    {team.theme && <span className="text-indigo-400/70">{team.theme}</span>}
                    <span>{team.member_count} members</span>
                </div>
            </div>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: EASE_OUT }}
                        className="overflow-hidden border-t border-white/[0.04]"
                    >
                        <div className="p-4 sm:p-5 bg-white/[0.01]">
                            {team.project_objective && (
                                <div className="mb-4">
                                    <div className="text-[10px] font-semibold text-indigo-400 uppercase tracking-widest mb-1">Objective</div>
                                    <p className="text-sm text-white/50 leading-relaxed">{team.project_objective}</p>
                                </div>
                            )}
                            <div className="text-[10px] font-semibold text-white/25 uppercase tracking-widest mb-2.5">Members</div>
                            <div className="space-y-2">
                                {team.members.map((m, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm">
                                        <span className={`text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                                            m.role === 'leader' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/[0.04] text-white/30'
                                        }`}>
                                            {m.role}
                                        </span>
                                        <span className="text-white/70">{m.name}</span>
                                        {m.college && <span className="text-white/20 text-xs">• {m.college}</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
