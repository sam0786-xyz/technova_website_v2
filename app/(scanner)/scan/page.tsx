'use client'

import { useState, useEffect } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { CheckCircle, XCircle, Camera, Loader2 } from 'lucide-react'

export default function ScannerPage() {
    const [scanResult, setScanResult] = useState<'success' | 'error' | null>(null)
    const [message, setMessage] = useState('')
    const [isScanning, setIsScanning] = useState(false)

    useEffect(() => {
        const scanner = new Html5QrcodeScanner('qr-reader', {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
        }, false)

        scanner.render(
            async (decodedText) => {
                setIsScanning(true)
                scanner.pause(true)

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
                    scanner.resume()
                }, 3000)
            },
            () => {
                // Ignore scan errors (no QR detected yet)
            }
        )

        return () => {
            scanner.clear().catch(() => { })
        }
    }, [])

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
            <div className="mb-8 text-center">
                <Camera className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                <h1 className="text-2xl font-bold">Event Scanner</h1>
                <p className="text-gray-400 mt-2">Point camera at attendee&apos;s QR code</p>
            </div>

            {/* QR Scanner Container */}
            <div className="relative w-full max-w-sm">
                <div id="qr-reader" className="rounded-xl overflow-hidden" />

                {/* Overlay for results */}
                {scanResult && (
                    <div className={`absolute inset-0 flex flex-col items-center justify-center rounded-xl ${scanResult === 'success' ? 'bg-green-600/90' : 'bg-red-600/90'
                        }`}>
                        {scanResult === 'success' ? (
                            <CheckCircle className="w-20 h-20 mb-4" />
                        ) : (
                            <XCircle className="w-20 h-20 mb-4" />
                        )}
                        <p className="text-xl font-bold">{message}</p>
                    </div>
                )}

                {isScanning && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 rounded-xl">
                        <Loader2 className="w-12 h-12 animate-spin" />
                    </div>
                )}
            </div>

            <p className="text-gray-500 text-sm mt-8">Technova Event Scanner v1.0</p>
        </div>
    )
}
