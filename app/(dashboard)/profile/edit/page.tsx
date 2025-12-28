import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getProfileData } from "@/lib/actions/profile"
import { ProfileEditForm } from "@/components/profile/profile-edit-form"
import { User } from "lucide-react"

export default async function EditProfilePage() {
    const session = await auth()
    if (!session) redirect("/login")

    const data = await getProfileData()

    return (
        <div className="container mx-auto py-8 px-4 max-w-2xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                {session.user.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500/30"
                        referrerPolicy="no-referrer"
                    />
                ) : (
                    <div className="w-16 h-16 rounded-2xl bg-blue-600/20 flex items-center justify-center border-2 border-blue-500/30">
                        <User className="w-8 h-8 text-blue-500" />
                    </div>
                )}
                <div>
                    <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
                    <p className="text-gray-400 text-sm">{session.user.email}</p>
                </div>
            </div>

            {/* Form Card */}
            <div className="p-6 md:p-8 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10">
                <ProfileEditForm initialData={data} />
            </div>
        </div>
    )
}
