import { checkHackathonRole } from "@/lib/actions/hackathon"
import { redirect } from "next/navigation"
import GateScannerClient from "./client"

export default async function GateScanPage() {
    const { role } = await checkHackathonRole()
    if (role !== 'organizer' && role !== 'volunteer') redirect("/")
    return <GateScannerClient />
}
