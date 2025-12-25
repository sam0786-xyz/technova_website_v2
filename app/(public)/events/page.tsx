import { getPublicEvents } from "@/lib/actions/events"
import Link from "next/link"
import { Calendar, MapPin, Clock, ArrowRight, Home, ChevronRight } from "lucide-react"

export default async function PublicEventsPage() {
    const allEvents = await getPublicEvents()
    const now = new Date()

    const upcomingEvents = allEvents.filter((event: any) => new Date(event.start_time) > now).sort((a: any, b: any) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    const pastEvents = allEvents.filter((event: any) => new Date(event.start_time) <= now).sort((a: any, b: any) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="container mx-auto py-24 px-4">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm mb-8">
                    <Link href="/" className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors">
                        <Home className="w-4 h-4" />
                        Home
                    </Link>
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                    <span className="text-white font-medium">Events</span>
                </nav>

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
                        <div className="text-center py-12 bg-white/[0.03] backdrop-blur-xl rounded-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
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
                        <div className="text-center py-12 bg-white/[0.03] backdrop-blur-xl rounded-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
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

                    <div className="bg-black/40 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden">
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
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl border border-white/10 hover:border-blue-500/30 transition-all duration-500 overflow-hidden group relative h-full shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_40px_rgba(59,130,246,0.15)]">
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2 z-10 shadow-lg">
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
                        <img
                            src={event.banner}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            style={{ objectPosition: event.banner_position || 'center' }}
                        />
                    ) : (
                        <Calendar className="w-12 h-12 text-blue-400" />
                    )}
                </div>
                <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                        {event.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                        {/* Price Badge */}
                        <div className={`text-xs px-2 py-1 rounded-md inline-block ${event.price === 0 ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"}`}>
                            {event.price === 0 ? "Free" : `₹${event.price}`}
                        </div>

                        {/* Virtual Badge */}
                        {event.is_virtual && (
                            <div className="text-xs px-2 py-1 rounded-md inline-block bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                {event.venue && event.venue.toLowerCase() !== 'online' ? 'Hybrid' : 'Virtual'}
                            </div>
                        )}
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
