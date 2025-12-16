'use server'

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/lib/auth";

const updateProfileSchema = z.object({
    bio: z.string().max(500).optional(),
    skills: z.string().optional(), // Comma separated
    interests: z.string().optional(), // Comma separated
    github_url: z.string().url().optional().or(z.literal("")),
    linkedin_url: z.string().url().optional().or(z.literal("")),
    portfolio_url: z.string().url().optional().or(z.literal("")),
});

export async function updateProfile(prevState: any, formData: FormData) {
    const supabase = createClient();
    const session = await auth();
    const user = session?.user;

    if (!user || !user.id) {
        return { error: "Not authenticated" };
    }

    const result = updateProfileSchema.safeParse({
        bio: formData.get("bio"),
        skills: formData.get("skills"),
        interests: formData.get("interests"),
        github_url: formData.get("github_url"),
        linkedin_url: formData.get("linkedin_url"),
        portfolio_url: formData.get("portfolio_url"),
    });

    if (!result.success) {
        return { error: result.error.issues[0].message };
    }

    const { bio, skills, interests, github_url, linkedin_url, portfolio_url } = result.data;

    const skillsArray = skills ? skills.split(',').map(s => s.trim()).filter(Boolean) : [];
    const interestsArray = interests ? interests.split(',').map(s => s.trim()).filter(Boolean) : [];

    const supabaseAdmin = createAdminClient();
    const { error } = await supabaseAdmin.from('profiles').upsert({
        id: user.id,
        bio,
        skills: skillsArray,
        interests: interestsArray,
        github_url,
        linkedin_url,
        portfolio_url,
        updated_at: new Date().toISOString(),
    });

    if (error) {
        console.error("Error updating profile:", error);
        return { error: "Failed to update profile" };
    }

    revalidatePath('/profile');
    revalidatePath('/buddy-finder');
    return { success: true };
}

export async function getProfile(userId?: string) {
    const supabase = createClient();

    let targetUserId = userId;
    if (!targetUserId) {
        const session = await auth();
        const user = session?.user;
        if (!user || !user.id) return null;
        targetUserId = user.id;
    }

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetUserId)
        .single();

    // If no profile found, return minimal valid object or null, 
    // but upsert handles creation so it might be null initially.
    if (error && error.code !== 'PGRST116') {
        console.error("Error fetching profile:", error);
    }

    return profile;
}

export async function searchBuddies(query?: string, skill?: string) {
    const supabase = createClient();

    let queryBuilder = supabase
        .from('profiles')
        .select('*');

    if (skill) {
        // Simple array contains check
        queryBuilder = queryBuilder.contains('skills', [skill]);
    }

    const { data: profiles, error } = await queryBuilder;

    if (error) {
        console.error("Error searching buddies:", error);
        return [];
    }

    if (!profiles || profiles.length === 0) return [];

    // Manually fetch user details
    const userIds = profiles.map((p: any) => p.id);
    const supabaseAdmin = createAdminClient();
    const { data: usersResponse, error: usersError } = await supabaseAdmin
        .schema('next_auth')
        .from('users')
        .select('id, name, email, image')
        .in('id', userIds);

    if (usersError) {
        console.error("Error fetching buddy users:", usersError);
        // Continue with profiles but missing user data? Or return empty?
        // Let's attach what we can or filter out.
    }

    const userMap = new Map(usersResponse?.map((u: any) => [u.id, u]));

    const buddies = profiles.map((p: any) => ({
        ...p,
        users: userMap.get(p.id) || { name: 'Unknown', email: null, image: null }
    }));

    if (query) {
        const lowerQuery = query.toLowerCase();
        return buddies.filter((p: any) =>
            p.users.name?.toLowerCase().includes(lowerQuery) ||
            p.users.email?.toLowerCase().includes(lowerQuery) ||
            p.bio?.toLowerCase().includes(lowerQuery)
        );
    }

    return buddies;
}
