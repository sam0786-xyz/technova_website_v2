import { getEventById } from "@/lib/actions/events"
import { getClubs } from "@/lib/actions/clubs"
import { notFound } from "next/navigation"
import { EventForm } from "@/components/admin/event-form"

export default async function EditEventPage({ params }: { params: { id: string } }) {
    const event = await getEventById(params.id)
    const clubs = await getClubs()

    if (!event) {
        notFound()
    }

    return (
        <div className="max-w-3xl mx-auto pb-20">
            <h1 className="text-3xl font-bold mb-8">Edit Event</h1>
            <EventForm clubs={clubs} event={event} />
        </div>
    )
}
