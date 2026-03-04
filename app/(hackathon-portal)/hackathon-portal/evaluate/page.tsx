import { checkHackathonRole, getHackathonSettings } from "@/lib/actions/hackathon"
import { redirect } from "next/navigation"
import EvaluatorDashboardClient from "@/app/(admin)/admin/hackathon/evaluate/client"

export default async function HackathonEvaluatePage() {
    const { role } = await checkHackathonRole()

    // Only organizers and evaluators can evaluate
    if (role !== 'organizer' && role !== 'evaluator') {
        redirect("/hackathon-portal")
    }

    const settings = await getHackathonSettings()

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                    Team Evaluation
                </h1>
                <p className="text-gray-400 mt-2 text-sm md:text-base">
                    Score teams based on the 6-point rubric. Select a team to expand and submit your evaluation.
                </p>
            </div>

            {!settings?.evaluation_open && (
                <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm">
                    ⚠️ The evaluation period is currently <strong>closed</strong>. You can view teams but cannot submit scores.
                </div>
            )}

            <div className="border border-zinc-800 bg-zinc-900/50 rounded-2xl p-6 shadow-xl backdrop-blur-xl">
                <EvaluatorDashboardClient initialTeams={[]} evaluationOpen={settings?.evaluation_open ?? false} />
            </div>
        </div>
    )
}
