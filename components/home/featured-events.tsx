'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Calendar, MapPin, Clock, ExternalLink, Zap, Terminal } from 'lucide-react'
import { useState, useEffect } from 'react'

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]

export function FeaturedEvents() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <section className="relative overflow-hidden bg-[var(--sig-bg)] border-y border-[var(--sig-border)]">

            {/* ── Hackathon Live Banner ── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: EASE_OUT }}
                className="relative"
            >
                <Link href="/hackathon" className="group block">
                    <div className="relative overflow-hidden">
                        {/* Left accent bar */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-400 via-white to-green-500 z-10" />

                        {/* Scrolling background text */}
                        <div className="absolute inset-0 flex items-center overflow-hidden opacity-[0.03] pointer-events-none">
                            <div className="animate-marquee whitespace-nowrap flex">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <span key={i} className="text-[6rem] font-heading font-black uppercase tracking-tighter mx-8">
                                        INNOVATE BHARAT 2026 • HACKATHON LIVE •
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Main content */}
                        <div className="container mx-auto px-6 lg:px-16 py-6 relative z-10">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                                {/* Left: Status + Name */}
                                <div className="flex items-center gap-5 flex-wrap">
                                    {/* Live beacon */}
                                    <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-[var(--sig-green)]/30 bg-[var(--sig-green)]/10">
                                        <div className="w-2 h-2 rounded-full bg-[var(--sig-green)] animate-live-pulse" />
                                        <span className="text-[var(--sig-green)] text-[11px] font-bold uppercase tracking-[0.15em]">Live</span>
                                    </div>

                                    <div>
                                        <h3 className="text-lg md:text-xl font-heading font-bold text-[var(--sig-text)] flex items-center gap-2">
                                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-white to-green-500">INNOVATE BHARAT</span>
                                            <span className="text-[var(--sig-text-secondary)] font-normal text-sm">Hackathon 2026</span>
                                        </h3>
                                    </div>
                                </div>

                                {/* Center: Quick info */}
                                <div className="hidden lg:flex items-center gap-6 text-[var(--sig-text-secondary)] text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span className="font-medium">April 10-11, 2026</span>
                                    </div>
                                    <div className="w-px h-4 bg-[var(--sig-border)]" />
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span className="font-medium">24 Hours</span>
                                    </div>
                                    <div className="w-px h-4 bg-[var(--sig-border)]" />
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span className="font-medium">Block 45, Sharda University</span>
                                    </div>
                                </div>

                                {/* Right: CTA */}
                                <div className="flex items-center gap-3">
                                    <span className="hidden md:inline-block px-2.5 py-1 rounded border border-[var(--sig-amber)]/20 bg-[var(--sig-amber)]/10 text-[var(--sig-amber)] text-[10px] font-bold uppercase tracking-wider">
                                        ₹2,00,000 Prize Pool
                                    </span>
                                    <div className="flex items-center gap-2 text-[var(--sig-amber)] font-heading font-bold text-sm uppercase tracking-wider group-hover:gap-3 transition-all duration-200" style={{ transitionTimingFunction: 'var(--ease-out)' }}>
                                        Enter Dashboard
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" style={{ transitionTimingFunction: 'var(--ease-out)' }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hover glow */}
                        <div className="absolute inset-0 bg-[var(--sig-amber)]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>
                </Link>
            </motion.div>

        </section>
    )
}
