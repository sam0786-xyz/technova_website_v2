'use server'

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { auth } from "@/lib/auth";

const createResourceSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    file_url: z.string().url("Must be a valid URL"),
    type: z.string(),
    semester: z.string().optional(),
    subject: z.string().optional(),
});

export async function createResource(prevState: any, formData: FormData) {
    const supabase = createClient();
    const session = await auth();
    const user = session?.user;

    if (!user || !user.id) {
        return { error: "You must be logged in to upload resources." };
    }

    // Check valid role or permissions if needed
    // For now, allow any logged in user to upload, but marked as unverified by default in DB

    const result = createResourceSchema.safeParse({
        title: formData.get("title"),
        description: formData.get("description"),
        file_url: formData.get("file_url"),
        type: formData.get("type"),
        semester: formData.get("semester"),
        subject: formData.get("subject"),
    });

    if (!result.success) {
        return { error: result.error.errors[0].message };
    }

    const { title, description, file_url, type, semester, subject } = result.data;

    // Use admin client
    const supabaseAdmin = createAdminClient();
    const { error } = await supabaseAdmin.from('resources').insert({
        uploaded_by: user.id,
        title,
        description,
        file_url,
        type,
        semester,
        subject,
        is_verified: true // Auto-verify for now or controlled by admin policy later
    });

    if (error) {
        console.error("Error creating resource:", error);
        return { error: "Failed to upload resource" };
    }

    revalidatePath('/resources');
    return { success: true };
}

export async function getResources(semester?: string, subject?: string) {
    const supabase = createClient();
    let query = supabase
        .from('resources')
        .select('*')
        .eq('is_verified', true) // Only show verified
        .order('created_at', { ascending: false });

    if (semester && semester !== 'all') {
        query = query.eq('semester', semester);
    }

    // Subject filter would require exact match or we filter in client if fuzzy
    if (subject) {
        // Simple exact match for now
        query = query.ilike('subject', `%${subject}%`);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching resources:", error);
        return [];
    }

    return data;
}
