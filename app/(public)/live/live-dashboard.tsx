"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Megaphone, Clock, Calendar, Trophy, Sparkles, Flame, AlertTriangle, Zap, Activity, Terminal, Coffee, Mouse, Quote, Dice6, Volume2, VolumeX, ChevronRight, RotateCcw, Home } from "lucide-react";
import { format, differenceInSeconds } from "date-fns";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import Link from "next/link";

// ========================================================
// MOTIVATIONAL QUOTES DATA
// ========================================================
const HACK_QUOTES = [
    { text: "Move fast and break things. Unless you are breaking stuff, you are not moving fast enough.", author: "Mark Zuckerberg" },
    { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
    { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
    { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
    { text: "Everybody should learn to program a computer because it teaches you how to think.", author: "Steve Jobs" },
    { text: "It's not a bug – it's an undocumented feature.", author: "Anonymous" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
    { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
    { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
    { text: "Programming isn't about what you know; it's about what you can figure out.", author: "Chris Pine" },
    { text: "The best error message is the one that never shows up.", author: "Thomas Fuchs" },
    { text: "Don't worry if it doesn't work right. If everything did, you'd be out of a job.", author: "Mosher's Law" },
    { text: "Sleep is for the weak. Caffeine is for the strong. Hackathons are for legends.", author: "Every Hacker Ever" },
    { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
];

// ========================================================
// WEB AUDIO SOUND GENERATOR
// ========================================================
function playTone(freq: number, duration: number, type: OscillatorType = 'sine') {
    try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
        osc.start();
        osc.stop(ctx.currentTime + duration);
    } catch (e) {
        // Audio not supported
    }
}

const SOUNDS = {
    applause: () => { playTone(523, 0.1, 'square'); setTimeout(() => playTone(659, 0.1, 'square'), 80); setTimeout(() => playTone(784, 0.15, 'square'), 160); },
    fire: () => { playTone(200, 0.3, 'sawtooth'); setTimeout(() => playTone(250, 0.2, 'sawtooth'), 100); },
    laugh: () => { for (let i = 0; i < 4; i++) setTimeout(() => playTone(400 + i * 80, 0.08, 'triangle'), i * 100); },
    airhorn: () => { playTone(440, 0.5, 'sawtooth'); playTone(550, 0.5, 'sawtooth'); },
    click: () => playTone(800, 0.05, 'square'),
    win: () => { playTone(523, 0.15, 'square'); setTimeout(() => playTone(659, 0.15, 'square'), 150); setTimeout(() => playTone(784, 0.3, 'square'), 300); },
};

export default function LiveDashboardClient({
    initialSettings,
    initialSchedule,
    initialShortlisted
}: {
    initialSettings: any;
    initialSchedule: any[];
    initialShortlisted: any[];
}) {
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [isFinished, setIsFinished] = useState(false);
    const [totalSeconds, setTotalSeconds] = useState(0);
    const [totalDurationSeconds, setTotalDurationSeconds] = useState(0);

    const [shortlistPage, setShortlistPage] = useState(1);
    const ITEMS_PER_PAGE = 12;
    const paginatedShortlist = initialShortlisted.slice((shortlistPage - 1) * ITEMS_PER_PAGE, shortlistPage * ITEMS_PER_PAGE);
    const totalPages = Math.ceil(initialShortlisted.length / ITEMS_PER_PAGE);

    // GLITCH ENGINE STATE
    const [glitchActive, setGlitchActive] = useState(false);
    const [glitchText, setGlitchText] = useState({ hours: "00", minutes: "00", seconds: "00" });
    const containerRef = useRef<HTMLDivElement>(null);

    // INTERACTIVE FLASHLIGHT PHYSICS
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };
    const springX = useSpring(mouseX, { stiffness: 100, damping: 15 });
    const springY = useSpring(mouseY, { stiffness: 100, damping: 15 });
    const bgGradient = useMotionTemplate`radial-gradient(circle 400px at ${springX}px ${springY}px, rgba(0, 255, 65, 0.12), transparent 70%)`;

    // FAKE TERMINAL FEED
    const [logs, setLogs] = useState<string[]>([]);
    useEffect(() => {
        const sysLogs = [
            "SYS.INIT.OK", "SYNCING_TELEMETRY::OK", "NODE_04_WARN: DELAY_DETECTED",
            "OVERRIDE_AUTH_ACCEPTED", "AWAITING_COMMAND_INPUT", "AEROSPACE_LINK: ACTIVE",
            "CPU_THERMALS_STABLE", "FLUSHING_I/O_BUFFERS", "SYS.MEM.OK", "NEO_ROUTING_ESTABLISHED"
        ];
        let idx = 0;
        const logInt = setInterval(() => {
            setLogs(prev => [...prev.slice(-3), sysLogs[idx % sysLogs.length]]);
            idx++;
        }, 2500);
        return () => clearInterval(logInt);
    }, []);

    // ─────────────────────────────
    // FUN ELEMENTS STATE
    // ─────────────────────────────

    // Sound Board
    const [soundMuted, setSoundMuted] = useState(false);
    const [lastReaction, setLastReaction] = useState<string | null>(null);

    // Quick Click Challenge
    const [clickGameActive, setClickGameActive] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const [clickTimeLeft, setClickTimeLeft] = useState(10);
    const [clickHighScore, setClickHighScore] = useState(0);
    const [clickGameDone, setClickGameDone] = useState(false);
    const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Motivational Quotes
    const [quoteIndex, setQuoteIndex] = useState(0);

    // Team Spotlight
    const [spotlightTeam, setSpotlightTeam] = useState<any | null>(null);
    const [spotlightActive, setSpotlightActive] = useState(false);

    // Coffee Counter
    const [coffeeCount, setCoffeeCount] = useState(0);
    const [coffeeAnimate, setCoffeeAnimate] = useState(false);

    // Load persisted data
    useEffect(() => {
        try {
            const hs = localStorage.getItem('hackathon-click-highscore');
            if (hs) setClickHighScore(parseInt(hs));
            const cc = localStorage.getItem('hackathon-coffee-count');
            if (cc) setCoffeeCount(parseInt(cc));
        } catch {}
    }, []);

    // Auto rotate quotes
    useEffect(() => {
        const qi = setInterval(() => {
            setQuoteIndex(prev => (prev + 1) % HACK_QUOTES.length);
        }, 8000);
        return () => clearInterval(qi);
    }, []);

    // Click game timer
    useEffect(() => {
        if (!clickGameActive) return;
        if (clickTimeLeft <= 0) {
            setClickGameActive(false);
            setClickGameDone(true);
            if (clickCount > clickHighScore) {
                setClickHighScore(clickCount);
                try { localStorage.setItem('hackathon-click-highscore', String(clickCount)); } catch {}
            }
            if (!soundMuted) SOUNDS.win();
            return;
        }
        clickTimerRef.current = setTimeout(() => setClickTimeLeft(prev => prev - 1), 1000);
        return () => { if (clickTimerRef.current) clearTimeout(clickTimerRef.current); };
    }, [clickGameActive, clickTimeLeft, clickCount, clickHighScore, soundMuted]);

    const startClickGame = () => {
        setClickCount(0);
        setClickTimeLeft(10);
        setClickGameActive(true);
        setClickGameDone(false);
        if (!soundMuted) SOUNDS.click();
    };

    const handleClick = () => {
        if (!clickGameActive) return;
        setClickCount(prev => prev + 1);
        if (!soundMuted) SOUNDS.click();
    };

    const handleReaction = (emoji: string, sound: keyof typeof SOUNDS) => {
        setLastReaction(emoji);
        if (!soundMuted) SOUNDS[sound]();
        setTimeout(() => setLastReaction(null), 1500);
    };

    const handleSpotlight = () => {
        if (initialShortlisted.length === 0) return;
        const random = initialShortlisted[Math.floor(Math.random() * initialShortlisted.length)];
        setSpotlightTeam(random);
        setSpotlightActive(true);
        if (!soundMuted) SOUNDS.applause();
        setTimeout(() => setSpotlightActive(false), 4000);
    };

    const addCoffee = () => {
        const nc = coffeeCount + 1;
        setCoffeeCount(nc);
        setCoffeeAnimate(true);
        try { localStorage.setItem('hackathon-coffee-count', String(nc)); } catch {}
        setTimeout(() => setCoffeeAnimate(false), 600);
        if (!soundMuted) SOUNDS.click();
    };

    // Auto refresh data every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            router.refresh();
        }, 10000);
        return () => clearInterval(interval);
    }, [router]);

    // Timer Logic
    useEffect(() => {
        if (!initialSettings?.timer_start || !initialSettings?.is_running) return;

        const startTime = new Date(initialSettings.timer_start);
        const durationMs = initialSettings.duration_hours * 60 * 60 * 1000;
        const endTime = new Date(startTime.getTime() + durationMs);
        setTotalDurationSeconds(Math.floor(durationMs / 1000));

        const calculateTimeLeft = () => {
            const now = new Date();
            const diffSeconds = differenceInSeconds(endTime, now);

            if (diffSeconds <= 0) {
                setIsFinished(true);
                setTotalSeconds(0);
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
            } else {
                setIsFinished(false);
                setTotalSeconds(diffSeconds);
                setTimeLeft({
                    hours: Math.floor(diffSeconds / 3600),
                    minutes: Math.floor((diffSeconds % 3600) / 60),
                    seconds: diffSeconds % 60
                });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [initialSettings]);

    // Glitch Effect Loop
    useEffect(() => {
        if (!glitchActive) return;
        const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*";
        const glitchInterval = setInterval(() => {
            setGlitchText({
                hours: chars[Math.floor(Math.random() * chars.length)] + chars[Math.floor(Math.random() * chars.length)],
                minutes: chars[Math.floor(Math.random() * chars.length)] + chars[Math.floor(Math.random() * chars.length)],
                seconds: chars[Math.floor(Math.random() * chars.length)] + chars[Math.floor(Math.random() * chars.length)],
            });
        }, 50);
        return () => clearInterval(glitchInterval);
    }, [glitchActive]);

    const progressPercent = totalDurationSeconds > 0 ? Math.max(0, Math.min(100, ((totalDurationSeconds - totalSeconds) / totalDurationSeconds) * 100)) : 0;
    const totalHoursLeft = totalSeconds / 3600;

    // Urgency levels
    const urgency = useMemo(() => {
        if (isFinished) return 'finished';
        if (totalHoursLeft <= 0.5) return 'critical'; 
        if (totalHoursLeft <= 2) return 'urgent';     
        if (totalHoursLeft <= 6) return 'warning';     
        return 'normal';
    }, [totalHoursLeft, isFinished]);

    const handleGlitchStart = () => setGlitchActive(true);
    const handleGlitchEnd = () => setGlitchActive(false);

    const now = new Date();
    const sortedSchedule = [...initialSchedule].sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

    return (
        <div ref={containerRef} className="container mx-auto max-w-[1400px] pb-32 animate-in fade-in duration-1000 relative">
            
            {/* HOME LINK */}
            <div className="flex items-center justify-between mb-8">
                <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors font-mono uppercase tracking-widest text-xs font-bold">
                    <Home className="w-4 h-4" /> Home Base
                </Link>
                <Link href="/hackathon" className="inline-flex items-center gap-2 text-[#FF6B00] hover:text-white transition-colors font-mono uppercase tracking-widest text-xs font-bold">
                    Hackathon Page <ChevronRight className="w-4 h-4" />
                </Link>
            </div>

            {/* MARQUEE ANNOUNCEMENT TAPE */}
            {initialSettings?.active_announcement && (
                <div className="w-[100vw] relative left-1/2 -translate-x-1/2 mb-12 bg-[#FF6B00] border-y-2 border-white text-black overflow-hidden flex whitespace-nowrap py-3 font-heading font-black text-3xl uppercase tracking-tighter">
                   <motion.div 
                        initial={{ x: "0%" }}
                        animate={{ x: "-50%" }}
                        transition={{ ease: "linear", duration: 15, repeat: Infinity }}
                        className="flex items-center"
                   >
                        <span className="px-8 text-black"><Megaphone className="inline-block w-8 h-8 mr-4 mb-1" /> {initialSettings.active_announcement}</span>
                        <span className="px-8 text-white">///</span>
                        <span className="px-8 text-black"><Megaphone className="inline-block w-8 h-8 mr-4 mb-1" /> {initialSettings.active_announcement}</span>
                        <span className="px-8 text-white">///</span>
                        <span className="px-8 text-black"><Megaphone className="inline-block w-8 h-8 mr-4 mb-1" /> {initialSettings.active_announcement}</span>
                        <span className="px-8 text-white">///</span>
                        <span className="px-8 text-black"><Megaphone className="inline-block w-8 h-8 mr-4 mb-1" /> {initialSettings.active_announcement}</span>
                        <span className="px-8 text-white">///</span>
                   </motion.div>
                </div>
            )}

            <div className="grid lg:grid-cols-12 gap-8 font-mono">
                
                {/* LEFT COL: MASSIVE TIMER */}
                <div className="lg:col-span-8 flex flex-col gap-8 flex-1">
                    
                    <div 
                        onMouseMove={handleMouseMove}
                        className="bg-[#03030F] p-8 md:p-16 border border-white/20 neo-border relative overflow-hidden group min-h-[500px] flex flex-col"
                    >
                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-multiply pointer-events-none z-0" />
                        
                        {/* INTERACTIVE MOUSE TRACKER */}
                        <motion.div
                            className="absolute inset-0 pointer-events-none z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                            style={{ background: bgGradient }}
                        />

                        {/* BACKGROUND SCANLINES */}
                        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,65,0.02)_50%)] bg-[length:100%_4px] pointer-events-none z-0" />
                        
                        {/* Dynamic background pulse based on urgency */}
                        {urgency === 'critical' && <div className="absolute top-0 left-0 w-full h-full bg-red-500/10 animate-pulse pointer-events-none z-0" />}
                        {urgency === 'urgent' && <div className="absolute top-0 left-0 w-full h-full bg-[#FF6B00]/10 animate-pulse pointer-events-none z-0" />}

                        <div className="flex justify-between items-start mb-12 relative z-10">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/20 font-bold uppercase tracking-widest text-[#00FF41] shadow-[0_0_15px_rgba(0,255,65,0.1)]">
                                <Activity className="w-5 h-5 animate-pulse" />
                                <span>{initialSettings?.is_running ? 'HACKATHON LIVE' : 'SYSTEM PAUSED'}</span>
                            </div>

                            {/* GLITCH BUTTON WITH SPRING ANIMATION */}
                            <motion.button 
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                onMouseDown={handleGlitchStart}
                                onMouseUp={handleGlitchEnd}
                                onMouseLeave={handleGlitchEnd}
                                onTouchStart={handleGlitchStart}
                                onTouchEnd={handleGlitchEnd}
                                className="flex items-center gap-2 bg-[#FF6B00] border-2 border-[#FF6B00] text-black px-6 py-2 font-black uppercase tracking-tighter hover:bg-white hover:border-white transition-colors select-none z-10"
                            >
                                <Zap className="w-5 h-5" /> SYS.GLITCH
                            </motion.button>
                        </div>

                        {/* GIANT COUNTDOWN */}
                        <div className="flex items-center gap-2 md:gap-6 justify-center relative z-10 mb-auto w-full max-w-full">
                            <div className="flex flex-col items-center min-w-0">
                                <span className={`text-[clamp(4rem,10vw,12rem)] font-black leading-none tracking-tighter ${urgency==='critical'?'text-red-500':'text-white'} ${glitchActive ? 'text-[#00FF41]' : ''}`}>
                                    {glitchActive ? glitchText.hours : String(timeLeft.hours).padStart(2, '0')}
                                </span>
                                <span className={`text-white/40 tracking-[0.2em] md:tracking-[0.5em] text-[10px] md:text-sm font-bold uppercase ${glitchActive ? 'text-[#00FF41]' : ''}`}>Hours</span>
                            </div>
                            <span className={`text-[clamp(3rem,8vw,8rem)] leading-none mb-4 md:mb-8 font-light ${urgency==='critical'?'text-red-500/50 animate-pulse':'text-white/20'}`}>:</span>
                            <div className="flex flex-col items-center min-w-0">
                                <span className={`text-[clamp(4rem,10vw,12rem)] font-black leading-none tracking-tighter ${urgency==='critical'?'text-red-500':'text-white'} ${glitchActive ? 'text-[#00FF41]' : ''}`}>
                                    {glitchActive ? glitchText.minutes : String(timeLeft.minutes).padStart(2, '0')}
                                </span>
                                <span className={`text-white/40 tracking-[0.2em] md:tracking-[0.5em] text-[10px] md:text-sm font-bold uppercase ${glitchActive ? 'text-[#00FF41]' : ''}`}>Minutes</span>
                            </div>
                            <span className={`text-[clamp(3rem,8vw,8rem)] leading-none mb-4 md:mb-8 font-light ${urgency==='critical'?'text-red-500/50 animate-pulse':'text-white/20'}`}>:</span>
                            <div className="flex flex-col items-center min-w-0">
                                <span className={`text-[clamp(4rem,10vw,12rem)] font-black leading-none tracking-tighter text-[#00FF41]`}>
                                    {glitchActive ? glitchText.seconds : String(timeLeft.seconds).padStart(2, '0')}
                                </span>
                                <span className={`text-[#00FF41]/40 tracking-[0.2em] md:tracking-[0.5em] text-[10px] md:text-sm font-bold uppercase`}>Seconds</span>
                            </div>
                        </div>

                        {/* BRUTALIST PROGRESS BAR */}
                        {initialSettings?.is_running && (
                            <div className="relative z-10 mt-16 mb-8">
                                <div className="flex justify-between text-[#00FF41] text-xs md:text-sm font-bold uppercase tracking-widest mb-3">
                                    <span>SYS.START</span>
                                    <span>{progressPercent.toFixed(2)}% ELAPSED</span>
                                    <span>{initialSettings.duration_hours}H ZERO</span>
                                </div>
                                <div className="h-4 w-full bg-[#03030F] border border-white/30 p-1">
                                    <div 
                                        className="h-full bg-[#00FF41] transition-all duration-1000 ease-linear shadow-[0_0_20px_rgba(0,255,65,0.4)]"
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* TERMINAL DIAGNOSTICS READOUT */}
                        <div className="relative z-10 mt-auto flex items-end justify-between border-t border-white/10 pt-4">
                            <div className="flex flex-col font-mono text-[10px] md:text-xs text-white/40 leading-tight uppercase tracking-widest">
                                <div className="flex items-center gap-2 mb-1 text-[#00FF41]/70"><Terminal className="w-3 h-3" /> LIVE_DATA_STREAM</div>
                                <AnimatePresence mode="popLayout">
                                    {logs.map((log, i) => (
                                        <motion.div 
                                            key={`${log}-${i}`}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                        >
                                            {`> ${log}`}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                            <div className="text-right flex flex-col items-end">
                                <div className="w-8 h-8 flex flex-wrap gap-0.5 opacity-50">
                                    {[...Array(9)].map((_, i) => (
                                        <div key={i} className={`w-2 h-2 ${Math.random() > 0.5 ? 'bg-[#FF6B00]' : 'bg-white/20'} animate-pulse`} style={{ animationDelay: `${i * 0.1}s` }} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Time Is Up Screen Overlay */}
                        {isFinished && (
                            <div className="absolute inset-0 bg-[#03030F]/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-8 border-4 border-red-500">
                                <div className="animate-pulse bg-red-500 text-black px-6 py-2 font-black uppercase tracking-[0.5em] mb-8">
                                    CRITICAL WARNING
                                </div>
                                <h1 className="text-[100px] md:text-[150px] font-black leading-none text-red-500 tracking-tighter text-center uppercase">
                                    TIME IS UP
                                </h1>
                                <p className="text-2xl mt-4 text-white uppercase font-bold">Step Away From Keyboards!</p>
                            </div>
                        )}
                    </div>

                    {/* SHORTLISTED TEAMS */}
                    {initialShortlisted.length > 0 && (
                        <div className="bg-white/5 border border-white/20 p-8 neo-border">
                            <div className="flex items-center gap-4 mb-8">
                                <Trophy className="w-8 h-8 text-[#FF6B00]" />
                                <h2 className="text-3xl font-heading font-black uppercase text-white tracking-tight">Shortlisted Squads</h2>
                            </div>
                            
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <AnimatePresence mode="popLayout" initial={false}>
                                    {paginatedShortlist.map((team, idx) => (
                                        <motion.div 
                                            key={team.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            layout
                                            className="bg-[#03030F] border border-white/10 hover:border-[#FF6B00] transition-colors p-4 flex flex-col gap-2"
                                        >
                                            <div className="flex justify-between items-center w-full">
                                                <span className="text-xs font-bold text-[#FF6B00] tracking-widest">SQD-{(shortlistPage - 1) * ITEMS_PER_PAGE + idx + 1}</span>
                                                {team.table_number && <span className="text-[10px] text-black bg-[#00FF41] font-bold px-2 py-0.5">TBL-{team.table_number}</span>}
                                            </div>
                                            <h3 className="font-bold text-lg text-white font-sans uppercase truncate">{team.name}</h3>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                            
                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-8 flex flex-col items-center justify-center gap-4 relative z-10 w-full mb-2">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setShortlistPage(Math.max(1, shortlistPage - 1))}
                                            disabled={shortlistPage === 1}
                                            className={`pg-btn flex items-center gap-1 ${shortlistPage === 1 ? 'pg-btn--disabled' : 'pg-btn--inactive'}`}
                                        >
                                            Prev
                                        </button>
                                        <div className="px-4 py-1.5 bg-white/[0.03] border border-white/[0.08] rounded-lg text-xs font-bold text-white/80">
                                            Page {shortlistPage} <span className="text-white/30 font-medium">of {totalPages}</span>
                                        </div>
                                        <button
                                            onClick={() => setShortlistPage(Math.min(totalPages, shortlistPage + 1))}
                                            disabled={shortlistPage === totalPages}
                                            className={`pg-btn flex items-center gap-1 ${shortlistPage === totalPages ? 'pg-btn--disabled' : 'pg-btn--inactive'}`}
                                        >
                                            Next
                                        </button>
                                    </div>
                                    <div className="text-[10px] uppercase tracking-widest text-white/30 font-semibold">
                                        Showing {(shortlistPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(shortlistPage * ITEMS_PER_PAGE, initialShortlisted.length)} of {initialShortlisted.length} Squads
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* RIGHT COL: TRANSIT MAP TIMELINE */}
                <div className="lg:col-span-4 h-full">
                    <div className="bg-[#03030F] p-8 border border-white/20 neo-border h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-12 border-b border-white/10 pb-6">
                            <Clock className="w-6 h-6 text-[#00FF41]" />
                            <h2 className="text-2xl font-heading font-black uppercase text-white tracking-widest">Flight Plan</h2>
                        </div>

                        <div className="space-y-0 relative before:absolute before:inset-0 before:ml-[11px] before:w-[2px] before:bg-white/20 flex-1">
                            {sortedSchedule.map((ev, i) => {
                                const start = new Date(ev.start_time);
                                const end = ev.end_time ? new Date(ev.end_time) : new Date(start.getTime() + 60 * 60 * 1000);
                                const isPast = now > end;
                                const isCurrent = now >= start && now <= end;

                                return (
                                    <div key={ev.id} className={`relative flex gap-6 pb-12 last:pb-0 ${isPast ? 'opacity-30' : 'opacity-100'}`}>
                                        <div className="flex flex-col items-center relative z-10 pt-2">
                                            <div className={`w-6 h-6 flex items-center justify-center bg-[#03030F] border-4 ${isCurrent ? 'border-[#00FF41]' : isPast ? 'border-white/50' : 'border-[#FF6B00]'}`}>
                                                {isCurrent && <div className="w-2 h-2 bg-[#00FF41] animate-ping" />}
                                            </div>
                                        </div>
                                        <div className={`flex-1 ${isCurrent ? 'bg-white/5 border border-[#00FF41]/50 p-4 -mt-2' : ''}`}>
                                            <div className="flex justify-between items-start gap-2 mb-1">
                                                <h4 className={`text-xl font-bold font-sans uppercase leading-tight ${isCurrent ? 'text-[#00FF41]' : 'text-white'}`}>
                                                    {ev.title}
                                                </h4>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#FF6B00]">
                                                {format(start, "HH:mm")}
                                                {ev.end_time && ` — ${format(new Date(ev.end_time), "HH:mm")}`}
                                            </div>
                                            {ev.description && <p className="text-white/50 mt-2 text-sm font-sans">{ev.description}</p>}
                                        </div>
                                    </div>
                                );
                            })}
                            
                            {sortedSchedule.length === 0 && (
                                <div className="text-white/30 text-center font-bold uppercase tracking-widest mt-10">AWAITING FLIGHT PLAN DATA</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ============================================================
                FUN ZONE — Interactive elements for 24-hour endurance
                ============================================================ */}
            <div className="mt-16 border-t-2 border-dashed border-white/10 pt-16">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3">
                        <Sparkles className="w-6 h-6 text-[#FF6B00]" />
                        <h2 className="text-3xl font-heading font-black uppercase text-white tracking-tight">Break Zone</h2>
                        <span className="text-[10px] font-bold text-white/30 tracking-widest uppercase ml-2">// TAKE A BREATHER</span>
                    </div>
                    <button
                        onClick={() => setSoundMuted(!soundMuted)}
                        className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
                    >
                        {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        {soundMuted ? 'Unmute' : 'Mute'}
                    </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* ── 🎵 SOUND BOARD ── */}
                    <div className="bg-[#03030F] border border-white/10 p-6 neo-border relative overflow-hidden">
                        <h3 className="text-lg font-heading font-black uppercase text-white mb-4 flex items-center gap-2">
                            <Volume2 className="w-5 h-5 text-[#FF6B00]" /> Reaction Board
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { emoji: '👏', label: 'Applause', sound: 'applause' as const, color: '#00FF41' },
                                { emoji: '🔥', label: 'Fire', sound: 'fire' as const, color: '#FF6B00' },
                                { emoji: '😂', label: 'Laugh', sound: 'laugh' as const, color: '#FFD700' },
                                { emoji: '📯', label: 'Air Horn', sound: 'airhorn' as const, color: '#FF4136' },
                            ].map(btn => (
                                <motion.button
                                    key={btn.label}
                                    whileTap={{ scale: 0.92 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    onClick={() => handleReaction(btn.emoji, btn.sound)}
                                    className="flex flex-col items-center justify-center p-4 border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 transition-all rounded-none"
                                    style={{ boxShadow: lastReaction === btn.emoji ? `0 0 20px ${btn.color}40` : 'none' }}
                                >
                                    <span className="text-3xl mb-1">{btn.emoji}</span>
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">{btn.label}</span>
                                </motion.button>
                            ))}
                        </div>
                        {/* Floating reaction */}
                        <AnimatePresence>
                            {lastReaction && (
                                <motion.div
                                    initial={{ opacity: 1, y: 0, scale: 1 }}
                                    animate={{ opacity: 0, y: -80, scale: 2 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 1.2, ease: "easeOut" }}
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 text-6xl pointer-events-none z-50"
                                >
                                    {lastReaction}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* ── 🎯 QUICK CLICK CHALLENGE ── */}
                    <div className="bg-[#03030F] border border-white/10 p-6 neo-border">
                        <h3 className="text-lg font-heading font-black uppercase text-white mb-4 flex items-center gap-2">
                            <Mouse className="w-5 h-5 text-[#00FF41]" /> Speed Click
                        </h3>
                        
                        {!clickGameActive && !clickGameDone && (
                            <div className="text-center">
                                <p className="text-white/50 text-sm mb-4 font-sans">Click as fast as you can in 10 seconds!</p>
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={startClickGame}
                                    className="w-full py-4 bg-[#00FF41] text-black font-black uppercase tracking-wider text-sm hover:bg-[#33FF66] transition-colors"
                                >
                                    Start Challenge
                                </motion.button>
                                {clickHighScore > 0 && (
                                    <div className="mt-3 text-[10px] font-bold text-[#FF6B00] uppercase tracking-widest">
                                        High Score: {clickHighScore} clicks
                                    </div>
                                )}
                            </div>
                        )}

                        {clickGameActive && (
                            <div className="text-center">
                                <div className="text-6xl font-black text-[#00FF41] tabular-nums mb-2">{clickCount}</div>
                                <div className="text-sm font-bold text-[#FF6B00] uppercase tracking-widest mb-4">
                                    {clickTimeLeft}s remaining
                                </div>
                                <motion.button
                                    whileTap={{ scale: 0.92 }}
                                    transition={{ type: "spring", stiffness: 600, damping: 10 }}
                                    onClick={handleClick}
                                    className="w-full py-8 bg-white/10 border-2 border-[#00FF41] hover:bg-[#00FF41]/20 text-white font-black uppercase text-2xl transition-colors active:bg-[#00FF41]/40"
                                >
                                    TAP! TAP! TAP!
                                </motion.button>
                            </div>
                        )}

                        {clickGameDone && (
                            <div className="text-center">
                                <div className="text-5xl font-black text-white mb-2">{clickCount}</div>
                                <div className="text-sm text-white/50 mb-1">clicks in 10 seconds</div>
                                {clickCount >= clickHighScore && (
                                    <div className="text-[#00FF41] text-xs font-bold uppercase tracking-widest mb-4">🏆 New High Score!</div>
                                )}
                                <div className="flex gap-3 mt-4">
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={startClickGame}
                                        className="flex-1 py-3 bg-[#FF6B00] text-black font-black uppercase text-sm flex items-center justify-center gap-2"
                                    >
                                        <RotateCcw className="w-4 h-4" /> Again
                                    </motion.button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── ☕ COFFEE COUNTER ── */}
                    <div className="bg-[#03030F] border border-white/10 p-6 neo-border">
                        <h3 className="text-lg font-heading font-black uppercase text-white mb-4 flex items-center gap-2">
                            <Coffee className="w-5 h-5 text-[#FFD700]" /> Caffeine Tracker
                        </h3>
                        <div className="text-center">
                            <motion.div 
                                animate={coffeeAnimate ? { scale: [1, 1.3, 1], rotate: [0, -10, 10, 0] } : {}}
                                transition={{ duration: 0.5 }}
                                className="text-6xl mb-2"
                            >
                                ☕
                            </motion.div>
                            <div className="text-4xl font-black text-[#FFD700] tabular-nums mb-1">{coffeeCount}</div>
                            <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4">CUPS CONSUMED</div>
                            <motion.button
                                whileTap={{ scale: 0.92 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                onClick={addCoffee}
                                className="w-full py-3 bg-[#FFD700]/20 border border-[#FFD700]/40 text-[#FFD700] font-black uppercase tracking-wider text-sm hover:bg-[#FFD700]/30 transition-colors"
                            >
                                + Add Cup
                            </motion.button>
                        </div>
                    </div>

                    {/* ── 💬 MOTIVATIONAL QUOTES ── */}
                    <div className="bg-[#03030F] border border-white/10 p-6 neo-border md:col-span-2">
                        <h3 className="text-lg font-heading font-black uppercase text-white mb-4 flex items-center gap-2">
                            <Quote className="w-5 h-5 text-[#6366F1]" /> Hack Wisdom
                        </h3>
                        <div className="relative min-h-[100px] flex flex-col justify-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={quoteIndex}
                                    initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                    exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                >
                                    <blockquote className="text-lg md:text-xl font-sans text-white/80 italic leading-relaxed mb-3">
                                        "{HACK_QUOTES[quoteIndex].text}"
                                    </blockquote>
                                    <cite className="text-sm font-bold text-[#6366F1] not-italic uppercase tracking-wider">
                                        — {HACK_QUOTES[quoteIndex].author}
                                    </cite>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        <button
                            onClick={() => setQuoteIndex(Math.floor(Math.random() * HACK_QUOTES.length))}
                            className="mt-4 text-xs font-bold text-white/30 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2"
                        >
                            <RotateCcw className="w-3 h-3" /> Shuffle
                        </button>
                    </div>

                    {/* ── 🎲 RANDOM TEAM SPOTLIGHT ── */}
                    <div className="bg-[#03030F] border border-white/10 p-6 neo-border relative overflow-hidden">
                        <h3 className="text-lg font-heading font-black uppercase text-white mb-4 flex items-center gap-2">
                            <Dice6 className="w-5 h-5 text-[#FF6B00]" /> Team Spotlight
                        </h3>
                        
                        {initialShortlisted.length > 0 ? (
                            <div className="text-center">
                                <AnimatePresence mode="wait">
                                    {spotlightActive && spotlightTeam && (
                                        <motion.div
                                            key={spotlightTeam.id}
                                            initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                            exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                            className="py-6"
                                        >
                                            <div className="text-4xl mb-2">🌟</div>
                                            <h4 className="text-2xl font-heading font-black text-[#FF6B00] uppercase">{spotlightTeam.name}</h4>
                                            {spotlightTeam.idea_title && (
                                                <p className="text-sm text-white/50 mt-2 font-sans">{spotlightTeam.idea_title}</p>
                                            )}
                                            {spotlightTeam.table_number && (
                                                <span className="inline-block mt-3 text-[10px] text-black bg-[#00FF41] font-bold px-3 py-1">
                                                    TABLE {spotlightTeam.table_number}
                                                </span>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {!spotlightActive && (
                                    <div className="py-6 text-white/30 text-sm">Press the button to spotlight a random team!</div>
                                )}

                                <motion.button
                                    whileTap={{ scale: 0.92 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    onClick={handleSpotlight}
                                    className="w-full py-3 bg-[#FF6B00]/20 border border-[#FF6B00]/40 text-[#FF6B00] font-black uppercase tracking-wider text-sm hover:bg-[#FF6B00]/30 transition-colors"
                                >
                                    🎲 Random Spotlight
                                </motion.button>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-white/30 text-sm">
                                No teams available for spotlight
                            </div>
                        )}

                        {/* Confetti-like particles on spotlight */}
                        <AnimatePresence>
                            {spotlightActive && [...Array(12)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 1, x: '50%', y: '50%', scale: 0 }}
                                    animate={{
                                        opacity: 0,
                                        x: `${50 + (Math.random() - 0.5) * 200}%`,
                                        y: `${50 + (Math.random() - 0.5) * 200}%`,
                                        scale: 1,
                                    }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="absolute w-2 h-2 pointer-events-none z-50"
                                    style={{
                                        backgroundColor: ['#FF6B00', '#00FF41', '#FFD700', '#6366F1', '#FF4136'][i % 5],
                                        borderRadius: Math.random() > 0.5 ? '50%' : '0',
                                    }}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}

