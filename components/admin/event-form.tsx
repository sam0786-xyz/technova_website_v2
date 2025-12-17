"use client"

import { useState } from "react"
import { createEvent, updateEvent } from "@/lib/actions/events"
import { FormBuilder, RegistrationField } from "./form-builder"
import { Loader2 } from "lucide-react"

interface EventFormProps {
    clubs: any[]
    event?: any // If provided, we are in edit mode
}

export function EventForm({ clubs, event }: EventFormProps) {
    const [loading, setLoading] = useState(false)
    const [isVirtual, setIsVirtual] = useState(event?.is_virtual || false)

    // Determine initial mode
    const initialPos = event?.banner_position || "center"
    const isCustom = initialPos.includes('%') || !['center', 'top', 'bottom', 'left', 'right'].includes(initialPos)

    const [bannerPosMode, setBannerPosMode] = useState(isCustom ? 'custom' : initialPos)
    const [bannerPosValue, setBannerPosValue] = useState(initialPos)

    const [questions, setQuestions] = useState<RegistrationField[]>(
        event?.registration_fields ? (typeof event.registration_fields === 'string' ? JSON.parse(event.registration_fields) : event.registration_fields) : []
    )

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        try {
            // Append questions as JSON
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

    return (
        <form action={handleSubmit} className="space-y-8">
            <div className="bg-white p-8 rounded-xl border shadow-sm space-y-6">
                <h2 className="text-lg font-semibold border-b pb-2">Basic Details</h2>

                <div>
                    <label className="block text-sm font-medium mb-1">Event Title</label>
                    <input name="title" required type="text" defaultValue={event?.title} className="w-full p-2 border rounded-md" placeholder="e.g. Technova Hackathon 2025" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Hosting Club (Primary)</label>
                        <select name="club_id" required defaultValue={event?.club_id || ""} className="w-full p-2 border rounded-md">
                            <option value="" disabled>Select Club</option>
                            {clubs.map((club: any) => (
                                <option key={club.id} value={club.id}>{club.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Co-Hosting Club (Optional)</label>
                        <select name="co_host_club_id" defaultValue={event?.co_host_club_id || "none"} className="w-full p-2 border rounded-md">
                            <option value="none">None</option>
                            {clubs.map((club: any) => (
                                <option key={club.id} value={club.id}>{club.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea name="description" required defaultValue={event?.description} className="w-full p-2 border rounded-md h-32" placeholder="Event details..." />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Banner Image</label>
                    {event?.banner && (
                        <div className="mb-2">
                            <img src={event.banner} alt="Current Banner" className="h-32 rounded-lg object-cover border" />
                            <p className="text-xs text-gray-500 mt-1">Current Banner URL: {event.banner}</p>
                            <input type="hidden" name="banner" value={event.banner} />
                        </div>
                    )}
                    <input name="banner_file" type="file" accept="image/*" className="w-full p-2 border rounded-md" />
                    <p className="text-xs text-gray-400 mt-1">Upload an image to replace the current one.</p>

                    <div>
                        <label className="block text-sm font-medium mb-1">Banner Position (Focus Point)</label>
                        <div className="flex flex-col gap-2">
                            <select
                                className="w-full p-2 border rounded-md"
                                value={bannerPosMode}
                                onChange={(e) => {
                                    const val = e.target.value
                                    setBannerPosMode(val)
                                    if (val !== 'custom') {
                                        setBannerPosValue(val)
                                    }
                                }}
                            >
                                <option value="center">Center</option>
                                <option value="top">Top</option>
                                <option value="bottom">Bottom</option>
                                <option value="left">Left</option>
                                <option value="right">Right</option>
                                <option value="custom">Custom (Coordinates)</option>
                            </select>

                            {bannerPosMode === 'custom' && (
                                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                                    <div className="flex-1">
                                        <label className="text-xs text-gray-500">Horizontal %</label>
                                        <input
                                            type="number"
                                            placeholder="50"
                                            min="0"
                                            max="100"
                                            className="w-full p-2 border rounded-md"
                                            defaultValue={bannerPosValue.includes('%') ? parseInt(bannerPosValue.split(' ')[0]) : 50}
                                            onChange={(e) => {
                                                const y = bannerPosValue.includes(' ') ? bannerPosValue.split(' ')[1] : '50%'
                                                setBannerPosValue(`${e.target.value}% ${y}`)
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-xs text-gray-500">Vertical %</label>
                                        <input
                                            type="number"
                                            placeholder="50"
                                            min="0"
                                            max="100"
                                            className="w-full p-2 border rounded-md"
                                            defaultValue={bannerPosValue.includes('%') && bannerPosValue.split(' ').length > 1 ? parseInt(bannerPosValue.split(' ')[1]) : 50}
                                            onChange={(e) => {
                                                const x = bannerPosValue.includes(' ') ? bannerPosValue.split(' ')[0] : '50%'
                                                setBannerPosValue(`${x} ${e.target.value}%`)
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                            <input type="hidden" name="banner_position" value={bannerPosValue} />
                            <p className="text-xs text-gray-400">Controls which part of the image is shown when cropped.</p>
                        </div>
                    </div>
                </div>

                {/* Virtual Event Logic */}
                <div className="flex items-center gap-2 border p-4 rounded-md bg-gray-50">
                    <input
                        type="checkbox"
                        name="is_virtual"
                        value="true"
                        id="is_virtual"
                        defaultChecked={event?.is_virtual}
                        onChange={(e) => setIsVirtual(e.target.checked)}
                        className="w-4 h-4"
                    />
                    <label htmlFor="is_virtual" className="font-medium cursor-pointer">This is a Virtual Event</label>
                </div>

                {isVirtual && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <label className="block text-sm font-medium mb-1">Meeting Link</label>
                        <input name="meeting_link" type="url" defaultValue={event?.meeting_link} className="w-full p-2 border rounded-md" placeholder="e.g. Google Meet or Zoom Link" />
                    </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Start Time</label>
                        <input name="start_time" required type="datetime-local" defaultValue={event?.start_time ? new Date(event.start_time).toISOString().slice(0, 16) : ""} className="w-full p-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">End Time</label>
                        <input name="end_time" required type="datetime-local" defaultValue={event?.end_time ? new Date(event.end_time).toISOString().slice(0, 16) : ""} className="w-full p-2 border rounded-md" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Venue {isVirtual ? "(or Physical Location for Hybrid)" : ""}</label>
                    <input name="venue" required={!isVirtual} type="text" defaultValue={event?.venue} className="w-full p-2 border rounded-md" placeholder={isVirtual ? "Optional if purely online" : "e.g. Auditorium"} />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Capacity</label>
                        <input name="capacity" required type="number" defaultValue={event?.capacity} className="w-full p-2 border rounded-md" placeholder="100" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Price (₹)</label>
                        <input name="price" required type="number" defaultValue={event?.price || 0} className="w-full p-2 border rounded-md" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select name="status" className="w-full p-2 border rounded-md" defaultValue={event?.status || "draft"}>
                        <option value="draft">Draft</option>
                        <option value="live">Live (Public)</option>
                    </select>
                </div>
            </div>

            <div className="bg-white p-8 rounded-xl border shadow-sm space-y-6">
                <h2 className="text-lg font-semibold border-b pb-2">Custom Questions</h2>
                <p className="text-sm text-gray-500">Add questions that students must answer when registering.</p>
                <FormBuilder fields={questions} onChange={setQuestions} />
            </div>

            <div className="flex justify-end gap-4">
                <button disabled={loading} type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 flex items-center gap-2">
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {event ? "Update Event" : "Create Event"}
                </button>
            </div>
        </form>
    )
}
