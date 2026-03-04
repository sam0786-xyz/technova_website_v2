"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Megaphone, Clock, Calendar, Trophy, Sparkles } from "lucide-react";
import { format, differenceInSeconds } from "date-fns";

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

        const calculateTimeLeft = () => {
            const startTime = new Date(initialSettings.timer_start);
            const endTime = new Date(startTime.getTime() + initialSettings.duration_hours * 60 * 60 * 1000);
            const now = new Date();

            const diffSeconds = differenceInSeconds(endTime, now);

            if (diffSeconds <= 0) {
                setIsFinished(true);
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
            } else {
                setIsFinished(false);
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

    const now = new Date();
    const sortedSchedule = [...initialSchedule].sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

    return (
        <div className="container mx-auto px-4 max-w-7xl space-y-8 animate-in fade-in duration-1000">

            {/* ANNOUNCEMENT BANNER */}
            {initialSettings?.active_announcement && (
                <div className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 rounded-2xl p-[2px] shadow-[0_0_40px_rgba(245,158,11,0.3)] animate-pulse-slow">
                    <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 flex items-center justify-center gap-4 text-center">
                        <Megaphone className="w-8 h-8 text-white animate-bounce" />
                        <h2 className="text-2xl md:text-3xl font-black text-white tracking-wide">
                            {initialSettings.active_announcement}
                        </h2>
                    </div>
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-8">
                {/* TIMER SECTION */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/10 opacity-50" />

                        <div className="relative z-10 flex flex-col items-center justify-center text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-emerald-400 font-mono text-sm uppercase tracking-widest mb-8 border border-white/5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                {initialSettings?.is_running ? "Hackathon Live" : "Timer Paused or Not Started"}
                            </div>

                            <div className="flex items-center justify-center gap-4 md:gap-8 font-mono">
                                <div className="flex flex-col items-center">
                                    <span className="text-7xl md:text-9xl font-black text-white tracking-tighter drop-shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                                        {String(timeLeft.hours).padStart(2, '0')}
                                    </span>
                                    <span className="text-gray-500 text-sm md:text-base font-sans uppercase tracking-[0.2em] mt-2">Hours</span>
                                </div>
                                <span className="text-5xl md:text-7xl font-light text-white/20 -mt-8">:</span>
                                <div className="flex flex-col items-center">
                                    <span className="text-7xl md:text-9xl font-black text-white tracking-tighter drop-shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                                        {String(timeLeft.minutes).padStart(2, '0')}
                                    </span>
                                    <span className="text-gray-500 text-sm md:text-base font-sans uppercase tracking-[0.2em] mt-2">Minutes</span>
                                </div>
                                <span className="text-5xl md:text-7xl font-light text-white/20 -mt-8">:</span>
                                <div className="flex flex-col items-center">
                                    <span className="text-7xl md:text-9xl font-black text-emerald-400 tracking-tighter drop-shadow-[0_0_20px_rgba(52,211,153,0.5)]">
                                        {String(timeLeft.seconds).padStart(2, '0')}
                                    </span>
                                    <span className="text-gray-500 text-sm md:text-base font-sans uppercase tracking-[0.2em] mt-2">Seconds</span>
                                </div>
                            </div>

                            {isFinished && (
                                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-20">
                                    <h2 className="text-6xl font-black text-amber-500 drop-shadow-[0_0_30px_rgba(245,158,11,0.5)] animate-bounce">
                                        TIME IS UP!
                                    </h2>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SHORTLISTED TEAMS (Shows only if there are any) */}
                    {initialShortlisted.length > 0 && (
                        <div className="bg-gradient-to-br from-amber-500/10 to-orange-600/10 border border-amber-500/20 rounded-3xl p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Trophy className="w-8 h-8 text-amber-400" />
                                <h3 className="text-2xl font-bold text-white">Shortlisted Teams</h3>
                                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {initialShortlisted.map((team, idx) => (
                                    <div key={team.id} className="bg-black/40 border border-amber-500/30 rounded-xl p-4 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold font-mono">
                                            #{idx + 1}
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-white">{team.name}</h4>
                                            {team.table_number && <p className="text-sm text-amber-400/80">Table {team.table_number}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* SCHEDULE SECTION */}
                <div className="space-y-6">
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-8">
                            <Calendar className="w-6 h-6 text-blue-400" />
                            <h3 className="text-xl font-bold text-white tracking-wide">Live Schedule</h3>
                        </div>

                        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[11px] before:w-0.5 before:bg-white/10">
                            {sortedSchedule.map(ev => {
                                const start = new Date(ev.start_time);
                                const end = ev.end_time ? new Date(ev.end_time) : new Date(start.getTime() + 60 * 60 * 1000);
                                const isPast = now > end;
                                const isCurrent = now >= start && now <= end;
                                const isUpcoming = now < start;

                                return (
                                    <div key={ev.id} className={`relative flex items-stretch gap-4 ${isPast ? 'opacity-50' : ''}`}>
                                        <div className="flex flex-col items-center mt-1">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-[3px] border-[#121212] z-10 ${isCurrent ? 'bg-emerald-500 shadow-[0_0_15px_rgba(52,211,153,0.5)]' :
                                                isPast ? 'bg-gray-600' : 'bg-blue-500'
                                                }`}>
                                                {isCurrent && <div className="w-2 h-2 bg-white rounded-full animate-pulse" />}
                                            </div>
                                        </div>
                                        <div className={`flex-1 rounded-xl p-4 border ${isCurrent ? 'bg-emerald-500/10 border-emerald-500/20' :
                                            isPast ? 'bg-white/5 border-transparent' : 'bg-black/40 border-white/5 hover:border-white/10 transition-colors'
                                            }`}>
                                            <div className="flex justify-between items-start mb-1 gap-2">
                                                <h5 className={`font-bold text-lg ${isCurrent ? 'text-emerald-400' : 'text-white'}`}>
                                                    {ev.title}
                                                </h5>
                                                {isCurrent && <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full shrink-0">Now</span>}
                                            </div>
                                            <div className={`flex items-center gap-2 text-sm font-mono ${isCurrent ? 'text-emerald-300' : 'text-gray-400'}`}>
                                                <Clock className="w-3.5 h-3.5" />
                                                {format(start, "h:mm a")}
                                                {ev.end_time && ` - ${format(new Date(ev.end_time), "h:mm a")}`}
                                            </div>
                                            {ev.description && <p className="text-gray-400 mt-2 text-sm">{ev.description}</p>}
                                        </div>
                                    </div>
                                );
                            })}
                            {sortedSchedule.length === 0 && (
                                <p className="text-gray-500 text-sm ml-8">No events scheduled yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
