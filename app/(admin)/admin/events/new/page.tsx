import { createEvent } from "@/lib/actions/events"

export default function CreateEventPage() {
    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Create New Event</h1>

            <div className="bg-white p-8 rounded-xl border shadow-sm">
                <form action={createEvent} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Event Title</label>
                        <input name="title" required type="text" className="w-full p-2 border rounded-md" placeholder="e.g. Technova Hackathon 2025" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea name="description" required className="w-full p-2 border rounded-md h-32" placeholder="Event details..." />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Start Time</label>
                            <input name="start_time" required type="datetime-local" className="w-full p-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">End Time</label>
                            <input name="end_time" required type="datetime-local" className="w-full p-2 border rounded-md" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Venue</label>
                        <input name="venue" required type="text" className="w-full p-2 border rounded-md" placeholder="e.g. Auditorium" />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Capacity</label>
                            <input name="capacity" required type="number" className="w-full p-2 border rounded-md" placeholder="100" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Price (₹)</label>
                            <input name="price" required type="number" className="w-full p-2 border rounded-md" defaultValue="0" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Status</label>
                            <select name="status" className="w-full p-2 border rounded-md" defaultValue="draft">
                                <option value="draft">Draft</option>
                                <option value="live">Live (Public)</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Create Event</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
