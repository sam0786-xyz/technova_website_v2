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
    const course = formData.get("course") as string
    const mobile = formData.get("mobile") as string
    const skills = (formData.get("skills") as string).split(',').map(s => s.trim()).filter(s => s.length > 0)

    // 1. Update User Details (next_auth.users)
    const { error: userError } = await supabase.schema('next_auth').from('users').update({
        section,
        system_id,
        year,
        course,
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

    // Get profiles first
    let profilesQuery = supabase.from('profiles').select('id, skills')

    // Filter by skill if provided
    if (skill && skill.trim() !== '') {
        profilesQuery = profilesQuery.contains('skills', [skill])
    }

    const { data: profiles, error: profilesError } = await profilesQuery

    if (profilesError) {
        console.error("Search Buddies Error:", profilesError)
        return []
    }

    if (!profiles || profiles.length === 0) {
        return []
    }

    // Get user IDs from profiles
    const userIds = profiles.map((p: any) => p.id)

    // Fetch user details from next_auth.users
    const { data: users, error: usersError } = await supabase
        .schema('next_auth')
        .from('users')
        .select('id, name, image, role, course, year')
        .in('id', userIds)

    if (usersError) {
        console.error("Search Users Error:", usersError)
        return []
    }

    // Create a map of profiles by id for quick lookup
    const profilesMap = new Map(profiles.map((p: any) => [p.id, p.skills]))

    // Combine users with their skills
    let buddies = (users || []).map((user: any) => ({
        id: user.id,
        name: user.name,
        image: user.image,
        role: user.role,
        course: user.course,
        year: user.year,
        skills: profilesMap.get(user.id) || []
    }))

    // Manual filter for name match if query exists
    if (query && query.trim() !== '') {
        const lowerQ = query.toLowerCase()
        buddies = buddies.filter(b => b.name?.toLowerCase().includes(lowerQ))
    }

    return buddies
}
