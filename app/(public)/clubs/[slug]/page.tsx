'use client'

import { notFound } from "next/navigation"
import { Users, User, Shield, Target, Calendar, ArrowRight, Github, Globe, Linkedin, Mail, ImageIcon, Home, ChevronRight, Sparkles, Trophy, Rocket, Zap, Phone, ExternalLink, Code, Cpu, Cloud, Database, Gamepad2, Camera, Lock, Server, Brain, Palette } from "lucide-react"
import { getPastEvents } from "@/lib/actions/club-events"
import { getClubMembersByName, getClubWithMembers } from "@/lib/actions/clubs"
import { getMemberPhotoPath } from "@/lib/constants/team-photos"
import Link from "next/link"
import { use, useEffect, useState } from "react"
import { motion } from "framer-motion"

const ensureAbsoluteUrl = (url: string) => {
    if (!url) return "#"
    if (url.startsWith("http://") || url.startsWith("https://")) return url
    return `https://${url}`
}

// ===============================================
// CLUB THEMES - Colors matched to actual logos
// ===============================================

const SLUG_TO_DB_NAME: Record<string, string> = {
    "technova-main": "Technova Main",
    "ai-robotics": "AI & Robotics",
    "aws-cloud": "AWS Cloud",
    "cyber-pirates": "CyberPirates",
    "datapool": "Datapool",
    "game-drifters": "Game Drifters",
    "gdg": "GDG on Campus",
    "github": "GitHub Club",
    "pixelance": "Pixelance"
}

const CLUB_THEMES: Record<string, {
    colors: { primary: string; secondary: string; bg: string; border: string; text: string; glow: string; gradient: string }
    heroPattern: string
}> = {
    "cyber-pirates": {
        // CyberPirates: Red/Black hacker theme (skull logo with red accents)
        colors: {
            primary: "from-red-600 to-rose-600",
            secondary: "red-500",
            bg: "bg-red-950/30",
            border: "border-red-500/40",
            text: "text-red-400",
            glow: "rgba(220,38,38,0.4)",
            gradient: "from-red-950 via-black to-black"
        },
        heroPattern: "radial-gradient(ellipse at top, rgba(220,38,38,0.15) 0%, transparent 50%)"
    },
    "ai-robotics": {
        // AI & Robotics: Blue/Cyan neural network theme (circuit/brain logo)
        colors: {
            primary: "from-blue-500 to-cyan-400",
            secondary: "blue-500",
            bg: "bg-blue-950/30",
            border: "border-blue-500/40",
            text: "text-blue-400",
            glow: "rgba(59,130,246,0.4)",
            gradient: "from-blue-950 via-black to-black"
        },
        heroPattern: "radial-gradient(ellipse at top, rgba(59,130,246,0.15) 0%, transparent 50%)"
    },
    "aws-cloud": {
        // AWS Cloud: Orange/Amber (official AWS orange #FF9900)
        colors: {
            primary: "from-orange-500 to-amber-500",
            secondary: "orange-500",
            bg: "bg-orange-950/30",
            border: "border-orange-500/40",
            text: "text-orange-400",
            glow: "rgba(249,115,22,0.4)",
            gradient: "from-orange-950 via-black to-black"
        },
        heroPattern: "radial-gradient(ellipse at top, rgba(249,115,22,0.15) 0%, transparent 50%)"
    },
    "datapool": {
        // Datapool: Teal/Emerald (data/analytics green-blue)
        colors: {
            primary: "from-emerald-500 to-teal-500",
            secondary: "emerald-500",
            bg: "bg-emerald-950/30",
            border: "border-emerald-500/40",
            text: "text-emerald-400",
            glow: "rgba(16,185,129,0.4)",
            gradient: "from-emerald-950 via-black to-black"
        },
        heroPattern: "radial-gradient(ellipse at top, rgba(16,185,129,0.15) 0%, transparent 50%)"
    },
    "game-drifters": {
        // Game Drifters: Purple/Violet (gaming neon theme)
        colors: {
            primary: "from-violet-600 to-purple-500",
            secondary: "violet-500",
            bg: "bg-violet-950/30",
            border: "border-violet-500/40",
            text: "text-violet-400",
            glow: "rgba(139,92,246,0.4)",
            gradient: "from-violet-950 via-black to-black"
        },
        heroPattern: "radial-gradient(ellipse at top, rgba(139,92,246,0.15) 0%, transparent 50%)"
    },
    "github": {
        // GitHub: Eye‑catching neon gradient with vivid accent
        colors: {
            primary: "from-fuchsia-500 via-violet-500 to-blue-500",
            secondary: "fuchsia-500",
            bg: "bg-fuchsia-900/20",
            border: "border-fuchsia-400/40",
            text: "text-fuchsia-300",
            glow: "rgba(217,70,239,0.6)",
            gradient: "from-black via-violet-950 to-fuchsia-900"
        },
        heroPattern: "radial-gradient(ellipse at top, rgba(217,70,239,0.12) 0%, transparent 50%)"
    },
    "gdg": {
        // GDG: Google Blue (primary Google color #4285F4)
        colors: {
            primary: "from-blue-500 to-blue-400",
            secondary: "blue-500",
            bg: "bg-blue-950/30",
            border: "border-blue-500/40",
            text: "text-blue-400",
            glow: "rgba(66,133,244,0.4)",
            gradient: "from-blue-950 via-black to-black"
        },
        heroPattern: "radial-gradient(ellipse at top, rgba(66,133,244,0.15) 0%, transparent 50%)"
    },
    "pixelance": {
        // PiXelance: Amber/Gold (camera/photography warm tones)
        colors: {
            primary: "from-amber-500 to-yellow-500",
            secondary: "amber-500",
            bg: "bg-amber-950/30",
            border: "border-amber-500/40",
            text: "text-amber-400",
            glow: "rgba(245,158,11,0.4)",
            gradient: "from-amber-950 via-black to-black"
        },
        heroPattern: "radial-gradient(ellipse at top, rgba(245,158,11,0.15) 0%, transparent 50%)"
    }
}

// ===============================================
// TEAM MEMBER TYPE
// ===============================================
interface TeamMember {
    name: string
    role: string
    photo?: string
    phone?: string
    email?: string
    linkedin?: string
}

// ===============================================
// CLUB DATA
// ===============================================
const CLUBS_DATA: Record<string, {
    name: string
    tagline: string
    description: string
    whyJoin: string
    logo: string
    stats: Record<string, string>
    joinLink: string
    highlights: { icon: any; title: string; desc: string }[]
    team: TeamMember[]
}> = {
    "cyber-pirates": {
        name: "CyberPirates Club",
        tagline: "Security through knowledge, not obscurity",
        description: "Empowering individuals with cybersecurity knowledge to defend against modern digital threats. Learn ethical hacking, penetration testing, and security best practices.",
        whyJoin: "Join a community of security enthusiasts. Participate in CTF competitions, learn from industry experts, and build skills that matter in today's digital world.",
        logo: "/assets/logo/cyberpirates.png",
        stats: { members: "80+", ctfs: "12+", workshops: "8+" },
        joinLink: "https://forms.gle/KbXuf6MCQJ2idz697",
        highlights: [
            { icon: Lock, title: "Ethical Hacking", desc: "Learn penetration testing & security auditing" },
            { icon: Shield, title: "CTF Challenges", desc: "Compete in capture-the-flag competitions" },
            { icon: Target, title: "Bug Bounties", desc: "Find vulnerabilities in real systems" }
        ],
        team: []
    },
    "ai-robotics": {
        name: "AI & Robotics Club",
        tagline: "Building intelligent machines for tomorrow",
        description: "Exploring the frontiers of Artificial Intelligence and Robotics. From neural networks to autonomous systems, we're shaping the future of technology.",
        whyJoin: "Get hands-on with cutting-edge AI/ML projects, build robots, participate in hackathons, and collaborate with passionate innovators.",
        logo: "/assets/logo/AI_&_Robotics_logo.png",
        stats: { members: "120+", projects: "15+", hackathons: "10+" },
        joinLink: "https://forms.gle/KbXuf6MCQJ2idz697",
        highlights: [
            { icon: Brain, title: "Machine Learning", desc: "Build and train intelligent models" },
            { icon: Cpu, title: "Robotics Projects", desc: "Create autonomous machines & drones" },
            { icon: Sparkles, title: "Research", desc: "Explore cutting-edge AI papers" }
        ],
        team: []
    },
    "aws-cloud": {
        name: "AWS Cloud Club",
        tagline: "Build on the cloud, scale to the world",
        description: "Master cloud computing with Amazon Web Services. Learn to architect, deploy, and scale applications on the world's leading cloud platform.",
        whyJoin: "Get hands-on with AWS services, prepare for certifications, and learn from industry professionals. Cloud skills are in high demand!",
        logo: "/assets/logo/awscc.png",
        stats: { members: "100+", certified: "25+", workshops: "12+" },
        joinLink: "https://forms.gle/KbXuf6MCQJ2idz697",
        highlights: [
            { icon: Cloud, title: "Cloud Architecture", desc: "Design scalable cloud solutions" },
            { icon: Server, title: "Serverless", desc: "Build with Lambda & API Gateway" },
            { icon: Trophy, title: "Certifications", desc: "AWS certification preparation" }
        ],
        team: []
    },
    "datapool": {
        name: "Datapool Club",
        tagline: "Turning data into insights, insights into action",
        description: "Dive deep into Data Science, Analytics, and Machine Learning. Transform raw data into meaningful insights that drive decisions.",
        whyJoin: "Learn from data science practitioners, work on real datasets, compete on Kaggle, and build a portfolio that stands out.",
        logo: "/assets/logo/datapool.png",
        stats: { members: "90+", kaggle: "8+", workshops: "6+" },
        joinLink: "https://forms.gle/KbXuf6MCQJ2idz697",
        highlights: [
            { icon: Database, title: "Data Analysis", desc: "Master SQL & data manipulation" },
            { icon: Sparkles, title: "ML Models", desc: "Build predictive algorithms" },
            { icon: Globe, title: "Kaggle", desc: "Compete in data challenges" }
        ],
        team: []
    },
    "game-drifters": {
        name: "Game Drifters Club",
        tagline: "Level up your gaming & development skills",
        description: "Unite with passionate gamers and aspiring developers. From esports tournaments to game development with Unity and Unreal Engine.",
        whyJoin: "Compete in tournaments, learn game development, or simply connect with fellow gamers. Whether you play or create, you belong here.",
        logo: "/assets/logo/Game Drifters.png",
        stats: { members: "150+", tournaments: "20+", games: "10+" },
        joinLink: "https://forms.gle/KbXuf6MCQJ2idz697",
        highlights: [
            { icon: Gamepad2, title: "Esports", desc: "Compete in gaming tournaments" },
            { icon: Code, title: "Game Dev", desc: "Build games with Unity & Unreal" },
            { icon: Trophy, title: "Tournaments", desc: "Regular gaming competitions" }
        ],
        team: []
    },
    "github": {
        name: "GitHub Club",
        tagline: "Code, Collaborate, Contribute",
        description: "A community of developers focused on open-source contribution, technical skills, and collaborative coding. Build projects that matter.",
        whyJoin: "Contribute to open-source, improve your Git skills, collaborate on projects, and connect with a thriving developer community.",
        logo: "/assets/logo/github.png",
        stats: { members: "200+", repos: "50+", contributions: "500+" },
        joinLink: "https://forms.gle/KbXuf6MCQJ2idz697",
        highlights: [
            { icon: Github, title: "Open Source", desc: "Contribute to real projects" },
            { icon: Code, title: "Coding", desc: "Learn modern development practices" },
            { icon: Users, title: "Collaboration", desc: "Work with fellow developers" }
        ],
        team: []
    },
    "gdg": {
        name: "GDG on Campus",
        tagline: "Learn, Build, Connect with Google",
        description: "Google Developer Group on Campus - where innovation meets execution. Learn Google technologies, participate in Solution Challenges, and build for the community.",
        whyJoin: "Access Google's cutting-edge technologies, participate in DevFests, build solutions for local communities, and connect with a global developer network.",
        logo: "/assets/logo/gdg_on_campus.jpg",
        stats: { members: "300+", events: "30+", solutions: "10+" },
        joinLink: "https://forms.gle/KbXuf6MCQJ2idz697",
        highlights: [
            { icon: Globe, title: "Google Tech", desc: "Learn Firebase, Flutter, Cloud & more" },
            { icon: Rocket, title: "Solution Challenge", desc: "Build solutions for local problems" },
            { icon: Users, title: "Community", desc: "Join a global developer network" }
        ],
        team: []
    },
    "pixelance": {
        name: "PiXelance Club",
        tagline: "Capturing moments, creating memories",
        description: "A community of photography and videography enthusiasts. Learn techniques, explore creative subjects, and capture the world through your lens.",
        whyJoin: "Attend photo walks, learn editing in Lightroom & Photoshop, participate in competitions, and build a portfolio of stunning work.",
        logo: "/assets/logo/pixelance_logo.png",
        stats: { members: "70+", photowalks: "15+", exhibitions: "5+" },
        joinLink: "https://forms.gle/KbXuf6MCQJ2idz697",
        highlights: [
            { icon: Camera, title: "Photo Walks", desc: "Explore photography outdoors" },
            { icon: Palette, title: "Editing", desc: "Master Lightroom & Photoshop" },
            { icon: ImageIcon, title: "Portfolio", desc: "Showcase your best work" }
        ],
        team: []
    }
}

// ===============================================
// PAST EVENTS COMPONENT
// ===============================================
function PastEventsSection({ slug, theme }: { slug: string; theme: typeof CLUB_THEMES[string] }) {
    const [pastEvents, setPastEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const colors = theme.colors

    useEffect(() => {
        async function fetchEvents() {
            try {
                const events = await getPastEvents(slug)
                setPastEvents(events)
            } catch (error) {
                console.error('Error fetching past events:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchEvents()
    }, [slug])

    if (loading || pastEvents.length === 0) return null

    return (
        <section className="py-24 relative">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className={`text-sm font-bold ${colors.text} uppercase tracking-widest`}>Memories</span>
                    <h2 className="text-4xl font-bold mt-2">Past Events</h2>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pastEvents.slice(0, 6).map((event, idx) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Link
                                href={`/events/${event.id}`}
                                className={`block group rounded-2xl overflow-hidden bg-white/[0.02] border border-white/10 hover:${colors.border} transition-all duration-500 hover:-translate-y-1`}
                            >
                                <div className="aspect-video relative overflow-hidden">
                                    {event.banner ? (
                                        /* eslint-disable-next-line @next/next/no-img-element */
                                        <img src={event.banner} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className={`w-full h-full bg-gradient-to-br ${colors.gradient} flex items-center justify-center`}>
                                            <Calendar className={`w-12 h-12 ${colors.text} opacity-50`} />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <p className={`text-xs ${colors.text} font-medium mb-1`}>
                                            {new Date(event.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                        <h3 className="font-bold text-lg line-clamp-2">{event.title}</h3>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

// ===============================================
// MAIN PAGE COMPONENT
// ===============================================
export default function ClubDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params)
    const club = CLUBS_DATA[slug]
    const theme = CLUB_THEMES[slug]

    if (!club || !theme) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Club Not Found</h1>
                    <p className="text-gray-400 mb-8">The club you're looking for is coming soon.</p>
                    <Link href="/clubs" className="text-blue-400 hover:underline">← Back to Clubs</Link>
                </div>
            </div>
        )
    }

    const colors = theme.colors

    const [teamMembers, setTeamMembers] = useState<TeamMember[]>(club.team || [])
    const [dbClub, setDbClub] = useState<any>(null)
    const [loadingData, setLoadingData] = useState(true)

    useEffect(() => {
        async function fetchData() {
            if (!slug || !SLUG_TO_DB_NAME[slug]) {
                setLoadingData(false)
                return
            }
            try {
                const dbName = SLUG_TO_DB_NAME[slug]
                const result = await getClubWithMembers(dbName)

                if (result) {
                    setDbClub(result.club)
                    if (result.members && result.members.length > 0) {
                        const mappedMembers = result.members.map((m: any) => ({
                            name: m.name,
                            role: m.role || "Core Team",
                            email: m.email,
                            phone: m.phone,
                            linkedin: m.linkedin_id,
                            photo: getMemberPhotoPath(m.name)
                        }))
                        setTeamMembers(mappedMembers)
                    }
                }
            } catch (error) {
                console.error("Failed to fetch club data:", error)
            } finally {
                setLoadingData(false)
            }
        }
        fetchData()
    }, [slug])

    const displayDescription = dbClub?.description || club.description

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden">
            {/* =============== HERO SECTION =============== */}
            <section className="relative min-h-[90vh] flex items-center">
                {/* Background */}
                <div className="absolute inset-0" style={{ background: theme.heroPattern }} />
                <div className={`absolute inset-0 bg-gradient-to-b ${colors.gradient}`} />

                {/* Animated Orbs */}
                <motion.div
                    className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-30"
                    style={{ background: colors.glow, top: '10%', right: '10%' }}
                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-20"
                    style={{ background: colors.glow, bottom: '20%', left: '5%' }}
                    animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />

                <div className="container mx-auto px-4 relative z-10 pt-24">
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
                        <Link href="/clubs" className="text-gray-400 hover:text-white transition-colors">Clubs</Link>
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                        <span className={colors.text}>{club.name}</span>
                    </motion.nav>

                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left Side - Info */}
                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${colors.bg} border ${colors.border} mb-6`}
                            >
                                <Shield className={`w-4 h-4 ${colors.text}`} />
                                <span className={`text-sm font-medium ${colors.text}`}>Official Technova Club</span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4"
                            >
                                {club.name}
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className={`text-xl ${colors.text} font-medium mb-6`}
                            >
                                {club.tagline}
                            </motion.p>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-gray-400 text-lg leading-relaxed mb-8 max-w-lg"
                            >
                                {displayDescription}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex flex-wrap gap-4"
                            >
                                <a
                                    href={club.joinLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`group inline-flex items-center gap-2 bg-gradient-to-r ${colors.primary} text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:brightness-110 ring-2 ring-white/10 hover:ring-white/20`}
                                    style={{ boxShadow: `0 0 60px ${colors.glow}` }}
                                >
                                    Join Now
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </a>
                                <a
                                    href="#team"
                                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold border border-white/20 bg-white/5 hover:bg-white/10 transition-all"
                                >
                                    Meet the Team
                                </a>
                            </motion.div>
                        </div>

                        {/* Right Side - Logo & Stats */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col items-center"
                        >
                            {/* Club Logo */}
                            <div className="relative mb-10">
                                <div
                                    className="absolute inset-0 rounded-full blur-3xl opacity-50"
                                    style={{ background: colors.glow }}
                                />
                                <div className="relative w-56 h-56 rounded-full bg-white shadow-2xl flex items-center justify-center p-8 border-4 border-white/30">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={club.logo} alt={club.name} className="w-40 h-40 object-contain" />
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                                {Object.entries(club.stats).map(([key, value], idx) => (
                                    <motion.div
                                        key={key}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 + idx * 0.1 }}
                                        className={`text-center p-4 rounded-2xl ${colors.bg} border ${colors.border}`}
                                    >
                                        <p className={`text-2xl font-bold ${colors.text}`}>{value}</p>
                                        <p className="text-gray-500 text-xs uppercase tracking-wider mt-1 capitalize">{key}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* =============== HIGHLIGHTS SECTION =============== */}
            <section className="py-24 relative">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className={`text-sm font-bold ${colors.text} uppercase tracking-widest`}>What We Offer</span>
                        <h2 className="text-4xl font-bold mt-2">Why Join Us?</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto mt-4">{club.whyJoin}</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {club.highlights.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className={`group p-8 rounded-3xl ${colors.bg} border ${colors.border} hover:scale-[1.02] transition-all duration-300`}
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors.primary} flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform`}>
                                    <item.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                <p className="text-gray-400">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* =============== PAST EVENTS =============== */}
            <PastEventsSection slug={slug} theme={theme} />

            {/* =============== TEAM SECTION =============== */}
            <section id="team" className="py-24 relative">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className={`text-sm font-bold ${colors.text} uppercase tracking-widest`}>Our Team</span>
                        <h2 className="text-4xl font-bold mt-2">Meet the Team</h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {teamMembers.map((member, idx) => (
                            <motion.div
                                key={member.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05 }}
                                className={`group bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:bg-white/[0.06] hover:border-white/20 transition-all duration-500 hover:-translate-y-1 overflow-hidden relative shadow-[0_8px_32px_rgba(0,0,0,0.3)]`}
                                style={{
                                    boxShadow: `0 8px 32px rgba(0,0,0,0.3)`,
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = `0 8px 40px ${colors.glow.replace('0.4', '0.12')}`
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.3)`
                                }}
                            >
                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    {/* Large Photo with Club Color Background */}
                                    <div className={`w-32 h-32 ${colors.bg} ${colors.text} backdrop-blur-xl rounded-2xl flex items-center justify-center text-current group-hover:scale-110 transition-transform duration-500 overflow-hidden relative border border-white/10`}>
                                        {member.photo ? (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img
                                                src={member.photo}
                                                alt={member.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(member.name) + "&background=random"
                                                }}
                                            />
                                        ) : (
                                            <User className="w-12 h-12" />
                                        )}
                                    </div>

                                    {/* Social Links - Appear on Hover */}
                                    <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        {member.linkedin && (
                                            <a
                                                href={ensureAbsoluteUrl(member.linkedin)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 bg-white/5 rounded-lg hover:bg-white/10 hover:text-blue-400 transition-colors"
                                                title="LinkedIn"
                                            >
                                                <Linkedin className="w-5 h-5" />
                                            </a>
                                        )}
                                        {member.phone && (
                                            <a
                                                href={`tel:+91${member.phone}`}
                                                className="p-2 bg-white/5 rounded-lg hover:bg-white/10 hover:text-green-400 transition-colors"
                                                title="Call"
                                            >
                                                <Phone className="w-5 h-5" />
                                            </a>
                                        )}
                                        {member.email && (
                                            <a
                                                href={`mailto:${member.email}`}
                                                className="p-2 bg-white/5 rounded-lg hover:bg-white/10 hover:text-red-400 transition-colors"
                                                title="Email"
                                            >
                                                <Mail className="w-5 h-5" />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Name & Role */}
                                <h3 className="text-xl font-bold mb-1 relative z-10">{member.name}</h3>
                                <p className={`text-sm font-bold uppercase tracking-wider ${colors.text} relative z-10`}>
                                    {member.role}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* =============== CTA SECTION =============== */}
            <section className="py-24 relative">
                <div
                    className="absolute inset-0 opacity-30"
                    style={{ background: `radial-gradient(ellipse at center, ${colors.glow} 0%, transparent 70%)` }}
                />
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-2xl mx-auto"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Join?</h2>
                        <p className="text-gray-400 text-lg mb-8">
                            Be part of an amazing community of learners and innovators.
                        </p>
                        <a
                            href={club.joinLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-2 bg-gradient-to-r ${colors.primary} text-white px-10 py-5 rounded-xl font-bold text-lg transition-all hover:scale-105 hover:brightness-110 ring-2 ring-white/10 hover:ring-white/20`}
                            style={{ boxShadow: `0 0 70px ${colors.glow}` }}
                        >
                            Join {club.name} Now
                            <ArrowRight className="w-6 h-6" />
                        </a>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
