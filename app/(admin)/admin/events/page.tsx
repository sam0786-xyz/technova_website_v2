import Link from "next/link"
import { Plus } from "lucide-react"
import { getEvents } from "@/lib/actions/events"

export default async function AdminEventsPage() {
    const events = await getEvents()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Events</h1>
                <Link href="/admin/events/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                    <Plus className="w-4 h-4" /> Create Event
                </Link>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-medium text-gray-500">Event Name</th>
                            <th className="p-4 font-medium text-gray-500">Date</th>
                            <th className="p-4 font-medium text-gray-500">Status</th>
                            <th className="p-4 font-medium text-gray-500">Capacity</th>
                            <th className="p-4 font-medium text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.length === 0 ? (
                            <tr>
                                <td className="p-4" colSpan={5}>
                                    <div className="text-center py-12 text-gray-500">
                                        No events found. Create your first event.
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            events.map((event: { id: string; title: string; start_time: string; status: string; capacity: number }) => (
                                <tr key={event.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4 font-medium"><Link href={`/events/${event.id}`} className="hover:underline">{event.title}</Link></td>
                                    <td className="p-4">{new Date(event.start_time).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs ${event.status === 'live' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {event.status}
                                        </span>
                                    </td>
                                    <td className="p-4">{event.capacity}</td>
                                    <td className="p-4 text-sm text-blue-600"><Link href={`/admin/events/${event.id}`}>Edit</Link></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
