"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { processHackathonQrScan, searchParticipants } from "@/lib/actions/hackathon";
import { ArrowLeft, Camera, QrCode, CheckCircle, AlertCircle, Coffee, ChevronDown, Search, UserCheck } from "lucide-react";

const MEAL_ROUNDS = [
    "Breakfast - Day 1",
    "Lunch - Day 1",
    "Snacks - Day 1",
    "Dinner - Day 1",
    "Breakfast - Day 2",
    "Lunch - Day 2",
];

export default function HackathonScannerPage() {
    const [mode, setMode] = useState<'checkin' | 'food'>('checkin');
    const [selectedMeal, setSelectedMeal] = useState(MEAL_ROUNDS[0]);
    const [scanResult, setScanResult] = useState<'success' | 'error' | 'already' | null>(null);
    const [message, setMessage] = useState("");
    const [participantName, setParticipantName] = useState("");
    const [isScanning, setIsScanning] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState("");

    // Search check-in state
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searching, setSearching] = useState(false);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const scannerRef = useRef<Html5Qrcode | null>(null);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                if (scannerRef.current.isScanning) {
                    scannerRef.current.stop().catch(console.error);
                }
                scannerRef.current.clear();
            }
        };
    }, []);

    // Debounced search
    useEffect(() => {
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        if (!searchQuery || searchQuery.length < 2) {
            setSearchResults([]);
            return;
        }
        searchTimeoutRef.current = setTimeout(async () => {
            setSearching(true);
            const results = await searchParticipants(searchQuery);
            setSearchResults(results);
            setSearching(false);
        }, 400);
    }, [searchQuery]);

    const startCamera = async () => {
        setScanResult(null);
        setMessage("");
        setCameraError("");
        setShowSearch(false);

        try {
            if (scannerRef.current) {
                try {
                    if (scannerRef.current.isScanning) await scannerRef.current.stop();
                    scannerRef.current.clear();
                } catch { }
                scannerRef.current = null;
            }

            scannerRef.current = new Html5Qrcode("reader", {
                verbose: false,
                formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
                useBarCodeDetectorIfSupported: false
            });

            await scannerRef.current.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
                handleScanSuccess,
                () => { }
            );

            setCameraActive(true);
        } catch (err) {
            console.error(err);
            setCameraError("Camera failed to start. Please check permissions.");
        }
    };

    const stopCamera = async () => {
        if (scannerRef.current) {
            try {
                if (scannerRef.current.isScanning) await scannerRef.current.stop();
                scannerRef.current.clear();
            } catch (err) {
                console.error(err);
            }
            setCameraActive(false);
        }
    };

    const handleScanSuccess = async (decodedText: string) => {
        setIsScanning(true);
        if (scannerRef.current && scannerRef.current.isScanning) {
            scannerRef.current.pause(true);
        }

        try {
            const participantId = decodedText.trim();
            const result = await processHackathonQrScan(participantId, mode, mode === 'food' ? selectedMeal : undefined);

            if (result.success) {
                setScanResult('success');
                setMessage(result.message || "Success!");
                setParticipantName(result.participant.name);
            } else if (result.message === "Already checked in") {
                setScanResult('already');
                setMessage("Participant already checked in.");
                setParticipantName(result.participant.name);
            } else {
                setScanResult('error');
                setMessage(result.error || "Invalid QR Code.");
            }
        } catch (err) {
            setScanResult('error');
            setMessage("Scan failed.");
        }

        setTimeout(() => {
            setScanResult(null);
            setMessage("");
            setParticipantName("");
            setIsScanning(false);
            if (scannerRef.current) {
                scannerRef.current.resume();
            }
        }, 3000);
    };

    const handleManualAction = async (participantId: string) => {
        setProcessingId(participantId);
        try {
            const result = await processHackathonQrScan(participantId, mode, mode === 'food' ? selectedMeal : undefined);
            if (result.success) {
                setMessage(result.message || "Success!");
                setScanResult('success');
                // Update local results to reflect change
                setSearchResults(prev => prev.map(p => p.id === participantId
                    ? { ...p, is_checked_in: true, food_count: (p.food_count || 0) + (mode === 'food' ? 1 : 0) }
                    : p));
            } else if (result.message === "Already checked in") {
                setMessage("Already checked in.");
                setScanResult('already');
            } else {
                setMessage(result.error || "Failed.");
                setScanResult('error');
            }
        } catch {
            setMessage("Action failed.");
            setScanResult('error');
        }
        setProcessingId(null);
        setTimeout(() => { setScanResult(null); setMessage(""); }, 3000);
    };

    return (
        <div className="min-h-screen bg-black text-white p-4">
            <header className="max-w-md mx-auto py-3 flex items-center justify-between mb-4">
                <Link href="/admin/hackathon" className="text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-emerald-400" />
                    <h1 className="text-lg font-bold">Hackathon Scanner</h1>
                </div>
                <div className="w-6" />
            </header>

            <main className="max-w-md mx-auto space-y-4">
                {/* Mode Selector */}
                <div className="flex bg-white/5 p-1 rounded-xl">
                    <button
                        onClick={() => setMode('checkin')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-colors ${mode === 'checkin' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        <CheckCircle className="w-4 h-4" /> Check-in
                    </button>
                    <button
                        onClick={() => setMode('food')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-colors ${mode === 'food' ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Coffee className="w-4 h-4" /> Meal Scan
                    </button>
                </div>

                {/* Meal Round Selector - only visible in food mode */}
                {mode === 'food' && (
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3">
                        <label className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-2 block">
                            Active Meal Round
                        </label>
                        <div className="relative">
                            <select
                                value={selectedMeal}
                                onChange={(e) => setSelectedMeal(e.target.value)}
                                className="w-full bg-black/60 border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm font-medium appearance-none focus:outline-none focus:border-orange-500 cursor-pointer"
                            >
                                {MEAL_ROUNDS.map(meal => (
                                    <option key={meal} value={meal}>{meal}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                        <p className="text-[11px] text-orange-400/60 mt-2">Each participant can only scan once per meal round.</p>
                    </div>
                )}

                {/* Toggle: Camera vs Search */}
                <div className="flex bg-white/5 p-1 rounded-xl">
                    <button
                        onClick={() => { setShowSearch(false); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-colors ${!showSearch ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Camera className="w-3.5 h-3.5" /> QR Camera
                    </button>
                    <button
                        onClick={() => { setShowSearch(true); stopCamera(); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-colors ${showSearch ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Search className="w-3.5 h-3.5" /> Search & {mode === 'checkin' ? 'Check-in' : 'Log Meal'}
                    </button>
                </div>

                {/* Status message */}
                {scanResult && showSearch && (
                    <div className={`p-3 rounded-xl text-sm font-medium text-center ${scanResult === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' :
                            scanResult === 'already' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20' :
                                'bg-red-500/20 text-red-400 border border-red-500/20'
                        }`}>
                        {message}
                    </div>
                )}

                {/* Search Mode */}
                {showSearch ? (
                    <div className="space-y-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or phone..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500"
                                autoFocus
                            />
                        </div>

                        {searching && (
                            <div className="text-center py-6">
                                <div className="w-5 h-5 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-2" />
                                <p className="text-gray-500 text-xs">Searching...</p>
                            </div>
                        )}

                        {!searching && searchQuery.length >= 2 && searchResults.length === 0 && (
                            <div className="text-center py-6 text-gray-500 text-sm border border-dashed border-white/10 rounded-xl">
                                No participants found for &quot;{searchQuery}&quot;
                            </div>
                        )}

                        {searchResults.length > 0 && (
                            <div className="space-y-2">
                                {searchResults.map((p: any) => (
                                    <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                                        <div className="flex-1 min-w-0 mr-3">
                                            <p className="text-sm font-bold text-white truncate">{p.name}</p>
                                            <p className="text-[11px] text-gray-500 truncate">
                                                {p.hackathon_teams?.team_code && <span className="text-amber-400 font-mono mr-1.5">{p.hackathon_teams.team_code}</span>}
                                                {p.hackathon_teams?.name || ''} · {p.role}
                                            </p>
                                            <p className="text-[11px] text-gray-600 truncate">{p.email}</p>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            {mode === 'checkin' && p.is_checked_in && (
                                                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">✓ In</span>
                                            )}
                                            {mode === 'food' && (
                                                <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2 py-1 rounded">🍽 {p.food_count}</span>
                                            )}
                                            <button
                                                onClick={() => handleManualAction(p.id)}
                                                disabled={processingId === p.id || (mode === 'checkin' && p.is_checked_in)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-40 ${mode === 'checkin'
                                                        ? 'bg-blue-600 hover:bg-blue-500 text-white'
                                                        : 'bg-orange-600 hover:bg-orange-500 text-white'
                                                    }`}
                                            >
                                                {processingId === p.id ? '...' : mode === 'checkin' ? (p.is_checked_in ? 'Done' : 'Check In') : 'Log Meal'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {searchQuery.length < 2 && searchResults.length === 0 && (
                            <div className="text-center py-8 text-gray-600 text-sm">
                                <Search className="w-8 h-8 mx-auto mb-3 text-gray-700" />
                                <p>Type at least 2 characters to search participants</p>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Camera Mode */
                    <>
                        <div className="text-center">
                            <p className="text-xs text-gray-400">
                                {mode === 'checkin'
                                    ? "Scan participants' IDs to mark them as arrived."
                                    : `Scanning for: ${selectedMeal}`}
                            </p>
                        </div>

                        <div className="relative w-full aspect-square bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 flex flex-col items-center justify-center">
                            <div id="reader" className="w-full h-full absolute inset-0"></div>

                            {!cameraActive && !scanResult && (
                                <div className="z-10 flex flex-col items-center p-6 text-center">
                                    <button
                                        onClick={startCamera}
                                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 transition-colors shadow-[0_0_30px_rgba(52,211,153,0.3)] mb-4"
                                    >
                                        <Camera className="w-6 h-6" /> START SCANNING
                                    </button>
                                    {cameraError && <p className="text-red-400 text-sm">{cameraError}</p>}
                                </div>
                            )}

                            {scanResult && (
                                <div className={`absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center backdrop-blur-md ${scanResult === 'success' ? 'bg-emerald-500/90' :
                                    scanResult === 'already' ? 'bg-amber-500/90' : 'bg-red-500/90'
                                    }`}>
                                    {scanResult === 'success' ? <CheckCircle className="w-16 h-16 text-white mb-4 drop-shadow-md" /> :
                                        <AlertCircle className="w-16 h-16 text-white mb-4 drop-shadow-md" />}

                                    <h2 className="text-2xl font-black text-white drop-shadow-md tracking-tight mb-2">
                                        {scanResult === 'success' ? 'SUCCESS' : scanResult === 'already' ? 'ALREADY SCANNED' : 'ERROR'}
                                    </h2>
                                    {participantName && <p className="text-xl font-bold text-white mb-1">{participantName}</p>}
                                    <p className="text-white/90 font-medium text-sm">{message}</p>
                                </div>
                            )}
                        </div>

                        {cameraActive && !scanResult && (
                            <button
                                onClick={stopCamera}
                                className="w-full py-3 text-center text-gray-400 hover:text-white font-medium transition-colors text-sm"
                            >
                                Stop Camera
                            </button>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
