'use client'

import { getProjects } from "@/lib/actions/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Home, ChevronRight, Code, Rocket, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ShowcasePage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProjects() {
            const results = await getProjects();
            setProjects(results);
            setLoading(false);
        }
        fetchProjects();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-black to-black" />
                <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] bg-emerald-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-teal-600/15 rounded-full blur-[100px]" />

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
                        <span className="text-emerald-400">Showcase</span>
                    </motion.nav>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-2xl"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-xl mb-6">
                                <Code className="w-4 h-4 text-emerald-400" />
                                <span className="text-emerald-400 font-medium text-sm">DevSpace Showcase</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                                Student Project Showcase
                            </h1>
                            <p className="text-gray-400 text-lg">
                                Explore amazing projects built by the Technova community. Get inspired and share your work.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Link href="/showcase/new">
                                <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] font-bold">
                                    <Plus className="w-5 h-5 mr-2" />
                                    Submit Project
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Projects Grid */}
            <section className="py-12">
                <div className="container mx-auto px-4 max-w-7xl">
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-gray-400">Loading projects...</p>
                        </div>
                    ) : projects.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-24 rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-dashed border-white/10"
                        >
                            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mx-auto mb-6">
                                <Rocket className="w-10 h-10 text-emerald-400" />
                            </div>
                            <h3 className="text-3xl font-bold mb-3">No Projects Yet</h3>
                            <p className="text-gray-400 max-w-md mx-auto mb-8">
                                Be the first to showcase your work to the world! Share your projects and inspire others.
                            </p>
                            <Link href="/showcase/new">
                                <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                                    <Sparkles className="w-5 h-5 mr-2" />
                                    Submit Your First Project
                                </Button>
                            </Link>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            {projects.map((project: any, idx: number) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <ProjectCard project={project} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </section>
        </div>
    );
}
