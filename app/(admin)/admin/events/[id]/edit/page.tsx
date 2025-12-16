import { updateEvent, getEventById } from "@/lib/actions/events"
import { getClubs } from "@/lib/actions/clubs"
import { notFound } from "next/navigation"

export default async function EditEventPage({ params }: { params: { id: string } }) {
    const event = await getEventById(params.id)
    const clubs = await getClubs()

    if (!event) {
        notFound()
    }

    // Format datetime-local strings
    const formatDateTime = (dateStr: string) => {
        if (!dateStr) return ""
        return new Date(dateStr).toISOString().slice(0, 16)
    }

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Edit Event</h1>

            <div className="bg-white p-8 rounded-xl border shadow-sm">
                <form action={updateEvent} className="space-y-6">
                    <input type="hidden" name="id" value={event.id} />

                    <div>
                        <label className="block text-sm font-medium mb-1">Event Title</label>
                        <input name="title" required type="text" defaultValue={event.title} className="w-full p-2 border rounded-md" />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Hosting Club (Primary)</label>
                            <select name="club_id" required defaultValue={event.club_id} className="w-full p-2 border rounded-md">
                                <option value="" disabled>Select Club</option>
                                {clubs.map((club: any) => (
                                    <option key={club.id} value={club.id}>{club.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Co-Hosting Club (Optional)</label>
                            <select name="co_host_club_id" defaultValue={event.co_host_club_id || "none"} className="w-full p-2 border rounded-md">
                                <option value="none">None</option>
                                {clubs.map((club: any) => (
                                    <option key={club.id} value={club.id}>{club.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea name="description" required defaultValue={event.description} className="w-full p-2 border rounded-md h-32" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Banner URL (Optional)</label>
                        <input name="banner" type="url" defaultValue={event.banner_url || ""} className="w-full p-2 border rounded-md" />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Start Time</label>
                            <input name="start_time" required type="datetime-local" defaultValue={formatDateTime(event.start_time)} className="w-full p-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">End Time</label>
                            <input name="end_time" required type="datetime-local" defaultValue={formatDateTime(event.end_time)} className="w-full p-2 border rounded-md" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Venue</label>
                        <input name="venue" required type="text" defaultValue={event.venue} className="w-full p-2 border rounded-md" />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Capacity</label>
                            <input name="capacity" required type="number" defaultValue={event.capacity} className="w-full p-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Price (₹)</label>
                            <input name="price" required type="number" defaultValue={event.price} className="w-full p-2 border rounded-md" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Status</label>
                            <select name="status" defaultValue={event.status} className="w-full p-2 border rounded-md">
                                <option value="draft">Draft</option>
                                <option value="live">Live (Public)</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
