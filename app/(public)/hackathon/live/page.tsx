'use client'

import { useEffect, useState } from 'react'
import LiveDashboardClient from '@/app/(public)/live/live-dashboard'
import { motion } from 'framer-motion'
import { Terminal } from 'lucide-react'

export default function HackathonLivePage() {
    const [liveData, setLiveData] = useState<{ settings: any; schedule: any[]; shortlistedTeams: any[] } | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        // Cyber Loader Sequence
        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    clearInterval(interval)
                    setTimeout(() => setIsLoading(false), 500)
                    return 100
                }
                return p + Math.floor(Math.random() * 15) + 5
            })
        }, 150)

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        async function fetchLiveData() {
            try {
                const res = await fetch('/api/hackathon-live')
                if (res.ok) {
                    const data = await res.json()
                    setLiveData(data)
                }
            } catch (e) {
                console.error('Failed to fetch live data', e)
            }
        }
        fetchLiveData()
        const liveInterval = setInterval(fetchLiveData, 15000)
        return () => clearInterval(liveInterval)
    }, [])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#03030F] flex items-center justify-center font-mono">
                <div className="w-16 h-1 w-full max-w-[200px] bg-white/10 relative overflow-hidden flex">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.2, ease: "linear" }} className="absolute left-0 top-0 h-full bg-[#FF6B00]" />
                </div>
            </div>
        )
    }

    if (!liveData) return <div className="min-h-screen bg-[#03030F] flex items-center justify-center text-white font-mono uppercase tracking-widest text-xs">AWAITING SYSTEM DATA...</div>

    return (
        <div className="min-h-screen bg-[#03030F] text-white pt-24 pb-32">
            <LiveDashboardClient
                initialSettings={liveData.settings || null}
                initialSchedule={liveData.schedule || []}
                initialShortlisted={liveData.shortlistedTeams || []}
            />
        </div>
    )
}
