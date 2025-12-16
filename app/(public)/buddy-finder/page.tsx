import { auth } from "@/lib/auth";
import { searchBuddies } from "@/lib/actions/profile";
import { BuddyCard } from "@/components/buddy/BuddyCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";

export default async function BuddyFinderPage({ searchParams }: { searchParams: { q?: string; skill?: string } }) {
    const query = searchParams.q;
    const skill = searchParams.skill;
    const session = await auth();

    const buddies = await searchBuddies(query, skill);

    return (
        <div className="container py-8 max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Buddy Finder</h1>
                    <p className="text-muted-foreground">
                        Connect with peers for hackathons, projects, and study groups.
                    </p>
                </div>
                {session?.user && (
                    <Link href="/profile/edit">
                        <Button variant="outline">Edit My Profile</Button>
                    </Link>
                )}
            </div>

            <div className="bg-card p-6 rounded-lg border shadow-sm mb-8">
                <form className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            name="skill"
                            placeholder="Search by skill (e.g. React, Python)..."
                            className="pl-9"
                            defaultValue={skill}
                        />
                    </div>
                    <Button type="submit">Search</Button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {buddies.map((buddy: any) => (
                    <BuddyCard key={buddy.id} buddy={buddy} />
                ))}
            </div>

            {buddies.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-muted-foreground text-lg mb-2">No active buddies found matching your criteria.</div>
                    <p className="text-sm text-muted-foreground">Try adjusting your search terms or be the first to update your profile!</p>
                </div>
            )}
        </div>
    );
}
