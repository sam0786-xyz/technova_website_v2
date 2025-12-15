"use client"

import { createClient } from "@/supabase/client"

export function LoginButton() {
    const supabase = createClient()

    const handleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: 'https://www.technovashardauniversity.in'
            }
        })
    }

    return (
        <button
            className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            onClick={handleLogin}
            type="button"
        >
            Sign in with Sharda Email
        </button>
    )
}
