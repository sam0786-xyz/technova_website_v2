"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Star, ChevronDown, ChevronUp, Check, Loader2, User,
    Award, MessageSquare, ArrowLeft, CheckCircle2
} from "lucide-react"
import { submitFormEvaluation } from "@/lib/actions/form-evaluation-actions"
import { toast } from "sonner"

interface EvaluatorPortalClientProps {
    evaluator: { id: string; name: string; email: string; form_id: string }
    formTitle: string
    candidates: any[]
    criteria: string[]
    existingEvaluations: any[]
    fields: any[]
    token: string
}

export function EvaluatorPortalClient({
    evaluator, formTitle, candidates, criteria, existingEvaluations, fields, token
}: EvaluatorPortalClientProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [submittingId, setSubmittingId] = useState<string | null>(null)

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
            toast.success("Evaluation submitted!")
            evaluatedIds.add(responseId)
        } catch (err: any) { toast.error(err.message) }
        finally { setSubmittingId(null) }
    }

    const progress = candidates.length > 0
        ? Math.round((Array.from(evaluatedIds).filter(id => candidates.some(c => c.id === id)).length / candidates.length) * 100)
        : 0

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

            {/* Candidates list */}
            <div className="space-y-4">
                {candidates.map((candidate, idx) => {
                    const isExpanded = expandedId === candidate.id
                    const isEvaluated = evaluatedIds.has(candidate.id)
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
                                                                        onClick={() => setScore(candidate.id, criterion, val)}
                                                                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-sm font-bold transition-all ${
                                                                            (scores[criterion] || 0) >= val
                                                                                ? val <= 3 ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                                                                : val <= 6 ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                                                                : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                                                                : "bg-[#1e1e22] text-[#52525b] border border-transparent hover:border-[#3f3f46]"
                                                                        }`}>
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
                                                    onChange={e => setRemarks(candidate.id, e.target.value)}
                                                    rows={3} placeholder="Additional notes, observations, strengths/weaknesses..."
                                                    className="w-full px-4 py-3 rounded-xl bg-[#0a0a0b] border border-[#27272a] text-white text-sm placeholder:text-[#3f3f46] focus:border-[#3b82f6] outline-none resize-none" />
                                            </div>

                                            {/* Submit button */}
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
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )
                })}

                {candidates.length === 0 && (
                    <div className="text-center py-16 text-[#52525b]">
                        <User className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        <p className="text-lg font-medium">No candidates yet</p>
                        <p className="text-sm mt-1">Candidates will appear once people submit the form.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
