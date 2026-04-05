"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plane, Train, Car, Clock, MapPin, Navigation, ChevronRight } from "lucide-react"

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]

interface TransportMode {
    id: string
    label: string
    icon: typeof Plane
    color: string
    accentBg: string
    distance: string
    duration: string
    steps: string[]
    routeSvg: React.ReactNode
}

/* ─── SVG Route Illustrations ─── */
function AirRoute() {
    return (
        <svg viewBox="0 0 400 180" fill="none" className="w-full h-auto">
            {/* Route line */}
            <motion.path
                d="M 30 140 Q 100 30 200 80 Q 300 130 370 50"
                stroke="url(#airGrad)"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.6, ease: EASE_OUT }}
            />
            {/* Dashed helper */}
            <path
                d="M 30 140 Q 100 30 200 80 Q 300 130 370 50"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
                strokeDasharray="6 6"
                fill="none"
            />
            {/* Origin marker */}
            <motion.circle cx="30" cy="140" r="6" fill="#FF6B00" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} />
            <text x="30" y="165" fill="rgba(255,255,255,0.5)" fontSize="10" textAnchor="middle" fontFamily="monospace">IGI AIRPORT</text>
            {/* Destination marker */}
            <motion.circle cx="370" cy="50" r="6" fill="#00FF41" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.4 }} />
            <text x="370" y="35" fill="rgba(255,255,255,0.5)" fontSize="10" textAnchor="middle" fontFamily="monospace">SHARDA UNIV.</text>
            {/* Traveling dot */}
            <motion.circle
                r="4"
                fill="#FF6B00"
                filter="url(#glow)"
                initial={{ offsetDistance: "0%" }}
                animate={{ offsetDistance: "100%" }}
                transition={{ duration: 2, ease: "linear", repeat: Infinity, repeatDelay: 1 }}
                style={{ offsetPath: "path('M 30 140 Q 100 30 200 80 Q 300 130 370 50')" }}
            />
            <defs>
                <linearGradient id="airGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#FF6B00" />
                    <stop offset="100%" stopColor="#00FF41" />
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
            </defs>
        </svg>
    )
}

function MetroRoute() {
    return (
        <svg viewBox="0 0 400 180" fill="none" className="w-full h-auto">
            {/* Blue Line */}
            <motion.path
                d="M 30 90 L 120 90"
                stroke="#2563EB"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, ease: EASE_OUT }}
            />
            <text x="75" y="78" fill="#2563EB" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">BLUE LINE</text>
            {/* Transfer node */}
            <motion.rect x="115" y="82" width="16" height="16" rx="3" fill="#FFD700" stroke="white" strokeWidth="1"
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }}
            />
            <text x="123" y="115" fill="rgba(255,255,255,0.4)" fontSize="8" textAnchor="middle" fontFamily="monospace">TRANSFER</text>
            {/* Aqua Line */}
            <motion.path
                d="M 135 90 L 280 90"
                stroke="#06B6D4"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.6 }}
            />
            <text x="207" y="78" fill="#06B6D4" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">AQUA LINE</text>
            {/* Station markers */}
            {[30, 70, 120, 170, 220, 280].map((x, i) => (
                <motion.circle key={i} cx={x} cy="90" r="4" fill={x <= 120 ? "#2563EB" : "#06B6D4"} stroke="#03030F" strokeWidth="2"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 * i }}
                />
            ))}
            {/* Walk path */}
            <motion.path
                d="M 280 90 L 320 90 L 340 70 L 370 70"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="2"
                strokeDasharray="4 4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, ease: EASE_OUT, delay: 1.2 }}
            />
            <text x="340" y="60" fill="rgba(255,255,255,0.4)" fontSize="8" textAnchor="middle" fontFamily="monospace">~20 MIN WALK</text>
            {/* Origin */}
            <motion.circle cx="30" cy="90" r="7" fill="none" stroke="#FF6B00" strokeWidth="2"
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }}
            />
            <text x="30" y="145" fill="rgba(255,255,255,0.5)" fontSize="9" textAnchor="middle" fontFamily="monospace">STATION</text>
            {/* Dest */}
            <motion.circle cx="370" cy="70" r="6" fill="#00FF41"
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.6 }}
            />
            <text x="370" y="145" fill="rgba(255,255,255,0.5)" fontSize="9" textAnchor="middle" fontFamily="monospace">SHARDA</text>
        </svg>
    )
}

function CarRoute() {
    return (
        <svg viewBox="0 0 400 180" fill="none" className="w-full h-auto">
            {/* Highway */}
            <motion.path
                d="M 30 130 L 100 130 L 130 80 L 250 80 L 280 60 L 370 60"
                stroke="url(#carGrad)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.4, ease: EASE_OUT }}
            />
            {/* Road markings */}
            <motion.path
                d="M 30 130 L 100 130 L 130 80 L 250 80 L 280 60 L 370 60"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.4, ease: EASE_OUT }}
            />
            {/* Expressway label */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <rect x="142" y="55" width="96" height="18" rx="3" fill="rgba(255,107,0,0.2)" stroke="#FF6B00" strokeWidth="0.5" />
                <text x="190" y="67" fill="#FF6B00" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">NOIDA EXPRESSWAY</text>
            </motion.g>
            {/* Origin */}
            <motion.circle cx="30" cy="130" r="6" fill="#FF6B00" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }} />
            <text x="30" y="155" fill="rgba(255,255,255,0.5)" fontSize="9" textAnchor="middle" fontFamily="monospace">DELHI NCR</text>
            {/* Dest */}
            <motion.circle cx="370" cy="60" r="6" fill="#00FF41" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2 }} />
            <text x="370" y="45" fill="rgba(255,255,255,0.5)" fontSize="9" textAnchor="middle" fontFamily="monospace">SHARDA UNIV.</text>
            {/* Traveling car dot */}
            <motion.circle
                r="3"
                fill="white"
                filter="url(#glowCar)"
                initial={{ offsetDistance: "0%" }}
                animate={{ offsetDistance: "100%" }}
                transition={{ duration: 3, ease: "linear", repeat: Infinity, repeatDelay: 0.5 }}
                style={{ offsetPath: "path('M 30 130 L 100 130 L 130 80 L 250 80 L 280 60 L 370 60')" }}
            />
            <defs>
                <linearGradient id="carGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#FF6B00" />
                    <stop offset="100%" stopColor="#00FF41" />
                </linearGradient>
                <filter id="glowCar">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
            </defs>
        </svg>
    )
}

const TRANSPORT_MODES: TransportMode[] = [
    {
        id: "air",
        label: "By Air",
        icon: Plane,
        color: "#FF6B00",
        accentBg: "rgba(255,107,0,0.1)",
        distance: "~40 km",
        duration: "~1 hour",
        steps: [
            "Land at IGI Airport (DEL), Terminal 1/2/3",
            "Take expressway cab/Uber towards Greater Noida",
            "Via Noida-Greater Noida Expressway (~40 km)",
            "Reach Sharda University, Knowledge Park III"
        ],
        routeSvg: <AirRoute />
    },
    {
        id: "metro",
        label: "By Metro",
        icon: Train,
        color: "#06B6D4",
        accentBg: "rgba(6,182,212,0.1)",
        distance: "~35 km",
        duration: "~1.5 hours",
        steps: [
            "Take Blue Line to Noida Sector 51 / City Centre",
            "Transfer to Aqua Line (towards Greater Noida)",
            "Exit at Pari Chowk or Knowledge Park II station",
            "~20 min walk or auto to Sharda University campus"
        ],
        routeSvg: <MetroRoute />
    },
    {
        id: "car",
        label: "By Road",
        icon: Car,
        color: "#00FF41",
        accentBg: "rgba(0,255,65,0.1)",
        distance: "~30-50 km",
        duration: "~45 min - 1.5 hrs",
        steps: [
            "Head towards Noida via DND/Kalindi Kunj/NH-24",
            "Take the Noida-Greater Noida Expressway",
            "Exit at Knowledge Park III / Pari Chowk",
            "Sharda University campus is well-signposted"
        ],
        routeSvg: <CarRoute />
    }
]

export function ArenaTransport() {
    const [activeMode, setActiveMode] = useState<string>("air")
    const currentMode = TRANSPORT_MODES.find(m => m.id === activeMode)!

    return (
        <div className="relative">
            {/* Transport Mode Selector */}
            <div className="flex gap-2 mb-6">
                {TRANSPORT_MODES.map((mode) => {
                    const isActive = activeMode === mode.id
                    return (
                        <motion.button
                            key={mode.id}
                            onClick={() => setActiveMode(mode.id)}
                            whileTap={{ scale: 0.97 }}
                            className={`flex-1 relative flex items-center justify-center gap-2.5 py-4 px-4 font-bold uppercase tracking-wider text-xs sm:text-sm transition-all duration-300 border ${
                                isActive
                                    ? 'bg-white/[0.06] border-white/20 text-white'
                                    : 'bg-white/[0.02] border-white/[0.06] text-white/40 hover:text-white/60 hover:border-white/10'
                            }`}
                        >
                            {/* Active indicator line */}
                            {isActive && (
                                <motion.div
                                    layoutId="transport-indicator"
                                    className="absolute bottom-0 left-0 right-0 h-[2px]"
                                    style={{ background: mode.color }}
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                            <mode.icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: isActive ? mode.color : undefined }} />
                            <span className="hidden sm:inline">{mode.label}</span>
                        </motion.button>
                    )
                })}
            </div>

            {/* Content Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeMode}
                    initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                    transition={{ duration: 0.35, ease: EASE_OUT }}
                    className="relative overflow-hidden border border-white/[0.08] bg-white/[0.02] rounded-2xl"
                >
                    {/* Ambient glow */}
                    <div
                        className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full blur-[120px] pointer-events-none opacity-20"
                        style={{ background: currentMode.color }}
                    />

                    {/* Route SVG */}
                    <div className="p-6 sm:p-8 pb-0">
                        <div className="bg-[#03030F] border border-white/[0.06] rounded-xl p-4 sm:p-6 mb-6">
                            {currentMode.routeSvg}
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="p-6 sm:p-8 pt-0 grid sm:grid-cols-2 gap-6">
                        {/* Stats */}
                        <div className="flex gap-6">
                            <div>
                                <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">Distance</div>
                                <div className="text-lg sm:text-xl font-black text-white flex items-center gap-1.5">
                                    <Navigation className="w-4 h-4" style={{ color: currentMode.color }} />
                                    {currentMode.distance}
                                </div>
                            </div>
                            <div>
                                <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">Est. Time</div>
                                <div className="text-lg sm:text-xl font-black text-white flex items-center gap-1.5">
                                    <Clock className="w-4 h-4" style={{ color: currentMode.color }} />
                                    {currentMode.duration}
                                </div>
                            </div>
                        </div>

                        {/* Steps */}
                        <div>
                            <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-3">Route Steps</div>
                            <div className="space-y-2">
                                {currentMode.steps.map((step, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 + i * 0.08, duration: 0.3, ease: EASE_OUT }}
                                        className="flex items-start gap-2.5 text-sm text-white/50"
                                    >
                                        <ChevronRight className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: currentMode.color }} />
                                        <span>{step}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Destination badge */}
                    <div className="px-6 sm:px-8 pb-6 sm:pb-8">
                        <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0">
                                <MapPin className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white">Sharda University</div>
                                <div className="text-xs text-white/40">Plot No. 32-34, Knowledge Park III, Greater Noida, UP 201310</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
