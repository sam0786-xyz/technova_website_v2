'use client'

import Link from "next/link"
import { ArrowRight, Terminal, Database, Rocket, Gamepad2, Code2, Globe, Camera, Lightbulb, Users, Target, Zap, ChevronRight, Mail, MapPin, Instagram, Linkedin } from "lucide-react"
import { ClubsCarousel } from "@/components/ui/clubs-carousel"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-blue-500 selection:text-white">

      {/* HER0 SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm">
            <span className="text-blue-400 font-medium text-sm tracking-wider uppercase">Technical Society of Sharda University</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
            WELCOME TO <br />
            <span className="text-blue-500">TECHNOVA</span>
          </h1>

          <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl mb-10 leading-relaxed">
            Prepare to be an efficient problem solver, researcher, innovator, and entrepreneur.
            The future of technology starts here.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/events" className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center gap-2">
              Explore Events
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/clubs" className="px-8 py-4 rounded-xl font-bold border border-white/10 hover:bg-white/5 transition-all">
              View Clubs
            </Link>
          </div>

          {/* Stats or Trusted By (Optional) */}
          <div className="mt-20 pt-10 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-3xl font-bold text-white">8+</h3>
              <p className="text-sm text-gray-500 uppercase tracking-widest mt-1">Specialized Clubs</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white">50+</h3>
              <p className="text-sm text-gray-500 uppercase tracking-widest mt-1">Events Yearly</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white">1000+</h3>
              <p className="text-sm text-gray-500 uppercase tracking-widest mt-1">Active Members</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white">24/7</h3>
              <p className="text-sm text-gray-500 uppercase tracking-widest mt-1">Innovation</p>
            </div>
          </div>
        </div>
      </section>

      {/* VISION & MISSION */}
      <section className="py-24 bg-zinc-900/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Vision Card */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-blue-500/50 transition-all group">
              <div className="w-14 h-14 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-transform">
                <Target className="w-7 h-7" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
              <p className="text-gray-400 leading-relaxed">
                The Technical Society aims to become a front-runner in preparing graduates to be efficient problem solvers, researchers, innovators and entrepreneurs, and making them competent professionals by enabling them to take up any kind of challenges in the Information Technology industry or research organizations.
              </p>
            </div>

            {/* Mission Card */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-purple-500/50 transition-all group">
              <div className="w-14 h-14 bg-purple-600/20 rounded-2xl flex items-center justify-center mb-6 text-purple-500 group-hover:scale-110 transition-transform">
                <Rocket className="w-7 h-7" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-400 leading-relaxed">
                We elevate the technical skillset of students to match industry standards by conducting interactions, sessions, and propelling students to pursue their passion. With support from our alumni network, we strive to excel in this all-time mission of empowering the student community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-3">Why Join Us?</h2>
            <h3 className="text-4xl md:text-5xl font-bold mb-6">What We Do?</h3>
            <p className="text-gray-400 text-lg">
              The Technical Society provides personal growth, leadership and learning opportunities in engineering, technology, innovation, and design.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Lightbulb, title: "Innovation", text: "Promoting student ability for invention, resourcefulness and ultimately innovation." },
              { icon: Users, title: "Community", text: "Connecting students with similar interests and interacting with alumni and professionals." },
              { icon: Zap, title: "Growth", text: "Introduction to principles and practices that are the foundation of engineering technology." },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white/5 p-8 rounded-2xl hover:bg-white/10 transition-colors">
                <feature.icon className="w-10 h-10 text-blue-400 mb-4" />
                <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
                <p className="text-gray-400 leading-relaxed">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALENDAR SECTION */}
      <section className="py-24 bg-zinc-900 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-3">Schedule</h2>
            <h3 className="text-4xl md:text-5xl font-bold mb-6">Upcoming Events Calendar</h3>
            <p className="text-gray-400 text-lg">
              Never miss an event. Subscribe to our official calendar.
            </p>
          </div>

          <div className="bg-black/50 p-4 rounded-3xl border border-white/10 shadow-2xl max-w-5xl mx-auto overflow-hidden">
            <iframe
              src="https://calendar.google.com/calendar/embed?src=technova%40sharda.ac.in&ctz=Asia%2FKolkata&bgcolor=%23000000&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&showTz=1"
              style={{ border: 0 }}
              width="100%"
              height="600"
              frameBorder="0"
              scrolling="no"
              className="rounded-2xl w-full"
            ></iframe>
          </div>

          <div className="text-center mt-8">
            <Link href="https://calendar.google.com/calendar/u/0?cid=dGVjaG5vdmFAc2hhcmRhLmFjLmlu" target="_blank" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium">
              Add to your Google Calendar <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* DEVSPACE FEATURES */}
      <section className="py-24 bg-black/50 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-3">DevSpace</h2>
            <h3 className="text-4xl md:text-5xl font-bold mb-6">Student Community Hub</h3>
            <p className="text-gray-400 text-lg">
              Everything you need to grow, collaborate, and succeed in your technical journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Community",
                desc: "Discuss ideas, ask questions, and share knowledge.",
                icon: Users,
                href: "/community",
                color: "text-blue-500"
              },
              {
                title: "Buddy Finder",
                desc: "Find teammates for hackathons and projects.",
                icon: Users,
                href: "/buddy-finder",
                color: "text-purple-500"
              },
              {
                title: "Project Showcase",
                desc: "Show off your projects and get feedback.",
                icon: Code2,
                href: "/showcase",
                color: "text-emerald-500"
              },
              {
                title: "Resources",
                desc: "Access academic resources and PYQs.",
                icon: Database,
                href: "/resources",
                color: "text-amber-500"
              },
            ].map((item, idx) => (
              <Link key={idx} href={item.href} className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all">
                <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${item.color} group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{item.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CLUBS GRID */}
      <section className="py-24 bg-zinc-900">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Explore Our Clubs</h2>
              <p className="text-gray-400">Find your tribe and master your craft.</p>
            </div>
            <Link href="/clubs" className="hidden md:flex items-center gap-2 text-blue-500 hover:text-blue-400 font-medium">
              View All Clubs <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="mt-20 mb-20">
            <ClubsCarousel />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black py-12 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex flex-wrap items-center gap-6 mb-8">
                <Link href="/" className="block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/logo/technova-white.png" alt="Technova Logo" className="h-24 w-auto object-contain" />
                </Link>
                <div className="hidden md:block h-12 w-px bg-white/20" />
                <Link href="https://www.sharda.ac.in/" target="_blank" className="block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/logo/sharda.png" alt="Sharda University" className="h-20 w-auto object-contain bg-white rounded-lg p-2" />
                </Link>
                <div className="hidden md:block h-12 w-px bg-white/20" />
                <div className="block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/logo/naac.png" alt="NAAC Accredited" className="h-20 w-auto object-contain bg-white/90 rounded-lg p-1" />
                </div>
              </div>

              <p className="text-gray-400 max-w-sm mb-6">
                Sharda School of Engineering and Technology, Sharda University,
                Knowledge Park III, Greater Noida, Uttar Pradesh - 201310, India
              </p>
              <div className="flex gap-4">
                <Link
                  href="https://www.instagram.com/technova_sharda/"
                  target="_blank"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-600/20"
                >
                  <Instagram className="w-5 h-5" />
                </Link>
                <Link
                  href="https://www.linkedin.com/company/technova-su/"
                  target="_blank"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-600/20"
                >
                  <Linkedin className="w-5 h-5" />
                </Link>
                <Link
                  href="mailto:technova@sharda.ac.in"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-red-500 hover:text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-red-500/20"
                >
                  <Mail className="w-5 h-5" />
                </Link>
                <Link
                  href="/"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-emerald-500 hover:text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/20"
                >
                  <Globe className="w-5 h-5" />
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link href="/events" className="text-gray-400 hover:text-blue-400 transition-colors">Events</Link></li>
                <li><Link href="/clubs" className="text-gray-400 hover:text-blue-400 transition-colors">Clubs</Link></li>
                <li><Link href="/leadership" className="text-gray-400 hover:text-blue-400 transition-colors">Leadership</Link></li>
                <li><Link href="/login" className="text-gray-400 hover:text-blue-400 transition-colors">Login / Register</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-gray-400">
                  <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <span>Knowledge Park III, Greater Noida</span>
                </li>
                <li className="flex items-center gap-3 text-gray-400">
                  <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                  <span>technova@sharda.ac.in</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Technova Technical Society.
          </div>
        </div>
      </footer>
    </div>
  )
}
