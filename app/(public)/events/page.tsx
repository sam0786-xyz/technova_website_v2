import { getPublicEvents } from "@/lib/actions/events"
import Link from "next/link"
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react"

export default async function PublicEventsPage() {
    const allEvents = await getPublicEvents()
    const now = new Date()

    const upcomingEvents = allEvents.filter((event: any) => new Date(event.start_time) > now).sort((a: any, b: any) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    const pastEvents = allEvents.filter((event: any) => new Date(event.start_time) <= now).sort((a: any, b: any) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="container mx-auto py-24 px-4">
                <h1 className="text-4xl font-bold text-center mb-4">Events</h1>
                <p className="text-center text-gray-400 max-w-2xl mx-auto mb-12">
                    Join our workshops, hackathons, and tech talks.
                </p>

                {/* UPCOMING EVENTS */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-blue-500" /> Upcoming Events
                    </h2>
                    {upcomingEvents.length === 0 ? (
                        <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-gray-400">No upcoming events scheduled.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {upcomingEvents.map((event: any) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    )}
                </div>

                {/* PAST EVENTS */}
                <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-400">
                        <Clock className="w-6 h-6" /> Past Events
                    </h2>
                    {pastEvents.length === 0 ? (
                        <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-gray-400">No past events found.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-80 hover:opacity-100 transition-opacity">
                            {pastEvents.map((event: any) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    )}
                </div>

                {/* CALENDAR SECTION */}
                <div className="mt-20 pt-12 border-t border-white/10">
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-green-500" /> Event Calendar
                    </h2>

                    <div className="bg-white/5 p-4 rounded-3xl border border-white/10 shadow-xl overflow-hidden">
                        <iframe
                            src="https://calendar.google.com/calendar/embed?src=technova%40sharda.ac.in&ctz=Asia%2FKolkata&bgcolor=%23000000&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&showTz=1"
                            style={{ border: 0 }}
                            width="100%"
                            height="600"
                            frameBorder="0"
                            scrolling="no"
                            className="rounded-2xl w-full grayscale hover:grayscale-0 transition-all duration-500"
                        ></iframe>
                    </div>

                    <div className="text-center mt-6">
                        <Link href="https://calendar.google.com/calendar/u/0?cid=dGVjaG5vdmFAc2hhcmRhLmac.in" target="_blank" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors border border-white/10 px-4 py-2 rounded-full hover:bg-white/5">
                            Subscribe to Calendar <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

function EventCard({ event }: { event: any }) {
    return (
        <Link href={`/events/${event.id}`}>
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 hover:border-blue-500/30 transition-colors overflow-hidden group relative h-full">
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2 z-10">
                    {event.club?.logo_url && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={event.club.logo_url} alt={event.club.name} className="w-4 h-4 object-contain rounded-full" />
                    )}
                    <span className="text-xs font-medium text-white max-w-[100px] truncate">
                        {event.club?.name || 'Technova'}
                    </span>
                </div>
                <div className="h-40 bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center overflow-hidden">
                    {event.banner ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={event.banner} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                        <Calendar className="w-12 h-12 text-blue-400" />
                    )}
                </div>
                <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold group-hover:text-blue-400 transition-colors line-clamp-1">{event.title}</h3>
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
    )
}
