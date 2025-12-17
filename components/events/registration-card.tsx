"use client"

import { useState } from "react"
import { registerForEvent } from "@/lib/actions/registrations"
import { useRouter } from "next/navigation"
import { Download } from "lucide-react"
import { RegistrationModal } from "./registration-modal"
import { RegistrationField } from "@/components/admin/form-builder"

declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => { open: () => void }
    }
}

interface RazorpayOptions {
    key: string
    amount: number | string
    currency: string
    name: string
    description: string
    order_id: string
    handler: (response: { razorpay_payment_id: string }) => void
    prefill: { name: string; email: string }
    theme: { color: string }
}

interface EventData {
    id: string
    title: string
    price: number
    capacity: number
    registered_count?: number
    registration_fields?: RegistrationField[] | string
}

interface UserData {
    name?: string | null
    email?: string | null
}

interface RegistrationData {
    id: string
    payment_status: string
}

export function EventRegistrationCard({
    event,
    user,
    existingRegistration,
    qrCode
}: {
    event: EventData
    user: UserData | null
    existingRegistration: RegistrationData | null
    qrCode?: string | null
}) {
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const router = useRouter()

    const registrationFields: RegistrationField[] = typeof event.registration_fields === 'string'
        ? JSON.parse(event.registration_fields)
        : (event.registration_fields || [])

    const handleRegisterClick = () => {
        if (!user) {
            router.push(`/login?callbackUrl=/events/${event.id}`)
            return
        }

        if (registrationFields.length > 0) {
            setShowModal(true)
        } else {
            processRegistration({})
        }
    }

    const processRegistration = async (answers: Record<string, any>) => {
        setLoading(true)
        setShowModal(false)

        try {
            const result = await registerForEvent(event.id, answers)

            if (result.status === 'success') {
                alert("Registration Successful!")
                router.refresh()
            } else if (result.status === 'payment_required' && result.order) {
                const options: RazorpayOptions = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
                    amount: result.order.amount,
                    currency: result.order.currency,
                    name: "Technova",
                    description: event.title,
                    order_id: result.order.id,
                    handler: function () {
                        alert("Payment Successful! (Webhook needs to verify)")
                        router.refresh()
                    },
                    prefill: {
                        name: user?.name || '',
                        email: user?.email || '',
                    },
                    theme: {
                        color: "#2563EB"
                    }
                }

                const rzp1 = new window.Razorpay(options)
                rzp1.open()
            }
        } catch (err: unknown) {
            const error = err as Error
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    const downloadQR = () => {
        if (!qrCode) return
        const link = document.createElement('a')
        link.href = qrCode
        link.download = `technova-ticket-${event.title.replace(/\s+/g, '-').toLowerCase()}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    if (existingRegistration) {
        return (
            <div className="w-full md:w-80 bg-green-50 p-6 rounded-xl border border-green-200">
                <div className="mb-4 text-center">
                    <p className="text-green-700 font-bold text-lg">You are registered!</p>
                    <p className="text-green-600 text-sm">See you at the event.</p>
                </div>
                {qrCode && (
                    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-green-100">
                        <img src={qrCode} alt="Event Ticket QR" className="w-48 h-48" />
                        <p className="text-xs text-gray-400 mt-2">Scan at entrance</p>
                        <button
                            onClick={downloadQR}
                            className="mt-3 flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Download QR
                        </button>
                    </div>
                )}
            </div>
        )
    }

    const isFull = (event.registered_count || 0) >= event.capacity

    return (
        <>
            <div className="w-full md:w-80 bg-gray-50 p-6 rounded-xl border">
                <div className="mb-4">
                    <p className="text-sm text-gray-500">Capacity</p>
                    <div className="w-full bg-gray-200 h-2 rounded-full mt-2 overflow-hidden">
                        <div className="bg-blue-600 h-full" style={{ width: `${((event.registered_count || 0) / event.capacity) * 100}%` }}></div>
                    </div>
                    <p className="text-right text-xs mt-1 text-gray-500">{(event.registered_count || 0)} / {event.capacity} Filled</p>
                </div>

                <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>

                <button
                    onClick={handleRegisterClick}
                    disabled={loading || isFull}
                    className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Processing..." : isFull ? "Event Full" : event.price > 0 ? `Pay ₹${event.price}` : "Register Now"}
                </button>
            </div>

            <RegistrationModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                fields={registrationFields}
                onConfirm={processRegistration}
                loading={loading}
            />
        </>
    )
}
