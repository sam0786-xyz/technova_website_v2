'use client'

import Link from "next/link"
import { Terminal, Database, Gamepad2, Globe, Camera, ArrowRight, Github, Cpu, Cloud } from "lucide-react"

const clubs = [
    {
        name: "AI & Robotics",
        slug: "ai-robotics",
        logo: "/assets/logo/AI_&_Robotics_logo.png",
        desc: "Innovating the future with Intelligence. Exploring AI, Machine Learning, and Robotics.",
        bg: "bg-indigo-500/10"
    },
    {
        name: "AWS Cloud",
        slug: "aws-cloud",
        logo: "/assets/logo/awscc.png",
        desc: "Building on the Cloud, for the World. Mastering AWS services and serverless architecture.",
        bg: "bg-orange-500/10"
    },
    {
        name: "CyberPirates",
        slug: "cyber-pirates",
        logo: "/assets/logo/cyberpirates.png",
        desc: "Guide individuals about Information security and cyber awareness to arm against modern exploits.",
        bg: "bg-green-500/10"
    },
    {
        name: "Datapool",
        slug: "datapool",
        logo: "/assets/logo/datapool.png",
        desc: "Focusing on data insights, Database Management Systems, and languages like MySQL.",
        bg: "bg-blue-500/10"
    },
    {
        name: "Game Drifters",
        slug: "game-drifters",
        logo: "/assets/logo/Game Drifters.png",
        desc: "A community for exploring and developing new games. Connect, share, and build.",
        bg: "bg-purple-500/10"
    },
    {
        name: "GDG on Campus",
        slug: "gdg",
        logo: "/assets/logo/gdg_on_campus.jpg",
        desc: "Google Developer Group. Peer-to-peer learning to build solutions for local communities.",
        bg: "bg-red-500/10",
        className: "rounded-full"
    },
    {
        name: "GitHub Club",
        slug: "github",
        logo: "/assets/logo/github.png",
        desc: "Promotes open-source contribution and technical skills. A community for developers.",
        bg: "bg-white/10",
        className: "invert"
    },
    {
        name: "Pixelance",
        slug: "pixelance",
        logo: "/assets/logo/pixelance_logo.png",
        desc: "For photography/videography enthusiasts to share passion and explore new subjects.",
        bg: "bg-pink-500/10"
    }
]

export default function ClubsPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <section className="relative pt-32 pb-12 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6">Our Clubs</h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Specialized communities to help you master your craft, connect with peers, and build the future.
                    </p>
                </div>
            </section>

            <section className="pb-24">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {clubs.map((club) => (
                            <Link key={club.slug} href={`/clubs/${club.slug}`} className="group bg-zinc-900/50 border border-white/5 p-10 rounded-3xl hover:bg-zinc-900 hover:border-white/10 transition-all flex flex-col items-center text-center">
                                <div className={`w-32 h-32 ${club.bg} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform p-4`}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={club.logo}
                                        alt={club.name}
                                        className={`w-full h-full object-contain ${club.className || ''}`}
                                    />
                                </div>

                                <h3 className="text-3xl font-bold mb-4">{club.name}</h3>
                                <p className="text-gray-400 leading-relaxed mb-8">
                                    {club.desc}
                                </p>

                                <span className="mt-auto flex items-center gap-2 text-blue-500 font-bold uppercase tracking-wider group-hover:text-blue-400">
                                    View Details <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
