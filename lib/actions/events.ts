'use server'

import { createClient as createServerClient } from "@supabase/supabase-js"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

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
    const status = formData.get("status") as string || 'draft'
    const bannerFile = formData.get("banner_file") as File
    let banner = formData.get("banner") as string

    if (bannerFile && bannerFile.size > 0) {
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('events')
            .upload(`${Date.now()}-${bannerFile.name}`, bannerFile, {
                upsert: true
            })

        if (uploadError) {
            console.error("Upload Error:", uploadError)
        } else {
            const { data: { publicUrl } } = supabase.storage.from('events').getPublicUrl(uploadData.path)
            banner = publicUrl
        }
    }

    const co_host_club_id = formData.get("co_host_club_id") as string || null
    const registration_fields = formData.get("registration_fields") as string || "[]"
    const is_virtual = formData.get("is_virtual") === "true"
    const meeting_link = formData.get("meeting_link") as string || null
    const banner_position = formData.get("banner_position") as string || "center"
    let club_id = formData.get("club_id") as string || null

    // If no club selected, try to find one or create default
    if (!club_id) {
        const { data: clubs } = await supabase.from('clubs').select('id').order('name', { ascending: true }).limit(1)
        if (clubs && clubs.length > 0) {
            club_id = clubs[0].id
        } else {
            const { data: newClub } = await supabase.from('clubs').insert({
                name: "Technova Main",
                description: "Central Society"
            }).select().single()
            club_id = newClub.id
        }
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
        status,
        banner,
        co_host_club_id: co_host_club_id === 'none' ? null : co_host_club_id,
        updated_at: new Date().toISOString(),
        registration_fields: JSON.parse(registration_fields),
        is_virtual,
        meeting_link,
        banner_position
    })

    if (error) {
        console.error("Create Event Error:", error)
        throw new Error("Failed to create event")
    }

    revalidatePath("/events")
    revalidatePath("/admin/events")
    redirect("/admin/events")
}

export async function updateEvent(formData: FormData) {
    const session = await auth()
    if (!session || session.user.role === 'student') {
        throw new Error("Unauthorized")
    }

    const supabase = await getSupabase()
    const id = formData.get("id") as string

    if (!id) throw new Error("Event ID is required")

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const start_time = formData.get("start_time") as string
    const end_time = formData.get("end_time") as string
    const venue = formData.get("venue") as string
    const capacity = parseInt(formData.get("capacity") as string)
    const price = parseFloat(formData.get("price") as string)
    const status = formData.get("status") as string
    const bannerFile = formData.get("banner_file") as File
    let banner = formData.get("banner") as string

    if (bannerFile && bannerFile.size > 0) {
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('events')
            .upload(`${Date.now()}-${bannerFile.name}`, bannerFile, {
                upsert: true
            })

        if (uploadError) {
            console.error("Upload Error:", uploadError)
        } else {
            const { data: { publicUrl } } = supabase.storage.from('events').getPublicUrl(uploadData.path)
            banner = publicUrl
        }
    }

    const club_id = formData.get("club_id") as string
    const co_host_club_id = formData.get("co_host_club_id") as string || null
    const registration_fields = formData.get("registration_fields") as string || "[]"
    const is_virtual = formData.get("is_virtual") === "true"
    const meeting_link = formData.get("meeting_link") as string || null

    const { error } = await supabase.from('events').update({
        club_id,
        title,
        description,
        start_time,
        end_time,
        venue,
        capacity,
        price,
        status,
        banner,
        co_host_club_id: co_host_club_id === 'none' ? null : co_host_club_id,
        updated_at: new Date().toISOString(),
        registration_fields,
        is_virtual,
        meeting_link
    }).eq('id', id)

    if (error) {
        console.error("Update Event Error:", error)
        throw new Error("Failed to update event")
    }

    revalidatePath("/events")
    revalidatePath("/admin/events")
    revalidatePath(`/events/${id}`)
    redirect("/admin/events")
}

export async function deleteEvent(id: string) {
    const session = await auth()
    if (!session || session.user.role === 'student') {
        throw new Error("Unauthorized")
    }

    const supabase = await getSupabase()
    const { error } = await supabase.from('events').delete().eq('id', id)

    if (error) {
        console.error("Delete Event Error:", error)
        throw new Error("Failed to delete event")
    }

    revalidatePath("/events")
    revalidatePath("/admin/events")
}

export async function getPublicEvents() {
    const supabase = await getSupabase()
    const { data, error } = await supabase.from('events')
        .select(`
            *,
            club:clubs!events_club_id_fkey(name, logo_url)
        `)
        .eq('status', 'live')
        .order('created_at', { ascending: false })

    return data || []
}

export async function getEvents() {
    const supabase = await getSupabase()
    const { data } = await supabase.from('events').select('*').order('created_at', { ascending: false })
    return data || []
}

export async function getEventById(id: string) {
    const supabase = await getSupabase()

    // Fetch event with club
    const { data: event, error } = await supabase.from('events')
        .select(`
            *,
            club:clubs!events_club_id_fkey(name, logo_url)
        `)
        .eq('id', id)
        .single()

    if (error || !event) return null

    // Fetch registration count separately (more reliable than count in select sometimes with foreign keys)
    const { count } = await supabase
        .from('registrations')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', id)

    return {
        ...event,
        registered_count: count || 0
    }
}
