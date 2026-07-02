"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Star, ChevronDown, ChevronUp, Check, Loader2, User,
    Award, MessageSquare, ArrowLeft, CheckCircle2, Lock, Unlock, AlertCircle, Search, ChevronLeft, ChevronRight
} from "lucide-react"
import { submitFormEvaluation, requestEvaluationUnlock } from "@/lib/actions/form-evaluation-actions"
import { toast } from "sonner"

interface EvaluatorPortalClientProps {
    evaluator: { id: string; name: string; email: string; form_id: string }
    formTitle: string
    candidates: any[]
    criteria: string[]
    existingEvaluations: any[]
    fields: any[]
    token: string
    evaluationsOpen: boolean
}

export function EvaluatorPortalClient({
    evaluator, formTitle, candidates, criteria, existingEvaluations, fields, token, evaluationsOpen
}: EvaluatorPortalClientProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [submittingId, setSubmittingId] = useState<string | null>(null)
    const [unlockingId, setUnlockingId] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const ITEMS_PER_PAGE = 10

    // Track scores and remarks per candidate
    const [allScores, setAllScores] = useState<Record<string, Record<string, number>>>(() => {
        const initial: Record<string, Record<string, number>> = {}
        for (const ev of existingEvaluations) {
            initial[ev.response_id] = ev.scores || {}
        }
        return initial
    })

    const [allRemarks, setAllRemarks] = useState<Record<string, string>>(() => {
        const initial: Record<string, string> = {}
        for (const ev of existingEvaluations) {
            initial[ev.response_id] = ev.remarks || ""
        }
        return initial
    })

    const evaluatedIds = useMemo(() => new Set(existingEvaluations.map(e => e.response_id)), [existingEvaluations])

    const setScore = (candidateId: string, criterion: string, value: number) => {
        setAllScores(prev => ({
            ...prev,
            [candidateId]: { ...(prev[candidateId] || {}), [criterion]: value }
        }))
    }

    const setRemarks = (candidateId: string, value: string) => {
        setAllRemarks(prev => ({ ...prev, [candidateId]: value }))
    }

    const handleSubmit = async (responseId: string) => {
        const scores = allScores[responseId] || {}
        const remarks = allRemarks[responseId] || ""

        // Validate all criteria have scores
        const missing = criteria.filter(c => !scores[c] || scores[c] < 1)
        if (missing.length > 0) {
            toast.error(`Please score all criteria: ${missing.join(", ")}`)
            return
        }

        setSubmittingId(responseId)
        try {
            await submitFormEvaluation(token, responseId, scores, remarks)
            toast.success("Evaluation submitted and locked!")
            
            // Mark it as evaluated locally (assuming it's locked and no longer editable)
            if (!evaluatedIds.has(responseId)) {
                evaluatedIds.add(responseId)
            }
            // Update the existing evaluations list locally to reflect the locked state
            const evIdx = existingEvaluations.findIndex(e => e.response_id === responseId)
            if (evIdx !== -1) {
                existingEvaluations[evIdx].is_locked = true
                existingEvaluations[evIdx].unlock_status = 'none'
            } else {
                existingEvaluations.push({
                    response_id: responseId,
                    scores,
                    remarks,
                    is_locked: true,
                    unlock_status: 'none'
                })
            }
        } catch (err: any) { toast.error(err.message) }
        finally { setSubmittingId(null) }
    }

    const handleRequestUnlock = async (responseId: string) => {
        setUnlockingId(responseId)
        try {
            await requestEvaluationUnlock(token, responseId)
            toast.success("Unlock request sent to admin!")
            // Update local state
            const ev = existingEvaluations.find(e => e.response_id === responseId)
            if (ev) ev.unlock_status = 'pending'
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setUnlockingId(null)
        }
    }

    const progress = candidates.length > 0
        ? Math.round((Array.from(evaluatedIds).filter(id => candidates.some(c => c.id === id)).length / candidates.length) * 100)
        : 0

    // Filter and paginate candidates
    const filteredCandidates = useMemo(() => {
        if (!searchQuery.trim()) return candidates;
        const q = searchQuery.toLowerCase();
        return candidates.filter(c => 
            c.user?.name?.toLowerCase().includes(q) || 
            c.user?.email?.toLowerCase().includes(q)
        );
    }, [candidates, searchQuery]);

    const totalPages = Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE) || 1;
    
    // Reset to page 1 if search query changes
    useMemo(() => { setCurrentPage(1) }, [searchQuery]);

    const paginatedCandidates = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredCandidates.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredCandidates, currentPage]);

    return (
        <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
            {/* Header */}
            <div className="mb-8 sm:mb-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                        <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Evaluation Portal</h1>
                        <p className="text-sm text-[#71717a]">{formTitle}</p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-[#71717a]">
                    <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {evaluator.name}</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> {evaluatedIds.size}/{candidates.length} evaluated</span>
                </div>

                {/* Progress bar */}
                <div className="mt-4 h-2 bg-[#1e1e22] rounded-full overflow-hidden">
                    <motion.div className="h-full bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] rounded-full"
                        initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }} />
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-[#71717a]" />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search candidate by name or email..."
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-[#141416] border border-[#27272a] text-white text-sm placeholder:text-[#52525b] focus:border-[#3b82f6] outline-none transition-all"
                />
            </div>

            {!evaluationsOpen && (
                <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-bold text-amber-500">Evaluations are Closed</h3>
                        <p className="text-sm text-amber-500/80 mt-1">
                            The admin has closed evaluations for this form. You can view your past evaluations, but you cannot submit or edit any scores.
                        </p>
                    </div>
                </div>
            )}

            {/* Candidates list */}
            <div className="space-y-4">
                {paginatedCandidates.map((candidate, idx) => {
                    const isExpanded = expandedId === candidate.id
                    const isEvaluated = evaluatedIds.has(candidate.id)
                    const existingEv = existingEvaluations.find(e => e.response_id === candidate.id)
                    const isLocked = existingEv?.is_locked && existingEv?.unlock_status !== 'approved'
                    const unlockStatus = existingEv?.unlock_status
                    
                    const isReadOnly = !evaluationsOpen || isLocked

                    const scores = allScores[candidate.id] || {}
                    const totalScore = criteria.reduce((sum, c) => sum + (scores[c] || 0), 0)

                    return (
                        <motion.div key={candidate.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`bg-[#141416] border rounded-2xl overflow-hidden transition-colors ${isEvaluated ? "border-emerald-500/20" : "border-[#27272a] hover:border-[#3f3f46]"}`}>

                            {/* Candidate header */}
                            <button onClick={() => setExpandedId(isExpanded ? null : candidate.id)}
                                className="w-full p-4 sm:p-5 flex items-center gap-3 sm:gap-4 text-left">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${isEvaluated ? "bg-emerald-500/10 text-emerald-400" : "bg-[#1e1e22] text-[#71717a]"}`}>
                                    {isEvaluated ? <Check className="w-5 h-5" /> : idx + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-medium text-sm truncate">{candidate.user?.name || "Anonymous"}</p>
                                    <p className="text-[#52525b] text-xs truncate">{candidate.user?.email || ""}</p>
                                </div>
                                {isEvaluated && (
                                    <span className="text-sm font-bold text-emerald-400 mr-2">{totalScore}/{criteria.length * 10}</span>
                                )}
                                {isExpanded ? <ChevronUp className="w-4 h-4 text-[#52525b] shrink-0" /> : <ChevronDown className="w-4 h-4 text-[#52525b] shrink-0" />}
                            </button>

                            {/* Expanded content */}
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                                        <div className="px-4 sm:px-5 pb-5 space-y-5 border-t border-[#1e1e22]">

                                            {/* Candidate responses */}
                                            <div className="pt-4">
                                                <p className="text-xs font-bold text-[#71717a] uppercase tracking-widest mb-3">Candidate Responses</p>
                                                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                                                    {fields.map((field: any) => {
                                                        const answer = candidate.answers?.find((a: any) => a.field_id === field.id)
                                                        let val = "—"
                                                        if (answer) {
                                                            if (answer.answer_text) val = answer.answer_text
                                                            if (answer.answer_json) val = Array.isArray(answer.answer_json) ? answer.answer_json.join(", ") : JSON.stringify(answer.answer_json)
                                                        }
                                                        return (
                                                            <div key={field.id} className="bg-[#0f0f11] rounded-xl p-3 border border-[#1e1e22]">
                                                                <p className="text-[10px] text-[#52525b] uppercase tracking-widest mb-1">{field.label}</p>
                                                                <p className="text-sm text-[#d4d4d8]">{val}</p>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>

                                            {/* Scoring */}
                                            <div>
                                                <p className="text-xs font-bold text-[#71717a] uppercase tracking-widest mb-3">Score (1-10)</p>
                                                <div className="space-y-4">
                                                    {criteria.map(criterion => (
                                                        <div key={criterion}>
                                                            <label className="text-sm text-[#a1a1aa] mb-2 block">{criterion}</label>
                                                            <div className="flex items-center gap-1 flex-wrap">
                                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => (
                                                                    <button key={val} type="button"
                                                                        disabled={isReadOnly}
                                                                        onClick={() => setScore(candidate.id, criterion, val)}
                                                                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-sm font-bold transition-all ${
                                                                            (scores[criterion] || 0) >= val
                                                                                ? val <= 3 ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                                                                : val <= 6 ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                                                                : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                                                                : "bg-[#1e1e22] text-[#52525b] border border-transparent hover:border-[#3f3f46]"
                                                                        } ${isReadOnly ? 'opacity-50 cursor-not-allowed hover:border-transparent' : ''}`}>
                                                                        {val}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Remarks */}
                                            <div>
                                                <label className="text-xs font-bold text-[#71717a] uppercase tracking-widest mb-2 flex items-center gap-2">
                                                    <MessageSquare className="w-3.5 h-3.5" /> Remarks
                                                </label>
                                                <textarea value={allRemarks[candidate.id] || ""}
                                                    disabled={isReadOnly}
                                                    onChange={e => setRemarks(candidate.id, e.target.value)}
                                                    rows={3} placeholder="Additional notes, observations, strengths/weaknesses..."
                                                    className={`w-full px-4 py-3 rounded-xl bg-[#0a0a0b] border border-[#27272a] text-white text-sm placeholder:text-[#3f3f46] outline-none resize-none ${isReadOnly ? 'opacity-50 cursor-not-allowed' : 'focus:border-[#3b82f6]'}`} />
                                            </div>

                                            {/* Submit or Locked button */}
                                            {isReadOnly ? (
                                                <div className="w-full flex flex-col sm:flex-row items-center gap-3">
                                                    <div className="flex-1 h-12 px-4 rounded-xl bg-[#1e1e22] border border-[#27272a] flex items-center justify-center gap-2 text-[#71717a] text-sm w-full">
                                                        <Lock className="w-4 h-4" /> 
                                                        {evaluationsOpen ? "Evaluation Locked" : "Evaluations Closed"}
                                                    </div>
                                                    {evaluationsOpen && unlockStatus !== 'pending' && (
                                                        <button 
                                                            onClick={() => handleRequestUnlock(candidate.id)}
                                                            disabled={unlockingId === candidate.id}
                                                            className="h-12 px-6 rounded-xl bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 font-medium text-sm flex items-center justify-center gap-2 transition-all shrink-0 w-full sm:w-auto disabled:opacity-50"
                                                        >
                                                            {unlockingId === candidate.id ? <><Loader2 className="w-4 h-4 animate-spin" /> Requesting...</> : <><Unlock className="w-4 h-4" /> Request Unlock</>}
                                                        </button>
                                                    )}
                                                    {evaluationsOpen && unlockStatus === 'pending' && (
                                                        <div className="h-12 px-6 rounded-xl bg-amber-500/10 text-amber-500/70 border border-amber-500/20 flex items-center justify-center gap-2 text-sm font-medium w-full sm:w-auto shrink-0">
                                                            <Loader2 className="w-4 h-4 animate-spin" /> Unlock Pending
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <button onClick={() => handleSubmit(candidate.id)}
                                                    disabled={submittingId === candidate.id}
                                                    className="w-full h-12 rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                                                    {submittingId === candidate.id ? (
                                                        <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                                                    ) : isEvaluated ? (
                                                        <><Check className="w-4 h-4" /> Update Evaluation</>
                                                    ) : (
                                                        <><Star className="w-4 h-4" /> Submit Evaluation</>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )
                })}

                {filteredCandidates.length === 0 && (
                    <div className="text-center py-16 text-[#52525b]">
                        <User className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        <p className="text-lg font-medium">{candidates.length === 0 ? "No candidates yet" : "No candidates match your search"}</p>
                        <p className="text-sm mt-1">{candidates.length === 0 ? "Candidates will appear once people submit the form." : "Try a different search term."}</p>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-between bg-[#141416] border border-[#27272a] rounded-xl p-4">
                    <p className="text-sm text-[#71717a]">
                        Showing <span className="text-white font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="text-white font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredCandidates.length)}</span> of <span className="text-white font-medium">{filteredCandidates.length}</span> candidates
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg bg-[#1e1e22] text-[#d4d4d8] hover:bg-[#27272a] disabled:opacity-50 transition-all flex items-center justify-center"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-sm text-white font-medium px-2">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg bg-[#1e1e22] text-[#d4d4d8] hover:bg-[#27272a] disabled:opacity-50 transition-all flex items-center justify-center"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
