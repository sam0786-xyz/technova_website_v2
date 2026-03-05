'use client'

import { getResources } from "@/lib/actions/resources";
import { ResourceList } from "@/components/resources/ResourceList";
import { UploadResource } from "@/components/resources/UploadResource";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Home, ChevronRight, BookOpen, FileText, GraduationCap, Filter } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function ResourcesPage() {
    const searchParams = useSearchParams();
    const subject = searchParams.get('subject') || '';
    const semesterParam = searchParams.get('semester') || 'all';

    const [resources, setResources] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        async function fetchResources() {
            const results = await getResources(semesterParam, subject);
            setResources(results);
            setLoading(false);
        }
        fetchResources();
    }, [semesterParam, subject]);

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-900/20 via-black to-black" />
                <div className="absolute top-1/2 right-1/3 w-[400px] h-[400px] bg-amber-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/3 left-1/4 w-[300px] h-[300px] bg-orange-600/15 rounded-full blur-[100px]" />

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
                        <span className="text-amber-400">Resources</span>
                    </motion.nav>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-2xl"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 backdrop-blur-xl mb-6">
                                <BookOpen className="w-4 h-4 text-amber-400" />
                                <span className="text-amber-400 font-medium text-sm">DevSpace Resources</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                                Academic Resources
                            </h1>
                            <p className="text-gray-400 text-lg">
                                Access PYQs, notes, and study materials shared by seniors and peers.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <UploadResource />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Search & Resources */}
            <section className="py-12">
                <div className="container mx-auto px-4 max-w-5xl">
                    {/* Filter Box */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] mb-10"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Filter className="w-5 h-5 text-amber-400" />
                            <h3 className="font-semibold">Filter Resources</h3>
                        </div>
                        <form className="flex flex-col md:flex-row gap-4">
                            <div className="w-full md:w-48">
                                <Select name="semester" defaultValue={semesterParam}>
                                    <SelectTrigger className="bg-white/5 border-white/10 focus:border-amber-500/50 h-12">
                                        <SelectValue placeholder="Semester" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-white/10">
                                        <SelectItem value="all">All Semesters</SelectItem>
                                        <SelectItem value="Sem 1">Sem 1</SelectItem>
                                        <SelectItem value="Sem 2">Sem 2</SelectItem>
                                        <SelectItem value="Sem 3">Sem 3</SelectItem>
                                        <SelectItem value="Sem 4">Sem 4</SelectItem>
                                        <SelectItem value="Sem 5">Sem 5</SelectItem>
                                        <SelectItem value="Sem 6">Sem 6</SelectItem>
                                        <SelectItem value="Sem 7">Sem 7</SelectItem>
                                        <SelectItem value="Sem 8">Sem 8</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                <Input
                                    name="subject"
                                    placeholder="Search for subjects..."
                                    className="pl-12 bg-white/5 border-white/10 focus:border-amber-500/50 h-12 placeholder:text-gray-500"
                                    defaultValue={subject}
                                />
                            </div>
                            <Button type="submit" className="h-12 px-8 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500">
                                <Search className="w-4 h-4 mr-2" />
                                Filter
                            </Button>
                        </form>
                    </motion.div>

                    {/* Resources */}
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-gray-400">Loading resources...</p>
                        </div>
                    ) : resources.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-20 rounded-2xl bg-white/[0.02] border border-white/10"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 mx-auto mb-6">
                                <FileText className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">No Resources Found</h3>
                            <p className="text-gray-400 max-w-md mx-auto mb-6">
                                No resources match your filter criteria. Try adjusting your search or be the first to upload!
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
                        >
                            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
                                <GraduationCap className="w-5 h-5 text-amber-400" />
                                <span className="font-semibold">{resources.length} Resources Found</span>
                            </div>
                            <ResourceList resources={resources} />
                        </motion.div>
                    )}
                </div>
            </section>
        </div>
    );
}
