'use server'

import { createClient as createServerClient } from "@supabase/supabase-js"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

async function getSupabase() {
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

export async function updateProfile(formData: FormData) {
    const session = await auth()
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated")
    }

    const supabase = await getSupabase()
    const userId = session.user.id

    const section = formData.get("section") as string
    const system_id = formData.get("system_id") as string
    const year = parseInt(formData.get("year") as string)
    const mobile = formData.get("mobile") as string
    const skills = (formData.get("skills") as string).split(',').map(s => s.trim()).filter(s => s.length > 0)

    // 1. Update User Details (next_auth.users)
    const { error: userError } = await supabase.schema('next_auth').from('users').update({
        section,
        system_id,
        year,
        mobile
    }).eq('id', userId)

    if (userError) {
        console.error("User Update Error:", userError)
        return { error: "Failed to update basic info" }
    }

    // 2. Update Profile Details (public.profiles)
    // Check if profile exists first
    const { data: profile } = await supabase.from('profiles').select('id').eq('id', userId).single()

    if (!profile) {
        await supabase.from('profiles').insert({
            id: userId,
            skills
        })
    } else {
        await supabase.from('profiles').update({
            skills
        }).eq('id', userId)
    }

    revalidatePath("/profile/edit")
    revalidatePath("/buddy-finder")
    return { success: true }
}

export async function getProfileData() {
    const session = await auth()
    if (!session || !session.user) return null

    const supabase = await getSupabase()
    const userId = session.user.id

    // Fetch User Data
    const { data: user } = await supabase.schema('next_auth').from('users').select('*').eq('id', userId).single()

    // Fetch Profile Data
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single()

    return {
        ...user,
        skills: profile?.skills || []
    }
}

export async function searchBuddies(query?: string, skill?: string) {
    const supabase = await getSupabase()

    let dbQuery = supabase
        .from('profiles')
        .select(`
            skills,
            user:users!inner(
                id,
                name,
                image,
                role,
                course,
                year
            )
        `)

    // Filter by skill if provided
    if (skill && skill.trim() !== '') {
        dbQuery = dbQuery.contains('skills', [skill])
    }

    // Note: Filtering by name on the joined table is tricky with standard Supabase client in one go if RLS allows.
    // simpler approach: fetch all (or limit) and filter in memory if query is complex, 
    // BUT for 'name', we can search on the joined relation if we use !inner join and proper syntax,
    // or we can search users first then get profiles.

    // Let's stick to skill based mostly, as that's the primary use case.
    // If query is present (name search), we might need a text search on user.name

    const { data, error } = await dbQuery

    if (error) {
        console.error("Search Buddies Error:", error)
        return []
    }

    // Flatten logic
    let buddies = data.map((item: any) => ({
        id: item.user.id,
        name: item.user.name,
        image: item.user.image,
        role: item.user.role,
        course: item.user.course,
        year: item.user.year,
        skills: item.skills
    }))

    // Manual filter for name match if query exists (simple substring match)
    if (query && query.trim() !== '') {
        const lowerQ = query.toLowerCase()
        buddies = buddies.filter(b => b.name?.toLowerCase().includes(lowerQ))
    }

    return buddies
}
