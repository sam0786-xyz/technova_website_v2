"use client";

import { useState } from "react";
import { submitEvaluation } from "@/lib/actions/hackathon";
import { Search, ChevronDown, CheckCircle, AlertCircle, Cpu, Users, Star } from "lucide-react";

export default function EvaluatorDashboardClient({ initialTeams }: { initialTeams: any[] }) {
    const [teams, setTeams] = useState(initialTeams);
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedTeam, setExpandedTeam] = useState<string | null>(null);
    const [scores, setScores] = useState({ innovation: 5, ui: 5, technical: 5, feedback: "" });
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const filteredTeams = teams.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.idea_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.table_number?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleExpand = (teamId: string) => {
        if (expandedTeam === teamId) {
            setExpandedTeam(null);
        } else {
            setExpandedTeam(teamId);
            setScores({ innovation: 5, ui: 5, technical: 5, feedback: "" });
            setMessage(null);
        }
    };

    const handleSubmit = async (teamId: string) => {
        setSubmitting(true);
        setMessage(null);

        try {
            const res = await submitEvaluation(teamId, scores);
            if (res.error) {
                setMessage({ type: 'error', text: res.error });
            } else {
                setMessage({ type: 'success', text: "Evaluation submitted successfully!" });
                // Update local state to show it's evaluated
                setTeams(teams.map(t => t.id === teamId ? { ...t, has_evaluated: true, my_score: scores.innovation + scores.ui + scores.technical } : t));
                setTimeout(() => setExpandedTeam(null), 2000);
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: "Failed to submit evaluation." });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search teams by name, idea, or table..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-amber-500 text-white transition-colors"
                    />
                </div>
                <div className="flex gap-4 text-sm font-medium">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                        <span className="text-gray-400">To Evaluate ({teams.filter(t => !t.has_evaluated).length})</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        <span className="text-gray-400">Completed ({teams.filter(t => t.has_evaluated).length})</span>
                    </div>
                </div>
            </div>

            <div className="grid gap-4">
                {filteredTeams.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 border border-dashed border-white/10 rounded-2xl">
                        No teams found matching your search.
                    </div>
                ) : (
                    filteredTeams.map((team) => (
                        <div
                            key={team.id}
                            className={`border rounded-2xl transition-all duration-300 overflow-hidden ${team.has_evaluated
                                    ? 'bg-emerald-500/5 border-emerald-500/20'
                                    : expandedTeam === team.id
                                        ? 'bg-amber-500/5 border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.1)]'
                                        : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'
                                }`}
                        >
                            {/* Header row (always visible) */}
                            <div
                                onClick={() => handleExpand(team.id)}
                                className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className={`text-xl font-bold ${team.has_evaluated ? 'text-emerald-400' : 'text-white'}`}>
                                            {team.name}
                                        </h3>
                                        {team.table_number && (
                                            <span className="px-2.5 py-1 rounded-md bg-white/10 text-xs font-mono text-gray-300 border border-white/10">
                                                Table {team.table_number}
                                            </span>
                                        )}
                                        {team.has_evaluated && (
                                            <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-full border border-emerald-500/30">
                                                <CheckCircle className="w-3 h-3" /> Scored: {team.my_score}/30
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-400 flex items-center gap-2 text-sm">
                                        <Cpu className="w-4 h-4 text-amber-500/70" /> {team.idea_title}
                                    </p>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="flex flex-wrap gap-2 md:max-w-xs justify-end">
                                        {team.hackathon_participants.slice(0, 3).map((p: any, i: number) => (
                                            <span key={i} className="text-xs text-gray-500 bg-black/50 px-2 py-1 rounded">
                                                {p.name}
                                            </span>
                                        ))}
                                        {team.hackathon_participants.length > 3 && (
                                            <span className="text-xs text-gray-500 bg-black/50 px-2 py-1 rounded">+{team.hackathon_participants.length - 3}</span>
                                        )}
                                    </div>
                                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${expandedTeam === team.id ? 'rotate-180 text-amber-400' : ''}`} />
                                </div>
                            </div>

                            {/* Evaluation Form (Expanded) */}
                            {expandedTeam === team.id && !team.has_evaluated && (
                                <div className="p-6 pt-0 border-t border-white/5 bg-black/20">
                                    <div className="mt-6 mb-8 text-sm text-gray-400 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                                        You are evaluating <strong className="text-amber-400">{team.name}</strong>. Score them based on the criteria below. This cannot be undone once submitted.
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                                        {/* Innovation Score */}
                                        <div className="space-y-3">
                                            <label className="flex items-center justify-between text-sm font-medium text-gray-300">
                                                Innovation & Creativity
                                                <span className="text-amber-400 font-bold">{scores.innovation}/10</span>
                                            </label>
                                            <input
                                                type="range" min="1" max="10"
                                                value={scores.innovation}
                                                onChange={(e) => setScores({ ...scores, innovation: parseInt(e.target.value) })}
                                                className="w-full accent-amber-500"
                                            />
                                            <p className="text-xs text-gray-500">Uniqueness of the idea, problem-solving approach.</p>
                                        </div>

                                        {/* UI/UX Score */}
                                        <div className="space-y-3">
                                            <label className="flex items-center justify-between text-sm font-medium text-gray-300">
                                                UI/UX & Design
                                                <span className="text-amber-400 font-bold">{scores.ui}/10</span>
                                            </label>
                                            <input
                                                type="range" min="1" max="10"
                                                value={scores.ui}
                                                onChange={(e) => setScores({ ...scores, ui: parseInt(e.target.value) })}
                                                className="w-full accent-amber-500"
                                            />
                                            <p className="text-xs text-gray-500">Aesthetics, usability, and user journey.</p>
                                        </div>

                                        {/* Technical Score */}
                                        <div className="space-y-3">
                                            <label className="flex items-center justify-between text-sm font-medium text-gray-300">
                                                Technical Implementation
                                                <span className="text-amber-400 font-bold">{scores.technical}/10</span>
                                            </label>
                                            <input
                                                type="range" min="1" max="10"
                                                value={scores.technical}
                                                onChange={(e) => setScores({ ...scores, technical: parseInt(e.target.value) })}
                                                className="w-full accent-amber-500"
                                            />
                                            <p className="text-xs text-gray-500">Code quality, completeness, tech stack used.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <label className="text-sm font-medium text-gray-300">General Feedback (Optional)</label>
                                        <textarea
                                            value={scores.feedback}
                                            onChange={(e) => setScores({ ...scores, feedback: e.target.value })}
                                            placeholder="Leave a note about what you liked or what could be improved..."
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-amber-500 text-white resize-none h-24"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                        <div className="text-2xl font-black text-white">
                                            Total: <span className="text-amber-500">{scores.innovation + scores.ui + scores.technical}</span><span className="text-gray-500 text-lg">/30</span>
                                        </div>

                                        <button
                                            onClick={() => handleSubmit(team.id)}
                                            disabled={submitting}
                                            className="bg-amber-600 hover:bg-amber-500 text-white font-medium py-2.5 px-8 rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {submitting ? (
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <Star className="w-4 h-4 fill-current" />
                                            )}
                                            {submitting ? "Submitting..." : "Submit Score"}
                                        </button>
                                    </div>

                                    {message && (
                                        <div className={`mt-4 p-4 rounded-xl flex items-start gap-3 ${message.type === 'error' ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'}`}>
                                            {message.type === 'error' ? <AlertCircle className="w-5 h-5 flex-shrink-0" /> : <CheckCircle className="w-5 h-5 flex-shrink-0" />}
                                            <p className="text-sm">{message.text}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Already Evaluated State */}
                            {expandedTeam === team.id && team.has_evaluated && (
                                <div className="p-8 border-t border-white/5 bg-black/20 text-center">
                                    <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                                    <h4 className="text-lg font-bold text-white mb-1">Evaluation Submitted</h4>
                                    <p className="text-gray-400">You gave this team a total score of <span className="text-emerald-400 font-bold">{team.my_score}</span>. Thank you for your review.</p>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
