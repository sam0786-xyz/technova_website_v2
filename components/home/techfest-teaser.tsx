'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

// Letters that will flash subtly - hidden clue for TECHFEST
const HIDDEN_LETTERS = ['T', 'E', 'C', 'H', 'F', 'E', 'S', 'T']

// Glitch text animation component
function GlitchText({ children }: { children: string }) {
    const [glitchActive, setGlitchActive] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => {
            setGlitchActive(true)
            setTimeout(() => setGlitchActive(false), 200)
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    return (
        <span className="relative inline-block">
            <span className={`${glitchActive ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
                {children}
            </span>
            {glitchActive && (
                <>
                    <span className="absolute inset-0 text-cyan-400 animate-pulse" style={{ clipPath: 'inset(40% 0 20% 0)', transform: 'translate(-2px, -1px)' }}>
                        {children}
                    </span>
                    <span className="absolute inset-0 text-pink-500 animate-pulse" style={{ clipPath: 'inset(20% 0 60% 0)', transform: 'translate(2px, 1px)' }}>
                        {children}
                    </span>
                </>
            )}
        </span>
    )
}

// Subtle letter flash component - hints at TECHFEST without revealing
function HiddenLetterFlash() {
    const [currentLetter, setCurrentLetter] = useState(-1)

    useEffect(() => {
        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * HIDDEN_LETTERS.length)
            setCurrentLetter(randomIndex)
            setTimeout(() => setCurrentLetter(-1), 150)
        }, 2500)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {currentLetter >= 0 && (
                <motion.span
                    initial={{ opacity: 0, scale: 2 }}
                    animate={{ opacity: 0.15, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute text-8xl md:text-[200px] font-black text-purple-400/20 blur-[1px]"
                    style={{
                        left: `${20 + Math.random() * 60}%`,
                        top: `${10 + Math.random() * 80}%`,
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    {HIDDEN_LETTERS[currentLetter]}
                </motion.span>
            )}
        </div>
    )
}

// Matrix-style raining characters
function MatrixRain() {
    return (
        <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
            {[...Array(15)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute text-xs font-mono text-purple-400"
                    style={{ left: `${5 + i * 7}%` }}
                    initial={{ y: -100 }}
                    animate={{ y: '100vh' }}
                    transition={{
                        duration: 8 + Math.random() * 4,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                        ease: 'linear'
                    }}
                >
                    {[...Array(20)].map((_, j) => (
                        <div key={j} className="opacity-50">
                            {String.fromCharCode(33 + Math.floor(Math.random() * 93))}
                        </div>
                    ))}
                </motion.div>
            ))}
        </div>
    )
}

// Pulsing signal indicator
function SignalPulse() {
    return (
        <div className="flex items-center gap-2">
            <motion.div
                className="w-2 h-2 rounded-full bg-purple-500"
                animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                    boxShadow: [
                        '0 0 0 0 rgba(147, 51, 234, 0.4)',
                        '0 0 0 10px rgba(147, 51, 234, 0)',
                        '0 0 0 0 rgba(147, 51, 234, 0.4)'
                    ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-purple-400 text-xs font-mono uppercase tracking-widest">Signal Detected</span>
        </div>
    )
}

export function TechfestTeaser() {
    const [hoverCount, setHoverCount] = useState(0)

    return (
        <section className="relative py-24 overflow-hidden">
            {/* Matrix Rain Background */}
            <MatrixRain />

            {/* Hidden Letter Flashes */}
            <HiddenLetterFlash />

            {/* Animated Background */}
            <div className="absolute inset-0">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-purple-950/50 via-black to-black" />

                {/* Animated Grid */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(147, 51, 234, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(147, 51, 234, 0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '50px 50px',
                        maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)'
                    }}
                />

                {/* Floating Particles */}
                <motion.div
                    className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-500 rounded-full"
                    animate={{
                        y: [0, -20, 0],
                        opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.div
                    className="absolute top-1/3 right-1/3 w-3 h-3 bg-cyan-500 rounded-full"
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0.3, 1, 0.3]
                    }}
                    transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                />

                {/* Glowing Orbs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/20 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-cyan-600/15 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Signal Indicator */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex justify-center mb-8"
                    >
                        <SignalPulse />
                    </motion.div>

                    {/* Mysterious Heading */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="relative mb-6"
                    >
                        <h2
                            className="text-6xl md:text-8xl font-black tracking-tight cursor-pointer select-none"
                            onMouseEnter={() => setHoverCount(prev => prev + 1)}
                        >
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
                                <GlitchText>???</GlitchText>
                            </span>
                        </h2>
                        {/* Glow effect behind text */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-cyan-600/30 blur-3xl -z-10" />

                        {/* Easter egg hints - progressive cryptic clues, not direct reveal */}
                        {hoverCount >= 5 && hoverCount < 10 && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-purple-500/60 font-mono whitespace-nowrap"
                            >
                                8 letters • where innovation meets celebration
                            </motion.span>
                        )}
                        {hoverCount >= 10 && hoverCount < 15 && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-purple-500/60 font-mono whitespace-nowrap"
                            >
                                _ E _ _ _ E S _
                            </motion.span>
                        )}
                        {hoverCount >= 15 && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-purple-500/60 font-mono whitespace-nowrap"
                            >
                                February awaits...
                            </motion.span>
                        )}
                    </motion.div>

                    {/* Cryptic Tagline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-gray-300 mb-8 font-light"
                    >
                        Something <span className="text-purple-400 font-semibold">massive</span> is brewing...
                        <br />
                        <span className="text-lg text-gray-500">Can you decode the signal?</span>
                    </motion.p>

                    {/* Mysterious Feature Boxes */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="flex justify-center gap-4 md:gap-8 mb-10"
                    >
                        {['???', '???', '???', '???'].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 + idx * 0.1 }}
                                className="flex flex-col items-center"
                            >
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center mb-2 group hover:border-purple-500/50 transition-all hover:bg-purple-500/10">
                                    <motion.span
                                        className="text-2xl md:text-3xl text-purple-400/70"
                                        animate={{
                                            opacity: [0.4, 1, 0.4],
                                        }}
                                        transition={{ duration: 2, repeat: Infinity, delay: idx * 0.3 }}
                                    >
                                        ?
                                    </motion.span>
                                </div>
                                <span className="text-xs text-gray-600 font-medium font-mono">???</span>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Countdown-style teaser */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="inline-block"
                    >
                        <div className="px-8 py-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-xl border border-purple-500/30 rounded-2xl">
                            <div className="flex items-center gap-4">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                    className="w-10 h-10 rounded-full border-2 border-purple-500/50 border-t-purple-400 flex items-center justify-center"
                                >
                                    <div className="w-2 h-2 bg-purple-400 rounded-full" />
                                </motion.div>
                                <div className="text-left">
                                    <div className="text-sm text-gray-400 font-mono">INCOMING TRANSMISSION</div>
                                    <div className="text-lg text-white font-bold">Stay Tuned...</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Bottom Text */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                        className="mt-8 text-sm text-gray-600 font-mono"
                    >
                        [ Await further instructions ]
                    </motion.p>
                </div>
            </div>
        </section>
    )
}
