'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Users, Sparkles, Trophy, Code2, ArrowLeft, ChevronRight, Filter } from 'lucide-react'
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
        <div className="min-h-screen bg-[#03030F] text-white font-mono">
            {/* Header */}
            <div className="border-b border-white/10 bg-black/50">
                <div className="container mx-auto max-w-[1200px] px-6 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/hackathon" className="text-white/40 hover:text-white transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-heading font-black uppercase tracking-tight flex items-center gap-2">
                                <Users className="w-6 h-6 text-[#FF6B00]" /> 
                                Teams Directory
                            </h1>
                            <p className="text-xs text-white/40 tracking-widest uppercase mt-1">
                                Innovate Bharat Hackathon 2026
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/hackathon/update"
                        className="hidden md:inline-flex items-center gap-2 bg-[#FF6B00] text-black px-4 py-2 font-bold text-xs uppercase tracking-wider hover:bg-[#FF8C00] transition-colors"
                    >
                        Update Your Team <ChevronRight className="w-3 h-3" />
                    </Link>
                </div>
            </div>

            <div className="container mx-auto max-w-[1200px] px-6 py-10">
                {/* Search & Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-10">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                            type="text"
                            placeholder="Search teams, ideas, or codes..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 text-white pl-12 pr-4 py-3 text-sm font-mono focus:border-[#FF6B00] focus:outline-none transition-colors placeholder:text-white/30"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => setThemeFilter(null)}
                            className={`px-3 py-2 text-[10px] font-bold uppercase tracking-widest border transition-colors ${
                                !themeFilter 
                                    ? 'bg-[#FF6B00] border-[#FF6B00] text-black' 
                                    : 'bg-transparent border-white/10 text-white/50 hover:border-white/30'
                            }`}
                        >
                            All
                        </button>
                        {allThemes.map(theme => (
                            <button
                                key={theme}
                                onClick={() => setThemeFilter(theme === themeFilter ? null : theme)}
                                className={`px-3 py-2 text-[10px] font-bold uppercase tracking-widest border transition-colors ${
                                    themeFilter === theme 
                                        ? 'bg-[#FF6B00] border-[#FF6B00] text-black' 
                                        : 'bg-transparent border-white/10 text-white/50 hover:border-white/30'
                                }`}
                            >
                                {theme}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    <div className="bg-white/5 border border-white/10 p-4">
                        <div className="text-2xl font-black text-[#FF6B00]">{teams.length}</div>
                        <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Total Teams</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4">
                        <div className="text-2xl font-black text-[#00FF41]">{teams.filter(t => t.is_shortlisted).length}</div>
                        <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Shortlisted</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4">
                        <div className="text-2xl font-black text-white">{teams.reduce((acc, t) => acc + t.member_count, 0)}</div>
                        <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Participants</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4">
                        <div className="text-2xl font-black text-[#6366F1]">{allThemes.length}</div>
                        <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Themes</div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-white/30 font-bold uppercase tracking-widest">
                        Loading teams...
                    </div>
                ) : (
                    <>
                        {/* Shortlisted Teams Section */}
                        {shortlisted.length > 0 && (
                            <div className="mb-12">
                                <div className="flex items-center gap-3 mb-6">
                                    <Trophy className="w-5 h-5 text-[#FFD700]" />
                                    <h2 className="text-xl font-heading font-black uppercase tracking-tight text-[#FFD700]">
                                        Shortlisted Teams
                                    </h2>
                                </div>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                            <div className="flex items-center gap-3 mb-6">
                                <Code2 className="w-5 h-5 text-white/50" />
                                <h2 className="text-xl font-heading font-black uppercase tracking-tight">
                                    {shortlisted.length > 0 ? 'All Teams' : 'Registered Teams'}
                                </h2>
                                <span className="text-xs text-white/30 font-bold">({others.length})</span>
                            </div>
                            {others.length > 0 ? (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                                <div className="text-center py-12 text-white/30 text-sm">
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT, delay: Math.min(index * 0.05, 0.3) }}
            className={`bg-[#03030F] border transition-colors cursor-pointer ${
                isShortlisted 
                    ? 'border-[#FFD700]/30 hover:border-[#FFD700]/60' 
                    : 'border-white/10 hover:border-white/30'
            }`}
            onClick={onToggle}
        >
            <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-heading font-black text-lg uppercase truncate text-white">{team.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-[#FF6B00] tracking-widest">{team.team_code}</span>
                            {team.table_number && (
                                <span className="text-[10px] text-black bg-[#00FF41] font-bold px-2 py-0.5">
                                    TBL-{team.table_number}
                                </span>
                            )}
                        </div>
                    </div>
                    {isShortlisted && <Trophy className="w-5 h-5 text-[#FFD700] shrink-0" />}
                </div>

                {team.idea_title && (
                    <p className="text-sm text-white/60 font-sans mb-2 line-clamp-2">{team.idea_title}</p>
                )}

                <div className="flex items-center gap-3 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                    {team.theme && <span className="text-[#6366F1]">{team.theme}</span>}
                    <span>{team.member_count} members</span>
                </div>
            </div>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE_OUT }}
                        className="overflow-hidden border-t border-white/5"
                    >
                        <div className="p-5 bg-white/[0.02]">
                            {team.project_objective && (
                                <div className="mb-4">
                                    <div className="text-[10px] font-bold text-[#FF6B00] uppercase tracking-widest mb-1">Objective</div>
                                    <p className="text-sm text-white/60 font-sans">{team.project_objective}</p>
                                </div>
                            )}
                            <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">Members</div>
                            <div className="space-y-2">
                                {team.members.map((m, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm">
                                        <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 ${
                                            m.role === 'leader' ? 'bg-[#FF6B00] text-black' : 'bg-white/10 text-white/40'
                                        }`}>
                                            {m.role}
                                        </span>
                                        <span className="text-white/80 font-sans">{m.name}</span>
                                        {m.college && <span className="text-white/30 text-xs">• {m.college}</span>}
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
