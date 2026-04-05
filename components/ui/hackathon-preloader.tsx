'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap } from 'lucide-react'

export function HackathonPreloader() {
    const [progress, setProgress] = useState(0)
    const [logIndex, setLogIndex] = useState(0)

    const logs = [
        "Booting Innovate Bharat telemetry...",
        "Syncing hackathon live feed...",
        "Connecting to orbit infrastructure...",
        "Calibrating chronometers...",
        "Establishing AEROSPACE_LINK: ACTIVE"
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    return 100
                }
                return prev + Math.floor(Math.random() * 12) + 4
            })
        }, 150)

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const logInt = setInterval(() => {
            setLogIndex(prev => Math.min(prev + 1, logs.length - 1))
        }, 400)
        return () => clearInterval(logInt)
    }, [])

    return (
        <div className="min-h-screen bg-[#03030F] flex flex-col items-center justify-center font-mono overflow-hidden fixed inset-0 z-50">
            {/* Background Cyber Details */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-multiply pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF6B00]/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="w-full max-w-lg px-8 relative z-10">
                <div className="flex flex-col items-center mb-12">
                    <motion.div 
                        animate={{ opacity: [0.5, 1, 0.5] }} 
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="w-16 h-16 bg-white/5 border border-white/10 flex items-center justify-center rounded-xl mb-6 shadow-[0_0_30px_rgba(255,107,0,0.15)]"
                    >
                        <Zap className="w-8 h-8 text-[#FF6B00]" />
                    </motion.div>
                    <h1 className="text-3xl font-black uppercase text-white tracking-widest text-center">
                        Syncing <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] to-[#FFa000]">Live Feed</span>
                    </h1>
                </div>
                
                {/* Tactical Progress Bar */}
                <div className="relative mb-8">
                    <div className="flex justify-between text-[10px] uppercase tracking-widest text-[#FF6B00] font-bold mb-2">
                        <span>Loading Interface</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 border border-white/10 relative overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${progress}%` }} 
                            transition={{ duration: 0.1, ease: "linear" }} 
                            className="absolute left-0 top-0 h-full bg-[#FF6B00] shadow-[0_0_15px_#FF6B00]" 
                        />
                    </div>
                </div>

                {/* Event Faux Terminal Feed */}
                <div className="flex flex-col items-center gap-2 h-20 justify-end overflow-hidden">
                    <AnimatePresence mode="popLayout">
                        <motion.div 
                            key={logIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="text-xs text-white/50 tracking-wider"
                        >
                            {logs[logIndex]}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
