import { getFormById, getFormResponses, getFormReferralLeaderboard } from "@/lib/actions/forms"
import { ArrowLeft, Users, Trophy } from "lucide-react"
import Link from "next/link"
import { ResponsesClient } from "./responses-client"

export default async function FormResponsesPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const form = await getFormById(id)
    const { fields, responses } = await getFormResponses(id)
    const leaderboard = await getFormReferralLeaderboard(id)

    if (!form) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-[#ef4444]">Form Not Found</h2>
                    <Link href="/admin/forms" className="text-[#3b82f6] hover:underline mt-4 inline-block">Back to Forms</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-10">
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-[#27272a] pb-6">
                <Link
                    href="/admin/forms"
                    className="p-3 bg-[#1e1e22] hover:bg-[#27272a] text-white rounded-xl transition-all border border-[#27272a] shrink-0"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">{form.title}</h1>
                    <p className="text-[#71717a] flex items-center gap-2 mt-1">
                        <Users className="w-4 h-4" /> {responses.length} Total Responses
                    </p>
                </div>
            </div>

            {/* Referral Leaderboard */}
            {leaderboard.length > 0 && (
                <div className="bg-[#141416] border border-[#a78bfa]/20 rounded-2xl overflow-hidden">
                    <div className="p-5 border-b border-[#1e1e22]">
                        <h3 className="text-lg font-semibold text-[#a78bfa] flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-[#fbbf24]" />
                            Referral Leaderboard
                        </h3>
                    </div>
                    <div className="divide-y divide-[#1e1e22]">
                        {leaderboard.slice(0, 5).map((l, idx) => (
                            <div key={l.system_id} className="flex items-center justify-between p-4 hover:bg-[#1e1e22]/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${idx === 0 ? "bg-[#fbbf24]/20 text-[#fbbf24]" : idx === 1 ? "bg-[#94a3b8]/20 text-[#94a3b8]" : idx === 2 ? "bg-[#cd7f32]/20 text-[#cd7f32]" : "bg-[#1e1e22] text-[#71717a]"}`}>
                                        #{idx + 1}
                                    </span>
                                    <div>
                                        <p className="text-white font-medium text-sm">{l.name}</p>
                                        <p className="text-[#52525b] text-xs">{l.system_id}</p>
                                    </div>
                                </div>
                                <span className="text-[#a78bfa] font-bold text-sm">
                                    {l.count} {l.count === 1 ? "referral" : "referrals"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Responses table + actions (client component) */}
            <ResponsesClient
                formId={id}
                formTitle={form.title}
                fields={fields}
                responses={responses}
            />
        </div>
    )
}
