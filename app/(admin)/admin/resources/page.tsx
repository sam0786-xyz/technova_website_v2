import { getAllResourcesAdmin } from "@/lib/actions/resources"
import { Shield, BookOpen } from "lucide-react"
import { ResourceTable } from "@/components/admin/ResourceTable"

export const metadata = {
    title: "Manage Resources | Admin Dashboard",
}

export default async function AdminResourcesPage() {
    const resources = await getAllResourcesAdmin()

    return (
        <div className="space-y-8 p-6 md:p-8 bg-black min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <BookOpen className="w-8 h-8 text-amber-500" />
                        Manage Resources
                    </h1>
                    <p className="text-gray-400 mt-1">Review and approve academic resources uploaded by students</p>
                </div>
                <div className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-sm text-blue-400 font-medium flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Admin Access
                </div>
            </div>

            <ResourceTable resources={resources} />
        </div>
    )
}
