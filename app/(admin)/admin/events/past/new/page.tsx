import { getClubs } from "@/lib/actions/clubs"
import { PastEventForm } from "@/components/admin/past-event-form"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { History } from "lucide-react"

export default async function CreatePastEventPage() {
    // Super admin only
    const session = await auth()
    if (!session || session.user.role !== 'super_admin') {
        redirect('/admin/events')
    }

    const clubs = await getClubs()

    return (
        <div className="min-h-screen bg-black p-6 md:p-8">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-500/20 rounded-xl">
                            <History className="w-6 h-6 text-purple-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-white">Add Past Event</h1>
                    </div>
                    <p className="text-gray-400">
                        Quickly log a completed event with minimal details for record keeping.
                    </p>
                </div>

                {/* Form Card */}
                <div className="rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl p-6 md:p-8">
                    <PastEventForm clubs={clubs} />
                </div>
            </div>
        </div>
    )
}
