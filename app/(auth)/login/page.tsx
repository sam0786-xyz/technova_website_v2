import { LoginButton } from "@/components/auth/login-button"

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
            <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-center space-y-6 border border-white/20">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-white">Welcome to Technova</h1>
                    <p className="text-gray-300">The official digital platform for Sharda University&apos;s Technical Society.</p>
                </div>

                <div className="p-4 bg-blue-500/20 text-blue-200 text-sm rounded-lg space-y-2">
                    <p className="font-medium">Allowed Accounts:</p>
                    <ul className="text-left list-disc list-inside text-xs space-y-1">
                        <li><strong>Students:</strong> systemid.name@ug.sharda.ac.in or @pg.sharda.ac.in</li>
                    </ul>
                </div>

                <LoginButton />
            </div>
        </div>
    )
}
