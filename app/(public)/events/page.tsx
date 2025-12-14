import { getEvents } from "@/lib/actions/events"
import Link from "next/link"
import { Calendar, MapPin } from "lucide-react"

export default async function PublicEventsPage() {
    const events = await getEvents()

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="container mx-auto py-24 px-4">
                <h1 className="text-4xl font-bold text-center mb-4">Upcoming Events</h1>
                <p className="text-center text-gray-400 max-w-2xl mx-auto mb-12">
                    Join our workshops, hackathons, and tech talks.
                </p>

                {events.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-xl">No events scheduled yet.</p>
                        <p className="mt-2">Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event: { id: string; title: string; start_time: string; venue: string; price: number; status: string }) => (
                            <Link key={event.id} href={`/events/${event.id}`}>
                                <div className="bg-gray-900/50 rounded-xl border border-gray-800 hover:border-blue-500/30 transition-colors overflow-hidden group">
                                    <div className="h-40 bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center">
                                        <Calendar className="w-12 h-12 text-blue-400" />
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-bold group-hover:text-blue-400 transition-colors">{event.title}</h3>
                                            <span className={`text-xs px-2 py-1 rounded-full ${event.price === 0 ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                {event.price === 0 ? 'Free' : `₹${event.price}`}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(event.start_time).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                                            <MapPin className="w-4 h-4" />
                                            {event.venue}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
