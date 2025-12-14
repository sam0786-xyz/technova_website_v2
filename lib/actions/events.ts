'use server'

import { createClient as createServerClient } from "@supabase/supabase-js"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

// Helper to get authenticated client or admin client
async function getSupabase() {
    // Ideally use createServerClient from @supabase/ssr with cookies
    // For this prototype, we rely on the Service Role for writes to ensure it works without complex RLS setup debugging
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

export async function createEvent(formData: FormData) {
    const session = await auth()
    if (!session || session.user.role === 'student') {
        throw new Error("Unauthorized")
    }

    const supabase = await getSupabase()

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const start_time = formData.get("start_time") as string
    const end_time = formData.get("end_time") as string
    const venue = formData.get("venue") as string
    const capacity = parseInt(formData.get("capacity") as string)
    const price = parseFloat(formData.get("price") as string)

    // 1. Get Club ID for the user (Mocking or fetching from admin_roles)
    // For now, we'll create a default 'Technova' club if it doesn't exist or pick the first one
    let club_id = null
    const { data: clubs } = await supabase.from('clubs').select('id').limit(1)

    if (clubs && clubs.length > 0) {
        club_id = clubs[0].id
    } else {
        // Create Default Club
        const { data: newClub } = await supabase.from('clubs').insert({
            name: "Technova Main",
            description: "Central Society"
        }).select().single()
        club_id = newClub.id
    }

    // 2. Create Event
    const { error } = await supabase.from('events').insert({
        club_id,
        title,
        description,
        start_time,
        end_time,
        venue,
        capacity,
        price,
        status: 'draft' // Default to draft
    })

    if (error) {
        console.error("Create Event Error:", error)
        throw new Error("Failed to create event")
    }

    redirect("/admin/events")
}

export async function getEvents() {
    const supabase = await getSupabase()
    const { data } = await supabase.from('events').select('*').order('created_at', { ascending: false })
    return data || []
}

export async function getEventById(id: string) {
    const supabase = await getSupabase()
    const { data } = await supabase.from('events').select('*').eq('id', id).single()
    return data
}
