'use client'

import { useState } from 'react'
import { Check, Clock, QrCode, ChevronLeft, ChevronRight } from 'lucide-react'
import { formatDate, formatTime } from '@/lib/utils'

const PAGE_SIZE = 25

export function RegistrationsTable({ registrations }: { registrations: any[] }) {
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')

    // Filter by search
    const filtered = search
        ? registrations.filter((reg: any) =>
            reg.user.name?.toLowerCase().includes(search.toLowerCase()) ||
            reg.user.email?.toLowerCase().includes(search.toLowerCase()) ||
            reg.events?.title?.toLowerCase().includes(search.toLowerCase())
        )
        : registrations

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
    const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    // Reset to page 1 when search changes
    const handleSearch = (value: string) => {
        setSearch(value)
        setPage(1)
    }

    return (
        <>
            {/* Search Bar */}
            <div className="flex items-center gap-3 mb-4">
                <input
                    type="text"
                    placeholder="Search by name, email, or event..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="flex-1 px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="text-sm text-gray-500 whitespace-nowrap">
                    {filtered.length} registration{filtered.length !== 1 ? 's' : ''}
                </span>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4 font-medium text-gray-500">Student</th>
                                <th className="p-4 font-medium text-gray-500">Event</th>
                                <th className="p-4 font-medium text-gray-500">Status</th>
                                <th className="p-4 font-medium text-gray-500">Date</th>
                                <th className="p-4 font-medium text-gray-500">Token ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paged.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">
                                        {search ? `No registrations matching "${search}"` : 'No registrations found.'}
                                    </td>
                                </tr>
                            ) : (
                                paged.map((reg: any) => (
                                    <tr key={reg.id} className="border-b hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-medium text-gray-900">{reg.user.name}</div>
                                            <div className="text-xs text-gray-500">{reg.user.email}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium text-blue-600">{reg.events?.title || 'Unknown Event'}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${reg.payment_status === 'paid' || reg.payment_status === 'free'
                                                ? 'bg-green-50 text-green-700 border-green-200'
                                                : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                }`}>
                                                {reg.payment_status === 'paid' || reg.payment_status === 'free' ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                                <span className="capitalize">{reg.payment_status}</span>
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-500">
                                            {formatDate(reg.created_at)}
                                            <div className="text-xs text-gray-400">{formatTime(reg.created_at)}</div>
                                        </td>
                                        <td className="p-4 text-gray-500 font-mono text-xs">
                                            <div className="flex items-center gap-2">
                                                <QrCode className="w-3 h-3" />
                                                {reg.qr_token_id?.substring(0, 8)}...
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
                        <p className="text-sm text-gray-500">
                            Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" /> Previous
                            </button>
                            <span className="text-sm text-gray-600 px-2">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                Next <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
