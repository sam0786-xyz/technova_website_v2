'use client'

import { getPosts } from "@/lib/actions/community";
import { CreatePost } from "@/components/community/CreatePost";
import { PostList } from "@/components/community/PostList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ChevronRight, Users, Rocket, HelpCircle, Lightbulb, MessageSquare, PenSquare, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function CommunityPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const [fetchedPosts, fetchedSession] = await Promise.all([
                getPosts(),
                getSession()
            ]);
            setPosts(fetchedPosts);
            setSession(fetchedSession);
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
                    {/* DevSpace Portals */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        <Link href="/showcase" className="group block">
                            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 relative overflow-hidden h-full">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
                                <div className="flex items-start justify-between relative z-10">
                                    <div>
                                        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                                            <Rocket className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-400 transition-colors">Project Showcase</h3>
                                        <p className="text-sm text-gray-400">Explore amazing projects built by the Technova student community.</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all mt-4" />
                                </div>
                            </div>
                        </Link>
                        <Link href="/resources" className="group block">
                            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 hover:border-amber-500/50 transition-all duration-300 relative overflow-hidden h-full">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all" />
                                <div className="flex items-start justify-between relative z-10">
                                    <div>
                                        <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                                            <BookOpen className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-amber-400 transition-colors">Academic Resources</h3>
                                        <p className="text-sm text-gray-400">Access PYQs, notes, and study materials shared by seniors and peers.</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all mt-4" />
                                </div>
                            </div>
                        </Link>
                    </div>

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
                                {/* Show CreatePost if logged in, otherwise show login prompt */}
                                {session?.user ? (
                                    <div className="p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                                        <div className="w-12 h-12 rounded-xl bg-green-600/20 flex items-center justify-center text-green-400 mb-4">
                                            <PenSquare className="w-6 h-6" />
                                        </div>
                                        <h3 className="font-bold text-xl mb-4">Start a Discussion</h3>
                                        <CreatePost />
                                    </div>
                                ) : (
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
                                )}

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
