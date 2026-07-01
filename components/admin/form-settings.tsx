"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
    Globe, Lock, Edit3, Users, MessageSquare, Calendar,
    Copy, Check, ExternalLink, Power, Loader2, Save
} from "lucide-react"
import { updateFormSettings } from "@/lib/actions/forms"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface FormSettingsProps {
    form: {
        id: string
        title: string
        description: string | null
        is_active: boolean
        is_published: boolean
        allow_edit: boolean
        show_referral: boolean
        confirmation_message: string | null
        deadline: string | null
    }
}

export function FormSettings({ form }: FormSettingsProps) {
    const [settings, setSettings] = useState({
        title: form.title,
        description: form.description || "",
        is_active: form.is_active ?? true,
        is_published: form.is_published ?? false,
        allow_edit: form.allow_edit ?? false,
        show_referral: form.show_referral ?? true,
        confirmation_message: form.confirmation_message || "",
        deadline: form.deadline ? new Date(form.deadline).toISOString().slice(0, 16) : "",
    })
    const [isSaving, setIsSaving] = useState(false)
    const [copied, setCopied] = useState(false)
    const router = useRouter()

    const shareUrl = typeof window !== "undefined"
        ? `${window.location.origin}/forms/${form.id}`
        : `https://technovashardauniversity.in/forms/${form.id}`

    const handleCopy = async () => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(shareUrl)
            } else {
                const textarea = document.createElement('textarea')
                textarea.value = shareUrl
                textarea.style.position = 'fixed'
                textarea.style.left = '-9999px'
                textarea.style.top = '-9999px'
                document.body.appendChild(textarea)
                textarea.focus()
                textarea.select()
                document.execCommand('copy')
                document.body.removeChild(textarea)
            }
            setCopied(true)
            toast.success("Link copied!")
            setTimeout(() => setCopied(false), 2000)
        } catch {
            window.prompt('Copy this link:', shareUrl)
        }
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            await updateFormSettings(form.id, {
                title: settings.title,
                description: settings.description || null,
                is_active: settings.is_active,
                is_published: settings.is_published,
                allow_edit: settings.allow_edit,
                show_referral: settings.show_referral,
                confirmation_message: settings.confirmation_message || null,
                deadline: settings.deadline || null,
            })
            toast.success("Settings saved!")
            router.refresh()
        } catch (err: any) {
            toast.error(err.message || "Failed to save settings")
        } finally {
            setIsSaving(false)
        }
    }

    const toggle = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }))
    }

    return (
        <div className="space-y-6">
            {/* Save button */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-end sticky top-0 z-30 bg-[#0a0a0b]/80 backdrop-blur-xl py-3"
            >
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 h-11 px-6 rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] text-white text-sm font-medium transition-all shadow-[0_0_20px_rgba(59,130,246,0.35)] disabled:opacity-50 active:scale-[0.97]"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Settings
                </button>
            </motion.div>

            {/* Form Details */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="bg-[#141416] border border-[#27272a] rounded-2xl p-6 space-y-5"
            >
                <h3 className="text-sm font-bold text-[#71717a] uppercase tracking-widest">Form Details</h3>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-[#e4e4e7]">Title</label>
                    <input
                        value={settings.title}
                        onChange={(e) => setSettings(s => ({ ...s, title: e.target.value }))}
                        className="w-full h-12 px-4 rounded-xl bg-[#0a0a0b] border border-[#27272a] text-white placeholder:text-[#3f3f46] focus:border-[#3b82f6] outline-none transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-[#e4e4e7]">Description</label>
                    <textarea
                        value={settings.description}
                        onChange={(e) => setSettings(s => ({ ...s, description: e.target.value }))}
                        rows={3}
                        onInput={(e) => { const t = e.target as HTMLTextAreaElement; t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px' }}
                        className="w-full px-4 py-3 rounded-xl bg-[#0a0a0b] border border-[#27272a] text-white placeholder:text-[#3f3f46] focus:border-[#3b82f6] outline-none transition-all resize-none overflow-hidden"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-[#e4e4e7] flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#71717a]" />
                        Deadline
                    </label>
                    <input
                        type="datetime-local"
                        value={settings.deadline}
                        onChange={(e) => setSettings(s => ({ ...s, deadline: e.target.value }))}
                        className="w-full h-12 px-4 rounded-xl bg-[#0a0a0b] border border-[#27272a] text-white focus:border-[#3b82f6] outline-none transition-all [color-scheme:dark]"
                    />
                </div>
            </motion.div>

            {/* Toggles */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#141416] border border-[#27272a] rounded-2xl divide-y divide-[#1e1e22]"
            >
                {/* Active */}
                <ToggleRow
                    icon={<Power className="w-5 h-5" />}
                    iconColor={settings.is_active ? "#22c55e" : "#71717a"}
                    title="Form Active"
                    description="When off, no new submissions are accepted."
                    checked={settings.is_active}
                    onToggle={() => toggle("is_active")}
                />

                {/* Published */}
                <ToggleRow
                    icon={<Globe className="w-5 h-5" />}
                    iconColor={settings.is_published ? "#3b82f6" : "#71717a"}
                    title="Published"
                    description="When on, the form is accessible via the share link."
                    checked={settings.is_published}
                    onToggle={() => toggle("is_published")}
                />

                {/* Allow editing */}
                <ToggleRow
                    icon={<Edit3 className="w-5 h-5" />}
                    iconColor={settings.allow_edit ? "#a78bfa" : "#71717a"}
                    title="Allow Editing"
                    description="Let respondents edit their submission after it's been submitted."
                    checked={settings.allow_edit}
                    onToggle={() => toggle("allow_edit")}
                />

                {/* Referral */}
                <ToggleRow
                    icon={<Users className="w-5 h-5" />}
                    iconColor={settings.show_referral ? "#f59e0b" : "#71717a"}
                    title="Show Referral Link"
                    description="Show a referral link after submission for respondents to share."
                    checked={settings.show_referral}
                    onToggle={() => toggle("show_referral")}
                />
            </motion.div>

            {/* Share Link */}
            {settings.is_published && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#141416] border border-[#3b82f6]/20 rounded-2xl p-6 space-y-4"
                >
                    <h3 className="text-sm font-bold text-[#3b82f6] uppercase tracking-widest flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Share Link
                    </h3>
                    <div className="flex gap-2">
                        <div className="flex-1 flex items-center px-4 h-11 rounded-xl bg-[#0a0a0b] border border-[#27272a] text-[#a1a1aa] text-sm font-mono truncate">
                            {shareUrl}
                        </div>
                        <button
                            onClick={handleCopy}
                            className="h-11 px-4 rounded-xl bg-[#1e1e22] hover:bg-[#27272a] text-white transition-all flex items-center gap-2 text-sm font-medium shrink-0"
                        >
                            {copied ? <Check className="w-4 h-4 text-[#22c55e]" /> : <Copy className="w-4 h-4" />}
                            {copied ? "Copied" : "Copy"}
                        </button>
                        <a
                            href={shareUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-11 w-11 rounded-xl bg-[#1e1e22] hover:bg-[#27272a] flex items-center justify-center text-[#71717a] hover:text-white transition-all shrink-0"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </motion.div>
            )}

            {/* Custom confirmation message */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-[#141416] border border-[#27272a] rounded-2xl p-6 space-y-4"
            >
                <h3 className="text-sm font-bold text-[#71717a] uppercase tracking-widest flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Confirmation Message
                </h3>
                <p className="text-xs text-[#52525b]">Custom message shown after someone submits the form. Leave empty for the default.</p>
                <textarea
                    value={settings.confirmation_message}
                    onChange={(e) => setSettings(s => ({ ...s, confirmation_message: e.target.value }))}
                    rows={3}
                    placeholder="Thank you for your response! We'll be in touch soon."
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0a0b] border border-[#27272a] text-white placeholder:text-[#3f3f46] focus:border-[#3b82f6] outline-none transition-all resize-none text-sm"
                />
            </motion.div>
        </div>
    )
}

function ToggleRow({ icon, iconColor, title, description, checked, onToggle }: {
    icon: React.ReactNode
    iconColor: string
    title: string
    description: string
    checked: boolean
    onToggle: () => void
}) {
    return (
        <div className="flex items-center justify-between p-5 gap-6">
            <div className="flex items-start gap-4">
                <div className="mt-0.5 transition-colors" style={{ color: iconColor }}>
                    {icon}
                </div>
                <div>
                    <p className="text-sm font-medium text-white">{title}</p>
                    <p className="text-xs text-[#71717a] mt-0.5">{description}</p>
                </div>
            </div>
            <button
                type="button"
                onClick={onToggle}
                className={`relative w-12 h-7 rounded-full transition-colors shrink-0 ${checked ? "bg-[#3b82f6]" : "bg-[#27272a]"}`}
            >
                <motion.div
                    layout
                    className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm"
                    style={{ left: checked ? "calc(100% - 24px)" : "4px" }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
            </button>
        </div>
    )
}
