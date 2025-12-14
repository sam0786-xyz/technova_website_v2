import Link from "next/link"

const clubs = [
    { name: "AI/ML Club", desc: "Explore artificial intelligence and machine learning" },
    { name: "Web Dev Club", desc: "Build the future of the web" },
    { name: "Robotics Club", desc: "Hardware meets software innovation" },
    { name: "Cyber Pirates", desc: "Cybersecurity & ethical hacking enthusiasts" },
    { name: "Competitive Programming", desc: "Algorithms and problem solving" },
    { name: "Game Dev Club", desc: "Create immersive gaming experiences" },
]

export default function ClubsPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <div className="container mx-auto py-24 px-4">
                <h1 className="text-4xl font-bold text-center mb-4">Our Clubs</h1>
                <p className="text-center text-gray-400 max-w-2xl mx-auto mb-12">
                    Technova is an umbrella society comprising various specialized technical clubs.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clubs.map((club) => (
                        <div key={club.name} className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 hover:border-blue-500/30 transition-colors">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-lg mb-4 flex items-center justify-center text-blue-400 font-bold text-xl">
                                {club.name[0]}
                            </div>
                            <h3 className="text-xl font-bold mb-2">{club.name}</h3>
                            <p className="text-gray-400 text-sm">{club.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
