'use server'

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { auth } from "@/lib/auth";

const createProjectSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    image_url: z.string().url().optional().or(z.literal("")),
    video_url: z.string().url().optional().or(z.literal("")),
    project_url: z.string().url().optional().or(z.literal("")),
    repo_url: z.string().url().optional().or(z.literal("")),
    tech_stack: z.string().optional(), // Comma separated
});

export async function createProject(prevState: any, formData: FormData) {
    const supabase = createClient();
    const session = await auth();
    const user = session?.user;

    if (!user || !user.id) {
        return { error: "You must be logged in to submit a project." };
    }

    const result = createProjectSchema.safeParse({
        title: formData.get("title"),
        description: formData.get("description"),
        image_url: formData.get("image_url"),
        video_url: formData.get("video_url"),
        project_url: formData.get("project_url"),
        repo_url: formData.get("repo_url"),
        tech_stack: formData.get("tech_stack"),
    });

    if (!result.success) {
        return { error: result.error.issues[0].message };
    }

    const { title, description, image_url, video_url, project_url, repo_url, tech_stack } = result.data;
    // Use admin client
    const supabaseAdmin = createAdminClient();
    const { error } = await supabaseAdmin.from('projects').insert({
        user_id: user.id,
        title,
        description,
        image_url,
        video_url,
        project_url,
        repo_url,
        tech_stack: tech_stack ? tech_stack.split(',').map(s => s.trim()) : []
    });

    if (error) {
        console.error("Error creating project:", error);
        return { error: "Failed to create project" };
    }

    revalidatePath('/showcase');
    redirect('/showcase');
}

export async function getProjects() {
    const supabase = createClient();
    const { data: projects, error } = await supabase
        .from('projects')
        .select(`*`)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching projects:", error);
        return [];
    }

    // Manually fetch user details
    const userIds = Array.from(new Set(projects.map((p: any) => p.user_id)));
    const supabaseAdmin = createAdminClient();
    const { data: users } = await supabaseAdmin
        .schema('next_auth')
        .from('users')
        .select('id, name, image')
        .in('id', userIds);

    const userMap = new Map(users?.map((u: any) => [u.id, u]));

    const projectsWithUsers = projects.map((project: any) => ({
        ...project,
        users: userMap.get(project.user_id) || { name: 'Unknown', image: null }
    }));

    return projectsWithUsers;
}
