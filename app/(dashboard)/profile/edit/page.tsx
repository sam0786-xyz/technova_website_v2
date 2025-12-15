import { updateProfile, getProfile } from "@/lib/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function EditProfilePage() {
    const session = await auth();
    const user = session?.user;

    if (!user || !user.id) {
        redirect('/login'); // Or whatever the login route is
    }

    const profile = await getProfile(user.id);

    async function action(formData: FormData) {
        'use server'
        await updateProfile(null, formData);
    }

    return (
        <div className="container py-8 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                    <CardDescription>
                        Update your profile to help others find you.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={action} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                name="bio"
                                placeholder="Tell us about yourself..."
                                defaultValue={profile?.bio || ""}
                                className="min-h-[100px]"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="skills">Skills (comma separated)</Label>
                                <Input
                                    id="skills"
                                    name="skills"
                                    placeholder="React, Node.js, Python..."
                                    defaultValue={profile?.skills?.join(", ") || ""}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="interests">Interests (comma separated)</Label>
                                <Input
                                    id="interests"
                                    name="interests"
                                    placeholder="AI, Web3, Hackathons..."
                                    defaultValue={profile?.interests?.join(", ") || ""}
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="text-sm font-medium">Social Links</h3>
                            <div className="space-y-2">
                                <Label htmlFor="github_url">GitHub URL</Label>
                                <Input
                                    id="github_url"
                                    name="github_url"
                                    placeholder="https://github.com/username"
                                    defaultValue={profile?.github_url || ""}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                                <Input
                                    id="linkedin_url"
                                    name="linkedin_url"
                                    placeholder="https://linkedin.com/in/username"
                                    defaultValue={profile?.linkedin_url || ""}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="portfolio_url">Portfolio URL</Label>
                                <Input
                                    id="portfolio_url"
                                    name="portfolio_url"
                                    placeholder="https://mywebsite.com"
                                    defaultValue={profile?.portfolio_url || ""}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit">Save Changes</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
