import { addSponsorship, getSponsorships, deleteSponsorship } from "@/lib/actions/sponsorships";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function SettingsPage() {
    // Fetch existing sponsorships
    const sponsorships = await getSponsorships();
    const totalSponsorship = sponsorships.reduce((sum, s) => sum + s.amount, 0);

    return (
        <div className="space-y-8 max-w-4xl">
            <h1 className="text-3xl font-bold">Admin Settings</h1>

            {/* Sponsorship Management Section */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Sponsorship & Funding</h2>
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                        <p className="text-sm text-green-600 font-medium">Total Sponsorships</p>
                        <p className="text-2xl font-bold text-green-700">₹{totalSponsorship.toLocaleString()}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-base font-medium">Add New Sponsorship</h3>
                    <form action={addSponsorship} className="flex gap-4 items-end bg-gray-50 p-4 rounded-lg">
                        <div className="flex-1">
                            <label className="block text-xs font-medium mb-1 text-gray-500">Source / Company</label>
                            <input name="source" required type="text" className="w-full p-2 border rounded-md text-sm" placeholder="e.g. OpenAI" />
                        </div>
                        <div className="w-32">
                            <label className="block text-xs font-medium mb-1 text-gray-500">Amount (₹)</label>
                            <input name="amount" required type="number" className="w-full p-2 border rounded-md text-sm" placeholder="10000" />
                        </div>
                        <div className="w-40">
                            <label className="block text-xs font-medium mb-1 text-gray-500">Date</label>
                            <input name="date" type="date" className="w-full p-2 border rounded-md text-sm" />
                        </div>
                        <Button size="sm" type="submit" className="mb-[1px]">Add Funds</Button>
                    </form>
                </div>

                <div className="mt-8">
                    <h3 className="text-base font-medium mb-3">Recent Sponsorships</h3>
                    <div className="border rounded-lg overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Source</th>
                                    <th className="px-4 py-3 font-medium">Date</th>
                                    <th className="px-4 py-3 font-medium">Amount</th>
                                    <th className="px-4 py-3 font-medium text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {sponsorships.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-8 text-center text-gray-400">No records found</td>
                                    </tr>
                                ) : (
                                    sponsorships.map((s) => (
                                        <tr key={s.id} className="bg-white">
                                            <td className="px-4 py-3 font-medium">{s.source}</td>
                                            <td className="px-4 py-3 text-gray-500">{new Date(s.received_at).toLocaleDateString()}</td>
                                            <td className="px-4 py-3 text-green-600 font-medium">+₹{s.amount.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-right">
                                                <form action={async () => {
                                                    "use server";
                                                    await deleteSponsorship(s.id);
                                                }}>
                                                    <button className="text-red-400 hover:text-red-600 transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </form>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
