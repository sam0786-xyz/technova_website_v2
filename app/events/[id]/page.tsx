import { auth } from "@/lib/auth"
import { Calendar, MapPin, Clock, Users, Globe, ArrowLeft, Video, CalendarDays } from "lucide-react"
import Link from "next/link"
import { getEventById } from "@/lib/actions/events"
import { checkRegistration } from "@/lib/actions/registrations"
import { EventRegistrationCard } from "@/components/events/registration-card"
import { POCCard } from "@/components/events/poc-card"
import { EventFeedbackSection } from "@/components/events/EventFeedbackSection"
import { notFound } from "next/navigation"
import { generateQRToken } from "@/lib/qr/generate"
import { createClient } from "@supabase/supabase-js"
import { formatDate, formatDateRange, formatTime } from "@/lib/utils"

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const event = await getEventById(id)
    const session = await auth()

    if (!event) {
        notFound()
    }

    const existingRegistration = await checkRegistration(id)

    const user = session?.user || null
    let qrCode = null

    if (existingRegistration && session?.user?.id) {
        // Generate QR Code for display - only for in-person events with a token
        if (!event.is_virtual && existingRegistration.qr_token_id) {
            const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!
            )
            const { data: userProfile } = await supabase.schema('next_auth').from('users').select('*').eq('id', session.user.id).single()

            const userData = {
                name: userProfile?.name || session.user.name || '',
                system_id: userProfile?.system_id || '',
                year: userProfile?.year?.toString() || '',
                course: userProfile?.course || '',
                section: userProfile?.section || '',
                email: session.user.email || ''
            }

            const { qrDataUrl } = await generateQRToken(
                session.user.id,
                id,
                userData,
                existingRegistration.qr_token_id
            )
            qrCode = qrDataUrl
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <div className="h-64 md:h-96 w-full bg-gray-900 relative">
                <div className="absolute inset-0 flex items-center justify-center text-gray-700">
                    {event.banner ? (
                        <img
                            src={event.banner}
                            alt={event.title}
                            className="w-full h-full object-cover opacity-80"
                            style={{ objectPosition: event.banner_position || 'center' }}
                        />
                    ) : "No Banner"}
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-20 relative z-10">
                <Link href="/events" className="inline-flex items-center text-white mb-6 hover:text-blue-400 transition-colors">
                    <div className="bg-black/50 backdrop-blur-sm p-2 rounded-full mr-2 border border-white/20">
                        <ArrowLeft className="w-5 h-5" />
                    </div>
                    <span className="font-medium drop-shadow-md">Back to Events</span>
                </Link>

                {/* Card 1: Heading & Meta */}
                <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                    <div className="p-8">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-wrap gap-2">
                                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                    {event.price === 0 ? "Free Event" : `₹${event.price} `}
                                </span>
                                {event.is_virtual && (
                                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                        {event.venue && event.venue.toLowerCase() !== 'online' ? 'Hybrid Event' : 'Virtual Event'}
                                    </span>
                                )}
                            </div>

                            {event.club && (
                                <div className="flex items-center gap-2">
                                    {event.club.logo_url && (
                                        <img src={event.club.logo_url} alt={event.club.name} className="w-6 h-6 object-contain rounded-full" />
                                    )}
                                    <span className="text-gray-500 font-medium">Organized by <span className="text-blue-600">{event.club.name}</span></span>
                                </div>
                            )}

                            <h1 className="text-4xl font-bold">{event.title}</h1>

                            <div className="flex flex-wrap gap-6 text-gray-600">
                                {event.is_multi_day ? (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <CalendarDays className="w-5 h-5 text-purple-500" />
                                            <span>{formatDateRange(event.start_time, event.end_time)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-5 h-5 text-purple-500" />
                                            <span>
                                                {event.daily_start_time?.slice(0, 5)} - {event.daily_end_time?.slice(0, 5)} daily
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-blue-500" />
                                            <span>{formatDate(event.start_time)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-5 h-5 text-blue-500" />
                                            <span>{formatTime(event.start_time)} - {formatTime(event.end_time)}</span>
                                        </div>
                                    </>
                                )}
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-blue-500" />
                                    <span>{event.venue || "Online"}</span>
                                </div>
                                {event.is_virtual && event.meeting_link && (
                                    <div className="flex items-center gap-2">
                                        <Video className="w-5 h-5 text-purple-500" />
                                        <a href={event.meeting_link} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline font-medium">
                                            Join Meeting
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 2: About + Right Sidebar */}
                <div className="mt-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2">
                            <div className="bg-white rounded-xl shadow-xl p-8">
                                <h2 className="text-2xl font-bold mb-4">About this Event</h2>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{event.description}</p>
                            </div>

                            {/* Feedback Section */}
                            <EventFeedbackSection
                                eventId={event.id}
                                userId={session?.user?.id}
                                isRegistered={!!existingRegistration}
                                eventEnded={new Date(event.end_time) < new Date()}
                            />
                        </div>
                        <div className="md:sticky md:top-24">
                            <div className="bg-white rounded-xl shadow-xl p-6">
                                <EventRegistrationCard
                                    event={event}
                                    user={user}
                                    existingRegistration={existingRegistration}
                                    qrCode={qrCode}
                                />
                                <POCCard
                                    name={event.poc_name}
                                    email={event.poc_email}
                                    phone={event.poc_phone}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
