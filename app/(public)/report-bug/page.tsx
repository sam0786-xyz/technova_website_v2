import { Metadata } from 'next'
import BugReportForm from '@/components/bug-report-form'
import { ArrowLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Report a Bug | DevSpace | Technova',
    description: 'Help us improve the platform by reporting bugs and issues'
}

export default function BugReportPage() {
    return (
        <div className="min-h-screen bg-black text-white py-12">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-blue-400 mb-4">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">DevSpace</span>
                    </div>
                    <Link
                        href="/community"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Community
                    </Link>
                </div>

                <BugReportForm />
            </div>
        </div>
    )
}
