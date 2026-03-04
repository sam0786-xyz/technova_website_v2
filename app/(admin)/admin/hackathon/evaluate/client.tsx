"use client";

import { useState, useEffect, Fragment } from "react";
import { submitEvaluation, getTeamsForEvaluation, getTeamEvaluations } from "@/lib/actions/hackathon";
import { Search, ChevronDown, CheckCircle, AlertCircle, Cpu, Users, Star, Layers, Mail, Phone, Lock } from "lucide-react";

export default function EvaluatorDashboardClient({ initialTeams, evaluationOpen = true }: { initialTeams: any[], evaluationOpen?: boolean }) {
    const [round, setRound] = useState<number>(1);
    const [teams, setTeams] = useState<any[]>(initialTeams || []);
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedTeam, setExpandedTeam] = useState<string | null>(null);
    const [scores, setScores] = useState({ idea: 3, tools: 3, impact: 3, sustainability: 3, feasibility: 3, communication: 3, feedback: "" });
    const [submitting, setSubmitting] = useState(false);
    const [loadingTeams, setLoadingTeams] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [peerReviews, setPeerReviews] = useState<any[]>([]);
    const [loadingReviews, setLoadingReviews] = useState(false);

    // Fetch teams when round changes
    useEffect(() => {
        const fetchTeams = async () => {
            setLoadingTeams(true);
            try {
                const fetchedTeams = await getTeamsForEvaluation(round);
                setTeams(fetchedTeams);
                setExpandedTeam(null);
            } catch (error) {
                console.error("Failed to fetch teams:", error);
            } finally {
                setLoadingTeams(false);
            }
        };

        if (round !== 1 || !initialTeams) {
            fetchTeams();
        }
    }, [round, initialTeams]);

    const filteredTeams = (teams || []).filter(t =>
        (t?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t?.idea_title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t?.table_number || "").toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => !evaluationOpen ? (b.total_score || 0) - (a.total_score || 0) : 0);

    const handleExpand = async (teamId: string) => {
        if (expandedTeam === teamId) {
            setExpandedTeam(null);
        } else {
            setExpandedTeam(teamId);
            setScores({ idea: 3, tools: 3, impact: 3, sustainability: 3, feasibility: 3, communication: 3, feedback: "" });
            setMessage(null);

            if (!evaluationOpen) {
                setLoadingReviews(true);
                try {
                    const reviews = await getTeamEvaluations(teamId, round);
                    setPeerReviews(reviews);
                } catch (error) {
                    console.error("Failed to load peer reviews:", error);
                } finally {
                    setLoadingReviews(false);
                }
            }
        }
    };

    const handleSubmit = async (teamId: string) => {
        setSubmitting(true);
        setMessage(null);

        try {
            const res = await submitEvaluation(teamId, round, scores);
            if (res.error) {
                setMessage({ type: 'error', text: res.error });
            } else {
                setMessage({ type: 'success', text: "Evaluation submitted successfully!" });
                // Update local state to show it's evaluated
                const sumScores = scores.idea + scores.tools + scores.impact + scores.sustainability + scores.feasibility + scores.communication;
                setTeams(teams.map(t => t.id === teamId ? { ...t, has_evaluated: true, my_score: sumScores } : t));
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
            {/* Round Selector */}
            <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 w-full md:w-max mx-auto mb-8">
                <button
                    onClick={() => setRound(1)}
                    className={`flex-1 md:px-8 py-2.5 rounded-lg text-sm font-medium transition-all ${round === 1 ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    Round 1 - Online Screening
                </button>
                <button
                    onClick={() => setRound(2)}
                    className={`flex-1 md:px-8 py-2.5 rounded-lg text-sm font-medium transition-all ${round === 2 ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    Round 2 - Grand Finale
                </button>
            </div>

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
                {loadingTeams ? (
                    <div className="text-center py-12 text-gray-500 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center">
                        <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mb-4" />
                        Loading teams for Round {round}...
                    </div>
                ) : filteredTeams.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 border border-dashed border-white/10 rounded-2xl">
                        No teams found matching your search.
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5 shadow-2xl">
                        <table className="w-full text-sm text-left text-gray-400">
                            <thead className="text-xs text-gray-400 uppercase bg-black/40 border-b border-white/10">
                                <tr>
                                    <th className="px-4 py-5 font-semibold">S.No</th>
                                    <th className="px-4 py-5 font-semibold">Team ID</th>
                                    <th className="px-4 py-5 font-semibold">Team Name</th>
                                    <th className="px-4 py-5 font-semibold">Project Title</th>
                                    <th className="px-4 py-5 font-semibold">Team Lead</th>
                                    <th className="px-4 py-5 font-semibold w-64">Project Objective (Short Synopsis)</th>
                                    <th className="px-4 py-5 font-semibold">Mobile Number</th>
                                    <th className="px-4 py-5 font-semibold">Email</th>
                                    <th className="px-4 py-5 font-semibold text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTeams.map((team, index) => {
                                    const leader = team.hackathon_participants?.find((p: any) => p.role === 'Leader') || team.hackathon_participants?.[0] || {};
                                    const isExpanded = expandedTeam === team.id;

                                    return (
                                        <Fragment key={team.id}>
                                            <tr
                                                onClick={() => handleExpand(team.id)}
                                                className={`border-b border-white/5 cursor-pointer transition-all ${team.has_evaluated ? 'bg-emerald-500/5 hover:bg-emerald-500/10' :
                                                    isExpanded ? 'bg-amber-500/10 hover:bg-amber-500/20' :
                                                        'hover:bg-white/10'
                                                    }`}
                                            >
                                                <td className="px-4 py-4 whitespace-nowrap">{index + 1}</td>
                                                <td className="px-4 py-4 whitespace-nowrap font-mono text-amber-400 bg-amber-500/10 font-bold rounded m-2 table-cell border-y-8 border-transparent bg-clip-padding">{team.team_code || '---'}</td>
                                                <td className="px-4 py-4 font-bold text-white whitespace-nowrap">{team.name}</td>
                                                <td className="px-4 py-4 font-medium text-emerald-400">{team.idea_title}</td>
                                                <td className="px-4 py-4 text-purple-400 whitespace-nowrap flex items-center gap-2 mt-2"><Users className="w-4 h-4" />{leader.name || '---'}</td>
                                                <td className="px-4 py-4 max-w-xs truncate" title={team.project_objective}>{team.project_objective || 'No objective provided.'}</td>
                                                <td className="px-4 py-4 whitespace-nowrap"><div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" />{leader.phone || '---'}</div></td>
                                                <td className="px-4 py-4 whitespace-nowrap"><div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" />{leader.email || '---'}</div></td>
                                                <td className="px-4 py-4 text-right whitespace-nowrap">
                                                    {!evaluationOpen ? (
                                                        <span className="text-gray-400 font-bold flex items-center justify-end gap-1.5"><Lock className="w-4 h-4" /> Final: {team.total_score || 0}</span>
                                                    ) : team.has_evaluated ? (
                                                        <span className="text-emerald-400 font-bold flex items-center justify-end gap-1.5"><CheckCircle className="w-4 h-4" /> {team.my_score}/30</span>
                                                    ) : (
                                                        <span className="text-amber-500 font-semibold flex items-center justify-end gap-1 hover:text-amber-400">Evaluate <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} /></span>
                                                    )}
                                                </td>
                                            </tr>

                                            {/* Evaluation Closed / Peer Reviews State */}
                                            {isExpanded && !evaluationOpen && (
                                                <tr>
                                                    <td colSpan={9} className="p-0 border-b border-gray-500/20 shadow-inner">
                                                        <div className="p-6 md:p-8 bg-black/40">
                                                            <div className="mb-6 bg-red-500/10 border border-red-500/20 p-5 rounded-2xl shadow-lg flex items-start gap-4 text-red-400">
                                                                <Lock className="w-6 h-6 flex-shrink-0" />
                                                                <div>
                                                                    <h4 className="font-bold mb-1">Evaluation Period Closed</h4>
                                                                    <p className="text-sm">You can no longer submit scores for <strong className="text-white">{team.name}</strong>. Below are the final peer reviews from all evaluators.</p>
                                                                </div>
                                                            </div>

                                                            {loadingReviews ? (
                                                                <div className="text-center py-8">
                                                                    <div className="w-6 h-6 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-2" />
                                                                    <p className="text-gray-400 text-sm">Loading peer reviews...</p>
                                                                </div>
                                                            ) : peerReviews.length === 0 ? (
                                                                <div className="text-center py-8 border border-dashed border-white/10 rounded-xl">
                                                                    <p className="text-gray-500 text-sm italic">No evaluations were submitted for this team.</p>
                                                                </div>
                                                            ) : (
                                                                <div className="space-y-4">
                                                                    {peerReviews.map((rev: any) => (
                                                                        <div key={rev.id} className="bg-white/5 border border-white/10 rounded-xl p-5 shadow">
                                                                            <div className="flex justify-between items-start mb-4 border-b border-white/5 pb-4">
                                                                                <div>
                                                                                    <h5 className="font-bold text-white text-lg">{rev.hackathon_evaluators?.name || 'Unknown Evaluator'}</h5>
                                                                                    <p className="text-xs text-gray-500">{new Date(rev.created_at).toLocaleString()}</p>
                                                                                </div>
                                                                                <div className="flex flex-col items-end">
                                                                                    <div className="text-2xl font-black text-amber-500 bg-amber-500/10 px-4 py-1.5 rounded-xl border border-amber-500/20">
                                                                                        {rev.total_score}<span className="text-sm text-amber-500/50">/30</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-4 text-xs font-mono text-center">
                                                                                <div className="bg-black/30 p-2 rounded border border-white/5"><span className="block text-gray-500 mb-1">IDEA</span><span className="text-emerald-400 font-bold text-base">{rev.score_idea}</span><span className="text-gray-600">/5</span></div>
                                                                                <div className="bg-black/30 p-2 rounded border border-white/5"><span className="block text-gray-500 mb-1">TOOLS</span><span className="text-emerald-400 font-bold text-base">{rev.score_tools}</span><span className="text-gray-600">/5</span></div>
                                                                                <div className="bg-black/30 p-2 rounded border border-white/5"><span className="block text-gray-500 mb-1">IMPACT</span><span className="text-emerald-400 font-bold text-base">{rev.score_impact}</span><span className="text-gray-600">/5</span></div>
                                                                                <div className="bg-black/30 p-2 rounded border border-white/5"><span className="block text-gray-500 mb-1">SUSTAIN</span><span className="text-emerald-400 font-bold text-base">{rev.score_sustainability}</span><span className="text-gray-600">/5</span></div>
                                                                                <div className="bg-black/30 p-2 rounded border border-white/5"><span className="block text-gray-500 mb-1">FEASIBLE</span><span className="text-emerald-400 font-bold text-base">{rev.score_feasibility}</span><span className="text-gray-600">/5</span></div>
                                                                                <div className="bg-black/30 p-2 rounded border border-white/5"><span className="block text-gray-500 mb-1">COMM</span><span className="text-emerald-400 font-bold text-base">{rev.score_communication}</span><span className="text-gray-600">/5</span></div>
                                                                            </div>
                                                                            {rev.feedback && (
                                                                                <div className="bg-black/30 rounded-lg p-4 text-sm text-gray-300 border-l-2 border-emerald-500">
                                                                                    <strong className="text-xs text-emerald-500/70 block mb-1 uppercase tracking-wider">Reviewer Feedback</strong>
                                                                                    {rev.feedback}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}

                                            {/* Evaluation Form (Expanded, Open State) */}
                                            {isExpanded && evaluationOpen && !team.has_evaluated && (
                                                <tr>
                                                    <td colSpan={9} className="p-0 border-b border-amber-500/20 shadow-inner">
                                                        <div className="p-6 md:p-8 bg-black/40">

                                                            {/* Project Objective Full Detail */}
                                                            <div className="mb-6 bg-white/5 border border-white/10 p-5 rounded-2xl shadow-lg">
                                                                <h4 className="text-emerald-400 text-sm font-bold mb-3 flex items-center gap-2 uppercase tracking-wide"><Cpu className="w-4 h-4" /> Project Objective & Synopsis</h4>
                                                                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{team.project_objective || 'No detailed objective provided by the team.'}</p>
                                                            </div>

                                                            <div className="mb-8 text-sm text-gray-400 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-4 shadow-lg">
                                                                <Star className="w-6 h-6 text-amber-500 flex-shrink-0 animate-pulse mt-0.5" />
                                                                <p>You are evaluating <strong className="text-amber-400 text-lg">{team.name}</strong>. Score them based on the criteria below. This cannot be undone once submitted.</p>
                                                            </div>

                                                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                                                {/* Idea Score */}
                                                                <div className="space-y-3">
                                                                    <label className="flex items-center justify-between text-sm font-medium text-gray-300">
                                                                        Idea (Value/Interest)
                                                                        <span className="text-amber-400 font-bold">{scores.idea}/5</span>
                                                                    </label>
                                                                    <div className="flex items-center gap-3">
                                                                        <input
                                                                            type="range" min="1" max="5"
                                                                            value={scores.idea}
                                                                            onChange={(e) => setScores({ ...scores, idea: parseInt(e.target.value) })}
                                                                            className="w-full accent-amber-500 flex-1"
                                                                        />
                                                                        <input
                                                                            type="number" min="1" max="5"
                                                                            value={scores.idea}
                                                                            onChange={(e) => setScores({ ...scores, idea: Math.min(5, Math.max(1, parseInt(e.target.value) || 1)) })}
                                                                            className="w-16 bg-black/50 border border-white/10 rounded px-2 py-1 text-center text-white focus:outline-none focus:border-amber-500"
                                                                        />
                                                                    </div>
                                                                    <p className="text-xs text-gray-500">Interesting, Useful, Value Accretive.</p>
                                                                </div>

                                                                {/* Tools Score */}
                                                                <div className="space-y-3">
                                                                    <label className="flex items-center justify-between text-sm font-medium text-gray-300">
                                                                        Tools/Technology
                                                                        <span className="text-amber-400 font-bold">{scores.tools}/5</span>
                                                                    </label>
                                                                    <div className="flex items-center gap-3">
                                                                        <input
                                                                            type="range" min="1" max="5"
                                                                            value={scores.tools}
                                                                            onChange={(e) => setScores({ ...scores, tools: parseInt(e.target.value) })}
                                                                            className="w-full accent-amber-500 flex-1"
                                                                        />
                                                                        <input
                                                                            type="number" min="1" max="5"
                                                                            value={scores.tools}
                                                                            onChange={(e) => setScores({ ...scores, tools: Math.min(5, Math.max(1, parseInt(e.target.value) || 1)) })}
                                                                            className="w-16 bg-black/50 border border-white/10 rounded px-2 py-1 text-center text-white focus:outline-none focus:border-amber-500"
                                                                        />
                                                                    </div>
                                                                    <p className="text-xs text-gray-500">Identification of Necessary Tools & Latest Technology.</p>
                                                                </div>

                                                                {/* Impact Score */}
                                                                <div className="space-y-3">
                                                                    <label className="flex items-center justify-between text-sm font-medium text-gray-300">
                                                                        Impact (Scalability)
                                                                        <span className="text-amber-400 font-bold">{scores.impact}/5</span>
                                                                    </label>
                                                                    <div className="flex items-center gap-3">
                                                                        <input
                                                                            type="range" min="1" max="5"
                                                                            value={scores.impact}
                                                                            onChange={(e) => setScores({ ...scores, impact: parseInt(e.target.value) })}
                                                                            className="w-full accent-amber-500 flex-1"
                                                                        />
                                                                        <input
                                                                            type="number" min="1" max="5"
                                                                            value={scores.impact}
                                                                            onChange={(e) => setScores({ ...scores, impact: Math.min(5, Math.max(1, parseInt(e.target.value) || 1)) })}
                                                                            className="w-16 bg-black/50 border border-white/10 rounded px-2 py-1 text-center text-white focus:outline-none focus:border-amber-500"
                                                                        />
                                                                    </div>
                                                                    <p className="text-xs text-gray-500">Level of impact and scalability.</p>
                                                                </div>

                                                                {/* Sustainability Score */}
                                                                <div className="space-y-3">
                                                                    <label className="flex items-center justify-between text-sm font-medium text-gray-300">
                                                                        Financial Sustainability
                                                                        <span className="text-amber-400 font-bold">{scores.sustainability}/5</span>
                                                                    </label>
                                                                    <div className="flex items-center gap-3">
                                                                        <input
                                                                            type="range" min="1" max="5"
                                                                            value={scores.sustainability}
                                                                            onChange={(e) => setScores({ ...scores, sustainability: parseInt(e.target.value) })}
                                                                            className="w-full accent-amber-500 flex-1"
                                                                        />
                                                                        <input
                                                                            type="number" min="1" max="5"
                                                                            value={scores.sustainability}
                                                                            onChange={(e) => setScores({ ...scores, sustainability: Math.min(5, Math.max(1, parseInt(e.target.value) || 1)) })}
                                                                            className="w-16 bg-black/50 border border-white/10 rounded px-2 py-1 text-center text-white focus:outline-none focus:border-amber-500"
                                                                        />
                                                                    </div>
                                                                    <p className="text-xs text-gray-500">Financial Sustainability & Business Viability.</p>
                                                                </div>

                                                                {/* Feasibility Score */}
                                                                <div className="space-y-3">
                                                                    <label className="flex items-center justify-between text-sm font-medium text-gray-300">
                                                                        Technical Feasibility
                                                                        <span className="text-amber-400 font-bold">{scores.feasibility}/5</span>
                                                                    </label>
                                                                    <div className="flex items-center gap-3">
                                                                        <input
                                                                            type="range" min="1" max="5"
                                                                            value={scores.feasibility}
                                                                            onChange={(e) => setScores({ ...scores, feasibility: parseInt(e.target.value) })}
                                                                            className="w-full accent-amber-500 flex-1"
                                                                        />
                                                                        <input
                                                                            type="number" min="1" max="5"
                                                                            value={scores.feasibility}
                                                                            onChange={(e) => setScores({ ...scores, feasibility: Math.min(5, Math.max(1, parseInt(e.target.value) || 1)) })}
                                                                            className="w-16 bg-black/50 border border-white/10 rounded px-2 py-1 text-center text-white focus:outline-none focus:border-amber-500"
                                                                        />
                                                                    </div>
                                                                    <p className="text-xs text-gray-500">Technical Feasibility & Implementation.</p>
                                                                </div>

                                                                {/* Communication Score */}
                                                                <div className="space-y-3">
                                                                    <label className="flex items-center justify-between text-sm font-medium text-gray-300">
                                                                        Communication
                                                                        <span className="text-amber-400 font-bold">{scores.communication}/5</span>
                                                                    </label>
                                                                    <div className="flex items-center gap-3">
                                                                        <input
                                                                            type="range" min="1" max="5"
                                                                            value={scores.communication}
                                                                            onChange={(e) => setScores({ ...scores, communication: parseInt(e.target.value) })}
                                                                            className="w-full accent-amber-500 flex-1"
                                                                        />
                                                                        <input
                                                                            type="number" min="1" max="5"
                                                                            value={scores.communication}
                                                                            onChange={(e) => setScores({ ...scores, communication: Math.min(5, Math.max(1, parseInt(e.target.value) || 1)) })}
                                                                            className="w-16 bg-black/50 border border-white/10 rounded px-2 py-1 text-center text-white focus:outline-none focus:border-amber-500"
                                                                        />
                                                                    </div>
                                                                    <p className="text-xs text-gray-500">Presentation, articulation, and clarity.</p>
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
                                                                    Total: <span className="text-amber-500">{scores.idea + scores.tools + scores.impact + scores.sustainability + scores.feasibility + scores.communication}</span><span className="text-gray-500 text-lg">/30</span>
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
                                                    </td>
                                                </tr>
                                            )}

                                            {/* Already Evaluated State (Open State) */}
                                            {isExpanded && evaluationOpen && team.has_evaluated && (
                                                <tr>
                                                    <td colSpan={9} className="p-0 border-b border-emerald-500/20 shadow-inner">
                                                        <div className="p-8 bg-black/40 text-center">
                                                            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                                                            <h4 className="text-lg font-bold text-white mb-1">Evaluation Submitted</h4>
                                                            <p className="text-gray-400">You gave this team a total score of <span className="text-emerald-400 font-bold">{team.my_score}</span>. Thank you for your review.</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
