import { Code2, Users, Rocket, Trophy } from "lucide-react";

const stats = [
    {
        label: "Active Members",
        value: "500+",
        icon: Users,
        color: "text-blue-500"
    },
    {
        label: "Projects Built",
        value: "50+",
        icon: Rocket,
        color: "text-purple-500"
    },
    {
        label: "Hackathons Won",
        value: "15+",
        icon: Trophy,
        color: "text-yellow-500"
    },
    {
        label: "Workshops Hosted",
        value: "25+",
        icon: Code2,
        color: "text-green-500"
    }
]

export function EcosystemHighlight() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
            {stats.map((stat) => (
                <div key={stat.label} className="text-center p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                    <div className={`mx-auto mb-4 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                    </div>
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
            ))}
        </div>
    );
}
