"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Trash2, Settings, ArrowRight, FileText, Users, Calendar, Loader2, Sparkles, Copy, Globe } from "lucide-react"
import Link from "next/link"
import { deleteForm, duplicateForm } from "@/lib/actions/forms"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { CreateFormDialog } from "./create-form-dialog"

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })
}

export function FormsPageClient({ forms: initialForms }: { forms: any[] }) {
    const [forms, setForms] = useState(initialForms)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
    const [duplicatingId, setDuplicatingId] = useState<string | null>(null)
    const router = useRouter()

    async function handleDuplicate(id: string) {
        setDuplicatingId(id)
        try {
            const result = await duplicateForm(id)
            toast.success("Form duplicated!")
            router.refresh()
        } catch (err: any) {
            toast.error(err.message || "Failed to duplicate")
        } finally {
            setDuplicatingId(null)
        }
    }

    async function handleDelete(id: string) {
        setDeletingId(id)
        try {
            await deleteForm(id)
            setForms(forms.filter(f => f.id !== id))
            toast.success("Form deleted")
            setConfirmDeleteId(null)
        } catch (err: any) {
            toast.error(err.message || "Failed to delete form")
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <div className="pb-12">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10"
            >
                <div>
                    <motion.h1
                        className="text-4xl font-bold tracking-tight text-white mb-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                    >
                        Forms & Surveys
                    </motion.h1>
                    <motion.p
                        className="text-[#a1a1aa] text-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        Collect registrations, nominations, and feedback.
                    </motion.p>
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <CreateFormDialog />
                </motion.div>
            </motion.div>

            {/* Grid of form cards */}
            {forms.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center min-h-[400px] rounded-3xl border-2 border-dashed border-[#27272a] bg-[#0a0a0b]/50 text-center p-12"
                >
                    <div className="w-20 h-20 rounded-full bg-[#1e1e22] flex items-center justify-center mb-6">
                        <FileText className="w-10 h-10 text-[#3b82f6]" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">No forms yet</h3>
                    <p className="text-[#71717a] max-w-md mb-8 text-lg">
                        Create your first form to start collecting responses, feedback, and nominations from your community.
                    </p>
                    <CreateFormDialog />
                </motion.div>
            ) : (
                <motion.div
                    className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.08 } },
                    }}
                >
                    <AnimatePresence mode="popLayout">
                        {forms.map((form) => (
                            <motion.div
                                key={form.id}
                                layout
                                variants={{
                                    hidden: { opacity: 0, y: 30, scale: 0.95 },
                                    visible: { opacity: 1, y: 0, scale: 1 },
                                }}
                                exit={{ opacity: 0, scale: 0.9, y: -20, transition: { duration: 0.3 } }}
                                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                                className="group relative"
                            >
                                {/* Hover glow */}
                                <div className="absolute -inset-1 bg-gradient-to-br from-[#3b82f6]/20 to-[#8b5cf6]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                <div className="relative flex flex-col h-full bg-[#141416] border border-[#27272a] rounded-2xl overflow-hidden transition-all duration-300 group-hover:border-[#3f3f46] group-hover:-translate-y-1">
                                    {/* Card content */}
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="p-3 rounded-xl bg-[#3b82f6]/10">
                                                <FileText className="w-6 h-6 text-[#3b82f6]" />
                                            </div>
                                            <div className="flex gap-1.5">
                                                {form.is_published && (
                                                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20 flex items-center gap-1">
                                                        <Globe className="w-3 h-3" /> Live
                                                    </span>
                                                )}
                                                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${form.is_active
                                                    ? "bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20"
                                                    : "bg-[#27272a] text-[#71717a] border border-[#3f3f46]"
                                                    }`}>
                                                    {form.is_active ? "Active" : "Closed"}
                                                </span>
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#60a5fa] transition-colors">
                                            {form.title}
                                        </h3>

                                        <p className="text-sm text-[#a1a1aa] line-clamp-2 mb-6 flex-1">
                                            {form.description || "No description provided."}
                                        </p>

                                        <div className="flex flex-col gap-2 pt-4 border-t border-[#1e1e22]">
                                            <div className="flex items-center text-sm text-[#a1a1aa]">
                                                <Users className="w-4 h-4 mr-3 text-[#3b82f6]/70" />
                                                <span className="font-medium text-white mr-1">{form.response_count}</span> responses
                                            </div>
                                            {form.deadline && (
                                                <div className="flex items-center text-sm text-[#a1a1aa]">
                                                    <Calendar className="w-4 h-4 mr-3 text-[#8b5cf6]/70" />
                                                    Due {formatDate(form.deadline)}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action bar */}
                                    <div className="p-4 bg-[#0f0f11] border-t border-[#1e1e22] flex gap-2 items-center">
                                        <Link
                                            href={`/admin/forms/${form.id}/edit`}
                                            className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-[#1e1e22] hover:bg-[#27272a] text-[#a1a1aa] hover:text-white text-sm font-medium transition-all"
                                        >
                                            <Settings className="w-4 h-4" />
                                            Builder
                                        </Link>
                                        <Link
                                            href={`/admin/forms/${form.id}/responses`}
                                            className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] text-white text-sm font-medium transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                                        >
                                            Results
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>

                                        {/* Duplicate button */}
                                        <button
                                            onClick={() => handleDuplicate(form.id)}
                                            disabled={duplicatingId === form.id}
                                            className="h-10 w-10 flex items-center justify-center rounded-xl text-[#71717a] hover:text-[#3b82f6] hover:bg-[#3b82f6]/10 transition-all shrink-0"
                                            title="Duplicate form"
                                        >
                                            {duplicatingId === form.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Copy className="w-4 h-4" />}
                                        </button>

                                        {/* Delete button */}
                                        <AnimatePresence mode="wait">
                                            {confirmDeleteId === form.id ? (
                                                <motion.div
                                                    key="confirm"
                                                    initial={{ opacity: 0, width: 0 }}
                                                    animate={{ opacity: 1, width: "auto" }}
                                                    exit={{ opacity: 0, width: 0 }}
                                                    className="flex gap-1 overflow-hidden"
                                                >
                                                    <button
                                                        onClick={() => handleDelete(form.id)}
                                                        disabled={deletingId === form.id}
                                                        className="h-10 px-3 rounded-xl bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-semibold transition-all flex items-center gap-1 whitespace-nowrap"
                                                    >
                                                        {deletingId === form.id ? (
                                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                        ) : (
                                                            "Yes"
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => setConfirmDeleteId(null)}
                                                        className="h-10 px-3 rounded-xl bg-[#1e1e22] hover:bg-[#27272a] text-[#a1a1aa] text-xs font-semibold transition-all whitespace-nowrap"
                                                    >
                                                        No
                                                    </button>
                                                </motion.div>
                                            ) : (
                                                <motion.button
                                                    key="trash"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    onClick={() => setConfirmDeleteId(form.id)}
                                                    className="h-10 w-10 flex items-center justify-center rounded-xl text-[#71717a] hover:text-[#ef4444] hover:bg-[#dc2626]/10 transition-all shrink-0"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </motion.button>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    )
}
