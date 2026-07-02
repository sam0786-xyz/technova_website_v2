"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Plus, Trash2, Copy, Check, Users, Award, Link2, X,
    Loader2, UserPlus, BarChart3, Star, ChevronDown, ChevronUp, Settings, Unlock, Lock, AlertTriangle, Mail
} from "lucide-react"
import { addFormEvaluator, removeFormEvaluator, updateEvaluationCriteria, toggleEvaluationsOpen, clearAllEvaluations, resolveUnlockRequest, sendEmailToEvaluators } from "@/lib/actions/form-evaluation-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface EvaluateClientProps {
    formId: string
    formTitle: string
    evaluators: any[]
    criteria: string[]
    evaluations: any[]
    evaluationsOpen: boolean
}

export function EvaluateClient({ formId, formTitle, evaluators, criteria, evaluations, evaluationsOpen }: EvaluateClientProps) {
    const [activeTab, setActiveTab] = useState<"evaluators" | "results" | "settings" | "requests">("evaluators")
    const router = useRouter()

    return (
        <div className="space-y-6">
            {/* Tab bar */}
            <div className="flex bg-[#141416] border border-[#27272a] rounded-xl p-1 w-fit">
                {[
                    { key: "evaluators", label: "Evaluators", icon: Users },
                    { key: "results", label: "Results", icon: BarChart3 },
                    { key: "requests", label: "Unlock Requests", icon: Unlock, badge: evaluations.filter(e => e.unlock_status === 'pending').length },
                    { key: "settings", label: "Settings", icon: Settings },
                ].map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
                        className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === tab.key ? "bg-[#27272a] text-white" : "text-[#71717a] hover:text-white"}`}>
                        <tab.icon className="w-4 h-4" /> {tab.label}
                        {tab.badge ? <span className="ml-1 bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{tab.badge}</span> : null}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {activeTab === "evaluators" && (
                    <motion.div key="evaluators" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <EvaluatorsPanel formId={formId} evaluators={evaluators} />
                    </motion.div>
                )}
                {activeTab === "results" && (
                    <motion.div key="results" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <ResultsPanel evaluators={evaluators} evaluations={evaluations} criteria={criteria} />
                    </motion.div>
                )}
                {activeTab === "settings" && (
                    <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <CriteriaSettings formId={formId} initialCriteria={criteria} evaluationsOpen={evaluationsOpen} />
                    </motion.div>
                )}
                {activeTab === "requests" && (
                    <motion.div key="requests" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <UnlockRequestsPanel formId={formId} evaluations={evaluations} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// ============================================================
// Evaluators Panel
// ============================================================

function EvaluatorsPanel({ formId, evaluators }: { formId: string; evaluators: any[] }) {
    const [showAdd, setShowAdd] = useState(false)
    const [showEmail, setShowEmail] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [isAdding, setIsAdding] = useState(false)
    const [isEmailing, setIsEmailing] = useState(false)
    const [emailSubject, setEmailSubject] = useState("Update on Evaluation")
    const [emailMessage, setEmailMessage] = useState("")
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const router = useRouter()

    const handleAdd = async () => {
        if (!name.trim() || !email.trim()) { toast.error("Name and email are required"); return }
        setIsAdding(true)
        try {
            await addFormEvaluator(formId, name.trim(), email.trim())
            toast.success("Evaluator added!")
            setName(""); setEmail(""); setShowAdd(false)
            router.refresh()
        } catch (err: any) { toast.error(err.message) }
        finally { setIsAdding(false) }
    }

    const handleSendEmail = async () => {
        if (!emailSubject.trim() || !emailMessage.trim()) { toast.error("Subject and message are required"); return }
        setIsEmailing(true)
        try {
            await sendEmailToEvaluators(formId, emailSubject.trim(), emailMessage.trim())
            toast.success("Email sent to all evaluators!")
            setEmailSubject("Update on Evaluation"); setEmailMessage(""); setShowEmail(false)
        } catch (err: any) { toast.error(err.message) }
        finally { setIsEmailing(false) }
    }

    const handleRemove = async (evId: string) => {
        if (!confirm("Remove this evaluator? Their evaluations will be deleted.")) return
        try {
            await removeFormEvaluator(evId, formId)
            toast.success("Evaluator removed")
            router.refresh()
        } catch (err: any) { toast.error(err.message) }
    }

    const copyLink = (token: string) => {
        const url = `${window.location.origin}/form-evaluate?token=${token}`
        navigator.clipboard.writeText(url).then(() => {
            setCopiedId(token)
            setTimeout(() => setCopiedId(null), 2000)
            toast.success("Evaluation link copied!")
        }).catch(() => {
            window.prompt("Copy this link:", url)
        })
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white">Evaluators ({evaluators.length})</h2>
                    <p className="text-sm text-[#52525b]">Add interviewers who will evaluate the candidates</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => setShowEmail(true)} disabled={evaluators.length === 0}
                        className="h-10 px-4 rounded-xl bg-[#1e1e22] hover:bg-[#27272a] text-[#d4d4d8] text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50">
                        <Mail className="w-4 h-4" /> Email All
                    </button>
                    <button onClick={() => setShowAdd(true)}
                        className="h-10 px-4 rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] text-white text-sm font-medium transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                        <UserPlus className="w-4 h-4" /> Add Evaluator
                    </button>
                </div>
            </div>

            {/* Add form */}
            <AnimatePresence>
                {showAdd && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden">
                        <div className="bg-[#141416] border border-[#27272a] rounded-2xl p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold text-white">New Evaluator</h3>
                                <button onClick={() => setShowAdd(false)} className="text-[#52525b] hover:text-white"><X className="w-4 h-4" /></button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name"
                                    className="h-11 px-4 rounded-xl bg-[#0a0a0b] border border-[#27272a] text-white text-sm placeholder:text-[#3f3f46] focus:border-[#3b82f6] outline-none" />
                                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" type="email"
                                    className="h-11 px-4 rounded-xl bg-[#0a0a0b] border border-[#27272a] text-white text-sm placeholder:text-[#3f3f46] focus:border-[#3b82f6] outline-none" />
                            </div>
                            <button onClick={handleAdd} disabled={isAdding}
                                className="h-10 px-6 rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] text-white text-sm font-medium flex items-center gap-2 disabled:opacity-50 w-fit">
                                {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                {isAdding ? "Adding..." : "Add"}
                            </button>
                        </div>
                    </motion.div>
                )}
                
                {showEmail && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden">
                        <div className="bg-[#141416] border border-[#3b82f6]/30 rounded-2xl p-6 space-y-4 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                                <Mail className="w-32 h-32" />
                            </div>
                            <div className="flex items-center justify-between relative">
                                <div>
                                    <h3 className="text-base font-bold text-white">Blast Email</h3>
                                    <p className="text-xs text-[#71717a] mt-1">Send an update or schedule to all {evaluators.length} evaluators.</p>
                                </div>
                                <button onClick={() => setShowEmail(false)} className="text-[#52525b] hover:text-white"><X className="w-4 h-4" /></button>
                            </div>
                            <div className="space-y-3 relative">
                                <input value={emailSubject} onChange={e => setEmailSubject(e.target.value)} placeholder="Email Subject"
                                    className="w-full h-11 px-4 rounded-xl bg-[#0a0a0b] border border-[#27272a] text-white text-sm placeholder:text-[#3f3f46] focus:border-[#3b82f6] outline-none" />
                                <textarea value={emailMessage} onChange={e => setEmailMessage(e.target.value)} placeholder="Type your message here... Include candidate allocations or general schedule information." rows={5}
                                    className="w-full px-4 py-3 rounded-xl bg-[#0a0a0b] border border-[#27272a] text-white text-sm placeholder:text-[#3f3f46] focus:border-[#3b82f6] outline-none resize-none" />
                            </div>
                            <button onClick={handleSendEmail} disabled={isEmailing}
                                className="h-10 px-6 rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] text-white text-sm font-medium flex items-center gap-2 disabled:opacity-50 relative">
                                {isEmailing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                                {isEmailing ? "Sending..." : "Send to All Evaluators"}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Evaluator list */}
            <div className="space-y-3">
                {evaluators.map(ev => (
                    <div key={ev.id} className="bg-[#141416] border border-[#27272a] rounded-2xl p-5 flex items-center gap-4 group hover:border-[#3f3f46] transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/10 flex items-center justify-center shrink-0">
                            <Award className="w-5 h-5 text-[#3b82f6]" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-medium text-sm truncate">{ev.name}</p>
                            <p className="text-[#52525b] text-xs truncate">{ev.email}</p>
                        </div>
                        <button onClick={() => copyLink(ev.magic_token)} title="Copy evaluation link"
                            className="p-2.5 rounded-xl bg-[#1e1e22] hover:bg-[#27272a] text-[#71717a] hover:text-white transition-all">
                            {copiedId === ev.magic_token ? <Check className="w-4 h-4 text-emerald-400" /> : <Link2 className="w-4 h-4" />}
                        </button>
                        <button onClick={() => handleRemove(ev.id)} title="Remove"
                            className="p-2.5 rounded-xl text-[#52525b] hover:text-[#ef4444] hover:bg-[#dc2626]/10 transition-all opacity-0 group-hover:opacity-100">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                {evaluators.length === 0 && (
                    <div className="text-center py-12 text-[#52525b]">
                        <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        <p>No evaluators added yet</p>
                        <p className="text-sm mt-1">Add evaluators and share their unique evaluation links</p>
                    </div>
                )}
            </div>
        </div>
    )
}

// ============================================================
// Results Panel
// ============================================================

function ResultsPanel({ evaluators, evaluations, criteria }: { evaluators: any[]; evaluations: any[]; criteria: string[] }) {
    const [expandedCandidate, setExpandedCandidate] = useState<string | null>(null)

    // Group evaluations by candidate (response_id)
    const candidateMap = new Map<string, { candidate: any; evals: any[] }>()
    for (const ev of evaluations) {
        const rid = ev.response_id
        if (!candidateMap.has(rid)) {
            candidateMap.set(rid, { candidate: ev.response, evals: [] })
        }
        candidateMap.get(rid)!.evals.push(ev)
    }

    const candidates = Array.from(candidateMap.entries())

    if (candidates.length === 0) {
        return (
            <div className="text-center py-16 text-[#52525b]">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">No evaluations yet</p>
                <p className="text-sm mt-1">Share evaluation links with your evaluators to get started.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Evaluation Results</h2>

            {candidates.map(([responseId, { candidate, evals }]) => {
                const avgScores: Record<string, number> = {}
                for (const c of criteria) {
                    const vals = evals.map(e => e.scores?.[c]).filter((v: any) => typeof v === "number")
                    avgScores[c] = vals.length > 0 ? vals.reduce((a: number, b: number) => a + b, 0) / vals.length : 0
                }
                const overallAvg = Object.values(avgScores).reduce((a, b) => a + b, 0) / Math.max(criteria.length, 1)
                const isExpanded = expandedCandidate === responseId

                return (
                    <div key={responseId} className="bg-[#141416] border border-[#27272a] rounded-2xl overflow-hidden">
                        <button onClick={() => setExpandedCandidate(isExpanded ? null : responseId)}
                            className="w-full p-5 flex items-center gap-4 text-left hover:bg-[#1e1e22]/50 transition-colors">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3b82f6]/10 to-[#a78bfa]/10 flex items-center justify-center shrink-0">
                                <Star className="w-5 h-5 text-[#fbbf24]" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-medium text-sm truncate">{candidate?.user?.name || "Unknown"}</p>
                                <p className="text-[#52525b] text-xs">{evals.length} evaluation{evals.length !== 1 ? "s" : ""}</p>
                            </div>
                            <div className="text-right mr-2">
                                <p className="text-2xl font-bold text-white">{overallAvg.toFixed(1)}</p>
                                <p className="text-[10px] text-[#52525b] uppercase tracking-wider">avg score</p>
                            </div>
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-[#52525b]" /> : <ChevronDown className="w-4 h-4 text-[#52525b]" />}
                        </button>

                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                                    <div className="px-5 pb-5 space-y-4 border-t border-[#1e1e22]">
                                        {/* Criteria averages */}
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4">
                                            {criteria.map(c => (
                                                <div key={c} className="bg-[#0f0f11] rounded-xl p-3 border border-[#1e1e22]">
                                                    <p className="text-[10px] text-[#52525b] uppercase tracking-widest mb-1 truncate" title={c}>{c}</p>
                                                    <p className="text-xl font-bold text-white">{avgScores[c]?.toFixed(1) || "—"}<span className="text-xs text-[#52525b] ml-1">/10</span></p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Per-evaluator scores */}
                                        <div className="space-y-2">
                                            <p className="text-xs font-bold text-[#71717a] uppercase tracking-widest">Individual Evaluations</p>
                                            {evals.map((ev: any) => (
                                                <div key={ev.id} className="bg-[#0f0f11] rounded-xl p-4 border border-[#1e1e22]">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <p className="text-sm text-white font-medium">{ev.evaluator?.name || "Unknown"}</p>
                                                        <p className="text-xs text-[#52525b]">{ev.updated_at ? new Date(ev.updated_at).toLocaleDateString() : ""}</p>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 mb-2">
                                                        {criteria.map(c => (
                                                            <span key={c} className="text-xs px-2 py-1 bg-[#1e1e22] rounded-lg text-[#a1a1aa]" title={c}>
                                                                {c.split(" ")[0]}: <span className="text-white font-bold">{ev.scores?.[c] ?? "—"}</span>
                                                            </span>
                                                        ))}
                                                    </div>
                                                    {ev.remarks && (
                                                        <p className="text-sm text-[#a1a1aa] italic border-l-2 border-[#27272a] pl-3 mt-2">{ev.remarks}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )
            })}
        </div>
    )
}

// ============================================================
// Criteria Settings
// ============================================================

function CriteriaSettings({ formId, initialCriteria, evaluationsOpen }: { formId: string; initialCriteria: string[]; evaluationsOpen: boolean }) {
    const [criteria, setCriteria] = useState(initialCriteria)
    const [isSaving, setIsSaving] = useState(false)
    const [isToggling, setIsToggling] = useState(false)
    const [isClearing, setIsClearing] = useState(false)
    const router = useRouter()

    const addCriterion = () => setCriteria([...criteria, ""])
    const updateCriterion = (idx: number, val: string) => {
        const next = [...criteria]; next[idx] = val; setCriteria(next)
    }
    const removeCriterion = (idx: number) => setCriteria(criteria.filter((_, i) => i !== idx))

    const handleSave = async () => {
        const valid = criteria.filter(c => c.trim())
        if (valid.length === 0) { toast.error("At least one criterion is required"); return }
        setIsSaving(true)
        try {
            await updateEvaluationCriteria(formId, valid)
            toast.success("Criteria updated!")
            router.refresh()
        } catch (err: any) { toast.error(err.message) }
        finally { setIsSaving(false) }
    }

    return (
        <div className="space-y-4 max-w-xl">
            <div>
                <h2 className="text-xl font-bold text-white">Evaluation Criteria</h2>
                <p className="text-sm text-[#52525b] mt-1">Define the parameters evaluators will score candidates on (1-10 scale)</p>
            </div>

            <div className="space-y-3">
                {criteria.map((c, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-[#1e1e22] text-[#52525b] flex items-center justify-center text-xs font-mono shrink-0">{i + 1}</span>
                        <input value={c} onChange={e => updateCriterion(i, e.target.value)} placeholder="e.g. Communication Skills"
                            className="flex-1 h-11 px-4 rounded-xl bg-[#141416] border border-[#27272a] text-white text-sm placeholder:text-[#3f3f46] focus:border-[#3b82f6] outline-none transition-all" />
                        <button onClick={() => removeCriterion(i)} disabled={criteria.length <= 1}
                            className="p-2 rounded-lg text-[#52525b] hover:text-[#ef4444] hover:bg-[#dc2626]/10 transition-all disabled:opacity-20">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            <button onClick={addCriterion}
                className="flex items-center gap-2 h-9 px-4 rounded-xl bg-[#1e1e22] hover:bg-[#27272a] text-[#a78bfa] text-xs font-semibold transition-all">
                <Plus className="w-3.5 h-3.5" /> Add Criterion
            </button>

            <div className="pt-4 border-t border-[#1e1e22]">
                <button onClick={handleSave} disabled={isSaving}
                    className="h-10 px-6 rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] text-white text-sm font-medium flex items-center gap-2 disabled:opacity-50 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    {isSaving ? "Saving..." : "Save Criteria"}
                </button>
            </div>

            <div className="pt-8 mt-8 border-t border-[#1e1e22] space-y-6">
                <div>
                    <h2 className="text-xl font-bold text-white">Advanced Controls</h2>
                    <p className="text-sm text-[#52525b] mt-1">Manage the state of evaluations for this form.</p>
                </div>
                
                <div className="p-5 border border-[#27272a] rounded-2xl bg-[#141416] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="font-bold text-white flex items-center gap-2">
                            {evaluationsOpen ? <Unlock className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-amber-500" />}
                            Evaluations are {evaluationsOpen ? "Open" : "Closed"}
                        </h3>
                        <p className="text-sm text-[#71717a] mt-1">
                            {evaluationsOpen ? "Evaluators can submit new scores." : "Evaluators are blocked from submitting scores."}
                        </p>
                    </div>
                    <button 
                        onClick={async () => {
                            setIsToggling(true)
                            try {
                                await toggleEvaluationsOpen(formId, !evaluationsOpen)
                                toast.success(`Evaluations ${!evaluationsOpen ? 'opened' : 'closed'} successfully`)
                                router.refresh()
                            } catch (e: any) { toast.error(e.message) }
                            setIsToggling(false)
                        }} 
                        disabled={isToggling}
                        className={`h-10 px-6 rounded-xl text-sm font-medium transition-all ${evaluationsOpen ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'}`}
                    >
                        {isToggling ? "Processing..." : evaluationsOpen ? "Close Evaluations" : "Open Evaluations"}
                    </button>
                </div>

                <div className="p-5 border border-[#dc2626]/20 rounded-2xl bg-[#141416] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-rose-500" />
                            Clear All Score Responses
                        </h3>
                        <p className="text-sm text-[#71717a] mt-1">
                            Permanently delete all evaluation scores submitted for this form.
                        </p>
                    </div>
                    <button 
                        onClick={async () => {
                            if (!confirm("WARNING: This will permanently delete ALL evaluations from all evaluators for this form. Are you absolutely sure?")) return;
                            setIsClearing(true)
                            try {
                                await clearAllEvaluations(formId)
                                toast.success("All evaluations have been cleared.")
                                router.refresh()
                            } catch (e: any) { toast.error(e.message) }
                            setIsClearing(false)
                        }} 
                        disabled={isClearing}
                        className="h-10 px-6 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 text-sm font-medium transition-all whitespace-nowrap"
                    >
                        {isClearing ? "Clearing..." : "Clear All Scores"}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ============================================================
// Unlock Requests Panel
// ============================================================

function UnlockRequestsPanel({ formId, evaluations }: { formId: string, evaluations: any[] }) {
    const router = useRouter()
    const pendingRequests = evaluations.filter(e => e.unlock_status === 'pending')

    const handleResolve = async (evaluationId: string, status: 'approved' | 'declined') => {
        try {
            await resolveUnlockRequest(formId, evaluationId, status)
            toast.success(`Unlock request ${status}`)
            router.refresh()
        } catch (e: any) {
            toast.error(e.message)
        }
    }

    if (pendingRequests.length === 0) {
        return (
            <div className="text-center py-16 text-[#52525b]">
                <Check className="w-12 h-12 mx-auto mb-4 opacity-30 text-emerald-500" />
                <p className="text-lg font-medium">No Pending Requests</p>
                <p className="text-sm mt-1">All clear. Evaluators will appear here if they request to unlock a score.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Unlock Requests</h2>
            <div className="space-y-3">
                {pendingRequests.map(req => (
                    <div key={req.id} className="bg-[#141416] border border-[#27272a] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <p className="text-white font-medium">
                                <span className="text-[#3b82f6]">{req.evaluator?.name}</span> wants to edit their evaluation for <span className="text-[#a78bfa]">{req.response?.user?.name}</span>.
                            </p>
                            <p className="text-xs text-[#71717a] mt-1">
                                Submitted originally on {new Date(req.created_at).toLocaleString()}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => handleResolve(req.id, 'declined')}
                                className="px-4 py-2 rounded-xl text-sm font-medium bg-[#1e1e22] text-[#71717a] hover:text-white hover:bg-[#27272a] transition-all">
                                Decline
                            </button>
                            <button onClick={() => handleResolve(req.id, 'approved')}
                                className="px-4 py-2 rounded-xl text-sm font-medium bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-all">
                                Approve Unlock
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
