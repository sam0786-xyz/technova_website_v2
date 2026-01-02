import { getEventById } from "@/lib/actions/events"
import { getClubs } from "@/lib/actions/clubs"
import { notFound } from "next/navigation"
import { EventForm } from "@/components/admin/event-form"
import { PastEventForm } from "@/components/admin/past-event-form"
import { History } from "lucide-react"

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const event = await getEventById(id)
    const clubs = await getClubs()

    if (!event) {
        notFound()
    }

    // Check if this is a past event
    const isPastEvent = event.is_past_event || event.status === 'completed'

    return (
        <div className="min-h-screen bg-black p-6 md:p-8">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className={`absolute top-0 right-0 w-[500px] h-[500px] ${isPastEvent ? 'bg-purple-600/10' : 'bg-blue-600/10'} rounded-full blur-[150px]`} />
                <div className={`absolute bottom-0 left-0 w-[400px] h-[400px] ${isPastEvent ? 'bg-blue-600/10' : 'bg-purple-600/10'} rounded-full blur-[120px]`} />
            </div>

            <div className="relative max-w-3xl mx-auto pb-20">
                {isPastEvent ? (
                    <>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-purple-500/20 rounded-xl">
                                <History className="w-6 h-6 text-purple-400" />
                            </div>
                            <h1 className="text-3xl font-bold text-white">Edit Past Event</h1>
                        </div>
                        <div className="rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl p-6 md:p-8">
                            <PastEventForm clubs={clubs} event={event} />
                        </div>
                    </>
                ) : (
                    <>
                        <h1 className="text-3xl font-bold mb-8 text-white">Edit Event</h1>
                        <EventForm clubs={clubs} event={event} />
                    </>
                )}
            </div>
        </div>
    )
}
