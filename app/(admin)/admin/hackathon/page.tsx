"use client";

import { useState, useRef, useEffect } from "react";
import {
    uploadHackathonData, getHackathonTeams,
    getEvaluators, addEvaluator, removeEvaluator,
    getHackathonSettings, startTimer, stopTimer, pushAnnouncement, clearAnnouncement,
    getSchedule, addScheduleItem, deleteScheduleItem, updateTeamStatus
} from "@/lib/actions/hackathon";
import { Upload, FileDown, CheckCircle, AlertCircle, Users, Cpu, Clock, Calendar, Trash2, QrCode, StopCircle, X, Mail } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default function HackathonAdminPage() {
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [teams, setTeams] = useState<any[]>([]);
    const [evaluators, setEvaluators] = useState<any[]>([]);
    const [settings, setSettings] = useState<any>(null);
    const [schedule, setSchedule] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [evalEmail, setEvalEmail] = useState("");
    const [announcement, setAnnouncement] = useState("");
    const [sendingQr, setSendingQr] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setLoading(true);
        const [teamsData, evaluatorsData, settingsData, scheduleData] = await Promise.all([
            getHackathonTeams(),
            getEvaluators(),
            getHackathonSettings(),
            getSchedule()
        ]);
        setTeams(teamsData);
        setEvaluators(evaluatorsData);
        setSettings(settingsData);
        setSchedule(scheduleData);
        setLoading(false);
    }

    const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage(null);
        setUploading(true);

        const formData = new FormData(e.currentTarget);
        const file = formData.get('file') as File;

        if (!file || file.size === 0) {
            setMessage({ type: 'error', text: 'Please select a valid CSV or XLSX file.' });
            setUploading(false);
            return;
        }

        try {
            const result = await uploadHackathonData(formData);
            if (result.error) {
                setMessage({ type: 'error', text: result.error });
            } else {
                setMessage({ type: 'success', text: result.message || 'Upload successful!' });
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                loadData();
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'An unexpected error occurred.' });
        } finally {
            setUploading(false);
        }
    };

    const handleAddEvaluator = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!evalEmail) return;

        const res = await addEvaluator(evalEmail);
        if (res.error) {
            setMessage({ type: 'error', text: res.error });
        } else {
            setEvalEmail("");
            setMessage({ type: 'success', text: "Evaluator added successfully." });
            loadData();
        }
    };

    const handleRemoveEvaluator = async (id: string) => {
        await removeEvaluator(id);
        loadData();
    };

    const handleStartTimer = async () => {
        if (!confirm("Are you sure you want to start the 24-hour timer? This will be visible on the public dashboard.")) return;
        const res = await startTimer(24);
        if (res.error) {
            setMessage({ type: 'error', text: res.error });
        } else {
            setMessage({ type: 'success', text: "Timer started successfully!" });
            loadData();
        }
    };

    const handleStopTimer = async () => {
        if (!confirm("Are you sure you want to stop the timer?")) return;
        const res = await stopTimer();
        if (res.error) {
            setMessage({ type: 'error', text: res.error });
        } else {
            setMessage({ type: 'success', text: "Timer stopped." });
            loadData();
        }
    };

    const handleClearAnnouncement = async () => {
        const res = await clearAnnouncement();
        if (res.error) {
            setMessage({ type: 'error', text: res.error });
        } else {
            setMessage({ type: 'success', text: "Announcement cleared." });
            loadData();
        }
    };

    const handleDeleteScheduleItem = async (id: string) => {
        if (!confirm("Delete this schedule item?")) return;
        const res = await deleteScheduleItem(id);
        if (res.error) {
            setMessage({ type: 'error', text: res.error });
        } else {
            setMessage({ type: 'success', text: "Schedule item deleted." });
            loadData();
        }
    };

    const handlePushAnnouncement = async () => {
        if (!announcement) return;
        const res = await pushAnnouncement(announcement);
        if (res.error) {
            setMessage({ type: 'error', text: res.error });
        } else {
            setMessage({ type: 'success', text: "Announcement pushed to live dashboard." });
            setAnnouncement("");
            loadData();
        }
    };

    const handleAddSchedule = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            start_time: new Date(formData.get('start_time') as string).toISOString(),
            end_time: formData.get('end_time') ? new Date(formData.get('end_time') as string).toISOString() : undefined,
            event_type: formData.get('event_type') as string,
        };

        const res = await addScheduleItem(data);
        if (res.error) {
            setMessage({ type: 'error', text: res.error });
        } else {
            setMessage({ type: 'success', text: "Schedule item added." });
            (e.target as HTMLFormElement).reset();
            loadData();
        }
    }
    const handleToggleShortlist = async (teamId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'shortlisted' ? 'evaluating' : 'shortlisted';
        const res = await updateTeamStatus(teamId, newStatus);
        if (res.error) {
            setMessage({ type: 'error', text: res.error });
        } else {
            loadData();
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
                        Hackathon Management
                    </h1>
                    <p className="text-gray-400 mt-2">Manage teams, evaluators, logistics, and the 24hr live timer.</p>
                </div>

                <Link
                    href="/admin/hackathon/scan"
                    className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-white px-6 py-3 rounded-xl font-medium transition-colors w-fit shadow-xl"
                >
                    <QrCode className="w-5 h-5 text-emerald-400" /> Open Logistics Scanner
                </Link>
            </div>

            <Tabs defaultValue="teams" className="w-full">
                {message && (
                    <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${message.type === 'error' ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'}`}>
                        {message.type === 'error' ? <AlertCircle className="w-5 h-5 flex-shrink-0" /> : <CheckCircle className="w-5 h-5 flex-shrink-0" />}
                        <p className="text-sm">{message.text}</p>
                    </div>
                )}
                <TabsList className="bg-white/[0.03] border border-white/10 p-1 rounded-xl mb-8 flex flex-wrap h-auto gap-2">
                    <TabsTrigger value="teams" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 rounded-lg px-6 py-2.5">
                        <Users className="w-4 h-4 mr-2" /> Teams & Import
                    </TabsTrigger>
                    <TabsTrigger value="evaluators" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400 rounded-lg px-6 py-2.5">
                        <CheckCircle className="w-4 h-4 mr-2" /> Evaluators
                    </TabsTrigger>
                    <TabsTrigger value="timer" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 rounded-lg px-6 py-2.5">
                        <Clock className="w-4 h-4 mr-2" /> Timer & Live
                    </TabsTrigger>
                    <TabsTrigger value="schedule" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 rounded-lg px-6 py-2.5">
                        <Calendar className="w-4 h-4 mr-2" /> Schedule
                    </TabsTrigger>
                </TabsList>

                {/* Teams & Import Tab */}
                <TabsContent value="teams" className="mt-0">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Upload Section */}
                        <div className="lg:col-span-1 border border-zinc-800 bg-zinc-900/50 rounded-2xl p-6 shadow-xl backdrop-blur-xl h-fit w-full">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                                    <Upload className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-semibold text-white">Import Data</h2>
                            </div>

                            <p className="text-sm text-gray-400 mb-6">
                                Upload an Excel (.xlsx) or CSV file downloaded from Google Forms. Ensure columns include 'Team Name', 'Idea', 'Leader Name', 'Leader Email', etc.
                            </p>

                            <form onSubmit={handleUpload} className="space-y-4">
                                <div className="w-full overflow-hidden">
                                    <input
                                        type="file"
                                        name="file"
                                        accept=".csv, .xlsx"
                                        className="block w-full text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border file:border-white/10 file:bg-white/5 file:text-white file:font-semibold hover:file:bg-white/10 cursor-pointer"
                                        ref={fileInputRef}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                                >
                                    {uploading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Importing...
                                        </>
                                    ) : (
                                        "Upload & Sync Teams"
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Teams List */}
                        <div className="lg:col-span-2 border border-zinc-800 bg-zinc-900/50 rounded-2xl p-6 shadow-xl backdrop-blur-xl">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-white">Registered Teams</h2>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-sm font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                        {teams.length} Teams
                                    </div>
                                    {teams.length > 0 && (
                                        <button
                                            onClick={async () => {
                                                if (!confirm(`This will email QR codes to ALL participants across ${teams.length} teams. Continue?`)) return;
                                                setSendingQr(true);
                                                setMessage(null);
                                                try {
                                                    const res = await fetch('/api/admin/hackathon-qr-emails', { method: 'POST' });
                                                    const data = await res.json();
                                                    if (data.error) {
                                                        setMessage({ type: 'error', text: data.error });
                                                    } else {
                                                        setMessage({ type: 'success', text: `QR codes emailed! ${data.sent} sent, ${data.failed} failed.` });
                                                    }
                                                } catch (err: any) {
                                                    setMessage({ type: 'error', text: err.message || 'Failed to send QR emails.' });
                                                } finally {
                                                    setSendingQr(false);
                                                }
                                            }}
                                            disabled={sendingQr}
                                            className="flex items-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 px-4 py-1.5 rounded-full text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {sendingQr ? (
                                                <>
                                                    <div className="w-3.5 h-3.5 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Mail className="w-3.5 h-3.5" /> Email QR Codes
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                {loading ? (
                                    <div className="text-center py-12">
                                        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                        <p className="text-gray-400">Loading teams...</p>
                                    </div>
                                ) : teams.length === 0 ? (
                                    <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
                                        <FileDown className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                                        <p className="text-gray-400">No teams found. Import a file to get started.</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-4">
                                        {teams.map((team) => (
                                            <div key={team.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                                                <div className="flex justify-between items-start mb-2 flex-col sm:flex-row gap-2">
                                                    <div>
                                                        <h3 className="font-semibold text-white text-lg flex items-center gap-3">
                                                            {team.name}
                                                            {team.total_score > 0 && (
                                                                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                                                                    Score: {team.total_score}
                                                                </span>
                                                            )}
                                                        </h3>
                                                        <p className="text-sm text-gray-400 flex items-center gap-2">
                                                            <Cpu className="w-4 h-4" /> {team.idea_title}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => handleToggleShortlist(team.id, team.status)}
                                                            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors border ${team.status === 'shortlisted'
                                                                ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-600/30'
                                                                : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                                                                }`}
                                                        >
                                                            {team.status === 'shortlisted' ? '★ Shortlisted' : 'Mark Shortlisted'}
                                                        </button>
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border w-fit ${team.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                            team.status === 'evaluating' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                                team.status === 'shortlisted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                                    'bg-red-500/10 text-red-400 border-red-500/20'
                                                            }`}>
                                                            {team.status.toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="mt-4 pt-4 border-t border-white/5 flex gap-2 flex-wrap">
                                                    {team.hackathon_participants?.map((p: any) => (
                                                        <div key={p.id} className="px-2 py-1 rounded bg-zinc-800 text-xs text-gray-300">
                                                            {p.name} <span className="text-gray-500">({p.role})</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Evaluators Tab */}
                <TabsContent value="evaluators" className="mt-0 border border-zinc-800 bg-zinc-900/50 rounded-2xl p-6 shadow-xl backdrop-blur-xl">
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-1 max-w-md">
                            <h2 className="text-xl font-bold text-white mb-2">Evaluator Management</h2>
                            <p className="text-gray-400 text-sm mb-6">Add evaluator emails here so they can securely access the evaluation portal to score teams. They will log in using this email.</p>

                            <form onSubmit={handleAddEvaluator} className="flex gap-3">
                                <input
                                    type="email"
                                    value={evalEmail}
                                    onChange={(e) => setEvalEmail(e.target.value)}
                                    placeholder="Evaluator Email (e.g. judge@company.com)"
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-amber-500 text-white"
                                    required
                                />
                                <button type="submit" className="bg-amber-600 hover:bg-amber-500 px-6 py-2 rounded-xl text-white font-medium transition-colors whitespace-nowrap">
                                    Add
                                </button>
                            </form>
                        </div>

                        <div className="flex-1 border-l border-white/10 pl-0 md:pl-8">
                            <h3 className="text-lg font-semibold text-white mb-4">Current Evaluators</h3>
                            {evaluators.length === 0 ? (
                                <p className="text-gray-500 text-sm italic">No evaluators added yet.</p>
                            ) : (
                                <div className="space-y-3">
                                    {evaluators.map(ev => (
                                        <div key={ev.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                                            <div>
                                                <p className="font-medium text-white">{ev.name}</p>
                                                <p className="text-xs text-gray-400">{ev.email}</p>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveEvaluator(ev.id)}
                                                className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                                title="Remove Evaluator"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </TabsContent>

                {/* Timer Tab */}
                <TabsContent value="timer" className="mt-0 border border-zinc-800 bg-zinc-900/50 rounded-2xl p-6 shadow-xl backdrop-blur-xl">
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Clock className={`w-16 h-16 mb-4 ${settings?.is_running ? 'text-emerald-500 animate-pulse' : 'text-blue-500/50'}`} />
                        <h2 className="text-2xl font-bold text-white mb-2">Live Timer Controls</h2>
                        <p className="text-gray-400 max-w-md mb-8">Start the 24-hour countdown and push real-time announcements to the public dashboard.</p>

                        <div className="w-full max-w-md space-y-4">
                            {settings?.is_running ? (
                                <div className="space-y-4 w-full mb-6">
                                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                        <p className="font-bold flex justify-center items-center gap-2">
                                            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" /></span> Timer is actively running!
                                        </p>
                                        <p className="text-xs mt-1 text-center">Started at: {new Date(settings.timer_start).toLocaleString()}</p>
                                    </div>
                                    <button
                                        onClick={handleStopTimer}
                                        className="w-full bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 py-3 rounded-xl text-red-400 font-bold text-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        <StopCircle className="w-5 h-5" /> STOP TIMER
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleStartTimer}
                                    className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl text-white font-bold text-lg transition-colors shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                                >
                                    START 24HR TIMER
                                </button>
                            )}

                            <div className="pt-6 border-t border-white/10 text-left">
                                <label className="block text-sm text-gray-400 mb-2">Live Announcement Banner</label>
                                <textarea
                                    value={announcement}
                                    onChange={(e) => setAnnouncement(e.target.value)}
                                    placeholder={settings?.active_announcement || "Type an announcement to display across all screens..."}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-blue-500 resize-none h-24 text-white"
                                />
                                <button
                                    onClick={handlePushAnnouncement}
                                    className="w-full bg-white/10 hover:bg-white/20 py-2 rounded-xl text-white mt-2 transition-colors"
                                >
                                    Push Notification
                                </button>
                                {settings?.active_announcement && (
                                    <div className="mt-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                                        <p className="text-xs text-emerald-400 flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3" /> Currently showing: "{settings.active_announcement}"
                                        </p>
                                        <button
                                            onClick={handleClearAnnouncement}
                                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors" title="Clear Announcement"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Schedule Tab */}
                <TabsContent value="schedule" className="mt-0 border border-zinc-800 bg-zinc-900/50 rounded-2xl p-6 shadow-xl backdrop-blur-xl">
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-white mb-2">Event Schedule</h2>
                            <p className="text-gray-400 text-sm mb-6">Manage checkpoints, meal times, and pitch timings for the live dashboard timeline.</p>

                            <form onSubmit={handleAddSchedule} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-400">Title</label>
                                        <input type="text" name="title" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-400">Type</label>
                                        <select name="event_type" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white [&>option]:bg-zinc-900">
                                            <option value="Activity">Activity</option>
                                            <option value="Meal">Meal</option>
                                            <option value="Evaluation">Evaluation</option>
                                            <option value="Pitch">Pitch</option>
                                            <option value="Deadline">Deadline</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-400">Start Time</label>
                                        <input type="datetime-local" name="start_time" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-400">End Time (Optional)</label>
                                        <input type="datetime-local" name="end_time" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-400">Description (Optional)</label>
                                    <input type="text" name="description" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" />
                                </div>
                                <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 px-6 py-2.5 rounded-xl text-white font-medium transition-colors">
                                    Add Schedule Item
                                </button>
                            </form>
                        </div>

                        <div className="flex-1 lg:border-l border-white/10 lg:pl-8">
                            <h3 className="text-lg font-semibold text-white mb-4">Live Timeline</h3>
                            {schedule.length === 0 ? (
                                <p className="text-gray-500 text-sm italic">No events scheduled.</p>
                            ) : (
                                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                                    {schedule.map(item => (
                                        <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                            <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-zinc-900 bg-purple-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2" />
                                            <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors shadow">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-bold text-white text-sm">{item.title}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${item.event_type === 'Meal' ? 'bg-orange-500/20 text-orange-400' :
                                                            item.event_type === 'Evaluation' ? 'bg-blue-500/20 text-blue-400' :
                                                                'bg-gray-500/20 text-gray-400'
                                                            }`}>
                                                            {item.event_type}
                                                        </span>
                                                        <button
                                                            onClick={() => handleDeleteScheduleItem(item.id)}
                                                            className="p-1 rounded-md text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                                                            title="Delete event"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <time className="block text-xs font-medium text-emerald-400 mb-2">
                                                    {new Date(item.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </time>
                                                {item.description && <div className="text-gray-400 text-xs">{item.description}</div>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
