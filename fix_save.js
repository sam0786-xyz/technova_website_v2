const fs = require('fs');
const file = '/Users/sameer/Desktop/dumps/technova_website_v2/lib/actions/forms.ts';
let code = fs.readFileSync(file, 'utf8');

const replacementStr = `export async function saveFormFields(formId: string, fields: any[]) {
    const session = await auth()
    if (!session || !['admin', 'super_admin'].includes(session.user.role)) {
        throw new Error("Unauthorized")
    }

    const supabase = getSupabase()

    // 1. Fetch existing fields to see what needs to be deleted
    const { data: existingFields } = await supabase
        .from("form_fields")
        .select("id")
        .eq("form_id", formId)

    const incomingIds = fields.map(f => f.id).filter(Boolean)
    const existingIds = (existingFields || []).map(f => f.id)
    const idsToDelete = existingIds.filter(id => !incomingIds.includes(id))

    // 2. Delete removed fields
    if (idsToDelete.length > 0) {
        const { error: deleteError } = await supabase
            .from("form_fields")
            .delete()
            .in("id", idsToDelete)
            
        if (deleteError) {
            throw new Error("Failed to clear removed fields")
        }
    }

    // 3. Upsert current fields
    if (fields.length > 0) {
        const fieldsToUpsert = fields.map((f, i) => {
            const validation: any = {}
            if (f.minLength != null) validation.minLength = f.minLength
            if (f.maxLength != null) validation.maxLength = f.maxLength
            if (f.minValue != null) validation.minValue = f.minValue
            if (f.maxValue != null) validation.maxValue = f.maxValue
            if (f.allowOther) validation.allowOther = true
            
            if (f.validation?.afterSection) {
                validation.afterSection = f.validation.afterSection
            }

            if (f.optionRouting && Object.keys(f.optionRouting).length > 0) {
                validation.optionRouting = f.optionRouting
            }

            // Enforce phone safety limits
            if (f.type === 'phone') {
                validation.minLength = Math.max(validation.minLength || 10, 10)
                validation.maxLength = Math.min(validation.maxLength || 15, 15)
            }

            return {
                id: f.id,
                form_id: formId,
                label: f.label,
                description: f.description || null,
                type: f.type,
                options: f.options || null,
                required: f.required || false,
                order_index: i,
                validation: Object.keys(validation).length > 0 ? validation : null
            }
        })

        const { error: upsertError } = await supabase
            .from("form_fields")
            .upsert(fieldsToUpsert, { onConflict: "id" })

        if (upsertError) {
            console.error("Save Fields Error:", upsertError)
            throw new Error("Failed to save fields")
        }
    }

    revalidatePath(\`/admin/forms/\${formId}/edit\`)
    revalidatePath(\`/forms/\${formId}\`)
    return { success: true }
}`;

const startIndex = code.indexOf('export async function saveFormFields');
const revalidateIndex = code.indexOf('return { success: true }', startIndex);
if (startIndex !== -1 && revalidateIndex !== -1) {
    const originalBlock = code.substring(startIndex, revalidateIndex + 'return { success: true }'.length);
    code = code.replace(originalBlock, replacementStr);
    fs.writeFileSync(file, code);
    console.log("Success5");
} else {
    console.log("Could not find block", startIndex, revalidateIndex);
}
