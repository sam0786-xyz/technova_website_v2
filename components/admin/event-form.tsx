"use client"

import { useState, useRef, MouseEvent } from "react"
import { createEvent, updateEvent } from "@/lib/actions/events"
import { FormBuilder, RegistrationField } from "./form-builder"
import { Loader2, Move } from "lucide-react"

interface EventFormProps {
    clubs: any[]
    event?: any
}

export function EventForm({ clubs, event }: EventFormProps) {
    const [loading, setLoading] = useState(false)
    const [isVirtual, setIsVirtual] = useState(event?.is_virtual || false)

    // Banner position state
    const initialPos = event?.banner_position || "center"
    const isCustom = initialPos.includes('%') || !['center', 'top', 'bottom', 'left', 'right'].includes(initialPos)

    const [bannerPosMode, setBannerPosMode] = useState(isCustom ? 'custom' : initialPos)
    const [bannerPosValue, setBannerPosValue] = useState(initialPos)
    const [posX, setPosX] = useState(isCustom ? parseInt(initialPos.split(' ')[0]) || 50 : 50)
    const [posY, setPosY] = useState(isCustom && initialPos.split(' ').length > 1 ? parseInt(initialPos.split(' ')[1]) || 50 : 50)

    const [previewUrl, setPreviewUrl] = useState<string | null>(event?.banner || null)
    const positionRef = useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = useState(false)

    const [questions, setQuestions] = useState<RegistrationField[]>(
        event?.registration_fields ? (typeof event.registration_fields === 'string' ? JSON.parse(event.registration_fields) : event.registration_fields) : []
    )

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        try {
            formData.set('registration_fields', JSON.stringify(questions))
            if (event) {
                formData.set('id', event.id)
                await updateEvent(formData)
            } else {
                await createEvent(formData)
            }
        } catch (error) {
            console.error(error)
            alert("Something went wrong")
            setLoading(false)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
            setBannerPosMode('custom')
        }
    }

    const handlePositionDrag = (e: MouseEvent<HTMLDivElement>) => {
        if (!positionRef.current) return
        const rect = positionRef.current.getBoundingClientRect()
        const x = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100))
        const y = Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100))
        setPosX(Math.round(x))
        setPosY(Math.round(y))
        const newValue = `${Math.round(x)}% ${Math.round(y)}%`
        setBannerPosValue(newValue)
    }

    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        setIsDragging(true)
        handlePositionDrag(e)
    }

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (isDragging) handlePositionDrag(e)
    }

    const handleMouseUp = () => setIsDragging(false)

    return (
        <form action={handleSubmit} className="space-y-8">
            <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl space-y-6">
                <h2 className="text-lg font-semibold text-white border-b border-white/10 pb-3">Basic Details</h2>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Event Title</label>
                    <input name="title" required type="text" defaultValue={event?.title} className="w-full p-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50" placeholder="e.g. Technova Hackathon 2025" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Hosting Club</label>
                        <select name="club_id" required defaultValue={event?.club_id || ""} className="w-full p-3 bg-black/50 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none">
                            <option value="" disabled>Select Club</option>
                            {clubs.map((club: any) => (
                                <option key={club.id} value={club.id}>{club.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Co-Hosting Club (Optional)</label>
                        <select name="co_host_club_id" defaultValue={event?.co_host_club_id || "none"} className="w-full p-3 bg-black/50 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none">
                            <option value="none">None</option>
                            {clubs.map((club: any) => (
                                <option key={club.id} value={club.id}>{club.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                    <textarea name="description" required defaultValue={event?.description} className="w-full p-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-500 h-32 focus:border-blue-500 focus:outline-none" placeholder="Event details..." />
                </div>

                {/* Banner with Draggable Position Picker */}
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-300">Banner Image</label>
                    <input name="banner_file" type="file" accept="image/*" onChange={handleFileChange} className="w-full p-3 bg-black/50 border border-white/10 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer" />
                    {event?.banner && <input type="hidden" name="banner" value={event.banner} />}

                    {previewUrl && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Move className="w-4 h-4" />
                                <span>Click on the image to set focus point for cropping</span>
                            </div>
                            <div
                                ref={positionRef}
                                className="relative w-full h-48 rounded-xl overflow-hidden border border-white/10 cursor-crosshair select-none"
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={previewUrl} alt="Banner Preview" className="w-full h-full object-cover" style={{ objectPosition: bannerPosValue }} />

                                {/* Focus Crosshair */}
                                <div
                                    className="absolute w-6 h-6 border-2 border-blue-500 rounded-full bg-blue-500/30 -translate-x-1/2 -translate-y-1/2 pointer-events-none shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                    style={{ left: `${posX}%`, top: `${posY}%` }}
                                >
                                    <div className="absolute inset-1 rounded-full bg-blue-500" />
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                                <span className="text-gray-400">Position:</span>
                                <span className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-400 font-mono">{bannerPosValue}</span>
                            </div>
                        </div>
                    )}
                    <input type="hidden" name="banner_position" value={bannerPosValue} />
                </div>

                {/* Virtual Event */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                    <input type="checkbox" name="is_virtual" value="true" id="is_virtual" defaultChecked={event?.is_virtual} onChange={(e) => setIsVirtual(e.target.checked)} className="w-5 h-5 rounded border-white/20 bg-black text-blue-600 focus:ring-blue-500/50" />
                    <label htmlFor="is_virtual" className="font-medium text-white cursor-pointer">This is a Virtual Event</label>
                </div>

                {isVirtual && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Meeting Link</label>
                        <input name="meeting_link" type="url" defaultValue={event?.meeting_link} className="w-full p-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none" placeholder="e.g. Google Meet or Zoom Link" />
                    </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Start Time</label>
                        <input name="start_time" required type="datetime-local" defaultValue={event?.start_time ? new Date(event.start_time).toISOString().slice(0, 16) : ""} className="w-full p-3 bg-black/50 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">End Time</label>
                        <input name="end_time" required type="datetime-local" defaultValue={event?.end_time ? new Date(event.end_time).toISOString().slice(0, 16) : ""} className="w-full p-3 bg-black/50 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Venue {isVirtual ? "(Physical Location for Hybrid)" : ""}</label>
                    <input name="venue" required={!isVirtual} type="text" defaultValue={event?.venue} className="w-full p-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none" placeholder={isVirtual ? "Optional if purely online" : "e.g. Auditorium"} />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Capacity</label>
                        <input name="capacity" required type="number" defaultValue={event?.capacity} className="w-full p-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none" placeholder="100" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Price (₹)</label>
                        <input name="price" required type="number" defaultValue={event?.price || 0} className="w-full p-3 bg-black/50 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                    <select name="status" className="w-full p-3 bg-black/50 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none" defaultValue={event?.status || "draft"}>
                        <option value="draft">Draft</option>
                        <option value="live">Live (Public)</option>
                    </select>
                </div>
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl space-y-6">
                <h2 className="text-lg font-semibold text-white border-b border-white/10 pb-3">Custom Questions</h2>
                <p className="text-sm text-gray-400">Add questions for registration. Toggle required to make them mandatory.</p>
                <FormBuilder fields={questions} onChange={setQuestions} />
            </div>

            <div className="flex justify-end gap-4">
                <button disabled={loading} type="submit" className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-8 py-3 rounded-xl font-medium disabled:opacity-50 flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all">
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {event ? "Update Event" : "Create Event"}
                </button>
            </div>
        </form>
    )
}
