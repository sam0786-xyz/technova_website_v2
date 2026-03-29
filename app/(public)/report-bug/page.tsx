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
        <div className="min-h-screen bg-[var(--sig-bg)] text-[var(--sig-text)] py-12">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-[var(--sig-amber)] mb-4">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest font-mono">DevSpace</span>
                    </div>
                    <Link
                        href="/community"
                        className="spring-btn inline-flex items-center gap-2 text-[var(--sig-text-secondary)] hover:text-white transition-colors"
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
