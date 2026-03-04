'use server'

import { createClient as createServerClient } from "@supabase/supabase-js"
import { auth } from "@/lib/auth"
import * as xlsx from 'xlsx'
import { revalidatePath } from "next/cache"

async function getSupabase() {
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

export async function uploadHackathonData(formData: FormData) {
    const session = await auth()
    if (!session || !session.user || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) {
        throw new Error("Unauthorized")
    }

    const file = formData.get('file') as File
    if (!file) {
        return { error: "No file provided" }
    }

    try {
        const buffer = await file.arrayBuffer()
        const workbook = xlsx.read(buffer, { type: 'buffer' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const data = xlsx.utils.sheet_to_json(worksheet)

        if (!data || data.length === 0) {
            return { error: "File is empty or invalid" }
        }

        const supabase = await getSupabase()

        // Expected columns (flexible mapping needed depending on Google Form output)
        // We assume headers like: "Team Name", "Idea/Project Title", "Leader Name", "Leader Email", "Member 1 Name", "Member 1 Email", etc.
        // Let's normalize it by looking at keys or we strictly require certain headers.

        let teamsAdded = 0
        let participantsAdded = 0

        for (const row of data as any[]) {
            // Find team name and idea
            const teamNameKey = Object.keys(row).find(k => k.toLowerCase().includes('team name'))
            const ideaKey = Object.keys(row).find(k => k.toLowerCase().includes('idea') || k.toLowerCase().includes('project title'))

            const teamName = teamNameKey ? row[teamNameKey] : `Team ${Math.floor(Math.random() * 10000)}`
            const ideaTitle = ideaKey ? row[ideaKey] : 'TBD'

            if (!teamName) continue;

            // Insert Team
            const { data: team, error: teamError } = await supabase
                .from('hackathon_teams')
                .insert({
                    name: teamName,
                    idea_title: ideaTitle,
                    status: 'pending'
                })
                .select()
                .single()

            if (teamError || !team) {
                console.error("Error inserting team:", teamError)
                continue;
            }
            teamsAdded++

            // Find members (leader + members)
            // Look for patterns like "Leader Name", "Leader Email", "Member 1 Name", "Member 1 Email"
            const participantPairs: { name: string, email: string, role: string }[] = []

            // Extract leader
            const leaderNameKey = Object.keys(row).find(k => k.toLowerCase().includes('leader name'))
            const leaderEmailKey = Object.keys(row).find(k => k.toLowerCase().includes('leader email'))
            if (leaderNameKey && leaderEmailKey && row[leaderNameKey] && row[leaderEmailKey]) {
                participantPairs.push({
                    name: row[leaderNameKey],
                    email: row[leaderEmailKey],
                    role: 'Leader'
                })
            }

            // Extract members (up to 4 members typically)
            for (let i = 1; i <= 4; i++) {
                const memberNameKey = Object.keys(row).find(k => k.toLowerCase().includes(`member ${i} name`) || k.toLowerCase().includes(`team member ${i} name`))
                const memberEmailKey = Object.keys(row).find(k => k.toLowerCase().includes(`member ${i} email`) || k.toLowerCase().includes(`team member ${i} email`))

                if (memberNameKey && memberEmailKey && row[memberNameKey] && row[memberEmailKey]) {
                    participantPairs.push({
                        name: row[memberNameKey],
                        email: row[memberEmailKey],
                        role: 'Member'
                    })
                }
            }

            // Insert Participants
            if (participantPairs.length > 0) {
                const participantsToInsert = participantPairs.map(p => ({
                    team_id: team.id,
                    name: p.name,
                    email: p.email,
                    role: p.role,
                    is_checked_in: false,
                    food_count: 0
                }))

                const { error: partError } = await supabase
                    .from('hackathon_participants')
                    .insert(participantsToInsert)

                if (!partError) {
                    participantsAdded += participantsToInsert.length
                } else {
                    console.error("Error inserting participants:", partError)
                }
            }
        }

        revalidatePath('/admin/hackathon')
        return { success: true, message: `Successfully imported ${teamsAdded} teams and ${participantsAdded} participants.` }

    } catch (error: any) {
        console.error("Upload Error:", error)
        return { error: "Failed to process file: " + error.message }
    }
}

export async function getHackathonTeams() {
    const session = await auth()
    if (!session || !session.user || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) return []

    const supabase = await getSupabase()
    const { data: teams } = await supabase
        .from('hackathon_teams')
        .select(`
            *,
            hackathon_participants (*)
        `)
        .order('created_at', { ascending: false })

    return teams || []
}

export async function updateTeamStatus(teamId: string, status: string) {
    const session = await auth()
    if (!session || !session.user || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) return { error: "Unauthorized" }

    const supabase = await getSupabase()
    const { error } = await supabase
        .from('hackathon_teams')
        .update({ status })
        .eq('id', teamId)

    if (error) return { error: error.message }

    revalidatePath('/admin/hackathon')
    return { success: true }
}

// Evaluator Management
export async function getEvaluators() {
    const session = await auth()
    if (!session || !session.user || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) return []

    const supabase = await getSupabase()
    const { data: evaluators } = await supabase
        .from('hackathon_evaluators')
        .select('*')
        .order('created_at', { ascending: false })

    return evaluators || []
}

export async function addEvaluator(email: string, name: string = 'Evaluator') {
    const session = await auth()
    if (!session || !session.user || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) return { error: "Unauthorized" }

    if (!email) return { error: "Email is required" }

    const supabase = await getSupabase()
    const { error } = await supabase
        .from('hackathon_evaluators')
        .insert({ email, name })

    if (error) {
        if (error.code === '23505') return { error: "Evaluator already exists" }
        return { error: error.message }
    }

    revalidatePath('/admin/hackathon')
    return { success: true }
}

export async function removeEvaluator(id: string) {
    const session = await auth()
    if (!session || !session.user || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) return { error: "Unauthorized" }

    const supabase = await getSupabase()
    const { error } = await supabase
        .from('hackathon_evaluators')
        .delete()
        .eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/admin/hackathon')
    return { success: true }
}

// Timer & Settings Management
export async function getHackathonSettings() {
    const supabase = await getSupabase()
    const { data: settings } = await supabase
        .from('hackathon_settings')
        .select('*')
        .limit(1)
        .maybeSingle()
    return settings
}

export async function startTimer(durationHours: number = 24) {
    const session = await auth()
    if (!session || !session.user || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) return { error: "Unauthorized" }

    const supabase = await getSupabase()

    // Check if settings row exists, if not create it
    const { data: existing } = await supabase.from('hackathon_settings').select('id').limit(1).maybeSingle()

    const payload = {
        timer_start: new Date().toISOString(),
        duration_hours: durationHours,
        is_running: true,
        updated_at: new Date().toISOString()
    }

    let error;
    if (existing) {
        const { error: updateError } = await supabase.from('hackathon_settings').update(payload).eq('id', existing.id)
        error = updateError
    } else {
        const { error: insertError } = await supabase.from('hackathon_settings').insert(payload)
        error = insertError
    }

    if (error) return { error: error.message }

    revalidatePath('/admin/hackathon')
    revalidatePath('/live')
    return { success: true }
}

export async function pushAnnouncement(message: string) {
    const session = await auth()
    if (!session || !session.user || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) return { error: "Unauthorized" }

    const supabase = await getSupabase()
    const { data: existing } = await supabase.from('hackathon_settings').select('id').limit(1).maybeSingle()

    if (existing) {
        const { error } = await supabase.from('hackathon_settings').update({
            active_announcement: message,
            updated_at: new Date().toISOString()
        }).eq('id', existing.id)
        if (error) return { error: error.message }
    } else {
        const { error } = await supabase.from('hackathon_settings').insert({
            active_announcement: message,
            duration_hours: 24
        })
        if (error) return { error: error.message }
    }

    revalidatePath('/admin/hackathon')
    revalidatePath('/live')
    return { success: true }
}

export async function stopTimer() {
    const session = await auth()
    if (!session || !session.user || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) return { error: "Unauthorized" }

    const supabase = await getSupabase()
    const { data: existing } = await supabase.from('hackathon_settings').select('id').limit(1).maybeSingle()

    if (!existing) return { error: "No timer found" }

    const { error } = await supabase.from('hackathon_settings').update({
        is_running: false,
        updated_at: new Date().toISOString()
    }).eq('id', existing.id)

    if (error) return { error: error.message }

    revalidatePath('/admin/hackathon')
    revalidatePath('/live')
    return { success: true }
}

export async function clearAnnouncement() {
    const session = await auth()
    if (!session || !session.user || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) return { error: "Unauthorized" }

    const supabase = await getSupabase()
    const { data: existing } = await supabase.from('hackathon_settings').select('id').limit(1).maybeSingle()

    if (!existing) return { error: "No settings found" }

    const { error } = await supabase.from('hackathon_settings').update({
        active_announcement: null,
        updated_at: new Date().toISOString()
    }).eq('id', existing.id)

    if (error) return { error: error.message }

    revalidatePath('/admin/hackathon')
    revalidatePath('/live')
    return { success: true }
}

// Schedule Management
export async function getSchedule() {
    const supabase = await getSupabase()
    const { data: schedule } = await supabase
        .from('hackathon_schedule')
        .select('*')
        .order('start_time', { ascending: true })

    return schedule || []
}

export async function addScheduleItem(data: { title: string, description?: string, start_time: string, end_time?: string, event_type: string }) {
    const session = await auth()
    if (!session || !session.user || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) return { error: "Unauthorized" }

    const supabase = await getSupabase()
    const { error } = await supabase
        .from('hackathon_schedule')
        .insert(data)

    if (error) return { error: error.message }

    revalidatePath('/admin/hackathon')
    revalidatePath('/live')
    return { success: true }
}

export async function deleteScheduleItem(id: string) {
    const session = await auth()
    if (!session || !session.user || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) return { error: "Unauthorized" }

    const supabase = await getSupabase()
    const { error } = await supabase
        .from('hackathon_schedule')
        .delete()
        .eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/admin/hackathon')
    revalidatePath('/live')
    return { success: true }
}

// ==========================================
// EVALUATOR PORTAL ACTIONS
// ==========================================

export async function checkEvaluatorAccess() {
    const session = await auth()
    if (!session || !session.user || !session.user.email) return null

    const supabase = await getSupabase()
    const { data } = await supabase
        .from('hackathon_evaluators')
        .select('id, name')
        .eq('email', session.user.email)
        .single()

    return data || null
}

export async function getTeamsForEvaluation() {
    const evaluator = await checkEvaluatorAccess()
    if (!evaluator) return []

    const supabase = await getSupabase()

    // Fetch teams that are in 'evaluating' or 'pending' state
    const { data: teams } = await supabase
        .from('hackathon_teams')
        .select(`
            id, name, idea_title, table_number, status, total_score,
            hackathon_participants (name, role),
            hackathon_evaluations (evaluator_id, total_score)
        `)
        .in('status', ['pending', 'evaluating'])
        .order('created_at', { ascending: true })

    if (!teams) return []

    // Map to indicate if this specific evaluator has already scored this team
    return teams.map(team => {
        const myEval = team.hackathon_evaluations.find((e: any) => e.evaluator_id === evaluator.id)
        return {
            ...team,
            has_evaluated: !!myEval,
            my_score: myEval ? myEval.total_score : null
        }
    })
}

export async function submitEvaluation(teamId: string, scores: { innovation: number, ui: number, technical: number, feedback: string }) {
    const evaluator = await checkEvaluatorAccess()
    if (!evaluator) return { error: "Unauthorized Evaluator Access" }

    const totalScore = scores.innovation + scores.ui + scores.technical
    const supabase = await getSupabase()

    // Insert Evaluation
    const { error: evalError } = await supabase
        .from('hackathon_evaluations')
        .insert({
            team_id: teamId,
            evaluator_id: evaluator.id,
            score_innovation: scores.innovation,
            score_ui: scores.ui,
            score_technical: scores.technical,
            total_score: totalScore,
            feedback: scores.feedback
        })

    if (evalError) return { error: evalError.code === '23505' ? "You have already evaluated this team." : evalError.message }

    // Aggregate all scores for this team to update the teams table
    const { data: allEvals } = await supabase
        .from('hackathon_evaluations')
        .select('total_score')
        .eq('team_id', teamId)

    if (allEvals) {
        const teamTotal = allEvals.reduce((acc, curr) => acc + Number(curr.total_score), 0)

        await supabase
            .from('hackathon_teams')
            .update({
                total_score: teamTotal,
                status: 'evaluating' // automatically move pending teams to evaluating
            })
            .eq('id', teamId)
    }

    revalidatePath('/evaluate')
    revalidatePath('/admin/hackathon')
    return { success: true }
}

export async function getPublicShortlistedTeams() {
    const supabase = await getSupabase()
    const { data: teams } = await supabase
        .from('hackathon_teams')
        .select(`
            id, name, idea_title, table_number
        `)
        .eq('status', 'shortlisted')
        .order('total_score', { ascending: false })

    return teams || []
}

// ==========================================
// LOGISTICS & QR ACTIONS
// ==========================================

export async function processHackathonQrScan(participantId: string, actionUrl: 'checkin' | 'food') {
    const session = await auth()
    if (!session || !session.user || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) return { error: "Unauthorized" }

    const supabase = await getSupabase()

    // Verify participant
    const { data: participant } = await supabase
        .from('hackathon_participants')
        .select('*')
        .eq('id', participantId)
        .single()

    if (!participant) return { error: "Invalid QR Code: Participant not found." }

    if (actionUrl === 'checkin') {
        if (participant.is_checked_in) return { message: "Already checked in", participant }

        const { error } = await supabase
            .from('hackathon_participants')
            .update({ is_checked_in: true })
            .eq('id', participantId)

        if (error) return { error: error.message }
        revalidatePath('/admin/hackathon')
        return { success: true, participant, message: "Checked in successfully" }
    }

    if (actionUrl === 'food') {
        const { error: logError } = await supabase
            .from('hackathon_food_logs')
            .insert({
                participant_id: participantId,
                scanned_by: session.user.id
            })

        if (logError) return { error: logError.message }

        const { error: updateError } = await supabase
            .from('hackathon_participants')
            .update({ food_count: participant.food_count + 1 })
            .eq('id', participantId)

        if (updateError) return { error: updateError.message }

        return { success: true, participant, message: `Food logged successfully! (Total meals: ${participant.food_count + 1})` }
    }

    return { error: "Invalid action" }
}

export async function manualCheckInParticipant(participantId: string, isCheckedIn: boolean) {
    const session = await auth()
    if (!session || !session.user || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) return { error: "Unauthorized" }

    const supabase = await getSupabase()
    const { error } = await supabase
        .from('hackathon_participants')
        .update({ is_checked_in: isCheckedIn })
        .eq('id', participantId)

    if (error) return { error: error.message }

    revalidatePath('/admin/hackathon')
    return { success: true }
}
