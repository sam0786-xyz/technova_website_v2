'use client'

import { getPosts } from "@/lib/actions/community";
import { CreatePost } from "@/components/community/CreatePost";
import { PostList } from "@/components/community/PostList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ChevronRight, Users, Rocket, HelpCircle, Lightbulb, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { use, useEffect, useState } from "react";

export default function CommunityPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const fetchedPosts = await getPosts();
            setPosts(fetchedPosts);
            setLoading(false);
        }
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black" />
                <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[120px]" />
                <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-purple-600/15 rounded-full blur-[100px]" />

                <div className="container mx-auto px-4 relative z-10">
                    {/* Breadcrumb */}
                    <motion.nav
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-sm mb-6"
                    >
                        <Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                            <Home className="w-4 h-4" /> Home
                        </Link>
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                        <span className="text-blue-400">Community</span>
                    </motion.nav>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-2xl"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-xl mb-6">
                            <Users className="w-4 h-4 text-blue-400" />
                            <span className="text-blue-400 font-medium text-sm">DevSpace Community</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                            Community & Collaboration
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Discuss ideas, find teammates, and share knowledge with the community.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12 relative">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Posts Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="lg:col-span-2"
                        >
                            <Tabs defaultValue="all" className="w-full">
                                <TabsList className="mb-6 bg-white/[0.03] border border-white/10 p-1 rounded-xl">
                                    <TabsTrigger value="all" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 rounded-lg gap-2">
                                        <MessageSquare className="w-4 h-4" /> All
                                    </TabsTrigger>
                                    <TabsTrigger value="projects" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 rounded-lg gap-2">
                                        <Rocket className="w-4 h-4" /> Projects
                                    </TabsTrigger>
                                    <TabsTrigger value="hackathons" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 rounded-lg gap-2">
                                        <Lightbulb className="w-4 h-4" /> Hackathons
                                    </TabsTrigger>
                                    <TabsTrigger value="questions" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400 rounded-lg gap-2">
                                        <HelpCircle className="w-4 h-4" /> Questions
                                    </TabsTrigger>
                                </TabsList>

                                <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                                    {loading ? (
                                        <div className="text-center py-12">
                                            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                            <p className="text-gray-400">Loading posts...</p>
                                        </div>
                                    ) : (
                                        <>
                                            <TabsContent value="all">
                                                <PostList posts={posts} userId={session?.user?.id} />
                                            </TabsContent>
                                            <TabsContent value="projects">
                                                <PostList posts={posts.filter(p => p.category === 'Project')} userId={session?.user?.id} />
                                            </TabsContent>
                                            <TabsContent value="hackathons">
                                                <PostList posts={posts.filter(p => p.category === 'Hackathon')} userId={session?.user?.id} />
                                            </TabsContent>
                                            <TabsContent value="questions">
                                                <PostList posts={posts.filter(p => p.category === 'Question')} userId={session?.user?.id} />
                                            </TabsContent>
                                        </>
                                    )}
                                </div>
                            </Tabs>
                        </motion.div>

                        {/* Sidebar */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="lg:col-span-1"
                        >
                            <div className="sticky top-32">
                                <div className="p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                                    <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400 mb-4">
                                        <MessageSquare className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-xl mb-2">Join the Conversation</h3>
                                    <p className="text-sm text-gray-400 mb-6">
                                        Log in to post questions, share projects, and connect with peers.
                                    </p>
                                    <Link href="/login">
                                        <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                                            Login to Post
                                        </Button>
                                    </Link>
                                </div>

                                {/* Quick Stats */}
                                <div className="mt-6 p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                                    <h4 className="font-semibold text-sm text-gray-400 uppercase tracking-wider mb-4">Community Stats</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">Total Posts</span>
                                            <span className="font-bold text-white">{posts.length}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">Projects</span>
                                            <span className="font-bold text-purple-400">{posts.filter(p => p.category === 'Project').length}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">Questions</span>
                                            <span className="font-bold text-amber-400">{posts.filter(p => p.category === 'Question').length}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
