import { getUser } from "@/lib/auth/supabase-server"
import { createClient as createServerClient } from "@supabase/supabase-js"

const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { db: { schema: 'next_auth' } }
)

export async function POST(req: Request) {
    const user = await getUser()

    if (!user || !user.id) {
        return new Response("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { system_id, year, course, section } = body

    if (!system_id || !year || !course || !section) {
        return new Response("Missing fields", { status: 400 })
    }

    // Check uniqueness of system_id
    const { data: existing } = await supabase
        .from("users")
        .select("id")
        .eq("system_id", system_id)
        .maybeSingle()

    if (existing && existing.id !== user.id) {
        return new Response("System ID already in use", { status: 409 })
    }

    // Update user (Upsert to create if missing from next_auth.users)
    const { error } = await supabase
        .from("users")
        .upsert({
            id: user.id,
            email: user.email,
            system_id,
            year,
            course,
            section,
            // Ensure other fields are present or handled if strict schema? 
            // Postgres upsert handles partial if we don't violate not-nulls.
        })
        .eq("id", user.id)

    if (error) {
        console.error(error)
        return new Response("Database error", { status: 500 })
    }

    return new Response("OK", { status: 200 })
}
