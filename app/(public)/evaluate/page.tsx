import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { checkEvaluatorAccess, getTeamsForEvaluation } from "@/lib/actions/hackathon";
import EvaluatorDashboardClient from "./client";

export default async function EvaluatorPage() {
    const session = await auth();

    if (!session || !session.user) {
        redirect("/login?callbackUrl=/evaluate");
    }

    const evaluator = await checkEvaluatorAccess();

    if (!evaluator) {
        return (
            <div className="min-h-screen pt-32 pb-20 px-4 max-w-7xl mx-auto flex items-center justify-center">
                <div className="text-center p-8 rounded-2xl bg-red-500/10 border border-red-500/20 max-w-md backdrop-blur-xl">
                    <h1 className="text-2xl font-bold text-red-400 mb-2">Access Denied</h1>
                    <p className="text-gray-400">
                        Your email ({session.user.email}) is not registered as an evaluator for this hackathon.
                        Please contact the organizers if you believe this is an error.
                    </p>
                </div>
            </div>
        );
    }

    const teams = await getTeamsForEvaluation();

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 max-w-7xl mx-auto">
            <div className="mb-12 border-b border-white/10 pb-8">
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500 mb-4 inline-block">
                    Evaluator Portal
                </h1>
                <p className="text-gray-400 text-lg max-w-3xl">
                    Welcome, <span className="text-white font-medium">{evaluator.name}</span>.
                    Please review the projects and submit your scores. Your evaluations are crucial for shortlisting the winning teams.
                </p>
            </div>

            <EvaluatorDashboardClient initialTeams={teams} />
        </div>
    );
}
