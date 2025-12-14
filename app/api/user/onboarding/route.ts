import { auth } from "@/lib/auth"
import { createClient as createServerClient } from "@supabase/supabase-js"

const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { db: { schema: 'next_auth' } }
)

export async function POST(req: Request) {
    const session = await auth()

    if (!session || !session.user?.id) {
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

    if (existing && existing.id !== session.user.id) {
        return new Response("System ID already in use", { status: 409 })
    }

    // Update user
    const { error } = await supabase
        .from("users")
        .update({
            system_id,
            year,
            course,
            section
        })
        .eq("id", session.user.id)

    if (error) {
        console.error(error)
        return new Response("Database error", { status: 500 })
    }

    return new Response("OK", { status: 200 })
}
