"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, History, Upload, X } from "lucide-react"
import { Toast, useToast } from "@/components/ui/toast"
import Image from "next/image"

interface PastEventFormProps {
    clubs: { id: string; name: string }[]
}

export function PastEventForm({ clubs }: PastEventFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const { toast, showToast, hideToast } = useToast()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setPreviewUrl(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        try {
            const formData = new FormData(e.currentTarget)

            const response = await fetch('/api/events/past', {
                method: 'POST',
                body: formData
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || 'Failed to create past event')
            }

            showToast("Past event created successfully!", "success")
            setTimeout(() => {
                router.push('/admin/events')
                router.refresh()
            }, 1500)
        } catch (error: any) {
            console.error("Error:", error)
            showToast(error.message || "Something went wrong", "error")
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Title */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Event Title *
                </label>
                <input
                    type="text"
                    name="title"
                    required
                    placeholder="e.g., Hackathon 2024"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
            </div>

            {/* Club Selection */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Organizing Club *
                </label>
                <select
                    name="club_id"
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                    <option value="">Select a club</option>
                    {clubs.map(club => (
                        <option key={club.id} value={club.id}>{club.name}</option>
                    ))}
                </select>
            </div>

            {/* Event Date */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Event Date *
                </label>
                <input
                    type="date"
                    name="event_date"
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
            </div>

            {/* Attendance Count */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Attendance Count *
                </label>
                <input
                    type="number"
                    name="attendance_count"
                    min="1"
                    required
                    placeholder="Number of attendees"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <p className="text-sm text-gray-500 mt-1">Used for statistics and capacity tracking</p>
            </div>

            {/* Banner Upload */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Event Banner
                </label>
                <div className="relative">
                    {previewUrl ? (
                        <div className="relative rounded-xl overflow-hidden">
                            <Image
                                src={previewUrl}
                                alt="Banner preview"
                                width={600}
                                height={300}
                                className="w-full h-48 object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => setPreviewUrl(null)}
                                className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-black/70"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-blue-500/50 transition-colors">
                            <Upload className="w-8 h-8 text-gray-500 mb-2" />
                            <span className="text-gray-400">Click to upload banner</span>
                            <span className="text-gray-500 text-sm mt-1">PNG, JPG up to 5MB</span>
                            <input
                                type="file"
                                name="banner"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
                    )}
                </div>
            </div>

            {/* Description (Optional) */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Short Description (Optional)
                </label>
                <textarea
                    name="description"
                    rows={3}
                    placeholder="Brief description of the event..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white rounded-xl font-medium disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)]"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Creating...
                        </>
                    ) : (
                        <>
                            <History className="w-4 h-4" />
                            Add Past Event
                        </>
                    )}
                </button>
            </div>

            {/* Toast */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={hideToast}
                />
            )}
        </form>
    )
}
