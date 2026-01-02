'use client'

import { motion } from 'framer-motion'
import { Sparkles, Rocket, Calendar, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function TechfestTeaser() {
    return (
        <section className="relative py-24 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-purple-950/50 via-black to-black" />

                {/* Animated Grid */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(147, 51, 234, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(147, 51, 234, 0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '50px 50px',
                        maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)'
                    }}
                />

                {/* Floating Particles */}
                <motion.div
                    className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-500 rounded-full"
                    animate={{
                        y: [0, -20, 0],
                        opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.div
                    className="absolute top-1/3 right-1/3 w-3 h-3 bg-blue-500 rounded-full"
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0.3, 1, 0.3]
                    }}
                    transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                />
                <motion.div
                    className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-cyan-400 rounded-full"
                    animate={{
                        y: [0, -25, 0],
                        opacity: [0.4, 1, 0.4]
                    }}
                    transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
                />

                {/* Glowing Orbs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/20 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-blue-600/15 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-cyan-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/40 backdrop-blur-xl mb-8"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        >
                            <Sparkles className="w-4 h-4 text-purple-400" />
                        </motion.div>
                        <span className="text-purple-300 font-medium text-sm uppercase tracking-wider">Coming Soon</span>
                    </motion.div>

                    {/* Main Heading with Glow */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="relative mb-6"
                    >
                        <h2 className="text-5xl md:text-7xl font-black tracking-tight">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
                                TECHFEST
                            </span>
                            <span className="block text-white mt-2">2026</span>
                        </h2>
                        {/* Glow effect behind text */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-cyan-600/30 blur-3xl -z-10" />
                    </motion.div>

                    {/* Tagline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-gray-300 mb-8 font-light"
                    >
                        Something <span className="text-purple-400 font-semibold">extraordinary</span> is on its way.
                        <br />
                        <span className="text-lg text-gray-400">The biggest tech event of the year.</span>
                    </motion.p>

                    {/* Animated Countdown Placeholder */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="flex justify-center gap-4 md:gap-8 mb-10"
                    >
                        {['Innovations', 'Workshops', 'Competitions', 'Networking'].map((item, idx) => (
                            <motion.div
                                key={item}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 + idx * 0.1 }}
                                className="flex flex-col items-center"
                            >
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center mb-2 group hover:border-purple-500/50 transition-colors">
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.1, 1],
                                        }}
                                        transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                                    >
                                        {idx === 0 && <Rocket className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />}
                                        {idx === 1 && <span className="text-2xl md:text-3xl">🛠️</span>}
                                        {idx === 2 && <span className="text-2xl md:text-3xl">🏆</span>}
                                        {idx === 3 && <span className="text-2xl md:text-3xl">🤝</span>}
                                    </motion.div>
                                </div>
                                <span className="text-xs text-gray-500 font-medium">{item}</span>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                    >
                        <Link
                            href="#"
                            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl font-bold text-lg transition-all shadow-[0_0_40px_rgba(147,51,234,0.4)] hover:shadow-[0_0_60px_rgba(147,51,234,0.6)] hover:scale-105"
                        >
                            <Calendar className="w-5 h-5" />
                            Stay Tuned
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>

                    {/* Bottom Text */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                        className="mt-8 text-sm text-gray-500"
                    >
                        Details revealing soon • Follow us for updates
                    </motion.p>
                </div>
            </div>
        </section>
    )
}
