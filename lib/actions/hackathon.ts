'use server'

import { createClient as createServerClient } from "@supabase/supabase-js"
import { auth } from "@/lib/auth"
import * as xlsx from 'xlsx'
import { revalidatePath } from "next/cache"
import { Resend } from "resend"

export async function getSupabase() {
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
                return clean.includes('idea') || clean.includes('projecttitle') || clean.includes('title') || clean.includes('solution') || clean.includes('theme');
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
            let teamName = (teamNameKey && row[teamNameKey]) ? String(row[teamNameKey]).trim() : '';
            if (!teamName) {
                teamName = `Team ${teamCode || Math.floor(Math.random() * 10000)}`
            }
            const ideaTitle = (ideaKey && row[ideaKey]) ? String(row[ideaKey]).trim() : 'TBD'
            const projectObjective = (objectiveKey && row[objectiveKey]) ? String(row[objectiveKey]).trim() : null

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

            // Extract leader - match actual column headers like "Team Lead Name", "Leader Name", "Name", etc.
            const leaderNameKey = Object.keys(row).find(k => {
                const lower = k.toLowerCase();
                return lower.includes('lead') && lower.includes('name');
            }) || Object.keys(row).find(k => {
                const lower = k.toLowerCase();
                return (lower === 'name') || (lower.includes('name') && !lower.includes('team name') && !lower.includes('idea') && !lower.includes('project') && !lower.includes('member'));
            })

            const leaderEmailKey = Object.keys(row).find(k => k.toLowerCase().includes('lead') && k.toLowerCase().includes('email'))
                || Object.keys(row).find(k => k.toLowerCase() === 'email')
                || Object.keys(row).find(k => k.toLowerCase().includes('email') && !k.toLowerCase().includes('member'))

            const leaderPhoneKey = Object.keys(row).find(k => {
                const lower = k.toLowerCase();
                return (lower.includes('mobile') || lower.includes('phone') || lower.includes('contact')) && !lower.includes('member');
            })

            participantPairs.push({
                name: (leaderNameKey && row[leaderNameKey]) ? String(row[leaderNameKey]).trim() : 'Unknown Leader',
                email: (leaderEmailKey && row[leaderEmailKey]) ? String(row[leaderEmailKey]).trim() : '',
                phone: (leaderPhoneKey && row[leaderPhoneKey]) ? String(row[leaderPhoneKey]).trim() : null,
                role: 'Leader'
            })

            // Extract members (up to 4 members typically)
            for (let i = 1; i <= 4; i++) {
                const memberNameKey = Object.keys(row).find(k => k.toLowerCase().includes(`member ${i}`) && k.toLowerCase().includes('name'))
                    || Object.keys(row).find(k => k.toLowerCase().includes(`member${i}`) && k.toLowerCase().includes('name'))
                const memberEmailKey = Object.keys(row).find(k => k.toLowerCase().includes(`member ${i}`) && k.toLowerCase().includes('email'))
                    || Object.keys(row).find(k => k.toLowerCase().includes(`member${i}`) && k.toLowerCase().includes('email'))
                const memberPhoneKey = Object.keys(row).find(k => k.toLowerCase().includes(`member ${i}`) && (k.toLowerCase().includes('phone') || k.toLowerCase().includes('mobile') || k.toLowerCase().includes('contact')))
                    || Object.keys(row).find(k => k.toLowerCase().includes(`member${i}`) && (k.toLowerCase().includes('phone') || k.toLowerCase().includes('mobile') || k.toLowerCase().includes('contact')))

                if (memberNameKey && row[memberNameKey]) {
                    participantPairs.push({
                        name: String(row[memberNameKey]).trim(),
                        email: (memberEmailKey && row[memberEmailKey]) ? String(row[memberEmailKey]).trim() : '',
                        phone: (memberPhoneKey && row[memberPhoneKey]) ? String(row[memberPhoneKey]).trim() : null,
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

export async function updateHackathonTeamDetails(teamId: string, data: {
    teamName: string,
    ideaTitle: string,
    teamCode?: string,
    projectObjective?: string,
    leader?: { id?: string, name: string, email: string, phone: string },
    members?: { id?: string, name: string, email?: string, phone?: string }[]
}) {
    const session = await auth()
    if (!session || !session.user || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) {
        return { error: "Unauthorized" }
    }

    try {
        const supabase = await getSupabase()

        // 1. Update Team Info
        const { error } = await supabase
            .from('hackathon_teams')
            .update({
                name: data.teamName,
                idea_title: data.ideaTitle || 'TBD',
                team_code: data.teamCode || null,
                project_objective: data.projectObjective || null,
            })
            .eq('id', teamId)

        if (error) {
            return { error: error.message || "Failed to update team details" }
        }

        // 2. Clear existing participants for this team
        await supabase.from('hackathon_participants').delete().eq('team_id', teamId)

        // 3. Prepare Participants to re-insert
        const participantsToInsert = []

        // Leader
        if (data.leader && data.leader.name) {
            participantsToInsert.push({
                team_id: teamId,
                name: data.leader.name,
                email: data.leader.email,
                phone: data.leader.phone,
                role: 'Leader',
                is_checked_in: false,
                food_count: 0
            })
        }

        // Members
        if (data.members && data.members.length > 0) {
            for (const member of data.members) {
                if (member.name && member.name.trim() !== "") {
                    participantsToInsert.push({
                        team_id: teamId,
                        name: member.name,
                        email: member.email || '',
                        phone: member.phone || null,
                        role: 'Member',
                        is_checked_in: false,
                        food_count: 0
                    })
                }
            }
        }

        // 4. Re-insert Participants
        if (participantsToInsert.length > 0) {
            const { error: partError } = await supabase
                .from('hackathon_participants')
                .insert(participantsToInsert)

            if (partError) {
                return { error: "Team updated, but failed to reconstruct members: " + partError.message }
            }
        }

        revalidatePath('/admin/hackathon')
        revalidatePath('/hackathon-portal')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}


export async function addHackathonTeamManually(data: {
    teamName: string,
    ideaTitle: string,
    teamCode?: string,
    projectObjective?: string,
    leader: { name: string, email: string, phone: string },
    members: { name: string, email?: string, phone?: string }[]
}) {
    const session = await auth()
    if (!session || !session.user || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) {
        return { error: "Unauthorized" }
    }

    try {
        const supabase = await getSupabase()

        // 1. Insert Team
        const { data: team, error: teamError } = await supabase
            .from('hackathon_teams')
            .insert({
                name: data.teamName,
                idea_title: data.ideaTitle || 'TBD',
                team_code: data.teamCode || null,
                project_objective: data.projectObjective || null,
                status: 'pending'
            })
            .select()
            .single()

        if (teamError || !team) {
            return { error: teamError?.message || "Failed to create team" }
        }

        // 2. Prepare Participants
        const participantsToInsert = []

        // Leader
        if (data.leader && data.leader.name) {
            participantsToInsert.push({
                team_id: team.id,
                name: data.leader.name,
                email: data.leader.email,
                phone: data.leader.phone,
                role: 'Leader',
                is_checked_in: false,
                food_count: 0
            })
        }

        // Members
        if (data.members && data.members.length > 0) {
            for (const member of data.members) {
                if (member.name && member.name.trim() !== "") {
                    participantsToInsert.push({
                        team_id: team.id,
                        name: member.name,
                        email: member.email || '',
                        phone: member.phone || null,
                        role: 'Member',
                        is_checked_in: false,
                        food_count: 0
                    })
                }
            }
        }

        // 3. Insert Participants
        if (participantsToInsert.length > 0) {
            const { error: partError } = await supabase
                .from('hackathon_participants')
                .insert(participantsToInsert)

            if (partError) {
                return { error: "Team created, but failed to add members: " + partError.message }
            }
        }

        revalidatePath('/admin/hackathon')
        return { success: true, message: "Team created successfully" }
    } catch (error: any) {
        return { error: "An unexpected error occurred: " + error.message }
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

    // Check if evaluator already exists first to avoid duplicate email errors
    const { data: existing } = await supabase
        .from('hackathon_evaluators')
        .select('id, magic_token')
        .eq('email', email)
        .maybeSingle()

    let magicToken = existing?.magic_token;

    if (!existing) {
        const { data, error } = await supabase
            .from('hackathon_evaluators')
            .insert({ email, name })
            .select('magic_token')
            .single()

        if (error) return { error: error.message }
        magicToken = data.magic_token;
    }

    if (process.env.RESEND_API_KEY) {
        try {
            const resend = new Resend(process.env.RESEND_API_KEY)
            const magicLink = `https://www.technovashardauniversity.in/evaluate?token=${magicToken}`;

            await resend.emails.send({
                from: "TechNova Hackathon <no-reply@technovashardauniversity.in>",
                to: email,
                subject: "Invitation: Official Evaluator - Innovate Bharat Hackathon",
                html: `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #000; color: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #333;">
                        <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center;">
                            <h1 style="margin: 0; color: #000; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">Innovate Bharat Hackathon</h1>
                            <p style="margin: 5px 0 0; color: #000; font-weight: bold; opacity: 0.8;">Official Evaluator Invitation</p>
                        </div>
                        <div style="padding: 40px 30px; line-height: 1.6;">
                            <h2 style="color: #f59e0b; margin-top: 0;">Welcome, ${name}!</h2>
                            <p style="color: #ccc; font-size: 16px;">
                                You have been selected as an official evaluator for the Innovate Bharat Hackathon. Your expertise will be invaluable in identifying the most innovative projects.
                            </p>
                            
                            <div style="background-color: #111; border: 1px solid #222; border-radius: 8px; padding: 20px; margin: 30px 0; text-align: center;">
                                <p style="margin: 0 0 15px; color: #888; font-size: 14px;">Use the button below for direct access to your dashboard:</p>
                                <a href="${magicLink}" style="display: inline-block; background-color: #f59e0b; color: #000; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; transition: transform 0.2s;">
                                    Enter Evaluator Portal
                                </a>
                                <p style="margin: 15px 0 0; color: #555; font-size: 12px;">Login Email: ${email}</p>
                            </div>

                            <p style="color: #666; font-size: 14px; margin-top: 30px;">
                                If you have any trouble with the link above, you can copy and paste this URL into your browser:<br/>
                                <span style="color: #f59e0b; word-break: break-all;">${magicLink}</span>
                            </p>
                        </div>
                        <div style="background-color: #0a0a0a; padding: 20px; text-align: center; border-top: 1px solid #1a1a1a;">
                            <p style="margin: 0; color: #444; font-size: 12px;">&copy; 2026 TechNova | Sharda University</p>
                        </div>
                    </div>
                `
            })
        } catch (e) {
            console.error("Failed to send evaluator email", e);
        }
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

export async function updateCustomMeals(meals: string[]) {
    const session = await auth()
    if (!session || !session.user || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) return { error: "Unauthorized" }

    const supabase = await getSupabase()
    const { data: existing } = await supabase.from('hackathon_settings').select('id').limit(1).maybeSingle()

    if (existing) {
        const { error } = await supabase.from('hackathon_settings').update({ custom_meals: meals }).eq('id', existing.id)
        if (error) return { error: error.message }
    } else {
        const { error } = await supabase.from('hackathon_settings').insert({ custom_meals: meals })
        if (error) return { error: error.message }
    }

    revalidatePath('/admin/hackathon')
    revalidatePath('/hackathon-portal')
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

export async function updateEvaluationRounds(rounds: number) {
    const session = await auth()
    if (!session || !session.user || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) return { error: "Unauthorized" }

    const supabase = await getSupabase()

    // Check if settings row exists
    const { data: existing } = await supabase.from('hackathon_settings').select('id').limit(1).maybeSingle()

    let error;
    if (existing) {
        const { error: updateError } = await supabase.from('hackathon_settings').update({ evaluation_rounds: rounds, updated_at: new Date().toISOString() }).eq('id', existing.id)
        error = updateError
    } else {
        const { error: insertError } = await supabase.from('hackathon_settings').insert({ evaluation_rounds: rounds, timer_start: new Date().toISOString(), duration_hours: 24, is_running: false, updated_at: new Date().toISOString() })
        error = insertError
    }

    if (error) return { error: error.message }

    revalidatePath('/admin/hackathon')
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
        .select('id, name, email')
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
        // Use only valid enum values: pending, evaluating, shortlisted, rejected
        query = query.in('status', ['pending', 'evaluating', 'shortlisted', 'rejected'])
    } else {
        query = query.in('status', ['shortlisted'])
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

        // Calculate the total score for this SPECIFIC round
        // Now using Average instead of Sum, so multiple panels evaluating the same team won't inflate scores over teams evaluated by fewer panels
        const roundSpecificEvals = evaluations.filter((e: any) => e.evaluation_round === round);

        let roundSpecificTotal = 0;
        if (roundSpecificEvals.length > 0) {
            const sum = roundSpecificEvals.reduce((acc: number, curr: any) => acc + Number(curr.total_score), 0);
            // Return average, rounded to 1 decimal place
            roundSpecificTotal = Math.round((sum / roundSpecificEvals.length) * 10) / 10;
        }

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

export async function submitEvaluation(teamId: string, round: number, scores: EvaluationScores, token?: string) {
    let evaluator;
    if (token) {
        const supabase = await getSupabase()
        const { data } = await supabase
            .from('hackathon_evaluators')
            .select('id, name, email')
            .eq('magic_token', token)
            .maybeSingle()
        evaluator = data
    }

    if (!evaluator) {
        evaluator = await checkEvaluatorAccess()
    }

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
        const round1Evals = allEvals.filter(e => e.evaluation_round === 1);
        const round1Sum = round1Evals.reduce((acc, curr) => acc + Number(curr.total_score), 0);
        const round1Avg = round1Evals.length > 0 ? Math.round((round1Sum / round1Evals.length) * 10) / 10 : 0;

        const round2Evals = allEvals.filter(e => e.evaluation_round === 2);
        const round2Sum = round2Evals.reduce((acc, curr) => acc + Number(curr.total_score), 0);
        const round2Avg = round2Evals.length > 0 ? Math.round((round2Sum / round2Evals.length) * 10) / 10 : 0;

        // We update the total_score to reflect the AVERAGE score of the CURRENT round so sorting works out of the box in the generic dashboard.
        const teamTotal = round === 1 ? round1Avg : round2Avg;

        await supabase
            .from('hackathon_teams')
            .update({
                total_score: teamTotal, // Holds the active round's total (Averaged across panels)
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

export async function processHackathonQrScan(participantId: string, actionUrl: 'checkin' | 'checkout' | 'food', mealRound?: string) {
    const session = await auth()
    if (!session || !session.user) return { error: "Unauthorized" }

    // Allow super_admin, admin, or volunteers
    const isAdmin = session.user.role === 'admin' || session.user.role === 'super_admin'
    const volunteer = await checkVolunteerAccess()
    if (!isAdmin && !volunteer) return { error: "Unauthorized" }

    const supabase = await getSupabase()

    // Verify participant
    const { data: participant } = await supabase
        .from('hackathon_participants')
        .select('*, hackathon_teams(name, team_code)')
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
        return { success: true, participant, message: `✅ ${participant.name} — Checked in successfully` }
    }

    if (actionUrl === 'checkout') {
        if (!participant.is_checked_in) return { message: "Not checked in", participant }

        const { error } = await supabase
            .from('hackathon_participants')
            .update({ is_checked_in: false })
            .eq('id', participantId)

        if (error) return { error: error.message }
        revalidatePath('/admin/hackathon')
        return { success: true, participant, message: `👋 ${participant.name} — Checked out successfully` }
    }

    if (actionUrl === 'food') {
        const mealType = mealRound || 'default'

        // Check if this participant already scanned for this meal round
        const { data: existingLog } = await supabase
            .from('hackathon_food_logs')
            .select('id')
            .eq('participant_id', participantId)
            .eq('meal_type', mealType)
            .maybeSingle()

        if (existingLog) {
            return { error: `${participant.name} has already scanned for "${mealType}". Each participant can only scan once per meal round.` }
        }

        const { error: logError } = await supabase
            .from('hackathon_food_logs')
            .insert({
                participant_id: participantId,
                meal_type: mealType,
            })

        if (logError) return { error: logError.message }

        const { error: updateError } = await supabase
            .from('hackathon_participants')
            .update({ food_count: participant.food_count + 1 })
            .eq('id', participantId)

        if (updateError) return { error: updateError.message }

        return { success: true, participant, message: `✅ ${participant.name} — "${mealType}" logged! (Total meals: ${participant.food_count + 1})` }
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

// ==========================================
// DATA DOWNLOADS
// ==========================================

export async function getCheckedInParticipantsData() {
    const session = await auth()
    if (!session || !session.user || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) return { error: "Unauthorized", data: [] }

    const supabase = await getSupabase()
    const { data: participants } = await supabase
        .from('hackathon_participants')
        .select('name, email, phone, role, is_checked_in, food_count, hackathon_teams(name, team_code)')
        .order('is_checked_in', { ascending: false })

    return {
        data: (participants || []).map((p: any) => ({
            'Participant Name': p.name,
            'Email': p.email,
            'Phone': p.phone || '',
            'Role': p.role,
            'Team Name': p.hackathon_teams?.name || '',
            'Team ID': p.hackathon_teams?.team_code || '',
            'Checked In': p.is_checked_in ? 'Yes' : 'No',
            'Meals Taken': p.food_count,
        }))
    }
}

export async function getFoodLogsData() {
    const session = await auth()
    if (!session || !session.user || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) return { error: "Unauthorized", data: [] }

    const supabase = await getSupabase()
    const { data: logs } = await supabase
        .from('hackathon_food_logs')
        .select('meal_type, scanned_at, hackathon_participants(name, email, phone, hackathon_teams(name, team_code))')
        .order('scanned_at', { ascending: false })

    return {
        data: (logs || []).map((log: any) => ({
            'Participant Name': log.hackathon_participants?.name || '',
            'Email': log.hackathon_participants?.email || '',
            'Phone': log.hackathon_participants?.phone || '',
            'Team Name': log.hackathon_participants?.hackathon_teams?.name || '',
            'Team ID': log.hackathon_participants?.hackathon_teams?.team_code || '',
            'Meal Type': log.meal_type || '',
            'Scanned At': log.scanned_at ? new Date(log.scanned_at).toLocaleString() : '',
        }))
    }
}

// ==========================================
// SEARCH PARTICIPANTS (for manual check-in)
// ==========================================

export async function searchParticipants(query: string) {
    const session = await auth()
    if (!session || !session.user) return []

    // Allow super_admin, admin, or volunteers
    const isAdmin = session.user.role === 'admin' || session.user.role === 'super_admin'
    const volunteer = await checkVolunteerAccess()
    if (!isAdmin && !volunteer) return []

    if (!query || query.length < 2) return []

    const supabase = await getSupabase()
    const { data: participants } = await supabase
        .from('hackathon_participants')
        .select('id, name, email, phone, role, is_checked_in, food_count, hackathon_teams(name, team_code)')
        .or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
        .limit(10)

    return participants || []
}

// ==========================================
// VOLUNTEER MANAGEMENT
// ==========================================

export async function checkVolunteerAccess() {
    const session = await auth()
    if (!session || !session.user || !session.user.email) return null

    const supabase = await getSupabase()
    const { data } = await supabase
        .from('hackathon_volunteers')
        .select('id, name')
        .eq('email', session.user.email)
        .single()

    return data || null
}

export async function getVolunteers() {
    const session = await auth()
    if (!session || session.user.role !== 'super_admin') return []

    const supabase = await getSupabase()
    const { data: volunteers } = await supabase
        .from('hackathon_volunteers')
        .select('*')
        .order('created_at', { ascending: false })

    return volunteers || []
}

export async function addVolunteer(email: string, name: string = 'Volunteer', teamName: string = 'Registration & Stage Team') {
    const session = await auth()
    if (!session || session.user.role !== 'super_admin') return { error: 'Unauthorized' }

    const supabase = await getSupabase()
    const { error } = await supabase
        .from('hackathon_volunteers')
        .insert({ email: email.trim().toLowerCase(), name: name.trim(), team_name: teamName })

    if (error) {
        if (error.code === '23505') return { error: "Volunteer already exists" }
        return { error: error.message }
    }
    revalidatePath('/hackathon-portal')
    return { success: true }
}

export async function removeVolunteer(id: string) {
    const session = await auth()
    if (!session || session.user.role !== 'super_admin') return { error: 'Unauthorized' }

    const supabase = await getSupabase()
    const { error } = await supabase
        .from('hackathon_volunteers')
        .delete()
        .eq('id', id)

    if (error) return { error: error.message }
    revalidatePath('/hackathon-portal')
    return { success: true }
}

// ==========================================
// HACKATHON ROLE CHECK (for portal access)
// ==========================================

export type HackathonRole = 'organizer' | 'evaluator' | 'volunteer' | 'none'

export async function checkHackathonRole(): Promise<{ role: HackathonRole, user: any }> {
    const session = await auth()
    if (!session || !session.user) return { role: 'none', user: null }

    // Admins and Super admins are organizers
    if (session.user.role === 'super_admin' || session.user.role === 'admin') {
        return { role: 'organizer', user: session.user }
    }

    // Check evaluator table
    const evaluator = await checkEvaluatorAccess()
    if (evaluator) return { role: 'evaluator', user: session.user }

    // Check volunteer table
    const volunteer = await checkVolunteerAccess()
    if (volunteer) return { role: 'volunteer', user: session.user }

    return { role: 'none', user: session.user }
}

// Check if an email has hackathon access (for login gating)
export async function isHackathonEmail(email: string): Promise<boolean> {
    const supabase = await getSupabase()

    const { data: evaluator } = await supabase
        .from('hackathon_evaluators')
        .select('id')
        .eq('email', email.toLowerCase())
        .single()

    if (evaluator) return true

    const { data: volunteer } = await supabase
        .from('hackathon_volunteers')
        .select('id')
        .eq('email', email.toLowerCase())
        .single()

    return !!volunteer
}
