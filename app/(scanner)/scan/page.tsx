'use client'

import { useState, useEffect, useRef } from 'react'
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode'
import { CheckCircle, XCircle, Camera, Loader2, Upload, RefreshCw } from 'lucide-react'

export default function ScannerPage() {
    const [scanResult, setScanResult] = useState<'success' | 'error' | null>(null)
    const [message, setMessage] = useState('')
    const [isScanning, setIsScanning] = useState(false)
    const [mode, setMode] = useState<'camera' | 'file'>('camera')
    const [cameraActive, setCameraActive] = useState(false)

    // Use a ref to hold the scanner instance to prevent re-initialization issues
    const scannerRef = useRef<Html5Qrcode | null>(null)

    useEffect(() => {
        // Cleanup function to stop camera when component unmounts
        return () => {
            if (scannerRef.current) {
                if (scannerRef.current.isScanning) {
                    scannerRef.current.stop().catch(console.error)
                }
                scannerRef.current.clear()
            }
        }
    }, [])

    const handleScanSuccess = async (decodedText: string) => {
        setIsScanning(true)
        // Pause if using camera
        if (scannerRef.current && scannerRef.current.isScanning) {
            scannerRef.current.pause(true)
        }

        try {
            const response = await fetch('/api/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: decodedText
            })

            const result = await response.json()

            if (result.success) {
                setScanResult('success')
                setMessage(`Welcome, ${result.userName}!`)
            } else {
                setScanResult('error')
                setMessage(result.message || 'Invalid QR Code')
            }
        } catch {
            setScanResult('error')
            setMessage('Scan failed. Please try again.')
        }

        setIsScanning(false)

        // Reset after 3 seconds
        setTimeout(() => {
            setScanResult(null)
            setMessage('')
            if (scannerRef.current && mode === 'camera') {
                scannerRef.current.resume()
            }
        }, 3000)
    }

    const startCamera = async () => {
        setScanResult(null)
        setMessage('')

        try {
            if (!scannerRef.current) {
                scannerRef.current = new Html5Qrcode("reader", {
                    verbose: false,
                    formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE]
                })
            }

            await scannerRef.current.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 }
                },
                handleScanSuccess,
                () => { /* ignore failures */ }
            )
            setCameraActive(true)
        } catch (err) {
            console.error("Camera start failed", err)
            setMessage("Failed to start camera. Please allow permissions.")
            setScanResult('error')
        }
    }

    const stopCamera = async () => {
        if (scannerRef.current && scannerRef.current.isScanning) {
            await scannerRef.current.stop()
            setCameraActive(false)
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsScanning(true)
        setScanResult(null)
        setMessage('')

        try {
            if (!scannerRef.current) {
                scannerRef.current = new Html5Qrcode("reader", {
                    verbose: false,
                    formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE]
                })
            }

            // If camera is running, stop it first to avoid conflicts
            if (cameraActive) {
                await stopCamera()
            }

            const decodedText = await scannerRef.current.scanFileV2(file, true)
            handleScanSuccess(decodedText.decodedText)
        } catch (err) {
            console.error("File scan error", err)
            setScanResult('error')
            setMessage("Could not find a QR code in this image. Try a clearer image.")
            setIsScanning(false)
        }
    }

    const switchMode = async (newMode: 'camera' | 'file') => {
        if (newMode === mode) return

        if (newMode === 'file') {
            await stopCamera()
        }
        setMode(newMode)
        setScanResult(null)
        setMessage('')
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
            <div className="mb-8 text-center">
                <Camera className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                <h1 className="text-2xl font-bold">Event Scanner</h1>
                <p className="text-gray-400 mt-2">Scan attendee tickets</p>
            </div>

            {/* Mode Switcher */}
            <div className="flex bg-gray-800 p-1 rounded-lg mb-6">
                <button
                    onClick={() => switchMode('camera')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${mode === 'camera' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                    Camera
                </button>
                <button
                    onClick={() => switchMode('file')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${mode === 'file' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                    Upload Image
                </button>
            </div>

            {/* Scanner Container */}
            <div className="relative w-full max-w-sm bg-black rounded-xl overflow-hidden border border-gray-800 min-h-[300px] flex flex-col items-center justify-center">

                {mode === 'camera' && (
                    <div className="w-full">
                        {/* Default ID required by Html5Qrcode */}
                        <div id="reader" className="w-full h-full"></div>

                        {!cameraActive && !scanResult && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <button
                                    onClick={startCamera}
                                    className="flex items-center gap-2 bg-blue-600 px-6 py-3 rounded-full hover:bg-blue-700 transition-colors"
                                >
                                    <Camera className="w-5 h-5" />
                                    Start Camera
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {mode === 'file' && (
                    <div className="p-8 w-full text-center">
                        {/* Hidden reader div still needed for file scan logic sometimes, or just for the instance */}
                        <div id="reader" className="hidden"></div>

                        <label className="flex flex-col items-center gap-4 cursor-pointer p-8 border-2 border-dashed border-gray-700 rounded-xl hover:border-blue-500 hover:bg-gray-800/50 transition-colors">
                            <Upload className="w-12 h-12 text-gray-500" />
                            <div className="text-sm text-gray-400">
                                <span className="font-bold text-white">Click to upload</span> or drag and drop
                                <br />QR code image
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileUpload}
                            />
                        </label>
                    </div>
                )}

                {/* Overlay for results */}
                {scanResult && (
                    <div className={`absolute inset-0 flex flex-col items-center justify-center bg-gray-900/95 z-10 p-6 text-center animate-in fade-in zoom-in duration-200`}>
                        {scanResult === 'success' ? (
                            <CheckCircle className="w-16 h-16 mb-4 text-green-500" />
                        ) : (
                            <XCircle className="w-16 h-16 mb-4 text-red-500" />
                        )}
                        <p className={`text-xl font-bold mb-2 ${scanResult === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                            {scanResult === 'success' ? 'Success!' : 'Error'}
                        </p>
                        <p className="text-gray-300">{message}</p>

                        {scanResult === 'error' && (
                            <button
                                onClick={() => {
                                    setScanResult(null)
                                    setMessage('')
                                    if (mode === 'camera') startCamera()
                                }}
                                className="mt-6 flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 font-medium"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Try Again
                            </button>
                        )}
                    </div>
                )}

                {isScanning && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
                    </div>
                )}
            </div>

            <p className="text-gray-500 text-sm mt-8">Technova Event Scanner v2.0</p>
        </div>
    )
}
