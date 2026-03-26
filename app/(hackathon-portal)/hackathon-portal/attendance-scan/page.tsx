import { checkHackathonRole } from "@/lib/actions/hackathon"
import { redirect } from "next/navigation"
import AttendanceScannerClient from "./client"

export default async function AttendanceScanPage() {
    const { role } = await checkHackathonRole()

    // Only organizers and volunteers can scan
    if (role !== 'organizer' && role !== 'volunteer') {
        redirect("/hackathon-portal")
    }

    return <AttendanceScannerClient />
}
