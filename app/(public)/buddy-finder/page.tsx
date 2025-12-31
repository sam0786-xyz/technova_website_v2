'use client'

import { searchBuddies } from "@/lib/actions/profile";
import { BuddyCard } from "@/components/buddy/BuddyCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Home, ChevronRight, Users, UserPlus, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function BuddyFinderPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const skill = searchParams.get('skill') || '';

    const [buddies, setBuddies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBuddies() {
            const results = await searchBuddies(query, skill);
            setBuddies(results);
            setLoading(false);
        }
        fetchBuddies();
    }, [query, skill]);

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black" />
                <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/3 left-1/4 w-[300px] h-[300px] bg-blue-600/15 rounded-full blur-[100px]" />

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
                        <span className="text-purple-400">Buddy Finder</span>
                    </motion.nav>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-2xl"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-xl mb-6">
                                <Users className="w-4 h-4 text-purple-400" />
                                <span className="text-purple-400 font-medium text-sm">DevSpace Buddy Finder</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                                Find Your Perfect Buddy
                            </h1>
                            <p className="text-gray-400 text-lg">
                                Connect with peers for hackathons, projects, and study groups.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Link href="/profile/edit">
                                <Button className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)]">
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    Edit My Profile
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Search & Results */}
            <section className="py-12">
                <div className="container mx-auto px-4 max-w-6xl">
                    {/* Search Box */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] mb-10"
                    >
                        <form className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                <Input
                                    name="skill"
                                    placeholder="Search by skill (e.g. React, Python, Machine Learning)..."
                                    className="pl-12 bg-white/5 border-white/10 focus:border-purple-500/50 h-12 text-white placeholder:text-gray-500"
                                    defaultValue={skill}
                                />
                            </div>
                            <Button type="submit" className="h-12 px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500">
                                <Search className="w-4 h-4 mr-2" />
                                Search
                            </Button>
                        </form>
                    </motion.div>

                    {/* Results */}
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-gray-400">Finding buddies...</p>
                        </div>
                    ) : buddies.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-20 rounded-2xl bg-white/[0.02] border border-white/10"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 mx-auto mb-6">
                                <Users className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">No Buddies Found</h3>
                            <p className="text-gray-400 max-w-md mx-auto mb-6">
                                No active buddies found matching your criteria. Try adjusting your search or be the first to update your profile!
                            </p>
                            <Link href="/profile/edit">
                                <Button className="bg-purple-600 hover:bg-purple-500">
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Create Your Profile
                                </Button>
                            </Link>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {buddies.map((buddy: any, idx: number) => (
                                <motion.div
                                    key={buddy.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <BuddyCard buddy={buddy} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </section>
        </div>
    );
}
