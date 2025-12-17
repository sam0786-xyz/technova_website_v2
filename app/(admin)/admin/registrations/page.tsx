import { getAllRegistrations } from "@/lib/actions/registrations"
import { Check, Clock, QrCode } from "lucide-react"

export default async function AdminRegistrationsPage() {
    const registrations = await getAllRegistrations()

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">All Registrations</h1>

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
                            {registrations.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">
                                        No registrations found.
                                    </td>
                                </tr>
                            ) : (
                                registrations.map((reg: any) => (
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
                                            {new Date(reg.created_at).toLocaleDateString()}
                                            <div className="text-xs text-gray-400">{new Date(reg.created_at).toLocaleTimeString()}</div>
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
            </div>
        </div>
    )
}
