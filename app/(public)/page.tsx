'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { ArrowRight, Users, Code2, Database, Globe, Lightbulb, Zap, ChevronRight, Mail, MapPin, Instagram, Linkedin, Sparkles, Target, Rocket } from "lucide-react"
import { ClubsCarousel } from "@/components/ui/clubs-carousel"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { FeaturedEvents } from "@/components/home/featured-events"

/* ═══════════════════════════════════════════
   DESIGN TOKENS — Emil Kowalski philosophy
   Custom easing curves, stagger values, durations.
   Never ease-in. Always ease-out for entries.
   ═══════════════════════════════════════════ */
const EASE_OUT = [0.23, 1, 0.32, 1] as const
const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const
const STAGGER_DELAY = 0.06 // 60ms between items — short, cascading

/* ── Scroll-triggered wrapper (lean, no external dep) ── */
function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, transform: "translateY(24px)" }}
      animate={inView ? { opacity: 1, transform: "translateY(0px)" } : {}}
      transition={{ duration: 0.5, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  )
}

/* ── Animated stat counter ── */
function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1200
    const startTime = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // ease-out curve applied to counting
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.floor(eased * value)
      setDisplay(current)
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [inView, value])

  return (
    <div ref={ref} className="text-center">
      <span className="text-3xl md:text-4xl font-bold tabular-nums text-white">
        {display}{suffix}
      </span>
      <p className="text-xs text-gray-500 uppercase tracking-widest mt-1.5 font-medium">{label}</p>
    </div>
  )
}

/* ── Word rotator — CSS-driven opacity crossfade ── */
function WordRotator({ words }: { words: string[] }) {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setIdx(i => (i + 1) % words.length), 2800)
    return () => clearInterval(interval)
  }, [words.length])

  return (
    <span className="inline-block relative" style={{ minWidth: '10ch' }}>
      {words.map((word, i) => (
        <span
          key={word}
          className="absolute left-0 transition-all duration-300"
          style={{
            opacity: i === idx ? 1 : 0,
            transform: i === idx ? 'translateY(0)' : 'translateY(6px)',
            transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
            position: i === idx ? 'relative' : 'absolute',
          }}
        >
          {word}
        </span>
      ))}
    </span>
  )
}

/* ═══════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════ */
export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-blue-500/30 selection:text-white overflow-hidden">

      {/* Background — CSS orbs, no canvas */}
      <AnimatedBackground variant="default" intensity="medium" />

      {/* ────────────────────── HERO ────────────────────── */}
      <section className="relative min-h-[100dvh] flex items-center justify-center pt-20 pb-12">
        {/* Grid pattern — subtle */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
            maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
          }}
        />

        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">

          {/* Badge — stagger item 1 */}
          <motion.div
            className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full border border-blue-500/25 bg-blue-500/[0.08]"
            initial={{ opacity: 0, transform: "scale(0.96)" }}
            animate={{ opacity: 1, transform: "scale(1)" }}
            transition={{ duration: 0.4, delay: 0.1, ease: EASE_OUT }}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-blue-400 font-medium text-xs tracking-[0.15em] uppercase">Technical Society of Sharda University</span>
          </motion.div>

          {/* Main Title — stagger item 2 */}
          <motion.h1
            className="text-5xl sm:text-6xl md:text-[5.5rem] font-extrabold tracking-tight leading-[0.95] mb-6"
            initial={{ opacity: 0, transform: "translateY(20px)" }}
            animate={{ opacity: 1, transform: "translateY(0)" }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE_OUT }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white/95 to-white/40">
              WELCOME TO
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400">
              TECHNOVA
            </span>
          </motion.h1>

          {/* Subtitle — stagger item 3 */}
          <motion.p
            className="max-w-xl mx-auto text-gray-400 text-lg md:text-xl mb-10 leading-relaxed"
            initial={{ opacity: 0, transform: "translateY(16px)" }}
            animate={{ opacity: 1, transform: "translateY(0)" }}
            transition={{ duration: 0.5, delay: 0.35, ease: EASE_OUT }}
          >
            Prepare to be an efficient{' '}
            <span className="text-blue-400 font-semibold">
              <WordRotator words={['problem solver', 'researcher', 'innovator', 'entrepreneur']} />
            </span>
            <br className="hidden sm:block" />
            The future of technology starts here.
          </motion.p>

          {/* CTAs — stagger item 4 */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, transform: "translateY(16px)" }}
            animate={{ opacity: 1, transform: "translateY(0)" }}
            transition={{ duration: 0.5, delay: 0.5, ease: EASE_OUT }}
          >
            <Link href="/events" className="group">
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 shadow-[0_0_24px_rgba(59,130,246,0.35)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] active:scale-[0.97]"
                style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
              >
                Explore Events
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
              </span>
            </Link>
            <Link href="/clubs" className="group">
              <span className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/25 transition-all duration-200 active:scale-[0.97]"
                style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
              >
                View Clubs
              </span>
            </Link>
          </motion.div>

          {/* Stats — inline, stagger item 5 */}
          <motion.div
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 pt-10 border-t border-white/[0.06]"
            initial={{ opacity: 0, transform: "translateY(20px)" }}
            animate={{ opacity: 1, transform: "translateY(0)" }}
            transition={{ duration: 0.5, delay: 0.65, ease: EASE_OUT }}
          >
            <StatCounter value={8} suffix="+" label="Specialized Clubs" />
            <StatCounter value={50} suffix="+" label="Events Yearly" />
            <StatCounter value={2500} suffix="+" label="Active Members" />
            <StatCounter value={24} suffix="/7" label="Innovation" />
          </motion.div>
        </div>
      </section>

      {/* ────────────────── FEATURED EVENTS ────────────────── */}
      <FeaturedEvents />

      {/* ────────────────── VISION & MISSION ────────────────── */}
      <section className="py-28 relative">
        <div className="container mx-auto px-4 max-w-5xl">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-xs font-bold text-blue-500 uppercase tracking-[0.2em]">Who We Are</span>
              <h2 className="text-4xl md:text-5xl font-extrabold mt-3 tracking-tight">Our Vision & Mission</h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Vision */}
            <Reveal delay={0.1}>
              <div className="group relative p-8 rounded-2xl bg-white/[0.025] border border-white/[0.08] hover:border-blue-500/30 transition-colors duration-200 h-full"
                style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center mb-5 transition-transform duration-200 group-hover:scale-105"
                    style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
                  >
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                    Our Vision
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    To become a front-runner in preparing graduates to be efficient problem solvers, researchers, innovators and entrepreneurs, making them competent professionals ready to take on any challenge in the IT industry.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Mission */}
            <Reveal delay={0.16}>
              <div className="group relative p-8 rounded-2xl bg-white/[0.025] border border-white/[0.08] hover:border-purple-500/30 transition-colors duration-200 h-full"
                style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center mb-5 transition-transform duration-200 group-hover:scale-105"
                    style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
                  >
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    Our Mission
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Elevating technical skillsets to match industry standards through interactions, sessions, and propelling students to pursue their passion with support from our alumni network.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ────────────────── WHAT WE OFFER — Bento ────────────────── */}
      <section className="py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/[0.06] to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 max-w-6xl">
          <Reveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold text-blue-500 uppercase tracking-[0.2em]">Why Join Us?</span>
              <h2 className="text-4xl md:text-5xl font-extrabold mt-3 mb-5 tracking-tight">What We Offer</h2>
              <p className="text-gray-400 text-base">
                Personal growth, leadership and learning opportunities in engineering, technology, innovation, and design.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {[
              { title: "Innovation Hub", desc: "Promoting student ability for invention, resourcefulness and ultimately innovation through hands-on projects and hackathons.", icon: Lightbulb, color: "blue", colSpan: 2, tags: ["Hackathons", "Projects", "Workshops"] },
              { title: "Community", desc: "Connect with like-minded students, alumni, and industry professionals.", icon: Users, color: "purple" },
              { title: "Growth", desc: "Build foundational skills in engineering and technology principles.", icon: Zap, color: "emerald" },
              { title: "Industry Connect", desc: "Bridge the gap between academia and industry through tech talks, mentorship sessions, and professional networking events.", icon: Globe, color: "amber", colSpan: 2 },
            ].map((item, idx) => (
              <Reveal key={item.title} delay={idx * STAGGER_DELAY} className={item.colSpan === 2 ? 'md:col-span-2' : ''}>
                <div
                  className="group relative p-7 rounded-2xl bg-white/[0.025] border border-white/[0.08] transition-colors duration-200 h-full cursor-default active:scale-[0.98]"
                  style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget
                    el.style.borderColor = item.color === 'blue' ? 'rgba(59,130,246,0.3)' : item.color === 'purple' ? 'rgba(147,51,234,0.3)' : item.color === 'emerald' ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                  }}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${
                    item.color === 'blue' ? 'bg-blue-600/15 text-blue-400' :
                    item.color === 'purple' ? 'bg-purple-600/15 text-purple-400' :
                    item.color === 'emerald' ? 'bg-emerald-600/15 text-emerald-400' :
                    'bg-amber-600/15 text-amber-400'
                  }`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className={`font-bold mb-2 ${item.colSpan === 2 ? 'text-xl' : 'text-lg'}`}>{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  {item.tags && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {item.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-blue-500/[0.08] text-blue-400 rounded-full text-xs font-medium">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────── DEVSPACE HUB ────────────────── */}
      <section className="py-28 relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <Reveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold text-blue-500 uppercase tracking-[0.2em]">DevSpace</span>
              <h2 className="text-4xl md:text-5xl font-extrabold mt-3 mb-5 tracking-tight">Student Community Hub</h2>
              <p className="text-gray-400 text-base">
                Everything you need to grow, collaborate, and succeed in your technical journey.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Community", desc: "Discuss ideas, ask questions, and share knowledge.", icon: Users, href: "/community", color: "blue" },
              { title: "Buddy Finder", desc: "Find teammates for hackathons and projects.", icon: Users, href: "/buddy-finder", color: "purple" },
              { title: "Project Showcase", desc: "Show off your projects and get feedback.", icon: Code2, href: "/showcase", color: "emerald" },
              { title: "Resources", desc: "Access academic resources and PYQs.", icon: Database, href: "/resources", color: "amber" },
            ].map((item, idx) => (
              <Reveal key={item.title} delay={idx * STAGGER_DELAY}>
                <Link href={item.href} className="block group h-full">
                  <div
                    className="p-6 rounded-2xl bg-white/[0.025] border border-white/[0.08] transition-colors duration-200 h-full active:scale-[0.97]"
                    style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget
                      el.style.borderColor = item.color === 'blue' ? 'rgba(59,130,246,0.3)' : item.color === 'purple' ? 'rgba(147,51,234,0.3)' : item.color === 'emerald' ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                    }}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${
                      item.color === 'blue' ? 'bg-blue-600/15 text-blue-400' :
                      item.color === 'purple' ? 'bg-purple-600/15 text-purple-400' :
                      item.color === 'emerald' ? 'bg-emerald-600/15 text-emerald-400' :
                      'bg-amber-600/15 text-amber-400'
                    }`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-lg font-bold mb-1.5 group-hover:text-blue-400 transition-colors duration-200">{item.title}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────── CLUBS ────────────────── */}
      <section className="py-28 bg-white/[0.015] border-y border-white/[0.05]">
        <div className="container mx-auto px-4">
          <Reveal>
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="text-xs font-bold text-blue-500 uppercase tracking-[0.2em]">Our Clubs</span>
                <h2 className="text-4xl md:text-5xl font-extrabold mt-3 tracking-tight">Explore & Join</h2>
                <p className="text-gray-400 mt-3 text-sm">Find your tribe and master your craft.</p>
              </div>
              <Link
                href="/clubs"
                className="hidden md:flex items-center gap-1.5 text-blue-500 hover:text-blue-400 font-semibold text-sm transition-colors duration-200"
              >
                View All Clubs <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>

          <div className="mt-8">
            <ClubsCarousel />
          </div>
        </div>
      </section>

      {/* ────────────────── FOOTER ────────────────── */}
      <footer className="bg-black/80 py-14 border-t border-white/[0.06]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Branding */}
            <div className="lg:col-span-1">
              <div className="flex flex-wrap items-center gap-4 mb-5">
                <Link href="/" className="block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/logo/technova-white.png" alt="Technova Logo" className="h-14 w-auto object-contain" />
                </Link>
                <div className="hidden md:block h-8 w-px bg-white/15" />
                <Link href="https://www.sharda.ac.in/" target="_blank" className="block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/logo/sharda.png" alt="Sharda University" className="h-12 w-auto object-contain bg-white rounded-lg p-1" />
                </Link>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed mb-4">
                Sharda School of Computing Science and Engineering, Sharda University, Knowledge Park III, Greater Noida, UP - 201310
              </p>
              <div className="flex gap-2.5">
                {[
                  { href: "https://www.instagram.com/technova_sharda/", icon: Instagram, hoverBg: "hover:bg-pink-600" },
                  { href: "https://www.linkedin.com/company/technova-su/", icon: Linkedin, hoverBg: "hover:bg-blue-600" },
                  { href: "mailto:technova@sharda.ac.in", icon: Mail, hoverBg: "hover:bg-red-500" },
                ].map((social) => (
                  <Link
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    className={`w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-gray-500 ${social.hoverBg} hover:text-white transition-all duration-200 active:scale-[0.93]`}
                    style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
                  >
                    <social.icon className="w-3.5 h-3.5" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-white text-sm mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {[
                  { label: "Events", href: "/events" },
                  { label: "Clubs", href: "/clubs" },
                  { label: "Leadership", href: "/leadership" },
                  { label: "Login / Register", href: "/login" },
                ].map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-gray-500 hover:text-blue-400 transition-colors duration-200 text-sm">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-white text-sm mb-4">Contact</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="https://maps.app.goo.gl/BpCDyGPHZvGwAoPs8" target="_blank" className="flex items-start gap-2 text-gray-500 text-sm hover:text-blue-400 transition-colors duration-200">
                    <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <span>Knowledge Park III, Greater Noida</span>
                  </Link>
                </li>
                <li>
                  <Link href="mailto:technova@sharda.ac.in" className="flex items-center gap-2 text-gray-500 text-sm hover:text-blue-400 transition-colors duration-200">
                    <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>technova@sharda.ac.in</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Find Us — no iframe, just link */}
            <div>
              <h4 className="font-bold text-white text-sm mb-4">Find Us</h4>
              <Link
                href="https://maps.app.goo.gl/BpCDyGPHZvGwAoPs8"
                target="_blank"
                className="group block p-5 rounded-2xl bg-white/[0.025] border border-white/[0.08] hover:border-blue-500/25 transition-colors duration-200"
                style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
              >
                <MapPin className="w-8 h-8 text-blue-500 mb-3" />
                <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-200">Sharda University, Knowledge Park III, Greater Noida, UP</p>
                <span className="inline-flex items-center gap-1 text-blue-500 text-xs font-semibold mt-3 group-hover:gap-2 transition-all duration-200">
                  Open in Maps <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </div>
          </div>

          <div className="border-t border-white/[0.06] mt-10 pt-6 text-center text-gray-600 text-xs">
            &copy; {new Date().getFullYear()} Technova Technical Society. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Global styles for press feedback & reduced motion */}
      <style jsx global>{`
        /* Press feedback for all interactive elements */
        .active\\:scale-\\[0\\.97\\]:active { transform: scale(0.97); }
        .active\\:scale-\\[0\\.98\\]:active { transform: scale(0.98); }
        .active\\:scale-\\[0\\.93\\]:active { transform: scale(0.93); }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  )
}
