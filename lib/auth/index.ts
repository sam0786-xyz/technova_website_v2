import NextAuth from "next-auth"
import { SupabaseAdapter } from "@auth/supabase-adapter"
import { config as authConfig } from "./config"

const supabaseUrl = "https://flsufzphoemuqscztmgj.supabase.co"
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

console.log("Auth Init: URL =", supabaseUrl)
console.log("Auth Init: Key Present =", !!supabaseServiceRoleKey)

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: SupabaseAdapter({
        url: supabaseUrl,
        secret: supabaseServiceRoleKey,
    }),
    session: { strategy: "jwt" },
    debug: false, // Enable Auth.js debug mode
    ...authConfig,
})
