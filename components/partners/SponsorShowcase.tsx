import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const sponsors = [
    {
        tier: "Gold",
        color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        companies: [
            { name: "TechGiant Corp", logo: "/assets/sponsors/techgiant.png" },
            { name: "InnovateX", logo: "/assets/sponsors/innovate.png" },
        ]
    },
    {
        tier: "Silver",
        color: "bg-slate-300/10 text-slate-300 border-slate-300/20",
        companies: [
            { name: "CodeStream", logo: "/assets/sponsors/codestream.png" },
            { name: "DevTools Inc", logo: "/assets/sponsors/devtools.png" },
            { name: "CloudSystems", logo: "/assets/sponsors/cloud.png" },
        ]
    },
    {
        tier: "Bronze",
        color: "bg-orange-700/10 text-orange-700 border-orange-700/20",
        companies: [
            { name: "StartupHub", logo: "/assets/sponsors/startup.png" },
            { name: "Local Soft", logo: "/assets/sponsors/local.png" },
        ]
    }
];

export function SponsorShowcase() {
    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Our Partners</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        We are proud to be supported by industry leaders who believe in the power of student innovation.
                    </p>
                </div>

                <div className="space-y-12">
                    {sponsors.map((tier) => (
                        <div key={tier.tier}>
                            <div className="flex items-center gap-4 mb-6 justify-center">
                                <div className="h-px bg-white/10 w-12 md:w-24" />
                                <Badge variant="outline" className={`px-4 py-1 text-sm ${tier.color} uppercase tracking-widest`}>
                                    {tier.tier} Sponsors
                                </Badge>
                                <div className="h-px bg-white/10 w-12 md:w-24" />
                            </div>

                            <div className="flex flex-wrap justify-center gap-6">
                                {tier.companies.map((company) => (
                                    <Card key={company.name} className="w-48 h-32 flex items-center justify-center bg-black/40 border-white/5 hover:border-white/10 transition-all hover:scale-105 group">
                                        <CardContent className="p-6">
                                            {/* Placeholder for Logo */}
                                            <div className="text-center">
                                                <span className="font-semibold text-gray-500 group-hover:text-gray-300 transition-colors">{company.name}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-muted-foreground">
                        Interested in supporting the next generation of tech leaders?
                        <br />
                        <span className="text-blue-500 font-medium">Become a sponsor today.</span>
                    </p>
                </div>
            </div>
        </section>
    );
}
