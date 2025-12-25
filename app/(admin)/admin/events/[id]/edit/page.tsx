import { getEventById } from "@/lib/actions/events"
import { getClubs } from "@/lib/actions/clubs"
import { notFound } from "next/navigation"
import { EventForm } from "@/components/admin/event-form"

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const event = await getEventById(id)
    const clubs = await getClubs()

    if (!event) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-black p-6 md:p-8">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative max-w-3xl mx-auto pb-20">
                <h1 className="text-3xl font-bold mb-8 text-white">Edit Event</h1>
                <EventForm clubs={clubs} event={event} />
            </div>
        </div>
    )
}
