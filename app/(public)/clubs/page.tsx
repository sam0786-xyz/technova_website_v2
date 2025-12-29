import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getClubs } from "@/lib/actions/clubs"

// Static assets mapping since these aren't in DB yet
const CLUB_ASSETS: Record<string, { slug: string, logo: string, bg: string }> = {
    "AI & Robotics": {
        slug: "ai-robotics",
        logo: "/assets/logo/AI_&_Robotics_logo.png",
        bg: "bg-indigo-500/10"
    },
    "AWS Cloud": {
        slug: "aws-cloud",
        logo: "/assets/logo/awscc.png",
        bg: "bg-orange-500/10"
    },
    "CyberPirates": {
        slug: "cyber-pirates",
        logo: "/assets/logo/cyberpirates.png",
        bg: "bg-green-500/10"
    },
    "Datapool": {
        slug: "datapool",
        logo: "/assets/logo/datapool.png",
        bg: "bg-blue-500/10"
    },
    "Game Drifters": {
        slug: "game-drifters",
        logo: "/assets/logo/Game Drifters.png",
        bg: "bg-purple-500/10"
    },
    "GDG on Campus": {
        slug: "gdg",
        logo: "/assets/logo/gdg_on_campus.jpg",
        bg: "bg-red-500/10"
    },
    "GitHub Club": {
        slug: "github",
        logo: "/assets/logo/github.png",
        bg: "bg-white/10"
    },
    "Pixelance": {
        slug: "pixelance",
        logo: "/assets/logo/pixelance_logo.png",
        bg: "bg-pink-500/10"
    },
    "Technova Main": {
        slug: "technova-main",
        logo: "/assets/logo/technova_logo.png",
        bg: "bg-blue-500/10"
    }
}

export const dynamic = 'force-dynamic' // Ensure we fetch fresh data

export default async function ClubsPage() {
    const dbClubs = await getClubs()

    return (
        <div className="min-h-screen bg-black text-white">
            <section className="relative pt-32 pb-12 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black" />
                <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] animate-float" />
                <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-blue-600/15 rounded-full blur-[80px] animate-float-slow" />
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
                        {dbClubs.map((club: any) => {
                            const assets = CLUB_ASSETS[club.name]

                            // Skip if no assets found (and not Technova Main, though that usually isn't in 'clubs' list for cards)
                            if (!assets) return null

                            return (
                                <Link key={club.id} href={`/clubs/${assets.slug}`} className={`group bg-white/[0.03] backdrop-blur-xl border border-white/10 p-10 rounded-3xl hover:bg-white/[0.06] hover:border-white/20 transition-all duration-500 flex flex-col items-center text-center shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_40px_rgba(59,130,246,0.12)] hover:-translate-y-1 ${assets.bg}`}>
                                    <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.3)] group-hover:shadow-[0_12px_40px_rgba(59,130,246,0.2)]">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={assets.logo}
                                            alt={club.name}
                                            className="w-24 h-24 object-contain"
                                        />
                                    </div>

                                    <h3 className="text-3xl font-bold mb-4">{club.name}</h3>
                                    <p className="text-gray-400 leading-relaxed mb-8">
                                        {club.description}
                                    </p>

                                    <span className="mt-auto flex items-center gap-2 text-blue-500 font-bold uppercase tracking-wider group-hover:text-blue-400">
                                        View Details <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </section>
        </div>
    )
}
