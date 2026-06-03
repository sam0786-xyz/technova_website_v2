import { getFormById } from "@/lib/actions/forms"
import { getFormEvaluators, getEvaluationCriteria, getFormEvaluationResults } from "@/lib/actions/form-evaluation-actions"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { EvaluateClient } from "./evaluate-client"

export default async function EvaluatePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const form = await getFormById(id)
    if (!form) notFound()

    const evaluators = await getFormEvaluators(id)
    const criteria = await getEvaluationCriteria(id)
    const evaluations = await getFormEvaluationResults(id)

    return (
        <div className="pb-12 max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href={`/admin/forms/${id}/responses`}
                    className="p-3 bg-[#1e1e22] hover:bg-[#27272a] text-white rounded-xl transition-all border border-[#27272a]">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Evaluation Portal</h1>
                    <p className="text-[#71717a] text-sm mt-1">{form.title} — Manage evaluators and view scores</p>
                </div>
            </div>

            <EvaluateClient
                formId={id}
                formTitle={form.title}
                evaluators={evaluators}
                criteria={criteria}
                evaluations={evaluations}
            />
        </div>
    )
}
