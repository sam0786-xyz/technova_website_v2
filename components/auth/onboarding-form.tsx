'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export function OnboardingForm({ userId }: { userId: string }) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()
    const { update } = useSession()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError("")

        const formData = new FormData(e.currentTarget)
        const data = {
            system_id: formData.get("system_id"),
            year: parseInt(formData.get("year") as string),
            course: formData.get("course"),
            section: formData.get("section"),
            userId
        }

        try {
            const res = await fetch("/api/user/onboarding", {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" }
            })

            if (!res.ok) {
                const msg = await res.text()
                throw new Error(msg || "Failed to update profile")
            }

            // Update session with new data
            await update({
                system_id: data.system_id
            })

            router.refresh()
            router.push("/dashboard")
        } catch (err: unknown) {
            const error = err as Error
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">System ID</label>
                <input
                    name="system_id"
                    required
                    placeholder="e.g. 2021001234"
                    className="w-full p-2 border rounded-md"
                />
                <p className="text-xs text-gray-500 mt-1">Found on your ID card. Must be unique.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Year</label>
                    <select name="year" required className="w-full p-2 border rounded-md">
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Course</label>
                    <select name="course" required className="w-full p-2 border rounded-md">
                        <option value="CSE">CSE</option>
                        <option value="IT">IT</option>
                        <option value="ECE">ECE</option>
                        <option value="EE">EE</option>
                        <option value="ME">ME</option>
                        <option value="CE">CE</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Section</label>
                <select name="section" required className="w-full p-2 border rounded-md">
                    {Array.from({ length: 19 }, (_, i) => String.fromCharCode(65 + i)).map(char => (
                        <option key={char} value={char}>{char}</option>
                    ))}
                </select>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
                {loading ? "Saving..." : "Complete Profile"}
            </button>
        </form>
    )
}
