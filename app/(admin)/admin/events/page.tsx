import Link from "next/link"
import { Plus, Calendar, Trash2, Edit, Eye, ExternalLink, History } from "lucide-react"
import { getEvents, deleteEvent } from "@/lib/actions/events"
import { formatDateShort } from "@/lib/utils"
import { auth } from "@/lib/auth"

export default async function AdminEventsPage() {
    const events = await getEvents()
    const session = await auth()
    const isSuperAdmin = session?.user?.role === 'super_admin'

    return (
        <div className="min-h-screen bg-black p-6 md:p-8">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Calendar className="w-8 h-8 text-blue-400" />
                            Events Management
                        </h1>
                        <p className="text-gray-400 mt-1">{events.length} events in total</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {isSuperAdmin && (
                            <Link
                                href="/admin/events/past/new"
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)]"
                            >
                                <History className="w-5 h-5" />
                                Add Past Event
                            </Link>
                        )}
                        <Link
                            href="/admin/events/new"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]"
                        >
                            <Plus className="w-5 h-5" />
                            Create Event
                        </Link>
                    </div>
                </div>

                {/* Events Table */}
                <div className="rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 border-b border-white/10">
                                <tr>
                                    <th className="p-4 font-medium text-gray-400 text-sm uppercase tracking-wide">Event Name</th>
                                    <th className="p-4 font-medium text-gray-400 text-sm uppercase tracking-wide">Date</th>
                                    <th className="p-4 font-medium text-gray-400 text-sm uppercase tracking-wide">Status</th>
                                    <th className="p-4 font-medium text-gray-400 text-sm uppercase tracking-wide">Capacity</th>
                                    <th className="p-4 font-medium text-gray-400 text-sm uppercase tracking-wide text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {events.length === 0 ? (
                                    <tr>
                                        <td className="p-4" colSpan={5}>
                                            <div className="text-center py-12">
                                                <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                                <p className="text-gray-400">No events found.</p>
                                                <p className="text-gray-500 text-sm mt-1">Create your first event to get started.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    events.map((event: { id: string; title: string; start_time: string; status: string; capacity: number }) => (
                                        <tr key={event.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="p-4">
                                                <Link href={`/admin/events/${event.id}`} className="font-medium text-white hover:text-blue-400 transition-colors">
                                                    {event.title}
                                                </Link>
                                            </td>
                                            <td className="p-4 text-gray-400">
                                                {formatDateShort(event.start_time)}
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${event.status === 'live'
                                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                    : event.status === 'draft'
                                                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                                    }`}>
                                                    {event.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-400">{event.capacity}</td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/events/${event.id}`}
                                                        target="_blank"
                                                        className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                                                        title="View Public Page"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </Link>
                                                    <Link
                                                        href={`/admin/events/${event.id}`}
                                                        className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                                                        title="Manage"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                    <Link
                                                        href={`/admin/events/${event.id}/edit`}
                                                        className="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                    <form action={deleteEvent.bind(null, event.id)}>
                                                        <button
                                                            type="submit"
                                                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </form>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
