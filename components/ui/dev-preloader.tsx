'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal } from 'lucide-react'

export function DevPreloader() {
    const [progress, setProgress] = useState(0)
    const [logIndex, setLogIndex] = useState(0)

    const logs = [
        "Initializing core modules...",
        "Resolving dependencies...",
        "Compiling assets...",
        "Establishing secure connection...",
        "Rendering layout [OK]"
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    return 100
                }
                return prev + Math.floor(Math.random() * 15) + 5
            })
        }, 120)

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const logInt = setInterval(() => {
            setLogIndex(prev => Math.min(prev + 1, logs.length - 1))
        }, 300)
        return () => clearInterval(logInt)
    }, [])

    return (
        <div className="min-h-screen bg-[#050510] flex items-center justify-center font-mono overflow-hidden fixed inset-0 z-50">
            <div className="w-full max-w-md px-6">
                <div className="flex items-center gap-3 mb-6 text-[#00FF41]/80">
                    <Terminal className="w-5 h-5" />
                    <span className="text-xs uppercase tracking-widest font-bold">System Boot Sequence</span>
                </div>
                
                {/* Progress Bar */}
                <div className="h-1 w-full bg-white/10 relative overflow-hidden mb-8 rounded-full">
                    <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${progress}%` }} 
                        transition={{ duration: 0.1, ease: "linear" }} 
                        className="absolute left-0 top-0 h-full bg-[#00FF41] shadow-[0_0_10px_#00FF41]" 
                    />
                </div>

                {/* Faux Terminal Feed */}
                <div className="flex flex-col gap-2 h-32 justify-end mask-image-b-fade">
                    <AnimatePresence mode="popLayout">
                        {logs.slice(0, logIndex + 1).map((log, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: i === logIndex ? 1 : 0.4, x: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className="text-xs text-[#00FF41]/80"
                            >
                                {`> ${log}`}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
            
            <style jsx>{`
                .mask-image-b-fade {
                    -webkit-mask-image: linear-gradient(to bottom, transparent, black 40%);
                    mask-image: linear-gradient(to bottom, transparent, black 40%);
                }
            `}</style>
        </div>
    )
}
