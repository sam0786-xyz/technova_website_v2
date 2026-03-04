import { NextResponse } from "next/server"
import { getHackathonSettings, getSchedule, getPublicShortlistedTeams } from "@/lib/actions/hackathon"

export const revalidate = 10

export async function GET() {
    const [settings, schedule, shortlistedTeams] = await Promise.all([
        getHackathonSettings(),
        getSchedule(),
        getPublicShortlistedTeams()
    ])

    return NextResponse.json({ settings, schedule, shortlistedTeams })
}
