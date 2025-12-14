'use client'

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Calendar, Users, Award } from "lucide-react"
import { Navbar } from "@/components/layout/navbar"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-blue-500 selection:text-white">

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden px-4 text-center pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black z-0 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10 max-w-4xl"
        >
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium backdrop-blur-sm">
            Technova Technical Society
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-200 to-gray-500">
            Shape the Future of <br className="hidden md:block" /> Technology
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            The official technical ecosystem of Sharda University. Connect, Compete, and Create with the brightest minds on campus.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="px-8 py-3.5 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2">
              Join Society <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/clubs" className="px-8 py-3.5 rounded-full border border-gray-700 hover:border-gray-500 hover:bg-gray-900 transition-all">
              Explore Clubs
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats/Highlights */}
      <section className="py-24 border-t border-gray-800 bg-black/50 backdrop-blur-3xl">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Calendar, label: "Active Events", value: "10+", desc: "Workshops & Hackathons" },
              { icon: Users, label: "Community", value: "500+", desc: "Student Developers" },
              { icon: Award, label: "Achievements", value: "50+", desc: "National Awards" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-blue-500/30 transition-colors"
              >
                <stat.icon className="w-8 h-8 text-blue-500 mb-4" />
                <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                <p className="font-semibold text-white mb-2">{stat.label}</p>
                <p className="text-gray-400 text-sm">{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
