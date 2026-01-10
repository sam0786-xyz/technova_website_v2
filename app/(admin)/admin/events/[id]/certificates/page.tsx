import { Suspense } from "react"
import Link from "next/link"
import { ArrowLeft, Award, FileEdit } from "lucide-react"
import { getEventById } from "@/lib/actions/events"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CertificateTemplateEditor } from "@/components/admin/CertificateTemplateEditor"
import { CertificateManager } from "@/components/admin/CertificateManager"

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function CertificatesPage({ params }: PageProps) {
    const { id } = await params
    const session = await auth()

    if (!session || !['admin', 'super_admin'].includes(session.user.role)) {
        redirect('/auth/signin')
    }

    const event = await getEventById(id)

    if (!event) {
        redirect('/admin/events')
    }

    return (
        <div className="min-h-screen bg-black">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href={`/admin/events/${id}`}
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Event
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-violet-500/20 rounded-xl">
                            <Award className="w-8 h-8 text-violet-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Certificate Management</h1>
                            <p className="text-gray-400">{event.title}</p>
                        </div>
                    </div>
                </div>

                {/* Content Tabs */}
                <div className="space-y-8">
                    {/* Template Editor Section */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <FileEdit className="w-5 h-5 text-violet-400" />
                            <h2 className="text-xl font-semibold text-white">Certificate Template</h2>
                        </div>
                        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                            <Suspense fallback={
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
                                </div>
                            }>
                                <CertificateTemplateEditor eventId={id} />
                            </Suspense>
                        </div>
                    </section>

                    {/* Certificate Manager Section */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <Award className="w-5 h-5 text-emerald-400" />
                            <h2 className="text-xl font-semibold text-white">Issued Certificates</h2>
                        </div>
                        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                            <Suspense fallback={
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
                                </div>
                            }>
                                <CertificateManager eventId={id} eventTitle={event.title} />
                            </Suspense>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}
