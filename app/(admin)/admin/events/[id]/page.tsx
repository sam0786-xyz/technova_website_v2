import { getEventById } from "@/lib/actions/events"
import { getEventRegistrations } from "@/lib/actions/registrations"
import { notFound } from "next/navigation"
import { AdminEventClient } from "./client"

export default async function AdminEventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const event = await getEventById(id)
    if (!event) notFound()

    const registrations = await getEventRegistrations(id)

    return (
        <AdminEventClient event={event} registrations={registrations} />
    )
}
