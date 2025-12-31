'use client'

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Terminal, Database, Rocket, Gamepad2, Code2, Globe, Camera, Lightbulb, Users, Target, Zap, ChevronRight, Mail, MapPin, Instagram, Linkedin, Sparkles, Brain, Shield, Cloud } from "lucide-react"
import { ClubsCarousel } from "@/components/ui/clubs-carousel"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { BentoGrid, BentoItem } from "@/components/ui/bento-grid"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { RevealOnScroll, StaggerContainer, StaggerItem } from "@/components/ui/reveal-on-scroll"
import { TypewriterText, TextRotate } from "@/components/ui/typewriter-text"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { Spotlight } from "@/components/ui/spotlight"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-blue-500 selection:text-white overflow-hidden">

      {/* Animated Background */}
      <AnimatedBackground variant="default" intensity="medium" />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-xl shadow-[0_0_30px_rgba(59,130,246,0.2)]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-medium text-sm tracking-wider uppercase">Technical Society of Sharda University</span>
            </motion.div>

            {/* Main Title */}
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/50">
                WELCOME TO
              </span>
              <br />
              <motion.span
                className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                style={{ backgroundSize: '200% 200%' }}
              >
                TECHNOVA
              </motion.span>
            </h1>

            {/* Subtitle with typing effect */}
            <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl mb-10 leading-relaxed">
              Prepare to be an efficient{' '}
              <span className="text-blue-400 font-medium">
                <TextRotate
                  words={['problem solver', 'researcher', 'innovator', 'entrepreneur']}
                  duration={2.5}
                />
              </span>
              <br className="hidden sm:block" />
              The future of technology starts here.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <MagneticButton as="a" href="/events" strength={0.2}>
                <span className="group bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_50px_rgba(59,130,246,0.6)]">
                  Explore Events
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </MagneticButton>
              <MagneticButton as="a" href="/clubs" strength={0.2}>
                <span className="px-8 py-4 rounded-xl font-bold border border-white/20 bg-white/5 backdrop-blur-xl hover:bg-white/10 hover:border-white/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                  View Clubs
                </span>
              </MagneticButton>
            </div>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            className="mt-20 pt-10 border-t border-white/5"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-white/[0.02] backdrop-blur-xl rounded-2xl py-8 px-4 border border-white/5">
              <AnimatedCounter value={8} suffix="+" label="Specialized Clubs" />
              <AnimatedCounter value={50} suffix="+" label="Events Yearly" />
              <AnimatedCounter value={2500} suffix="+" label="Active Members" />
              <AnimatedCounter value={24} suffix="/7" label="Innovation" />
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-white/60"
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* VISION & MISSION - Bento Style */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <span className="text-sm font-bold text-blue-500 uppercase tracking-widest">Who We Are</span>
              <h2 className="text-4xl md:text-5xl font-bold mt-3">Our Vision & Mission</h2>
            </div>
          </RevealOnScroll>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <RevealOnScroll direction="left">
              <Spotlight className="h-full">
                <div className="p-8 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-blue-500/30 transition-all duration-500 h-full group">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Target className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                  <p className="text-gray-400 leading-relaxed">
                    To become a front-runner in preparing graduates to be efficient problem solvers, researchers, innovators and entrepreneurs, making them competent professionals ready to take on any challenge in the IT industry.
                  </p>
                </div>
              </Spotlight>
            </RevealOnScroll>

            <RevealOnScroll direction="right">
              <Spotlight className="h-full">
                <div className="p-8 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-purple-500/30 transition-all duration-500 h-full group">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Rocket className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Elevating technical skillsets to match industry standards through interactions, sessions, and propelling students to pursue their passion with support from our alumni network.
                  </p>
                </div>
              </Spotlight>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* WHAT WE DO - Bento Grid */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <RevealOnScroll>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-sm font-bold text-blue-500 uppercase tracking-widest">Why Join Us?</span>
              <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-6">What We Offer</h2>
              <p className="text-gray-400 text-lg">
                Personal growth, leadership and learning opportunities in engineering, technology, innovation, and design.
              </p>
            </div>
          </RevealOnScroll>

          <BentoGrid className="max-w-6xl mx-auto">
            <BentoItem colSpan={2} index={0} glowColor="rgba(59, 130, 246, 0.3)">
              <div className="p-8 h-full flex flex-col justify-between min-h-[200px]">
                <div>
                  <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mb-4">
                    <Lightbulb className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Innovation Hub</h3>
                  <p className="text-gray-400">Promoting student ability for invention, resourcefulness and ultimately innovation through hands-on projects and hackathons.</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs">Hackathons</span>
                  <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs">Projects</span>
                  <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs">Workshops</span>
                </div>
              </div>
            </BentoItem>

            <BentoItem index={1} glowColor="rgba(147, 51, 234, 0.3)">
              <div className="p-8 h-full min-h-[200px]">
                <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Community</h3>
                <p className="text-gray-400 text-sm">Connect with like-minded students, alumni, and industry professionals.</p>
              </div>
            </BentoItem>

            <BentoItem index={2} glowColor="rgba(16, 185, 129, 0.3)">
              <div className="p-8 h-full min-h-[200px]">
                <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Growth</h3>
                <p className="text-gray-400 text-sm">Build foundational skills in engineering and technology principles.</p>
              </div>
            </BentoItem>

            <BentoItem colSpan={2} index={3} glowColor="rgba(245, 158, 11, 0.3)">
              <div className="p-8 h-full flex flex-col justify-between min-h-[200px]">
                <div>
                  <div className="w-12 h-12 bg-amber-600/20 rounded-xl flex items-center justify-center mb-4">
                    <Globe className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Industry Connect</h3>
                  <p className="text-gray-400">Bridge the gap between academia and industry through tech talks, mentorship sessions, and professional networking events.</p>
                </div>
              </div>
            </BentoItem>
          </BentoGrid>
        </div>
      </section>

      {/* CALENDAR SECTION */}
      <section className="py-24 bg-zinc-900/50 border-y border-white/5">
        <div className="container mx-auto px-4">
          <RevealOnScroll>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-sm font-bold text-blue-500 uppercase tracking-widest">Schedule</span>
              <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-6">Events Calendar</h2>
              <p className="text-gray-400 text-lg">Never miss an event. Subscribe to our official calendar.</p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.2}>
            <div className="bg-black/40 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] max-w-5xl mx-auto overflow-hidden">
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
          </RevealOnScroll>

          <div className="text-center mt-8">
            <Link href="https://calendar.google.com/calendar/u/0?cid=dGVjaG5vdmFAc2hhcmRhLmFjLmlu" target="_blank" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium">
              Add to your Google Calendar <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* DEVSPACE FEATURES */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <RevealOnScroll>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-sm font-bold text-blue-500 uppercase tracking-widest">DevSpace</span>
              <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-6">Student Community Hub</h2>
              <p className="text-gray-400 text-lg">
                Everything you need to grow, collaborate, and succeed in your technical journey.
              </p>
            </div>
          </RevealOnScroll>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Community", desc: "Discuss ideas, ask questions, and share knowledge.", icon: Users, href: "/community", color: "blue" },
              { title: "Buddy Finder", desc: "Find teammates for hackathons and projects.", icon: Users, href: "/buddy-finder", color: "purple" },
              { title: "Project Showcase", desc: "Show off your projects and get feedback.", icon: Code2, href: "/showcase", color: "emerald" },
              { title: "Resources", desc: "Access academic resources and PYQs.", icon: Database, href: "/resources", color: "amber" },
            ].map((item, idx) => (
              <StaggerItem key={idx}>
                <Link href={item.href} className="block group">
                  <div className={`p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-${item.color}-500/30 hover:bg-white/[0.06] transition-all duration-500 hover:-translate-y-2 h-full`}>
                    <div className={`w-12 h-12 rounded-xl bg-${item.color}-600/20 flex items-center justify-center mb-4 text-${item.color}-400 group-hover:scale-110 transition-transform`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{item.title}</h4>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CLUBS SECTION */}
      <section className="py-24 bg-zinc-900/50">
        <div className="container mx-auto px-4">
          <RevealOnScroll>
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="text-sm font-bold text-blue-500 uppercase tracking-widest">Our Clubs</span>
                <h2 className="text-4xl md:text-5xl font-bold mt-3">Explore & Join</h2>
                <p className="text-gray-400 mt-4">Find your tribe and master your craft.</p>
              </div>
              <Link href="/clubs" className="hidden md:flex items-center gap-2 text-blue-500 hover:text-blue-400 font-medium">
                View All Clubs <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </RevealOnScroll>

          <div className="mt-12">
            <ClubsCarousel />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black/60 backdrop-blur-xl py-12 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Logo & Branding */}
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <Link href="/" className="block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/logo/technova-white.png" alt="Technova Logo" className="h-16 w-auto object-contain" />
                </Link>
                <div className="hidden md:block h-10 w-px bg-white/20" />
                <Link href="https://www.sharda.ac.in/" target="_blank" className="block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/logo/sharda.png" alt="Sharda University" className="h-14 w-auto object-contain bg-white rounded-lg p-1.5" />
                </Link>
              </div>

              <p className="text-gray-400 text-sm mb-4">
                Sharda School of Engineering and Technology, Sharda University, Knowledge Park III, Greater Noida, UP - 201310
              </p>
              <div className="flex gap-3">
                <Link href="https://www.instagram.com/technova_sharda/" target="_blank" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-all duration-300 hover:-translate-y-1">
                  <Instagram className="w-4 h-4" />
                </Link>
                <Link href="https://www.linkedin.com/company/technova-su/" target="_blank" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300 hover:-translate-y-1">
                  <Linkedin className="w-4 h-4" />
                </Link>
                <Link href="mailto:technova@sharda.ac.in" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-red-500 hover:text-white transition-all duration-300 hover:-translate-y-1">
                  <Mail className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/events" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Events</Link></li>
                <li><Link href="/clubs" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Clubs</Link></li>
                <li><Link href="/leadership" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Leadership</Link></li>
                <li><Link href="/login" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Login / Register</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-white mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-400 text-sm">
                  <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <span>Knowledge Park III, Greater Noida</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400 text-sm">
                  <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>technova@sharda.ac.in</span>
                </li>
              </ul>
            </div>

            {/* Google Maps */}
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <h4 className="font-bold text-white mb-4">Find Us</h4>
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all duration-500">
                <iframe
                  src="https://www.google.com/maps?q=Sharda+University,+Knowledge+Park+III,+Greater+Noida,+Uttar+Pradesh&output=embed"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Sharda University Location"
                  className="w-full h-48"
                ></iframe>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-10 pt-6 text-center text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Technova Technical Society. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
