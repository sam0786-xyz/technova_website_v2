import { getEventById } from "@/lib/actions/events"
import { getEventRegistrations } from "@/lib/actions/registrations"
import { notFound } from "next/navigation"
import { AdminEventClient } from "./client"

export default async function AdminEventPage({ params }: { params: { id: string } }) {
    const event = await getEventById(params.id)
    if (!event) notFound()

    const registrations = await getEventRegistrations(params.id)

    return (
        <AdminEventClient event={event} registrations={registrations} />
    )
}
