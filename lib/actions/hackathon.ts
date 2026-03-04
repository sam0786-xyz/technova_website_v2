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
            // Find team name and idea using strict matching (strip non-alphanumeric whitespace)
            const cleanStr = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

            const teamNameKey = Object.keys(row).find(k => {
                const clean = cleanStr(k);
                return clean.includes('teamname') || clean.includes('nameofteam') || clean === 'team';
            })
            const ideaKey = Object.keys(row).find(k => {
                const clean = cleanStr(k);
                return clean.includes('idea') || clean.includes('projecttitle') || clean.includes('title') || clean.includes('solution');
            })
            const teamCodeKey = Object.keys(row).find(k => {
                const clean = cleanStr(k);
                return clean.includes('teamid') || clean.includes('code');
            })
            const objectiveKey = Object.keys(row).find(k => {
                const clean = cleanStr(k);
                return clean.includes('synopsis') || clean.includes('objective') || clean.includes('description');
            })

            const teamCode = teamCodeKey ? String(row[teamCodeKey]) : null
            const teamName = teamNameKey ? row[teamNameKey] : `Team ${teamCode || Math.floor(Math.random() * 10000)}`
            const ideaTitle = ideaKey ? row[ideaKey] : 'TBD'
            const projectObjective = objectiveKey ? row[objectiveKey] : null

            if (!teamName) continue;

            // Insert Team
            const { data: team, error: teamError } = await supabase
                .from('hackathon_teams')
                .insert({
                    name: teamName,
                    idea_title: ideaTitle,
                    team_code: teamCode,
                    project_objective: projectObjective,
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
            const participantPairs: { name: string, email: string, phone: string | null, role: string }[] = []

            // Extract leader
            const leaderNameKey = Object.keys(row).find(k => k.toLowerCase().includes('leader') && (k.toLowerCase().includes('name') || k.toLowerCase().includes('lead'))) || Object.keys(row).find(k => k.toLowerCase() === 'name') || Object.keys(row).find(k => k.toLowerCase().includes('name'))

            const leaderEmailKey = Object.keys(row).find(k => k.toLowerCase().includes('leader') && k.toLowerCase().includes('email')) || Object.keys(row).find(k => k.toLowerCase().includes('email'))
            const leaderPhoneKey = Object.keys(row).find(k => (k.toLowerCase().includes('leader') || !k.toLowerCase().includes('member')) && (k.toLowerCase().includes('phone') || k.toLowerCase().includes('mobile') || k.toLowerCase().includes('contact')))

            if (leaderNameKey && leaderEmailKey && row[leaderNameKey] && row[leaderEmailKey]) {
                participantPairs.push({
                    name: row[leaderNameKey],
                    email: row[leaderEmailKey],
                    phone: leaderPhoneKey ? String(row[leaderPhoneKey]) : null,
                    role: 'Leader'
                })
            }

            // Extract members (up to 4 members typically)
            for (let i = 1; i <= 4; i++) {
                const memberNameKey = Object.keys(row).find(k => k.toLowerCase().includes(`member ${i} name`) || k.toLowerCase().includes(`team member ${i} name`))
                const memberEmailKey = Object.keys(row).find(k => k.toLowerCase().includes(`member ${i} email`) || k.toLowerCase().includes(`team member ${i} email`))
                const memberPhoneKey = Object.keys(row).find(k => (k.toLowerCase().includes(`member ${i} `) || k.toLowerCase().includes(`team member ${i} `)) && (k.toLowerCase().includes('phone') || k.toLowerCase().includes('mobile') || k.toLowerCase().includes('contact')))

                if (memberNameKey && memberEmailKey && row[memberNameKey] && row[memberEmailKey]) {
                    participantPairs.push({
                        name: row[memberNameKey],
                        email: row[memberEmailKey],
                        phone: memberPhoneKey ? String(row[memberPhoneKey]) : null,
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
                    phone: p.phone,
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

export async function deleteAllHackathonTeams() {
    const session = await auth()
    if (!session || !session.user || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) {
        throw new Error("Unauthorized")
    }

    try {
        const supabase = await getSupabase()
        // Delete all teams. Cascading deletes will remove participants and evaluations.
        const { error } = await supabase
            .from('hackathon_teams')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000') // Dummy condition to delete all rows

        if (error) throw error

        revalidatePath('/admin/hackathon')
        return { success: true, message: "All teams have been successfully deleted." }
    } catch (error: any) {
        console.error("Delete All Teams Error:", error)
        return { error: "Failed to delete teams: " + error.message }
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

export async function getTeamsForEvaluation(round: number = 1) {
    const session = await auth()
    if (!session || !session.user) return []
    const isAdmin = session.user.role === 'admin' || session.user.role === 'super_admin'

    const evaluator = await checkEvaluatorAccess()
    if (!evaluator && !isAdmin) return []

    const supabase = await getSupabase()

    // Fetch teams that are in 'evaluating' or 'pending' state
    let query = supabase
        .from('hackathon_teams')
        .select(`
            id, name, idea_title, project_objective, team_code, table_number, status, total_score,
            hackathon_participants (name, email, phone, role),
            hackathon_evaluations (evaluator_id, total_score, evaluation_round)
        `)

    if (round === 1) {
        query = query.in('status', ['pending', 'evaluating', 'shortlisted', 'not_shortlisted']) // All teams basically
    } else if (round === 2) {
        query = query.eq('status', 'shortlisted') // Only shortlisted
    }

    const { data: teams, error } = await query.order('created_at', { ascending: true })

    if (error) {
        console.error("Supabase Error in getTeamsForEvaluation:", error);
        return [];
    }


    if (!teams) return []

    // Map to indicate if this specific evaluator has already scored this team for this round
    return teams.map(team => {
        const evaluations = team.hackathon_evaluations || [];
        const myEval = evaluator ? evaluations.find((e: any) => e.evaluator_id === evaluator.id && e.evaluation_round === round) : null;

        // Calculate the total score for this SPECIFIC round by summing all evaluations matching this round
        const roundSpecificEvals = evaluations.filter((e: any) => e.evaluation_round === round);
        const roundSpecificTotal = roundSpecificEvals.reduce((acc: number, curr: any) => acc + Number(curr.total_score), 0);

        return {
            ...team,
            total_score: roundSpecificTotal, // Override generic total score with ROUND SPECIFIC total score
            has_evaluated: !!myEval,
            my_score: myEval ? myEval.total_score : null
        }
    })
}

export type EvaluationScores = {
    idea: number;
    tools: number;
    impact: number;
    sustainability: number;
    feasibility: number;
    communication: number;
    feedback: string;
}

export async function submitEvaluation(teamId: string, round: number, scores: EvaluationScores) {
    const evaluator = await checkEvaluatorAccess()
    if (!evaluator) return { error: "Unauthorized Evaluator Access" }

    // Validate scores (1-5 range for 6 factors)
    const scoreValues = [scores.idea, scores.tools, scores.impact, scores.sustainability, scores.feasibility, scores.communication];
    if (scoreValues.some(s => s < 1 || s > 5)) {
        return { error: "Scores must be between 1 and 5 for each category." }
    }

    const totalScore = scoreValues.reduce((a, b) => a + b, 0);
    const supabase = await getSupabase()

    // Check if evaluation is open
    const { data: settings } = await supabase.from('hackathon_settings').select('evaluation_open').limit(1).maybeSingle()
    if (!settings?.evaluation_open) {
        return { error: "Evaluation period is currently closed. You can no longer submit scores." }
    }

    // Insert Evaluation for the specific round
    const { error: evalError } = await supabase
        .from('hackathon_evaluations')
        .insert({
            team_id: teamId,
            evaluator_id: evaluator.id,
            evaluation_round: round,
            score_idea: scores.idea,
            score_tools: scores.tools,
            score_impact: scores.impact,
            score_sustainability: scores.sustainability,
            score_feasibility: scores.feasibility,
            score_communication: scores.communication,
            total_score: totalScore,
            feedback: scores.feedback
        })

    if (evalError) return { error: evalError.code === '23505' ? `You have already evaluated this team for Round ${round}.` : evalError.message }

    // Aggregate all scores for this team to update the teams table for the specific round
    const { data: allEvals } = await supabase
        .from('hackathon_evaluations')
        .select('total_score, evaluation_round')
        .eq('team_id', teamId)

    if (allEvals) {
        const round1Total = allEvals.filter(e => e.evaluation_round === 1).reduce((acc, curr) => acc + Number(curr.total_score), 0);
        const round2Total = allEvals.filter(e => e.evaluation_round === 2).reduce((acc, curr) => acc + Number(curr.total_score), 0);

        // We'll update the total_score to reflect the CURRENT round so sorting works out of the box for the generic Dashboard stats
        // But optimally, we should just use the specific round total 
        const teamTotal = round === 1 ? round1Total : round2Total;

        await supabase
            .from('hackathon_teams')
            .update({
                total_score: teamTotal, // Holds the active round's total
                status: 'evaluating'
            })
            .eq('id', teamId)
    }

    revalidatePath('/admin/hackathon/evaluate')
    revalidatePath('/admin/hackathon')
    return { success: true }
}

export async function toggleEvaluationPeriod(isOpen: boolean) {
    const session = await auth()
    if (!session || !session.user || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) {
        return { error: "Unauthorized" }
    }

    const supabase = await getSupabase()
    const { data: existing } = await supabase.from('hackathon_settings').select('id').limit(1).maybeSingle()

    if (existing) {
        const { error } = await supabase.from('hackathon_settings').update({
            evaluation_open: isOpen
        }).eq('id', existing.id)
        if (error) return { error: error.message }
    } else {
        const { error } = await supabase.from('hackathon_settings').insert({
            duration_hours: 24,
            evaluation_open: isOpen
        })
        if (error) return { error: error.message }
    }

    revalidatePath('/admin/hackathon')
    return { success: true }
}

export async function getTeamEvaluations(teamId: string, round: number) {
    const session = await auth()
    if (!session || !session.user) return []
    const isAdmin = session.user.role === 'admin' || session.user.role === 'super_admin'

    const evaluator = await checkEvaluatorAccess()
    if (!evaluator && !isAdmin) return []

    const supabase = await getSupabase()

    const { data: evaluations } = await supabase
        .from('hackathon_evaluations')
        .select(`
            id, total_score, score_idea, score_tools, score_impact, score_sustainability, score_feasibility, score_communication, feedback, evaluation_round, created_at,
            hackathon_evaluators (name, email)
        `)
        .eq('team_id', teamId)
        .eq('evaluation_round', round)
        .order('created_at', { ascending: false })

    return evaluations || []
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
