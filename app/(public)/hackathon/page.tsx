'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Timer, Zap, Trophy, ShieldAlert, Cpu, HeartPulse, BookOpen, LineChart, Globe, GraduationCap, ChevronRight, Download, Users, CheckCircle2, Navigation, TrainFront, Plane, Train, Award, IndianRupee, Star, Clock, ListChecks, ArrowUpRight, CheckCircle, Activity } from 'lucide-react'
import { VenueCarousel } from '@/components/hackathon/venue-carousel'
import { useEffect, useState, useRef } from 'react'

const REGISTRATION_LINK = "https://docs.google.com/forms/d/e/1FAIpQLScDLjm7HDdkKXJqVIIQr9zp-cG95vnCrdNy2gjEtJtjxaZBXA/viewform"

export default function HackathonPage() {
    const [currentDate, setCurrentDate] = useState<Date | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [revealedContacts, setRevealedContacts] = useState<number[]>([])
    const [activeTrack, setActiveTrack] = useState<number | null>(null)
    const [liveData, setLiveData] = useState<{ settings: any; schedule: any[]; shortlistedTeams: any[] } | null>(null)

    // Setup polling for live data
    useEffect(() => {
        async function fetchLiveData() {
            try {
                const res = await fetch('/api/hackathon-live')
                if (res.ok) {
                    const data = await res.json()
                    setLiveData(data)
                }
            } catch (e) {
                console.error('Failed to fetch live data', e)
            }
        }
        fetchLiveData()
        const liveInterval = setInterval(fetchLiveData, 15000)
        return () => clearInterval(liveInterval)
    }, [])

    useEffect(() => {
        setCurrentDate(new Date())
        const timer = setInterval(() => setCurrentDate(new Date()), 1000)
        // Simulated boot
        setTimeout(() => setIsLoading(false), 800)
        return () => clearInterval(timer)
    }, [])

    const timelineEvents = [
        { date: "14 Feb 2026", title: "Registrations Open", timestamp: new Date("2026-02-14").getTime() },
        { date: "14 Mar 2026", title: "Registration Closes", timestamp: new Date("2026-03-14").getTime() },
        { date: "16-18 Mar 2026", title: "1st Round Screening", timestamp: new Date("2026-03-16").getTime() },
        { date: "24 Mar 2026", title: "Shortlisted Teams Declared", timestamp: new Date("2026-03-24").getTime() },
        { date: "10-11 Apr 2026", title: "Grand Finale (24Hr Offline)", timestamp: new Date("2026-04-10T09:00:00").getTime() }
    ]

    const getTimerData = () => {
        if (!currentDate) return null
        const now = currentDate.getTime()
        const nextEvent = timelineEvents.find(e => e.timestamp > now)
        
        if (!nextEvent) return { phase: "CONCLUDED", display: "00:00:00:00", active: false }
        
        const diff = nextEvent.timestamp - now
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)

        const pad = (n: number) => n.toString().padStart(2, '0')
        return {
            phase: `UNTIL ${nextEvent.title.toUpperCase()}`,
            display: `${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
            active: true
        }
    }

    const timerData = getTimerData()
    const isShortlistPopulated = liveData?.shortlistedTeams && liveData.shortlistedTeams.length > 0;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#03030F] flex items-center justify-center font-mono">
                <div className="w-16 h-1 w-full max-w-[200px] bg-white/10 relative overflow-hidden flex">
                    <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 0.8, ease: "circOut" }} className="absolute left-0 top-0 h-full bg-[#FF6B00]" />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#03030F] text-white font-sans overflow-x-hidden selection:bg-[#00FF41]/30">
            
            {/* AGGRESSIVE LIVE TIMER HERO COMPONENT (CYBER-TIRANGA) */}
            <div className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#03030F]/90 backdrop-blur-xl supports-[backdrop-filter]:bg-[#03030F]/60">
                <div className="w-full relative overflow-hidden">
                    {/* Patriotic Glow Behind Timer */}
                    <div className="absolute top-0 left-0 w-1/3 h-full bg-[#FF6B00]/10 blur-[50px] pointer-events-none" />
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-[#00FF41]/10 blur-[50px] pointer-events-none" />
                    
                    <div className="container mx-auto px-4 py-4 md:py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-1">
                                <Activity className="w-4 h-4 text-[#FF6B00] animate-pulse" />
                                <span className="text-[10px] md:text-xs font-bold tracking-widest text-[#FF6B00] uppercase">
                                    SYS_STATUS: {timerData?.active ? 'ONLINE' : 'OFFLINE'} | {timerData?.phase}
                                </span>
                            </div>
                            <div className="text-3xl md:text-5xl font-heading font-black tracking-tight font-mono text-white break-words tabular-nums">
                                {timerData?.display || "00:00:00:00"}
                            </div>
                        </div>

                        <Link href="/hackathon/live" className="spring-btn group shrink-0 relative overflow-hidden inline-flex items-center justify-center gap-3 px-8 py-4 bg-white hover:bg-gray-100 text-black font-black uppercase tracking-wider text-sm transition-colors rounded-none neo-border shadow-[4px_4px_0_#FF6B00] hover:shadow-[4px_4px_0_#00FF41] active:translate-y-1 active:shadow-[0_0_0_transparent]">
                            <span className="relative z-10 flex items-center gap-2">
                                Enter Live Dashboard
                                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </span>
                        </Link>
                    </div>
                </div>
                {/* 1px Tiranga line */}
                <div className="w-full h-[2px] bg-gradient-to-r from-[#FF6B00] via-white to-[#00FF41]" />
            </div>

            <div className="container mx-auto px-4 pt-16 pb-32">
                <div className="flex flex-wrap items-center gap-4 mb-12">
                    <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors uppercase tracking-widest text-xs font-bold">
                        <ArrowLeft className="w-4 h-4" /> REVERT TO BASE
                    </Link>
                    <div className="hidden md:block w-px h-5 bg-white/20" />
                    <Link href="/hackathon/teams" className="inline-flex items-center gap-2 text-[#FF6B00] hover:text-white transition-colors uppercase tracking-widest text-xs font-bold">
                        <Users className="w-3 h-3" /> View Teams
                    </Link>
                    <Link href="/hackathon/update" className="inline-flex items-center gap-2 text-[#00FF41] hover:text-white transition-colors uppercase tracking-widest text-xs font-bold">
                        <CheckCircle className="w-3 h-3" /> Update Your Team
                    </Link>
                </div>

                {/* MASSIVE HERO SECTION */}
                <div className="grid lg:grid-cols-12 gap-12 items-end mb-32">
                    <div className="lg:col-span-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-white/70 uppercase tracking-widest text-xs font-bold mb-8 neo-border">
                            <Zap className="w-4 h-4 text-[#FF6B00]" /> 8th Edition
                        </div>
                        <h1 className="text-6xl md:text-[8rem] font-heading font-black uppercase tracking-tighter leading-[0.85] mb-8">
                            <span className="block text-[#FF6B00]">Innovate</span>
                            <span className="block text-white mix-blend-difference">Bharat</span>
                            <span className="block text-[#00FF41]">Hackathon</span>
                        </h1>
                        <p className="max-w-xl text-lg md:text-xl text-white/60 font-sans leading-relaxed">
                            The ultimate test of endurance, creativity, and raw technical skill. 24 hours to build solutions that power the future of India's digital ecosystem.
                        </p>
                    </div>

                    <div className="lg:col-span-4 flex flex-col gap-4">
                        <a href={REGISTRATION_LINK} target="_blank" rel="noopener noreferrer" className="spring-btn w-full bg-[#FF6B00] text-black font-black uppercase py-6 px-8 flex items-center justify-between group hover:bg-[#FF8533] transition-colors neo-border">
                            <span>Register Team</span>
                            <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </a>
                        <a href="https://drive.google.com/file/d/1hTMH6CHzvjqZ9pWRB2wRnHlwBS_EpDdh/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="spring-btn w-full bg-transparent border-2 border-white/20 hover:border-white text-white font-bold uppercase py-6 px-8 flex items-center justify-between group transition-colors neo-border">
                            <span>Get Brochure</span>
                            <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                        </a>
                    </div>
                </div>

                {/* GRAND REVEAL: SHORTLISTED TEAMS (Shows only if we have data) */}
                {isShortlistPopulated && (
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="mb-32 w-full clip-reveal"
                    >
                        <div className="w-full bg-white/5 border border-white/10 p-8 md:p-16 neo-border relative overflow-hidden">
                            {/* Graphic texture */}
                            <div className="absolute -right-32 -top-32 w-96 h-96 border border-white/5 rounded-full flex items-center justify-center">
                                <div className="w-64 h-64 border border-[#00FF41]/20 rounded-full animate-spin-slow" />
                            </div>

                            <div className="relative z-10 mb-12">
                                <div className="inline-flex items-center gap-2 text-[#00FF41] font-mono text-sm tracking-widest mb-4">
                                    <Trophy className="w-4 h-4" /> GRAND FINALE SELECTIONS
                                </div>
                                <h2 className="text-5xl md:text-7xl font-heading font-black tracking-tight text-white mb-4 uppercase">
                                    The <span className="text-[#FF6B00]">Shortlist</span>
                                </h2>
                                <p className="text-white/60 max-w-2xl text-lg">
                                    These elite squads have cleared screening and will battle it out in the 24-hr offline crucible.
                                </p>
                            </div>

                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 relative z-10">
                                {liveData.shortlistedTeams.map((team: any, i: number) => (
                                    <motion.div 
                                        key={team.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.05 }}
                                        className="group p-5 bg-[#03030F] border border-white/10 hover:border-[#00FF41]/50 transition-colors neo-border flex flex-col"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-[10px] font-bold tracking-widest text-[#FF6B00] uppercase">RANK {i + 1}</span>
                                            {team.table_number && (
                                                <span className="tabular-nums text-[10px] font-mon text-[#00FF41] bg-[#00FF41]/10 px-2 py-0.5 border border-[#00FF41]/20">
                                                    TBL-{team.table_number}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-heading font-black text-xl text-white uppercase group-hover:text-[#00FF41] transition-colors line-clamp-1">{team.name}</h3>
                                        {team.idea_title && <p className="text-xs text-white/50 mt-2 line-clamp-2 leading-relaxed">{team.idea_title}</p>}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* INNOVATION TRACKS (BENTO GRID REWORK) */}
                <div className="mb-32">
                    <div className="mb-12">
                        <h2 className="text-5xl md:text-7xl font-heading font-black tracking-tight text-white uppercase mb-4">
                            Innovation <span className="text-[#00FF41]">Tracks</span>
                        </h2>
                        <p className="text-white/60 max-w-2xl text-lg">Choose your battlefield. Identify critical problems and forge unshakeable solutions.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { title: "AI & Intelligent Systems", icon: HeartPulse, color: "#FF6B00", problem: "AI-Driven Solutions for Smart India", type: "AI/ML" },
                            { title: "Web & Software", icon: BookOpen, color: "#00FF41", problem: "Next-Gen Digital Platforms", type: "Fullstack" },
                            { title: "Cyber & Blockchain", icon: ShieldAlert, color: "#FFFFFF", problem: "Secure Digital Ecosystems", type: "Security" },
                            { title: "Data & Analytics", icon: LineChart, color: "#FF6B00", problem: "Data-Driven Insights", type: "Data" },
                            { title: "Social Impact", icon: Globe, color: "#00FF41", problem: "Tech for Inclusive Growth", type: "Social" },
                            { title: "School Student Innovation", icon: GraduationCap, color: "#FFFFFF", problem: "Empowering Young Minds", type: "Junior" }
                        ].map((track, i) => (
                            <div key={i} className="group relative bg-white/5 border border-white/10 p-8 neo-border overflow-hidden hover:bg-white/10 transition-colors flex flex-col min-h-[300px]">
                                {/* Decorative Number */}
                                <div className="absolute -right-4 -bottom-10 text-[120px] font-heading font-black text-white/[0.03] leading-none pointer-events-none group-hover:text-white/[0.08] transition-colors">
                                    0{i+1}
                                </div>
                                
                                <div className="flex justify-between items-center mb-16 relative z-10">
                                    <div className="w-12 h-12 bg-[#03030F] border border-white/20 flex items-center justify-center -rotate-6 group-hover:rotate-0 transition-transform">
                                        <track.icon className="w-5 h-5" style={{ color: track.color }} />
                                    </div>
                                    <div className="px-3 py-1 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-[#a1a1aa] border border-white/10">
                                        {track.type}
                                    </div>
                                </div>
                                
                                <div className="relative z-10 mt-auto">
                                    <h3 className="text-2xl font-heading font-black uppercase text-white mb-2 leading-tight">{track.title}</h3>
                                    <p className="text-sm font-bold opacity-60" style={{ color: track.color }}>{'>'} {track.problem}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* PRIZES: ACID/NEON METALLIC BANNER */}
                <div className="mb-32 relative bg-[#FF6B00] border border-white/20 neo-border p-8 md:p-16 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-multiply" />
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 text-black">
                        <div>
                            <div className="font-mono text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Award className="w-5 h-5" /> REWARD PROTOCOL
                            </div>
                            <h2 className="text-6xl md:text-9xl font-heading font-black tracking-tighter leading-none mb-4">
                                ₹2.05<br/>LAKH
                            </h2>
                            <p className="max-w-md text-xl font-bold opacity-80 uppercase font-sans">Total Prize Pool verified for the strongest solutions.</p>
                        </div>

                        <div className="w-full md:w-auto grid gap-4 shrink-0 font-heading">
                            <div className="bg-white p-6 md:p-8 neo-border shadow-[8px_8px_0_#000000] rotate-2 hover:rotate-0 transition-transform">
                                <div className="text-xs uppercase font-bold text-gray-400 mb-1">Grand Prize</div>
                                <div className="text-5xl md:text-6xl font-black text-black">₹1 LAKH</div>
                            </div>
                            <div className="flex gap-4">
                                <div className="bg-black text-white p-6 neo-border flex-1 -rotate-1 hover:rotate-0 transition-transform">
                                    <div className="text-xs uppercase font-bold text-[#FF6B00] mb-1">Runner Up</div>
                                    <div className="text-3xl font-black">₹50K</div>
                                </div>
                                <div className="bg-black text-white p-6 neo-border flex-1 rotate-1 hover:rotate-0 transition-transform">
                                    <div className="text-xs uppercase font-bold text-[#00FF41] mb-1">2nd Runner</div>
                                    <div className="text-3xl font-black">₹25K</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* WHY SHARDA - STRUCTURAL GRID */}
                <div className="mb-32">
                    <div className="mb-12">
                        <h2 className="text-5xl md:text-7xl font-heading font-black tracking-tight text-white uppercase">
                            The <span className="text-[#FF6B00]">Arena</span>
                        </h2>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-px bg-white/10 border border-white/10 neo-border overflow-hidden">
                        {/* Info blocks built symmetrically */}
                        <div className="bg-[#03030F] p-8 md:p-12 hover:bg-white/5 transition-colors group">
                            <Cpu className="w-8 h-8 text-[#FF6B00] mb-6 block group-hover:scale-110 transition-transform" />
                            <h3 className="text-2xl font-heading font-black uppercase text-white mb-4">Dedicated Center</h3>
                            <p className="text-white/60">A massive, purpose-built space designed purely for 24-hr productivity. High-speed network, uninterrupted power, and ergonomic zones.</p>
                        </div>
                        <div className="bg-[#03030F] p-8 md:p-12 hover:bg-white/5 transition-colors">
                            <VenueCarousel />
                        </div>
                        <div className="bg-[#03030F] p-8 md:p-12 hover:bg-white/5 transition-colors group">
                            <ShieldAlert className="w-8 h-8 text-[#00FF41] mb-6 group-hover:scale-110 transition-transform" />
                            <h3 className="text-2xl font-heading font-black uppercase text-white mb-4">Complete Provisioning</h3>
                            <p className="text-white/60">3-time meals, late-night caffeine stations, separate resting lounges, and immediate medical clearance teams on site.</p>
                        </div>
                        <div className="bg-[#03030F] p-8 md:p-12 hover:bg-white/5 transition-colors group">
                            <Navigation className="w-8 h-8 text-white mb-6 group-hover:scale-110 transition-transform" />
                            <h3 className="text-2xl font-heading font-black uppercase text-white mb-4">Accessibility</h3>
                            <p className="text-white/60">Direct Metro links (Aqua Line) to Pari Chowk/Knowledge Park II. Smooth highways connecting IGI Airport directly to the venue gates.</p>
                        </div>
                    </div>
                </div>

                {/* TIMELINE / LOGISTICS */}
                <div className="mb-32 grid lg:grid-cols-2 gap-16 items-start">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tight text-white uppercase mb-12">
                            Deployment <span className="text-[#00FF41]">Timeline</span>
                        </h2>
                        <div className="space-y-8 relative before:absolute before:inset-0 before:w-[1px] before:bg-white/20 before:-left-4">
                            {timelineEvents.map((t, i) => (
                                <div key={i} className="relative pl-8">
                                    <div className={`absolute -left-5 top-1.5 w-[10px] h-[10px] border-2 bg-[#03030F] rounded-full ${t.timestamp < (currentDate?.getTime()||0) ? 'border-[#00FF41]/50 bg-[#00FF41]' : 'border-white/50'}`} />
                                    <div className="text-xs font-mono text-white/50 uppercase tracking-widest mb-1">{t.date}</div>
                                    <h3 className="text-2xl font-heading font-black text-white uppercase tracking-tight">{t.title}</h3>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tight text-white uppercase mb-12">
                            Secure <span className="text-[#FF6B00]">Access</span>
                        </h2>
                        
                        <div className="bg-white/5 border border-white/10 p-8 neo-border mb-8">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <div className="text-xs font-bold text-[#FF6B00] uppercase tracking-widest mb-1">Registration Ticket</div>
                                    <div className="text-4xl font-black font-heading tracking-tight text-white">INR 500</div>
                                </div>
                                <div className="text-right text-white/50 text-xs font-mono uppercase">Per Team<br/>Base Cost</div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="aspect-square bg-white border-4 border-[#03030F] flex items-center justify-center overflow-hidden">
                                     <img src="/images/payment-qr.png" alt="Payment QR" className="w-[85%] h-[85%] object-cover grayscale contrast-125 mix-blend-multiply" />
                                </div>
                                <div className="aspect-square bg-white border-4 border-[#03030F] flex items-center justify-center overflow-hidden">
                                    <img src="/images/registration-qr.png" alt="Registration QR" className="w-[85%] h-[85%] object-cover grayscale contrast-125 mix-blend-multiply" />
                                </div>
                                <div className="text-center text-xs font-bold uppercase text-white/40 tracking-widest mt-2">Scan Pay</div>
                                <div className="text-center text-xs font-bold uppercase text-white/40 tracking-widest mt-2">Scan Form</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                { name: "Dr. Sandeep Gupta", p: "9717577497" },
                                { name: "Dr. Ambuj Agarwal", p: "9412246459" },
                                { name: "Dr. Gaurav Raj", p: "8587010020" },
                                { name: "Ms. Harminder Kaur", p: "9034664521" }
                            ].map((c, i) => (
                                <div key={i} className="flex justify-between items-center border-b border-white/10 pb-4">
                                    <span className="font-bold text-white/80">{c.name}</span>
                                    {revealedContacts.includes(i) ? (
                                        <a href={`tel:+91${c.p}`} className="font-mono text-[#00FF41] hover:text-[#FF6B00] transition-colors">+91 {c.p}</a>
                                    ) : (
                                        <button onClick={() => setRevealedContacts(p => [...p, i])} className="text-xs font-bold uppercase tracking-widest text-[#FF6B00] hover:text-white transition-colors">Decrypt Number</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* FAQ SECTION */}
                <div className="mb-32">
                    <div className="mb-12">
                        <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tight text-white uppercase flex items-center gap-3">
                            <ListChecks className="w-8 h-8 text-[#FF6B00]" /> Intelligence Data
                        </h2>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                        {[
                            { q: "Who can participate?", a: "Students of B.Tech and all bachelor degree programs." },
                            { q: "Can we form teams with other colleges/departments?", a: "Cross colleges team is not allowed, but cross departments are allowed and other department students can participate also." },
                            { q: "Can I be part of multiple teams?", a: "A student can be part of 2 teams, but if more than one of their teams is selected for the final offline round, they must choose only one to represent." },
                            { q: "What is the team size?", a: "2–5 members recommended." },
                            { q: "Is the hackathon online or offline?", a: "The Grand Finale is fully on-site (offline) at Sharda University." },
                            { q: "Will Wi-Fi be provided?", a: "Yes, secure Wi-Fi access will be arranged. Teams may also use personal hotspots as backup." }
                        ].map((faq, i) => (
                            <details key={i} className="bg-white/5 border border-white/10 neo-border p-6 hover:bg-white/10 transition-colors group cursor-pointer [&_summary::-webkit-details-marker]:hidden">
                                <summary className="text-sm font-bold tracking-wider text-white uppercase group-hover:text-[#00FF41] transition-colors flex items-center justify-between list-none">
                                    <div className="flex items-center gap-3 font-sans font-bold">
                                        <div className="w-2 h-2 bg-[#FF6B00]" />
                                        {faq.q}
                                    </div>
                                    <span className="text-[#00FF41] transition-transform group-open:rotate-180">▼</span>
                                </summary>
                                <p className="text-white/60 font-sans mt-4 pl-5 border-l-2 border-[#FF6B00]">{faq.a}</p>
                            </details>
                        ))}
                    </div>
                </div>

                {/* SPONSORS (TIGHT GRID) */}
                <div className="mb-32">
                    <h2 className="text-center text-3xl font-heading font-black tracking-widest text-white/30 uppercase mb-12 border-b border-white/10 pb-8">System Sponsors</h2>
                    <div className="flex flex-wrap items-center justify-center gap-12">
                         <div className="opacity-70 hover:opacity-100 transition-opacity flex flex-col items-center gap-4">
                             <img src="/images/chings-secret-logo.jpg" alt="Chings" className="h-16 w-auto grayscale contrast-200 invert" />
                             <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Title Provider</span>
                         </div>
                         <div className="opacity-70 hover:opacity-100 transition-opacity flex flex-col items-center gap-4">
                             <img src="/images/prismatix-logo.jpg" alt="Prismatix" className="h-16 w-auto grayscale contrast-200 invert" />
                             <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Associate Node</span>
                         </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
