'use client'

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Download, Search, CheckCircle, XCircle } from "lucide-react"

export function AdminEventClient({ event, registrations }: { event: any, registrations: any[] }) {
    const [search, setSearch] = useState("")

    // Filter
    const filtered = registrations.filter(r =>
        r.user.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.user.email?.toLowerCase().includes(search.toLowerCase()) ||
        r.user.system_id?.toLowerCase().includes(search.toLowerCase())
    )

    // Stats
    const total = registrations.length
    const attended = registrations.filter(r => r.attended).length
    const revenue = registrations.reduce((acc, r) => acc + (r.payment_status === 'paid' ? event.price : 0), 0)

    // Download CSV
    const downloadCSV = (onlyAttended = false) => {
        const dataToExport = onlyAttended ? registrations.filter(r => r.attended) : registrations

        if (dataToExport.length === 0) {
            alert("No data to export")
            return
        }

        // Get custom fields
        const customFields = typeof event.registration_fields === 'string'
            ? JSON.parse(event.registration_fields)
            : (event.registration_fields || [])

        const customHeaders = customFields.map((f: any) => f.label)

        const headers = ["Name", "Email", "System ID", "Year", "Course", "Section", "Payment Status", "Checked In", "Registration Date", ...customHeaders]

        const csvContent = [
            headers.join(","),
            ...dataToExport.map(r => {
                const answers = r.answers || {}
                const customValues = customFields.map((f: any) => {
                    const val = answers[f.id]
                    return `"${val !== undefined && val !== null ? val : ''}"`
                })

                return [
                    `"${r.user.name || ''}"`,
                    `"${r.user.email || ''}"`,
                    `"${r.user.system_id || ''}"`,
                    `"${r.user.year || ''}"`,
                    `"${r.user.course || ''}"`,
                    `"${r.user.section || ''}"`,
                    r.payment_status,
                    r.attended ? "Yes" : "No",
                    new Date(r.created_at).toLocaleString(),
                    ...customValues
                ].join(",")
            })
        ].join("\n")

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const link = document.createElement("a")
        link.href = URL.createObjectURL(blob)
        link.download = `${event.title.replace(/\s+/g, '_')}_${onlyAttended ? 'CHECKED_IN' : 'ALL'}_${new Date().toISOString().split('T')[0]}.csv`
        link.click()
    }

    // Get custom fields for column headers
    const customFields = typeof event.registration_fields === 'string'
        ? JSON.parse(event.registration_fields)
        : (event.registration_fields || [])

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/events" className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">{event.title}</h1>
                        <div className="flex gap-4 text-sm text-gray-500 mt-1">
                            <span>{new Date(event.start_time).toLocaleDateString()}</span>
                            <span>•</span>
                            <span className={event.status === 'live' ? 'text-green-600 font-medium' : 'text-gray-600'}>
                                {event.status.toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => downloadCSV(false)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 text-sm font-medium"
                    >
                        <Download className="w-4 h-4" /> Export All
                    </button>
                    <button
                        onClick={() => downloadCSV(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                    >
                        <CheckCircle className="w-4 h-4" /> Export Checked-In
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">Total Registrations</p>
                    <p className="text-3xl font-bold">{total}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">Checked In (Attended)</p>
                    <p className="text-3xl font-bold text-green-600">{attended}</p>
                    <p className="text-xs text-gray-400 mt-2">{((attended / (total || 1)) * 100).toFixed(1)}% Turnout</p>
                </div>
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">Estimated Revenue</p>
                    <p className="text-3xl font-bold">₹{revenue.toLocaleString()}</p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="p-4 border-b flex items-center gap-2">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or system ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 outline-none text-sm"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 border-b text-gray-500">
                            <tr>
                                <th className="p-4 font-medium sticky left-0 bg-gray-50 z-10">Student</th>
                                <th className="p-4 font-medium">System ID</th>
                                <th className="p-4 font-medium">Class</th>
                                <th className="p-4 font-medium">Payment</th>
                                <th className="p-4 font-medium">Check-In</th>
                                <th className="p-4 font-medium">Date</th>
                                {/* Custom Fields Headers */}
                                {customFields.map((field: any) => (
                                    <th key={field.id} className="p-4 font-medium min-w-[200px]">{field.label}</th>
                                ))}
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7 + customFields.length} className="p-8 text-center text-gray-500">
                                        No registrations found matching "{search}"
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((reg) => (
                                    <tr key={reg.id} className="hover:bg-gray-50 group">
                                        <td className="p-4 sticky left-0 bg-white group-hover:bg-gray-50 z-10 box-border border-r border-transparent group-hover:border-gray-100">
                                            <div className="font-medium text-gray-900">{reg.user.name}</div>
                                            <div className="text-gray-500 text-xs">{reg.user.email}</div>
                                        </td>
                                        <td className="p-4 font-mono text-xs">{reg.user.system_id || '-'}</td>
                                        <td className="p-4">
                                            {reg.user.course} {reg.user.year && `- ${reg.user.year}Yr`} {reg.user.section && `(${reg.user.section})`}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${reg.payment_status === 'paid' ? 'bg-green-100 text-green-700' :
                                                reg.payment_status === 'free' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {reg.payment_status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {reg.attended ? (
                                                <div className="flex items-center gap-1 text-green-600 font-medium">
                                                    <CheckCircle className="w-4 h-4" /> Yes
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1 text-gray-400">
                                                    <XCircle className="w-4 h-4" /> No
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 text-gray-500">{new Date(reg.created_at).toLocaleDateString()}</td>

                                        {/* Custom Answers Cells */}
                                        {customFields.map((field: any) => {
                                            const val = reg.answers?.[field.id]
                                            return (
                                                <td key={field.id} className="p-4 text-gray-600 truncate max-w-[200px]" title={val}>
                                                    {val || '-'}
                                                </td>
                                            )
                                        })}

                                        <td className="p-4 text-right">
                                            <button
                                                onClick={async () => {
                                                    if (confirm("Are you sure you want to cancel this registration?")) {
                                                        const { cancelRegistration } = await import("@/lib/actions/registrations")
                                                        await cancelRegistration(reg.id)
                                                    }
                                                }}
                                                className="text-red-500 hover:text-red-700 text-xs font-medium px-2 py-1 rounded hover:bg-red-50"
                                            >
                                                Cancel
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t text-xs text-gray-400 text-center">
                    Showing {filtered.length} of {registrations.length} registrations
                </div>
            </div>
        </div>
    )
}
