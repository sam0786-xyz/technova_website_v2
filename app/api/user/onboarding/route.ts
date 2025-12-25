import { auth } from "@/lib/auth"
import { createClient as createServerClient } from "@supabase/supabase-js"

const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { db: { schema: 'next_auth' } }
)

const supabasePublic = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
    const session = await auth()

    if (!session || !session.user?.id) {
        return new Response("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { system_id, year, course, section, mobile, skills } = body

    if (!system_id || !year || !course || !section) {
        return new Response("Missing required fields", { status: 400 })
    }

    // Check uniqueness of system_id
    const { data: existing } = await supabase
        .from("users")
        .select("id")
        .eq("system_id", system_id)
        .maybeSingle()

    if (existing && existing.id !== session.user.id) {
        return new Response("System ID already in use", { status: 409 })
    }

    // Update user in next_auth.users
    const { error: userError } = await supabase
        .from("users")
        .update({
            system_id,
            year,
            course,
            section,
            mobile: mobile || null
        })
        .eq("id", session.user.id)

    if (userError) {
        console.error("User Update Error:", userError)
        return new Response("Database error", { status: 500 })
    }

    // Handle skills - update or insert into public.profiles
    if (skills && Array.isArray(skills) && skills.length > 0) {
        const { data: profile } = await supabasePublic
            .from("profiles")
            .select("id")
            .eq("id", session.user.id)
            .maybeSingle()

        if (!profile) {
            // Insert new profile
            const { error: insertError } = await supabasePublic
                .from("profiles")
                .insert({
                    id: session.user.id,
                    skills: skills
                })

            if (insertError) {
                console.error("Profile Insert Error:", insertError)
            }
        } else {
            // Update existing profile
            const { error: updateError } = await supabasePublic
                .from("profiles")
                .update({ skills: skills })
                .eq("id", session.user.id)

            if (updateError) {
                console.error("Profile Update Error:", updateError)
            }
        }
    }

    return new Response("OK", { status: 200 })
}
