import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"
import { getRoleFromEmail } from "./role-utils"

export const createClient = () => {
    const cookieStore = cookies()

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value, ...options })
                    } catch (error) {
                        // The `set` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
                remove(name: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value: "", ...options })
                    } catch (error) {
                        // The `delete` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )
}

export async function getUser() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) return null

    // Fetch role and system_id from metadata or simple logic
    // For now, mirroring NextAuth logic + potentially DB check if we migrated data
    // Using pure email logic for role to match previous config.ts behavior
    const role = getRoleFromEmail(user.email)

    // Need to fetch system_id from DB if not in metadata?
    // NextAuth was fetching from adapter (DB).
    // We can try to query the table directly if needed, but let's check metadata first.
    const system_id = user.user_metadata?.system_id

    return {
        ...user,
        role,
        system_id,
        image: user.user_metadata?.avatar_url || user.user_metadata?.picture,
        name: user.user_metadata?.full_name || user.user_metadata?.name,
        xp_points: 0 // TODO: Fetch from DB
    }
}
