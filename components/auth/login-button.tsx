import { signIn } from "@/lib/auth"

export function LoginButton() {
    return (
        <form
            action={async () => {
                "use server"
                await signIn("google")
            }}
        >
            <button className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors" type="submit">Sign in with Sharda Email</button>
        </form>
    )
}
