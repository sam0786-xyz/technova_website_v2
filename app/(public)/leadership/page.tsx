import { motion } from "framer-motion"

const leaders = [
    { name: "Prof. (Dr.) Sibaram Khara", role: "Vice Chancellor", initials: "SK" },
    { name: "Dr. Parma Nand", role: "Dean Academic Affairs", initials: "PN" },
    { name: "Faculty Coordinator", role: "Technova Advisor", initials: "FC" },
    { name: "President", role: "Technova Head", initials: "PR" },
    { name: "Vice President", role: "Operations Lead", initials: "VP" },
    { name: "Tech Lead", role: "Development Head", initials: "TL" },
]

export default function LeadershipPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <div className="container mx-auto py-24 px-4">
                <h1 className="text-4xl font-bold text-center mb-4">Leadership</h1>
                <p className="text-center text-gray-400 max-w-2xl mx-auto mb-12">
                    Meet the team driving Technova forward.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {leaders.map((leader, i) => (
                        <div key={i} className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800 hover:border-blue-500/30 transition-colors">
                            <div className="h-48 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                                <span className="text-5xl font-bold text-white/90">{leader.initials}</span>
                            </div>
                            <div className="p-6 text-center">
                                <h3 className="text-xl font-bold">{leader.name}</h3>
                                <p className="text-blue-400">{leader.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
