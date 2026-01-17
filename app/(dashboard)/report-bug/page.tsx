import { Metadata } from 'next'
import BugReportForm from '@/components/bug-report-form'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Report a Bug | Technova',
    description: 'Help us improve the platform by reporting bugs and issues'
}

export default function BugReportPage() {
    return (
        <div className="min-h-screen bg-black text-white py-12">
            <div className="container mx-auto px-4">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>

                <BugReportForm />
            </div>
        </div>
    )
}
