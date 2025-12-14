import { auth } from "@/lib/auth"
import { Calendar, MapPin, Clock } from "lucide-react"
import { getEventById } from "@/lib/actions/events"
import { checkRegistration } from "@/lib/actions/registrations"
import { EventRegistrationCard } from "@/components/events/registration-card"
import { notFound } from "next/navigation"

export default async function EventPage({ params }: { params: { id: string } }) {
    const event = await getEventById(params.id)
    const session = await auth()

    if (!event) {
        notFound()
    }

    const existingRegistration = await checkRegistration(params.id)

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Banner */}
            <div className="h-64 md:h-96 w-full bg-gray-900 relative">
                <div className="absolute inset-0 flex items-center justify-center text-gray-700">
                    {event.banner_url ? (
                        <img src={event.banner_url} alt={event.title} className="w-full h-full object-cover opacity-80" />
                    ) : "No Banner"}
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-20 relative z-10">
                <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                    <div className="p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                            <div className="flex-1">
                                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
                                    {event.price === 0 ? "Free Event" : `₹${event.price}`}
                                </span>
                                <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
                                <div className="flex flex-wrap gap-6 text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-blue-500" />
                                        <span>{new Date(event.start_time).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-blue-500" />
                                        <span>{new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-blue-500" />
                                        <span>{event.venue}</span>
                                    </div>
                                </div>
                            </div>

                            <EventRegistrationCard event={event} user={session?.user ?? null} existingRegistration={existingRegistration} />
                        </div>

                        <hr className="my-8" />

                        <div className="prose max-w-none">
                            <h2 className="text-2xl font-bold mb-4">About this Event</h2>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{event.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
