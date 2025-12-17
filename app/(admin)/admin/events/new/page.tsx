import { getClubs } from "@/lib/actions/clubs"
import { EventForm } from "@/components/admin/event-form"

export default async function CreateEventPage() {
    const clubs = await getClubs()

    return (
        <div className="max-w-3xl mx-auto pb-20">
            <h1 className="text-3xl font-bold mb-8">Create New Event</h1>
            <EventForm clubs={clubs} />
        </div>
    )
}
