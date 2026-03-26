"use client";

import { useState } from "react";
import { lookupAttendeeByEmail, updateAttendeeDetails } from "@/lib/actions/hackathon";
import { Search, CheckCircle, AlertCircle, User, Hash, BookOpen, Building } from "lucide-react";

export default function AttendeeRegisterClient() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [attendee, setAttendee] = useState<any>(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Form fields
    const [systemId, setSystemId] = useState("");
    const [section, setSection] = useState("");
    const [department, setDepartment] = useState("");
    const [saving, setSaving] = useState(false);

    const handleLookup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); setSuccess(""); setAttendee(null);
        if (!email.trim()) { setError("Please enter your email."); return; }
        setLoading(true);
        const result = await lookupAttendeeByEmail(email.trim());
        if (result.error) {
            setError(result.error);
        } else if (result.attendee) {
            setAttendee(result.attendee);
            setSystemId(result.attendee.system_id || "");
            setSection(result.attendee.section || "");
            setDepartment(result.attendee.department || "");
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!attendee) return;
        if (!systemId.trim() || !section.trim() || !department.trim()) {
            setError("Please fill in all fields.");
            return;
        }
        setSaving(true); setError("");
        const result = await updateAttendeeDetails(attendee.id, {
            system_id: systemId,
            section: section,
            department: department
        });
        if (result.error) {
            setError(result.error);
        } else {
            setSuccess(result.message || "Details saved!");
            setAttendee({ ...attendee, system_id: systemId, section, department });
        }
        setSaving(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/20">
                        <User className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-black tracking-tight">Complete Your Registration</h1>
                    <p className="text-gray-400 text-sm mt-2">Enter your email to verify your registration, then fill in your academic details.</p>
                </div>

                {/* Email Lookup */}
                {!attendee && (
                    <form onSubmit={handleLookup} className="space-y-4">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Your Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="your.email@example.com"
                                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 placeholder-gray-600"
                                    autoFocus
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50 shadow-lg shadow-violet-500/20"
                            >
                                {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Looking up...</> : <><Search className="w-4 h-4" /> Find My Registration</>}
                            </button>
                        </div>
                    </form>
                )}

                {/* Error */}
                {error && (
                    <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                {/* Success */}
                {success && (
                    <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <p className="text-emerald-400 text-sm">{success}</p>
                    </div>
                )}

                {/* Details Form */}
                {attendee && (
                    <div className="space-y-4 mt-4">
                        {/* Found info */}
                        <div className="bg-violet-500/10 border border-violet-500/20 rounded-2xl p-4">
                            <p className="text-xs text-violet-400 font-bold uppercase tracking-wider mb-1">Registration Found</p>
                            <p className="text-lg font-bold text-white">{attendee.name}</p>
                            <p className="text-sm text-gray-400">{attendee.email}</p>
                            {attendee.college && <p className="text-xs text-gray-500 mt-1">{attendee.college}</p>}
                        </div>

                        {/* Editable fields */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Your Academic Details</p>

                            <div>
                                <label className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-1.5">
                                    <Hash className="w-3.5 h-3.5" /> System ID
                                </label>
                                <input
                                    type="text"
                                    value={systemId}
                                    onChange={e => setSystemId(e.target.value)}
                                    placeholder="e.g. 2024012345"
                                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 placeholder-gray-600"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-1.5">
                                    <BookOpen className="w-3.5 h-3.5" /> Section
                                </label>
                                <input
                                    type="text"
                                    value={section}
                                    onChange={e => setSection(e.target.value)}
                                    placeholder="e.g. A, B, C"
                                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 placeholder-gray-600"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-1.5">
                                    <Building className="w-3.5 h-3.5" /> Department / Course
                                </label>
                                <input
                                    type="text"
                                    value={department}
                                    onChange={e => setDepartment(e.target.value)}
                                    placeholder="e.g. CSE, ECE, MBA"
                                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 placeholder-gray-600"
                                />
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50 shadow-lg shadow-violet-500/20"
                            >
                                {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</> : <><CheckCircle className="w-4 h-4" /> Save My Details</>}
                            </button>
                        </div>

                        {/* Go back button */}
                        <button onClick={() => { setAttendee(null); setEmail(""); setSuccess(""); setError(""); }} className="w-full text-center text-gray-500 hover:text-white text-sm py-2 transition-colors">
                            ← Look up a different email
                        </button>
                    </div>
                )}

                {/* Footer */}
                <p className="text-center text-gray-600 text-xs mt-8">&copy; 2026 TechNova | Sharda University</p>
            </div>
        </div>
    );
}
