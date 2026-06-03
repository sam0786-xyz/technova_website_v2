"use server"

import { createClient as createServerClient } from "@supabase/supabase-js"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

function getSupabase() {
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

const DEFAULT_CRITERIA = [
    "Communication Skills",
    "Teamwork & Collaboration",
    "Dedication & Commitment",
    "Relevance to Role",
    "Leadership Potential"
]

// ============================================================
// EVALUATION CRITERIA
// ============================================================

export async function getEvaluationCriteria(formId: string): Promise<string[]> {
    const supabase = getSupabase()
    const { data } = await supabase
        .from("forms")
        .select("evaluation_criteria")
        .eq("id", formId)
        .single()

    return data?.evaluation_criteria || DEFAULT_CRITERIA
}

export async function updateEvaluationCriteria(formId: string, criteria: string[]) {
    const session = await auth()
    if (!session || !['admin', 'super_admin'].includes(session.user.role)) {
        throw new Error("Unauthorized")
    }

    const supabase = getSupabase()
    const { error } = await supabase
        .from("forms")
        .update({ evaluation_criteria: criteria })
        .eq("id", formId)

    if (error) throw new Error("Failed to update criteria")
    revalidatePath(`/admin/forms/${formId}/evaluate`)
    return { success: true }
}

// ============================================================
// EVALUATORS MANAGEMENT
// ============================================================

export async function getFormEvaluators(formId: string) {
    const supabase = getSupabase()
    const { data, error } = await supabase
        .from("form_evaluators")
        .select("*")
        .eq("form_id", formId)
        .order("created_at", { ascending: true })

    if (error) {
        console.error("Fetch evaluators error:", error)
        return []
    }
    return data || []
}

export async function addFormEvaluator(formId: string, name: string, email: string) {
    const session = await auth()
    if (!session || !['admin', 'super_admin'].includes(session.user.role)) {
        throw new Error("Unauthorized")
    }

    const supabase = getSupabase()
    const { data, error } = await supabase
        .from("form_evaluators")
        .insert({ form_id: formId, name, email })
        .select()
        .single()

    if (error) {
        if (error.code === '23505') throw new Error("This evaluator already exists for this form")
        throw new Error("Failed to add evaluator")
    }

    revalidatePath(`/admin/forms/${formId}/evaluate`)
    return data
}

export async function removeFormEvaluator(evaluatorId: string, formId: string) {
    const session = await auth()
    if (!session || !['admin', 'super_admin'].includes(session.user.role)) {
        throw new Error("Unauthorized")
    }

    const supabase = getSupabase()
    const { error } = await supabase
        .from("form_evaluators")
        .delete()
        .eq("id", evaluatorId)

    if (error) throw new Error("Failed to remove evaluator")
    revalidatePath(`/admin/forms/${formId}/evaluate`)
    return { success: true }
}

// ============================================================
// EVALUATOR AUTH (magic token)
// ============================================================

export async function getEvaluatorByToken(token: string) {
    const supabase = getSupabase()
    const { data } = await supabase
        .from("form_evaluators")
        .select("id, form_id, name, email")
        .eq("magic_token", token)
        .maybeSingle()

    return data
}

// ============================================================
// SUBMIT / UPDATE EVALUATION
// ============================================================

export async function submitFormEvaluation(
    evaluatorToken: string,
    responseId: string,
    scores: Record<string, number>,
    remarks: string
) {
    const evaluator = await getEvaluatorByToken(evaluatorToken)
    if (!evaluator) throw new Error("Invalid evaluator token")

    const supabase = getSupabase()

    // Upsert evaluation
    const { error } = await supabase
        .from("form_evaluations")
        .upsert({
            form_id: evaluator.form_id,
            evaluator_id: evaluator.id,
            response_id: responseId,
            scores,
            remarks,
            updated_at: new Date().toISOString()
        }, { onConflict: "evaluator_id,response_id" })

    if (error) {
        console.error("Evaluation submit error:", error)
        throw new Error("Failed to submit evaluation")
    }

    return { success: true }
}

// ============================================================
// EVALUATION RESULTS (admin view)
// ============================================================

export async function getFormEvaluationResults(formId: string) {
    const session = await auth()
    if (!session || !['admin', 'super_admin'].includes(session.user.role)) {
        throw new Error("Unauthorized")
    }

    const supabase = getSupabase()

    // Get all evaluations for this form (no cross-schema join)
    const { data: evaluations, error } = await supabase
        .from("form_evaluations")
        .select(`
            *,
            evaluator:form_evaluators(id, name, email)
        `)
        .eq("form_id", formId)
        .order("created_at", { ascending: true })

    if (error) {
        console.error("Fetch evaluations error:", error)
        return []
    }

    if (!evaluations || evaluations.length === 0) return []

    // Fetch the related responses and their answers
    const responseIds = [...new Set(evaluations.map(e => e.response_id))]
    const { data: responses } = await supabase
        .from("form_responses")
        .select(`
            id, user_id,
            answers:form_response_answers(field_id, answer_text, answer_json)
        `)
        .in("id", responseIds)

    // Fetch user details from next_auth schema
    const userIds = [...new Set((responses || []).map((r: any) => r.user_id))]
    let usersMap: Record<string, any> = {}
    if (userIds.length > 0) {
        const { data: users } = await supabase
            .schema("next_auth")
            .from("users")
            .select("id, name, email, system_id")
            .in("id", userIds)
        for (const u of (users || [])) {
            usersMap[u.id] = u
        }
    }

    // Build response map with user data merged
    const responseMap: Record<string, any> = {}
    for (const r of (responses || [])) {
        responseMap[r.id] = {
            ...r,
            user: usersMap[r.user_id] || { name: "Unknown", email: "", system_id: "" }
        }
    }

    // Enrich evaluations with response + user data
    return evaluations.map(ev => ({
        ...ev,
        response: responseMap[ev.response_id] || null
    }))
}

// Get candidates (form responses) for evaluation
export async function getFormCandidates(formId: string) {
    const supabase = getSupabase()

    const { data: responses, error } = await supabase
        .from("form_responses")
        .select(`
            id, user_id, created_at,
            answers:form_response_answers(field_id, answer_text, answer_json)
        `)
        .eq("form_id", formId)
        .order("created_at", { ascending: true })

    if (error) return []

    // Fetch user details from next_auth schema
    const userIds = [...new Set((responses || []).map((r: any) => r.user_id))]
    let usersMap: Record<string, any> = {}
    if (userIds.length > 0) {
        const { data: users } = await supabase
            .schema("next_auth")
            .from("users")
            .select("id, name, email, system_id")
            .in("id", userIds)
        for (const u of (users || [])) {
            usersMap[u.id] = u
        }
    }

    return (responses || []).map((r: any) => ({
        ...r,
        user: usersMap[r.user_id] || { name: "Unknown", email: "", system_id: "" }
    }))
}

// Get evaluations by a specific evaluator
export async function getEvaluationsByEvaluator(evaluatorId: string) {
    const supabase = getSupabase()

    const { data, error } = await supabase
        .from("form_evaluations")
        .select("response_id, scores, remarks, updated_at")
        .eq("evaluator_id", evaluatorId)

    if (error) throw new Error("Failed to fetch evaluations")
    return data || []
}
