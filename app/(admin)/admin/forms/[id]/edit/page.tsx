import { getFormById } from "@/lib/actions/forms"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { FormEditorTabs } from "./form-editor-tabs"

export default async function EditFormPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const form = await getFormById(id)

    if (!form) {
        notFound()
    }

    const mappedFields = form.fields.map((f: any) => ({
        id: f.id,
        type: f.type,
        label: f.label,
        description: f.description || undefined,
        required: f.required,
        options: f.options,
        allowOther: f.validation?.allowOther || false,
        minLength: f.validation?.minLength,
        maxLength: f.validation?.maxLength,
        minValue: f.validation?.minValue,
        maxValue: f.validation?.maxValue,
        optionRouting: f.validation?.optionRouting,
        validation: f.validation || {},
    }))

    return (
        <div className="pb-12 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin/forms"
                    className="p-3 bg-[#1e1e22] hover:bg-[#27272a] text-white rounded-xl transition-all border border-[#27272a]"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">
                        {form.title}
                    </h1>
                    <p className="text-[#71717a] text-sm mt-1">Configure questions and settings.</p>
                </div>
            </div>

            <FormEditorTabs form={form} initialFields={mappedFields} formId={id} />
        </div>
    )
}
