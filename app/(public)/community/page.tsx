import { getPosts } from "@/lib/actions/community";
import { CreatePost } from "@/components/community/CreatePost";
import { PostList } from "@/components/community/PostList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function CommunityPage() {
    const posts = await getPosts();
    const session = await auth();
    const userId = session?.user?.id;

    return (
        <div className="container py-8 max-w-5xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Community & Collaboration</h1>
                <p className="text-muted-foreground">
                    Discuss ideas, find teammates, and share knowledge with the community.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <Tabs defaultValue="all" className="w-full">
                        <TabsList className="mb-4">
                            <TabsTrigger value="all">All Posts</TabsTrigger>
                            <TabsTrigger value="projects">Projects</TabsTrigger>
                            <TabsTrigger value="hackathons">Hackathons</TabsTrigger>
                            <TabsTrigger value="questions">Questions</TabsTrigger>
                        </TabsList>
                        <TabsContent value="all">
                            <PostList posts={posts} userId={userId} />
                        </TabsContent>
                        <TabsContent value="projects">
                            <PostList posts={posts.filter(p => p.category === 'Project')} userId={userId} />
                        </TabsContent>
                        <TabsContent value="hackathons">
                            <PostList posts={posts.filter(p => p.category === 'Hackathon')} userId={userId} />
                        </TabsContent>
                        <TabsContent value="questions">
                            <PostList posts={posts.filter(p => p.category === 'Question')} userId={userId} />
                        </TabsContent>
                    </Tabs>
                </div>

                <div className="md:col-span-1">
                    <div className="sticky top-6">
                        {session ? (
                            <CreatePost />
                        ) : (
                            <div className="rounded-xl border bg-card text-card-foreground shadow">
                                <div className="p-6 space-y-4">
                                    <h3 className="font-semibold text-lg">Join the Conversation</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Log in to post questions, share projects, and connect with peers.
                                    </p>
                                    <Link href="/login" className="block">
                                        <Button className="w-full">Login to Post</Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
