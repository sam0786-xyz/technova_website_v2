'use client'

import { getPublicEvents } from "@/lib/actions/events"
import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, MapPin, Clock, ArrowRight, Home, ChevronRight, Sparkles, History, CalendarDays } from "lucide-react"
import { formatDateShort, formatDateRange } from "@/lib/utils"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { RevealOnScroll, StaggerContainer, StaggerItem } from "@/components/ui/reveal-on-scroll"
import { useEffect, useState } from "react"

export default function PublicEventsPage() {
    const [allEvents, setAllEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchEvents() {
            const events = await getPublicEvents()
            setAllEvents(events)
            setLoading(false)
        }
        fetchEvents()
    }, [])

    const now = new Date()
    // Filter events: past if is_past_event=true OR status='completed' OR start_time has passed
    const upcomingEvents = allEvents.filter((event: any) =>
        !event.is_past_event && event.status !== 'completed' && new Date(event.start_time) > now
    ).sort((a: any, b: any) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())

    const pastEvents = allEvents.filter((event: any) =>
        event.is_past_event || event.status === 'completed' || new Date(event.start_time) <= now
    ).sort((a: any, b: any) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden">
            <AnimatedBackground variant="default" intensity="low" />

            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />

                <div className="container mx-auto px-4 relative z-10">
                    {/* Breadcrumb */}
                    <motion.nav
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-sm mb-8"
                    >
                        <Link href="/" className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors">
                            <Home className="w-4 h-4" /> Home
                        </Link>
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                        <span className="text-blue-400 font-medium">Events</span>
                    </motion.nav>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-xl mb-6">
                            <CalendarDays className="w-4 h-4 text-blue-400" />
                            <span className="text-blue-400 font-medium text-sm">Upcoming & Past Events</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
                            Events & Workshops
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Join our workshops, hackathons, and tech talks. Learn, collaborate, and grow.
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="container mx-auto px-4 relative z-10 pb-24">
                {loading ? (
                    <div className="text-center py-20">
                        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-gray-400">Loading events...</p>
                    </div>
                ) : (
                    <>
                        {/* UPCOMING EVENTS */}
                        <section className="mb-20">
                            <RevealOnScroll>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <h2 className="text-2xl font-bold">Upcoming Events</h2>
                                    <div className="flex-1 h-px bg-gradient-to-r from-blue-500/30 to-transparent ml-4" />
                                </div>
                            </RevealOnScroll>

                            {upcomingEvents.length === 0 ? (
                                <RevealOnScroll>
                                    <div className="text-center py-16 bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10">
                                        <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                        <p className="text-gray-400">No upcoming events scheduled.</p>
                                        <p className="text-gray-500 text-sm mt-2">Check back soon for new events!</p>
                                    </div>
                                </RevealOnScroll>
                            ) : (
                                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {upcomingEvents.map((event: any, idx: number) => (
                                        <StaggerItem key={event.id}>
                                            <EventCard event={event} />
                                        </StaggerItem>
                                    ))}
                                </StaggerContainer>
                            )}
                        </section>

                        {/* PAST EVENTS - Timeline Style */}
                        <section className="mb-20">
                            <RevealOnScroll>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 bg-gray-600/20 rounded-xl flex items-center justify-center">
                                        <History className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-300">Past Events</h2>
                                    <div className="flex-1 h-px bg-gradient-to-r from-gray-500/30 to-transparent ml-4" />
                                </div>
                            </RevealOnScroll>

                            {pastEvents.length === 0 ? (
                                <RevealOnScroll>
                                    <div className="text-center py-16 bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10">
                                        <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                        <p className="text-gray-400">No past events yet.</p>
                                    </div>
                                </RevealOnScroll>
                            ) : (
                                <div className="relative">
                                    {/* Timeline line */}
                                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-purple-500/30 to-transparent" />

                                    <div className="space-y-8">
                                        {pastEvents.slice(0, 6).map((event: any, idx: number) => (
                                            <RevealOnScroll key={event.id} delay={idx * 0.1}>
                                                <TimelineEventCard event={event} index={idx} />
                                            </RevealOnScroll>
                                        ))}
                                    </div>

                                    {pastEvents.length > 6 && (
                                        <div className="text-center mt-12">
                                            <span className="text-gray-500 text-sm">
                                                And {pastEvents.length - 6} more past events...
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </section>

                        {/* CALENDAR SECTION */}
                        <section className="pt-12 border-t border-white/10">
                            <RevealOnScroll>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 bg-emerald-600/20 rounded-xl flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <h2 className="text-2xl font-bold">Event Calendar</h2>
                                    <div className="flex-1 h-px bg-gradient-to-r from-emerald-500/30 to-transparent ml-4" />
                                </div>
                            </RevealOnScroll>

                            <RevealOnScroll delay={0.2}>
                                <div className="bg-black/40 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden">
                                    <iframe
                                        src="https://calendar.google.com/calendar/embed?src=technova%40sharda.ac.in&ctz=Asia%2FKolkata&bgcolor=%23000000&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&showTz=1"
                                        style={{ border: 0 }}
                                        width="100%"
                                        height="600"
                                        frameBorder="0"
                                        scrolling="no"
                                        className="rounded-2xl w-full"
                                    ></iframe>
                                </div>
                            </RevealOnScroll>

                            <div className="text-center mt-8">
                                <Link href="https://calendar.google.com/calendar/u/0?cid=dGVjaG5vdmFAc2hhcmRhLmFjLmlu" target="_blank" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                                    Add to your Google Calendar <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </section>
                    </>
                )}
            </div>
        </div>
    )
}

function EventCard({ event }: { event: any }) {
    return (
        <Link href={`/events/${event.id}`} className="block h-full">
            <motion.div
                className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all duration-500 overflow-hidden group relative h-full shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_40px_rgba(59,130,246,0.15)]"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
            >
                {/* Club Badge */}
                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2 z-10 shadow-lg">
                    {event.club?.logo_url && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={event.club.logo_url} alt={event.club.name} className="w-4 h-4 object-contain rounded-full" />
                    )}
                    <span className="text-xs font-medium text-white max-w-[100px] truncate">
                        {event.club?.name || 'Technova'}
                    </span>
                </div>

                {/* Banner */}
                <div className="h-44 bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center overflow-hidden relative">
                    {event.banner ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                            src={event.banner}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            style={{ objectPosition: event.banner_position || 'center' }}
                        />
                    ) : (
                        <Calendar className="w-12 h-12 text-blue-400/50" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                        {event.title}
                    </h3>

                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full ${event.price === 0 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"}`}>
                            {event.price === 0 ? "Free" : `₹${event.price}`}
                        </span>
                        {event.is_virtual && (
                            <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                {event.venue && event.venue.toLowerCase() !== 'online' ? 'Hybrid' : 'Virtual'}
                            </span>
                        )}
                        {event.is_multi_day && (
                            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                Multi-Day
                            </span>
                        )}
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-400" />
                            {event.is_multi_day ? formatDateRange(event.start_time, event.end_time) : formatDateShort(event.start_time)}
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-purple-400" />
                            <span className="truncate">{event.venue}</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    )
}

function TimelineEventCard({ event, index }: { event: any; index: number }) {
    const isLeft = index % 2 === 0

    return (
        <div className={`relative flex items-center ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row`}>
            {/* Timeline dot */}
            <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-blue-500 rounded-full transform md:-translate-x-1/2 z-10 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />

            {/* Content */}
            <div className={`w-full md:w-[45%] ${isLeft ? 'md:pr-8 md:text-right' : 'md:pl-8'} pl-12 md:pl-0`}>
                <Link href={`/events/${event.id}`}>
                    <motion.div
                        className="bg-white/[0.02] backdrop-blur-xl rounded-xl border border-white/10 hover:border-blue-500/20 p-5 transition-all duration-300 hover:bg-white/[0.04] group"
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className={`flex items-center gap-3 mb-3 ${isLeft ? 'md:justify-end' : ''}`}>
                            {event.club?.logo_url && (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img src={event.club.logo_url} alt={event.club?.name} className="w-6 h-6 rounded-full" />
                            )}
                            <span className="text-xs text-gray-500">
                                {formatDateShort(event.start_time)}
                            </span>
                        </div>
                        <h3 className="font-bold text-lg group-hover:text-blue-400 transition-colors mb-2">
                            {event.title}
                        </h3>
                        <div className={`flex items-center gap-2 text-sm text-gray-500 ${isLeft ? 'md:justify-end' : ''}`}>
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{event.venue}</span>
                        </div>
                    </motion.div>
                </Link>
            </div>
        </div>
    )
}
