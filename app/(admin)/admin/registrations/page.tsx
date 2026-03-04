import { getAllRegistrations } from "@/lib/actions/registrations"
import { RegistrationsTable } from "./registrations-table"

export default async function AdminRegistrationsPage() {
    const registrations = await getAllRegistrations()

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">All Registrations</h1>
            <RegistrationsTable registrations={registrations} />
        </div>
    )
}
