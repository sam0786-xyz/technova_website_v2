import { NextResponse, NextRequest } from "next/server"
import { checkRateLimit, getClientIdentifier } from "@/lib/rate-limit"
import { getSupabase } from "@/lib/actions/hackathon"

export const revalidate = 30

export async function GET(req: NextRequest) {
    const rateLimit = checkRateLimit(getClientIdentifier(req), { limit: 20, windowSeconds: 60 })
    if (!rateLimit.success) {
        return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const supabase = await getSupabase()

    const { data: teams, error } = await supabase
        .from('hackathon_teams')
        .select(`
            id,
            name,
            team_code,
            idea_title,
            theme,
            status,
            table_number,
            is_shortlisted,
            project_objective,
            hackathon_participants (
                id,
                name,
                role,
                college
            )
        `)
        .order('created_at', { ascending: false })

    if (error) {
        return NextResponse.json({ error: "Failed to fetch teams" }, { status: 500 })
    }

    // Only return safe public fields — no emails, phones
    const publicTeams = (teams || []).map(t => ({
        id: t.id,
        name: t.name,
        team_code: t.team_code,
        idea_title: t.idea_title,
        theme: t.theme,
        status: t.status,
        table_number: t.table_number,
        is_shortlisted: t.is_shortlisted,
        project_objective: t.project_objective,
        member_count: t.hackathon_participants?.length || 0,
        members: (t.hackathon_participants || []).map(p => ({
            name: p.name,
            role: p.role,
            college: p.college,
        })),
    }))

    return NextResponse.json({ teams: publicTeams })
}
