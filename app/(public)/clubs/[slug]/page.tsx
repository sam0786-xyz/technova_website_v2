'use client'

import { notFound } from "next/navigation"
import { Users, User, Shield, Target, Calendar, ArrowRight, Github, Globe, Linkedin, Mail, ImageIcon, Home, ChevronRight, Sparkles, Trophy, Rocket, Zap, Phone, ExternalLink, Code, Cpu, Cloud, Database, Gamepad2, Camera, Lock, Server, Brain, Palette } from "lucide-react"
import { getPastEvents } from "@/lib/actions/club-events"
import Link from "next/link"
import { use, useEffect, useState } from "react"
import { motion } from "framer-motion"

// ===============================================
// CLUB THEMES - Colors matched to actual logos
// ===============================================
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
        team: [
            { name: "Sneha Mishra", role: "Club Lead", phone: "8750396990", email: "2023311024.sneha@ug.sharda.ac.in" },
            { name: "Ishika Dhiman", role: "Club Co-Lead", phone: "8810481150", email: "2023000121.ishika@ug.sharda.ac.in" },
            { name: "Aditya Kumar Singh", role: "Designer", phone: "8595865070", email: "2025293514.aditya@ug.sharda.ac.in" },
            { name: "Anusha Bhardwaj", role: "Documentation", phone: "9798076460", email: "2023548664.anusha@ug.sharda.ac.in" },
            { name: "Miriam Victoria", role: "Technical", phone: "7303912590", email: "2023845674.miriam@ug.sharda.ac.in" },
            { name: "Ritesh Sharma", role: "Technical", phone: "9817577149", email: "2025284855.ritesh@ug.sharda.ac.in" },
            { name: "Aditya Dhanraj", role: "PR", phone: "7462050476", email: "2025193343.aditya@ug.sharda.ac.in" }
        ]
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
        team: [
            { name: "Muskan", role: "Lead", phone: "8607980945", email: "2023419688.muskan@ug.sharda.ac.in" },
            { name: "Sapna", role: "Co-lead", phone: "7982654060", email: "2023360481.sapna@ug.sharda.ac.in" },
            { name: "Kusuma", role: "Coordinator", phone: "7795746498", email: "2023443738.kusuma@ug.sharda.ac.in" },
            { name: "Pratham", role: "Coordinator", phone: "8532009999", email: "2024164168.pratham@ug.sharda.ac.in" },
            { name: "Manya Singh", role: "Coordinator", phone: "9305032218", email: "2023406503.manya@ug.sharda.ac.in" },
            { name: "Preeti Pal", role: "Coordinator", phone: "9580331010", email: "2023310314.preeti@ug.sharda.ac.in" },
            { name: "Saurav Suman", role: "Coordinator", phone: "9508899651", email: "2023203393.saurav@ug.sharda.ac.in" }
        ]
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
        team: [
            { name: "Utkarsh Gaur", role: "Club Captain", phone: "8512030569", email: "2023346887.utkarsh@ug.sharda.ac.in" },
            { name: "Shweta", role: "Marketing & Outreach", phone: "8595483318", email: "2023329880.shweta@ug.sharda.ac.in" },
            { name: "Vashu Kaushik", role: "Events Executive", phone: "8791201151", email: "2023375557.vashu@ug.sharda.ac.in" },
            { name: "Vidit Gupta", role: "Sponsorship", phone: "7505485975", email: "2023419546.vidit@ug.sharda.ac.in" },
            { name: "Ayush Harsh", role: "Technical", phone: "9508370518", email: "2022476818.ayush@ug.sharda.ac.in" },
            { name: "Aditya Maheshwari", role: "Logistics", phone: "8510022148", email: "2023340499.aditya@ug.sharda.ac.in" },
            { name: "Deepak", role: "Technical", phone: "9773850767", email: "2023336502.deepak@ug.sharda.ac.in" }
        ]
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
        team: [
            { name: "Rajeev Kumar", role: "Club Lead", phone: "9334286864", email: "2023382761.rajeev@ug.sharda.ac.in" },
            { name: "Tanisha", role: "Club Co-Lead", phone: "9416349244", email: "2024361865.tanisha@ug.sharda.ac.in" },
            { name: "Dushyant Prajapati", role: "Designer", phone: "8882236416", email: "2025273581.dushyant@ug.sharda.ac.in" },
            { name: "Al Dua Khan", role: "PR", phone: "8353956645", email: "2025429573.al@ug.sharda.ac.in" },
            { name: "Siya Rathi", role: "Documentation", phone: "8178213821", email: "2024157412.siya@ug.sharda.ac.in" },
            { name: "Rahul Gupta", role: "Technical", phone: "7309964567", email: "2023336847.rahul@ug.sharda.ac.in" }
        ]
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
        team: [
            { name: "Adhyyan Sharma", role: "Club Lead", phone: "9103230071", email: "2022618081.adhyyan@ug.sharda.ac.in" },
            { name: "Aarav Kashyap", role: "Club Co-Lead", phone: "7836809633", email: "2024468363.aarav@ug.sharda.ac.in" },
            { name: "Harshit Singh", role: "Coordinator", phone: "8460279630", email: "2024597770.harshit@ug.sharda.ac.in" },
            { name: "Siddhartha Singh", role: "Coordinator", phone: "8005237791", email: "2024244201.siddhartha@ug.sharda.ac.in" },
            { name: "Tanushi Jain", role: "Coordinator", phone: "7560949605", email: "2024244955.tanushi@ug.sharda.ac.in" },
            { name: "Sukaina Shakeel Ansari", role: "Coordinator", phone: "7173173678", email: "2023519649.sukaina@ug.sharda.ac.in" },
            { name: "Anupam Vasudeva", role: "Coordinator", phone: "9582873959", email: "2020718956.anupam@ug.sharda.ac.in" }
        ]
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
        team: [
            { name: "Suryansh Rai", role: "Club Lead", phone: "8171192097", email: "2023349070.suryansh@ug.sharda.ac.in" },
            { name: "Arnima Chakravarty", role: "Club Co-Lead", phone: "8240479460", email: "2023413608.arnima@ug.sharda.ac.in" },
            { name: "Shubham Shukla", role: "Designer", phone: "9303178846", email: "2024294955.shubham@ug.sharda.ac.in" },
            { name: "Deepanshu Singh", role: "Documentation", phone: "8582670020", email: "2024194135.deepanshu@ug.sharda.ac.in" },
            { name: "Parikshit Singh", role: "Technical", phone: "9625619910", email: "2024189810.parikshit@ug.sharda.ac.in" },
            { name: "Tanisha Mittal", role: "PR", phone: "8071047527", email: "2025350343.tanisha@ug.sharda.ac.in" }
        ]
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
        team: [
            { name: "Sanskriti Verma", role: "Club Lead (Organizer)", phone: "7011428007", email: "2022004547.sanskriti@ug.sharda.ac.in" },
            { name: "Abhishek Pandey", role: "AIML & Robotics Lead", phone: "7088219552", email: "2024156131.abhishek@ug.sharda.ac.in" },
            { name: "Masood Aslam", role: "Cyber Security Lead", phone: "9540379738", email: "2023305225.masood@ug.sharda.ac.in" },
            { name: "Priyanshu Verma", role: "Web dev & DSA Lead", phone: "6306930929", email: "2023392450.priyanshu@ug.sharda.ac.in" },
            { name: "Yash Kumar Choudhary", role: "XR Lead", phone: "9871802235", email: "2023368660.yash@ug.sharda.ac.in" },
            { name: "Utkarsh Gaur", role: "Cloud & Open Source Lead", phone: "8512030569", email: "2023346887.utkarsh@ug.sharda.ac.in" },
            { name: "Saksham Sharma", role: "Social Media Lead", phone: "9720549549", email: "2025188304.saksham@ug.sharda.ac.in" },
            { name: "Vansh Chauhan", role: "Design Lead", phone: "9897281748", email: "2024341632.vansh@ug.sharda.ac.in" },
            { name: "Narmada", role: "PR & Marketing Lead", phone: "9871370761", email: "2024131677.narmada@ug.sharda.ac.in" },
            { name: "Aditya Singh", role: "Sponsorship & Outreach", phone: "6201954727" },
            { name: "Harshit Singh", role: "Content Lead", phone: "9058624242", email: "2025368857.harshit@ug.sharda.ac.in" }
        ]
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
        team: [
            { name: "Krishna Narula", role: "Club Lead", phone: "9582087205", email: "2023286720.krishna@ug.sharda.ac.in" },
            { name: "Abhijit Dutta", role: "Co-Lead (Photography)", phone: "7542693791", email: "2023008089.abhijit@ug.sharda.ac.in" },
            { name: "Madwesha R", role: "Co-Lead (Videography)", phone: "9521150008", email: "2023055241.madwesha@ug.sharda.ac.in" },
            { name: "Swastik Garg", role: "Coordinator", phone: "8449216462", email: "2024134202.swastik@ug.sharda.ac.in" },
            { name: "Rishiyendra Kumar", role: "Coordinator", phone: "7667010826", email: "2024136214.rishiyendra@ug.sharda.ac.in" },
            { name: "Shivansh Tiwari", role: "Coordinator", phone: "8404048102", email: "2023216262.shivansh@ug.sharda.ac.in" },
            { name: "Keshav Grover", role: "Coordinator", phone: "7773477710", email: "2024342595.keshav@ug.sharda.ac.in" },
            { name: "Sarthak Choudhary", role: "Coordinator", phone: "9130071357", email: "2024446375.sarthak@ug.sharda.ac.in" },
            { name: "Navya Tyagi", role: "Coordinator", phone: "9135048681", email: "2022111945.navya@ug.sharda.ac.in" },
            { name: "Christopher Yumnam", role: "Coordinator", phone: "8414906254", email: "2024341974.christopher@ug.sharda.ac.in" },
            { name: "Shakhawat Ansari", role: "Coordinator", phone: "8794196897", email: "2023508416.shakhawat@ug.sharda.ac.in" },
            { name: "Kavay Dahiya", role: "Coordinator", phone: "7082307180", email: "2024321206.kavay@ug.sharda.ac.in" }
        ]
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
                                {club.description}
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

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {club.team.map((member, idx) => (
                            <motion.div
                                key={member.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05 }}
                                className={`group p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:${colors.border} transition-all duration-300 hover:-translate-y-1`}
                            >
                                {/* Avatar */}
                                <div className={`w-16 h-16 rounded-full ${colors.bg} flex items-center justify-center mx-auto mb-4 ${colors.text} group-hover:scale-110 transition-transform`}>
                                    {member.photo ? (
                                        /* eslint-disable-next-line @next/next/no-img-element */
                                        <img src={member.photo} alt={member.name} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        <User className="w-8 h-8" />
                                    )}
                                </div>

                                {/* Details */}
                                <div className="text-center mb-4">
                                    <h3 className="font-bold">{member.name}</h3>
                                    <p className={`text-sm ${colors.text}`}>{member.role}</p>
                                </div>

                                {/* Contact Icons */}
                                <div className="flex justify-center gap-2">
                                    {member.phone && (
                                        <a href={`tel:+91${member.phone}`} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-green-400 hover:bg-green-500/10 transition-all">
                                            <Phone className="w-4 h-4" />
                                        </a>
                                    )}
                                    {member.email && (
                                        <a href={`mailto:${member.email}`} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                                            <Mail className="w-4 h-4" />
                                        </a>
                                    )}
                                    {member.linkedin && (
                                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-600/10 transition-all">
                                            <Linkedin className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>
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
