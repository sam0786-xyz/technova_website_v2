"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Sparkles, FileText, Calendar as CalendarIcon, AlignLeft, X } from "lucide-react"
import { createForm } from "@/lib/actions/forms"
import { toast } from "sonner"

export function CreateFormDialog() {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)

        try {
            const formData = new FormData(e.currentTarget)
            const result = await createForm(formData)

            if (result.success) {
                toast.success("Form created successfully")
                setOpen(false)
                router.push(`/admin/forms/${result.formId}/edit`)
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to create form")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 h-12 px-6 rounded-xl bg-white text-black font-medium text-sm hover:bg-[#e4e4e7] active:scale-[0.97] transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)]"
            >
                <Plus className="h-5 w-5" />
                Create New Form
            </button>

            <AnimatePresence>
                {open && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                            onClick={(e) => e.target === e.currentTarget && setOpen(false)}
                        >
                            <div className="w-full max-w-[480px] bg-[#0a0a0b] border border-[#27272a] rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.6)] overflow-hidden">
                                {/* Top gradient accent */}
                                <div className="h-1 bg-gradient-to-r from-[#3b82f6] via-[#8b5cf6] to-[#ec4899]" />

                                {/* Header */}
                                <div className="flex items-center justify-between p-6 pb-4 border-b border-[#1e1e22]">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-[#3b82f6]/15">
                                            <Sparkles className="w-5 h-5 text-[#3b82f6]" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-semibold text-white">Create New Form</h2>
                                            <p className="text-sm text-[#71717a] mt-0.5">Set up the basics, then add questions.</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setOpen(false)}
                                        className="p-2 rounded-lg text-[#71717a] hover:text-white hover:bg-[#1e1e22] transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Form */}
                                <form onSubmit={onSubmit}>
                                    <div className="p-6 space-y-6">
                                        {/* Title */}
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-sm font-medium text-[#e4e4e7]">
                                                <FileText className="w-4 h-4 text-[#71717a]" />
                                                Form Title
                                            </label>
                                            <input
                                                name="title"
                                                required
                                                placeholder="e.g. Hackathon Registration"
                                                className="w-full h-12 px-4 rounded-xl bg-[#141416] border border-[#27272a] text-white placeholder:text-[#52525b] focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/50 outline-none transition-all text-sm"
                                            />
                                        </div>

                                        {/* Description */}
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-sm font-medium text-[#e4e4e7]">
                                                <AlignLeft className="w-4 h-4 text-[#71717a]" />
                                                Description
                                                <span className="text-[#52525b]">(optional)</span>
                                            </label>
                                            <textarea
                                                name="description"
                                                placeholder="Briefly describe what this form is for..."
                                                rows={3}
                                                className="w-full px-4 py-3 rounded-xl bg-[#141416] border border-[#27272a] text-white placeholder:text-[#52525b] focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/50 outline-none transition-all text-sm resize-none"
                                            />
                                        </div>

                                        {/* Deadline */}
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-sm font-medium text-[#e4e4e7]">
                                                <CalendarIcon className="w-4 h-4 text-[#71717a]" />
                                                Deadline
                                                <span className="text-[#52525b]">(optional)</span>
                                            </label>
                                            <input
                                                name="deadline"
                                                type="datetime-local"
                                                className="w-full h-12 px-4 rounded-xl bg-[#141416] border border-[#27272a] text-white focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/50 outline-none transition-all text-sm [color-scheme:dark]"
                                            />
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex gap-3 p-6 pt-4 border-t border-[#1e1e22]">
                                        <button
                                            type="button"
                                            onClick={() => setOpen(false)}
                                            className="flex-1 h-11 rounded-xl bg-[#1e1e22] hover:bg-[#27272a] text-[#a1a1aa] hover:text-white text-sm font-medium transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="flex-1 h-11 rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] text-white text-sm font-medium transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Creating...
                                                </>
                                            ) : (
                                                "Continue to Builder →"
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
