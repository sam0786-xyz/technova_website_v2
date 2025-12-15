import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { OnboardingForm } from "@/components/auth/onboarding-form"

export default async function OnboardingPage() {
    const session = await auth()

    if (!session) {
        redirect("/login")
    }

    // If already completed, redirect to dashboard
    if (session.user.system_id) {
        redirect("/dashboard")
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
            <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Complete Your Profile</h1>
                    <p className="text-gray-500">We need a few more details to set up your Technova account.</p>
                </div>

                <OnboardingForm userId={session.user.id} />
            </div>
        </div>
    )
}
