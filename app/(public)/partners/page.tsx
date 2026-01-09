'use client'

import { SponsorShowcase } from "@/components/partners/SponsorShowcase";
import { PartnershipForm } from "@/components/partners/PartnershipForm";
import { EcosystemHighlight } from "@/components/partners/EcosystemHighlight";
import { motion } from "framer-motion";
import { Home, ChevronRight, Handshake, Target, Users, Lightbulb, Mic, Quote } from "lucide-react";
import Link from "next/link";

export default function PartnersPage() {
    return (
        <div className="min-h-screen bg-black text-white overflow-hidden">
            {/* Hero Section */}
            <section className="relative py-32 md:py-40 overflow-hidden">
                {/* Animated Background Effects */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-cyan-600/10 rounded-full blur-[80px]" />

                <div className="container mx-auto px-4 relative z-10">
                    {/* Breadcrumb */}
                    <motion.nav
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-sm mb-8"
                    >
                        <Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                            <Home className="w-4 h-4" /> Home
                        </Link>
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                        <span className="text-blue-400">Partners</span>
                    </motion.nav>

                    <div className="text-center max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-xl mb-8 shadow-[0_0_30px_rgba(59,130,246,0.2)]"
                        >
                            <Handshake className="w-4 h-4 text-blue-400" />
                            <span className="text-blue-400 font-medium text-sm tracking-wider uppercase">Partnership Opportunities</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50"
                        >
                            Partner with{" "}
                            <span className="text-blue-500">Technova</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
                        >
                            Join us in building the future of technology by supporting the most vibrant student technical community at Sharda University.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Ecosystem Stats */}
            <section className="py-16 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 to-black" />
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-3">Our Reach</h2>
                        <h3 className="text-3xl md:text-4xl font-bold">A Thriving Tech Ecosystem</h3>
                    </motion.div>
                    <EcosystemHighlight />
                </div>
            </section>

            {/* Value Proposition */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-3">Benefits</h2>
                            <h3 className="text-4xl font-bold mb-8">Why Partner With Us?</h3>
                            <div className="space-y-6">
                                {[
                                    { icon: Users, text: "Access to top engineering talent for internships and full-time roles." },
                                    { icon: Target, text: "Brand visibility across our events, hackathons, and workshops." },
                                    { icon: Lightbulb, text: "Direct engagement with student projects and research." },
                                    { icon: Mic, text: "Opportunities to host tech talks and mentorship sessions." }
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400 shrink-0">
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <span className="text-gray-300 leading-relaxed">{item.text}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-blue-500/30 transition-all duration-500"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                                    <Quote className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold">What Partners Say</h3>
                            </div>
                            <p className="text-gray-400 italic text-lg leading-relaxed mb-6">
                                &ldquo;Technova has been instrumental in bridging the gap between academia and industry. The students here are ready to tackle real-world challenges from day one.&rdquo;
                            </p>
                            <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                    P
                                </div>
                                <div>
                                    <div className="font-semibold text-white">Partner Company</div>
                                    <div className="text-sm text-gray-500">Industry Partner</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Sponsor Showcase */}
            <section className="py-16 bg-zinc-900/50 border-y border-white/5">
                <div className="container mx-auto px-4">
                    <SponsorShowcase />
                </div>
            </section>

            {/* Partnership Inquiry Form */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-3">Get In Touch</h2>
                        <h3 className="text-4xl font-bold mb-4">Let&apos;s Build Together</h3>
                        <p className="text-gray-400 max-w-xl mx-auto">
                            Ready to make an impact? Send us an inquiry and our team will get back to you.
                        </p>
                    </motion.div>
                    <PartnershipForm />
                </div>
            </section>
        </div>
    );
}
