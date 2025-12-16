import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getProfileData, updateProfile } from "@/lib/actions/profile"
import { Button } from "@/components/ui/button"

export default async function EditProfilePage() {
    const session = await auth()
    if (!session) redirect("/login")

    const data = await getProfileData()

    return (
        <div className="container mx-auto py-12 px-4 max-w-2xl text-white">
            <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>

            <div className="bg-zinc-900 border border-white/10 p-8 rounded-2xl">
                <form action={updateProfile} className="space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">System ID</label>
                            <input
                                name="system_id"
                                defaultValue={data?.system_id || ''}
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none"
                                placeholder="e.g. 2023001234"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Year</label>
                            <select
                                name="year"
                                defaultValue={data?.year || ''}
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none"
                            >
                                <option value="" disabled>Select Year</option>
                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                                <option value="3">3rd Year</option>
                                <option value="4">4th Year</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Section</label>
                            <input
                                name="section"
                                defaultValue={data?.section || ''}
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none"
                                placeholder="e.g. A, B, C"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Mobile Number</label>
                            <input
                                name="mobile"
                                defaultValue={data?.mobile || ''}
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none"
                                placeholder="+91 9876543210"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Skills (Comma separated)</label>
                        <input
                            name="skills"
                            defaultValue={data?.skills?.join(', ') || ''}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none"
                            placeholder="React, Python, Design, AWS"
                        />
                        <p className="text-xs text-gray-500 mt-1">These will help you match with teammates in Buddy Finder.</p>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex justify-end">
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                            Save Changes
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    )
}
