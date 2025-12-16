import { SponsorShowcase } from "@/components/partners/SponsorShowcase";
import { PartnershipForm } from "@/components/partners/PartnershipForm";
import { EcosystemHighlight } from "@/components/partners/EcosystemHighlight";

export default function PartnersPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero Section */}
            <section className="relative py-24 md:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-blue-600/10 blur-3xl rounded-full translate-y-1/2 scale-150 opacity-30" />

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-6">
                        Partner with SSCSE
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                        Join us in building the future of technology by supporting the most vibrant student technical community.
                    </p>
                </div>
            </section>

            {/* Ecosystem Stats */}
            <section className="py-12 bg-white/5 border-y border-white/5">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-semibold mb-2">Our Ecosystem</h2>
                        <p className="text-gray-400">A thriving hub of innovation and talent.</p>
                    </div>
                    <EcosystemHighlight />
                </div>
            </section>

            {/* Value Proposition */}
            <section className="py-20">
                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-6">Why Partner With Us?</h2>
                        <ul className="space-y-4">
                            {[
                                "Access to top engineering talent for internships and full-time roles.",
                                "Brand visibility across our events, hackathons, and workshops.",
                                "Direct engagement with student projects and research.",
                                "Opportunities to host tech talks and mentorship sessions."
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">✓</div>
                                    <span className="text-lg text-gray-300">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10">
                        <h3 className="text-2xl font-bold mb-4">Impact Stories</h3>
                        <p className="text-gray-400 italic mb-4">
                            "Technova has been instrumental in bridging the gap between academia and industry. The students here are ready to tackle real-world challenges from day one."
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gray-600" />
                            <div>
                                <div className="font-semibold">Jane Smith</div>
                                <div className="text-sm text-gray-500">CTO, TechGiant Corp</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sponsor Showcase */}
            <SponsorShowcase />

            {/* Partnership Inquiry Form */}
            <section className="py-24 bg-white/5">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Let's Build Together</h2>
                        <p className="text-muted-foreground">
                            Ready to make an impact? Send us an inquiry and our team will get back to you.
                        </p>
                    </div>
                    <PartnershipForm />
                </div>
            </section>
        </div>
    );
}
