'use client'

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export type UrgencyLevel = 'normal' | 'warning' | 'urgent' | 'critical' | 'final' | 'finished'

export function LiveHackbot({ urgency }: { urgency: UrgencyLevel }) {
    // MOUSE TRACKING
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)
    const [isHovered, setIsHovered] = useState(false)

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Normalized coordinates: -1 to 1
            const x = (e.clientX / window.innerWidth) * 2 - 1
            const y = (e.clientY / window.innerHeight) * 2 - 1
            mouseX.set(x)
            mouseY.set(y)
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [mouseX, mouseY])

    // SPRINGS: Emil design engineering principle - natural momentum
    const baseSpring = { stiffness: 100, damping: 15 }
    const quickSpring = { stiffness: 300, damping: 20 }

    const headRotateX = useSpring(useTransform(mouseY, [-1, 1], [-15, 15]), baseSpring)
    const headRotateY = useSpring(useTransform(mouseX, [-1, 1], [-20, 20]), baseSpring)
    const eyeX = useSpring(useTransform(mouseX, [-1, 1], [-8, 8]), quickSpring)
    const eyeY = useSpring(useTransform(mouseY, [-1, 1], [-8, 8]), quickSpring)

    // URGENCY STATE DERIVATIONS
    const isCritical = urgency === 'critical' || urgency === 'final'
    const isWarning = urgency === 'warning' || urgency === 'urgent'
    
    const glowColor = isCritical ? 'rgba(255, 65, 54, 0.6)' : isWarning ? 'rgba(255, 107, 0, 0.5)' : 'rgba(0, 255, 65, 0.4)'
    const accentColor = isCritical ? '#FF4136' : isWarning ? '#FF6B00' : '#00FF41'
    
    // Animation Variants
    const floatVariant = {
        normal: { y: [0, -10, 0], transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const } },
        warning: { y: [0, -5, 0], transition: { duration: 2, repeat: Infinity, ease: "easeInOut" as const } },
        critical: { 
            x: [0, -2, 2, -2, 0], 
            y: [0, 2, -2, 2, 0],
            transition: { duration: 0.3, repeat: Infinity, ease: "linear" as const } 
        },
        finished: { y: 20, rotateZ: 90, opacity: 0.5, transition: { type: "spring" as const, bounce: 0.5 } }
    }

    const stateVariant = urgency === 'normal' ? 'normal' : 
                         isCritical ? 'critical' : 
                         isWarning ? 'warning' : 'finished'

    const [glitching, setGlitching] = useState(false)

    useEffect(() => {
        if (!isCritical) return
        const glInterval = setInterval(() => {
            setGlitching(true)
            setTimeout(() => setGlitching(false), 150)
        }, Math.random() * 2000 + 500)
        return () => clearInterval(glInterval)
    }, [isCritical])

    return (
        <motion.div 
            className="relative flex flex-col items-center justify-center cursor-pointer select-none"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", ...quickSpring }}
        >
            <AnimatePresence>
                {isHovered && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute -top-12 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-lg text-[10px] font-mono tracking-widest uppercase text-white/90 whitespace-nowrap"
                    >
                        {isCritical ? "SYSTEM OVERLOAD" : isWarning ? "FOCUS MODE ENGAGED" : "ALL SYSTEMS NOMINAL"}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Backdrop Glow */}
            <motion.div 
                animate={{ boxShadow: `0 0 60px ${glowColor}` }}
                className="absolute w-24 h-24 rounded-full mix-blend-screen opacity-50 blur-[20px] pointer-events-none"
            />

            <motion.div 
                variants={floatVariant}
                animate={stateVariant}
                style={{ rotateX: headRotateX, rotateY: headRotateY, transformStyle: "preserve-3d" }}
                className="relative z-10 w-28 h-28"
            >
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
                    {/* Head chassis */}
                    <rect x="20" y="20" width="60" height="50" rx="12" fill="#03030F" stroke={accentColor} strokeWidth="3" />
                    
                    {/* Ears / Antennae */}
                    <motion.rect x="10" y="35" width="10" height="20" rx="4" fill="#03030F" stroke={accentColor} strokeWidth="2" 
                        animate={{ rotateZ: isCritical ? [0, -10, 10, 0] : 0 }}
                        transition={{ repeat: Infinity, duration: 0.1 }}
                        className={glitching ? "opacity-50" : ''}
                    />
                    <motion.rect x="80" y="35" width="10" height="20" rx="4" fill="#03030F" stroke={accentColor} strokeWidth="2" 
                        animate={{ rotateZ: isCritical ? [0, 10, -10, 0] : 0 }}
                        transition={{ repeat: Infinity, duration: 0.1 }}
                        className={glitching ? "opacity-50" : ''}
                    />

                    {/* Antenna Top */}
                    <rect x="48" y="5" width="4" height="15" fill={accentColor} />
                    <motion.circle cx="50" cy="5" r="4" fill={accentColor} 
                        animate={{ opacity: [0.3, 1, 0.3] }} 
                        transition={{ duration: isCritical ? 0.2 : 1.5, repeat: Infinity }} 
                    />

                    {/* Face Plate */}
                    <rect x="25" y="25" width="50" height="40" rx="8" fill="rgba(255,255,255,0.02)" />

                    {/* Eyes tracking logic inside an SVG transform group */}
                    <motion.g style={{ x: eyeX, y: eyeY }}>
                        {isCritical ? (
                            // Stressed Eyes
                            <>
                                <path d="M 33 35 Q 38 30 43 35 L 43 40 Q 38 35 33 40 Z" fill={accentColor} />
                                <path d="M 57 35 Q 62 30 67 35 L 67 40 Q 62 35 57 40 Z" fill={accentColor} />
                            </>
                        ) : isWarning ? (
                            // Focused Eyes
                            <>
                                <rect x="33" y="36" width="10" height="4" rx="2" fill={accentColor} />
                                <rect x="57" y="36" width="10" height="4" rx="2" fill={accentColor} />
                            </>
                        ) : urgency === 'finished' ? (
                            // Dead / Sleep Eyes
                            <>
                                <path d="M 32 38 L 42 38" stroke={accentColor} strokeWidth="3" strokeLinecap="round" />
                                <path d="M 58 38 L 68 38" stroke={accentColor} strokeWidth="3" strokeLinecap="round" />
                            </>
                        ) : (
                            // Happy / Default Eyes
                            <>
                                <path d="M 33 40 Q 38 33 43 40" stroke={accentColor} strokeWidth="4" strokeLinecap="round" fill="none" />
                                <path d="M 57 40 Q 62 33 67 40" stroke={accentColor} strokeWidth="4" strokeLinecap="round" fill="none" />
                            </>
                        )}
                    </motion.g>

                    {/* Mouth */}
                    <motion.g style={{ y: eyeY }}>
                        {isCritical ? (
                            // O shaped panic mouth
                            <rect x="42" y="52" width="16" height="6" rx="3" fill={accentColor} />
                        ) : (
                            // Line mouth
                            <rect x="45" y="55" width="10" height="2" rx="1" fill={accentColor} />
                        )}
                    </motion.g>
                    
                    {/* Glitch Overlay */}
                    {glitching && (
                        <rect x="25" y="35" width="50" height="2" fill="white" className="mix-blend-overlay" />
                    )}
                </svg>

                {/* Cyber Sparks / Sweat if critical */}
                <AnimatePresence>
                    {isCritical && (
                        <motion.div
                            initial={{ opacity: 0, y: 0 }}
                            animate={{ opacity: [0, 1, 0], y: -20, x: 10 }}
                            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1 }}
                            className="absolute top-2 right-2 w-1.5 h-3 bg-red-500 rounded"
                        />
                    )}
                </AnimatePresence>

            </motion.div>
        </motion.div>
    )
}
