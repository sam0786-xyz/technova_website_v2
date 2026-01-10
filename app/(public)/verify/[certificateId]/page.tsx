import { Metadata } from "next"
import Link from "next/link"
import { CheckCircle, XCircle, Calendar, User, Award, Shield, ExternalLink } from "lucide-react"
import { verifyCertificate } from "@/lib/actions/certificates"
import { formatDateShort } from "@/lib/utils"

// Helper to extract club name from Supabase join (can be array or object)
function getClubName(club: any): string | null {
    if (!club) return null
    if (Array.isArray(club)) return club[0]?.name || null
    return club.name || null
}

// LinkedIn share URL generator
function getLinkedInShareUrl(eventName: string, participantName: string, verifyUrl: string): string {
    const text = `I'm proud to share that I earned a certificate for ${eventName}! Verify it here: ${verifyUrl}`
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verifyUrl)}`
}

interface PageProps {
    params: Promise<{ certificateId: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { certificateId } = await params
    return {
        title: `Verify Certificate ${certificateId} | Technova`,
        description: `Verify the authenticity of certificate ${certificateId} issued by Technova Technical Society.`,
    }
}

export default async function VerifyCertificatePage({ params }: PageProps) {
    const { certificateId } = await params
    const result = await verifyCertificate(certificateId)

    if (!result.valid && result.error === 'Certificate not found') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    <div className="bg-gray-900/50 border border-red-500/30 rounded-2xl p-8 text-center backdrop-blur-xl">
                        <div className="w-16 h-16 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
                            <XCircle className="w-8 h-8 text-red-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Certificate Not Found</h1>
                        <p className="text-gray-400 mb-6">
                            The certificate ID <code className="text-red-400 bg-red-500/10 px-2 py-1 rounded">{certificateId}</code> does not exist in our records.
                        </p>
                        <p className="text-sm text-gray-500">
                            Please check the certificate ID and try again, or contact support if you believe this is an error.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Return to Home
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    const certificate = result.certificate!
    const isValid = certificate.status === 'valid'

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
            <div className="max-w-lg w-full">
                {/* Status Header */}
                <div className={`rounded-t-2xl p-6 ${isValid
                    ? 'bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border-t border-l border-r border-emerald-500/30'
                    : 'bg-gradient-to-r from-red-600/20 to-orange-600/20 border-t border-l border-r border-red-500/30'
                    }`}>
                    <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${isValid ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                            {isValid ? (
                                <CheckCircle className="w-7 h-7 text-emerald-400" />
                            ) : (
                                <XCircle className="w-7 h-7 text-red-400" />
                            )}
                        </div>
                        <div>
                            <h1 className={`text-xl font-bold ${isValid ? 'text-emerald-400' : 'text-red-400'}`}>
                                {isValid ? 'Certificate Verified' : 'Certificate Revoked'}
                            </h1>
                            <p className="text-gray-400 text-sm">
                                {isValid
                                    ? 'This certificate is authentic and valid.'
                                    : 'This certificate has been revoked.'}
                            </p>
                        </div>
                        <div className={`ml-auto px-3 py-1 rounded-full text-sm font-semibold ${isValid
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                            {isValid ? 'VALID' : 'INVALID'}
                        </div>
                    </div>
                </div>

                {/* Certificate Details */}
                <div className={`bg-gray-900/50 backdrop-blur-xl rounded-b-2xl border-b border-l border-r ${isValid ? 'border-emerald-500/30' : 'border-red-500/30'} p-6`}>
                    {/* Revocation Notice */}
                    {!isValid && certificate.revoked_reason && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                            <p className="text-red-400 text-sm font-medium mb-1">Revocation Reason:</p>
                            <p className="text-red-300">{certificate.revoked_reason}</p>
                            {certificate.revoked_at && (
                                <p className="text-red-500/70 text-xs mt-2">
                                    Revoked on {formatDateShort(certificate.revoked_at)}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Details Grid */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                            <User className="w-5 h-5 text-violet-400 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Participant</p>
                                <p className="text-white font-medium">{certificate.user?.name || 'Unknown'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                            <Award className="w-5 h-5 text-violet-400 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Event</p>
                                <p className="text-white font-medium">{certificate.event?.title || 'Unknown Event'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                            <Calendar className="w-5 h-5 text-violet-400 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Event Date</p>
                                <p className="text-white font-medium">
                                    {certificate.event?.start_time ? formatDateShort(certificate.event.start_time) : 'Unknown'}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-gray-800/50 rounded-xl">
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Certificate ID</p>
                                <code className="text-violet-400 font-mono font-medium">{certificate.certificate_id}</code>
                            </div>
                            <div className="p-3 bg-gray-800/50 rounded-xl">
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Issued On</p>
                                <p className="text-white font-medium">{formatDateShort(certificate.issued_at)}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                            <Shield className="w-5 h-5 text-violet-400 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Issuing Authority</p>
                                <p className="text-white font-medium">
                                    {getClubName(certificate.event?.club) || 'Technova Technical Society'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Download Button */}
                    {isValid && (
                        <div className="mt-6 pt-6 border-t border-gray-800 space-y-3">
                            <a
                                href={`/api/certificate?id=${certificate.certificate_id}`}
                                target="_blank"
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium transition-colors"
                            >
                                <ExternalLink className="w-5 h-5" />
                                Download Certificate
                            </a>

                            {/* LinkedIn Share Button */}
                            <a
                                href={getLinkedInShareUrl(
                                    certificate.event?.title || 'Event',
                                    certificate.user?.name || 'Participant',
                                    `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.technovashardauniversity.in'}/verify/${certificate.certificate_id}`
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0a66c2] hover:bg-[#004182] text-white rounded-xl font-medium transition-colors"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                                Add to LinkedIn Profile
                            </a>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="mt-6 pt-4 border-t border-gray-800/50 text-center">
                        <p className="text-xs text-gray-500">
                            Verified on {new Date().toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                timeZone: 'Asia/Kolkata'
                            })} IST
                        </p>
                        <Link href="/" className="text-xs text-violet-400 hover:text-violet-300 mt-2 inline-block">
                            technovashardauniversity.in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
