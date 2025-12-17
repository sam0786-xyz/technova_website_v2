"use client"

import { useState } from "react"
import { RegistrationField } from "@/components/admin/form-builder"
import { Loader2, X } from "lucide-react"

interface RegistrationModalProps {
    isOpen: boolean
    onClose: () => void
    fields: RegistrationField[]
    onConfirm: (answers: Record<string, any>) => void
    loading: boolean
}

export function RegistrationModal({ isOpen, onClose, fields, onConfirm, loading }: RegistrationModalProps) {
    const [answers, setAnswers] = useState<Record<string, any>>({})

    if (!isOpen) return null

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onConfirm(answers)
    }

    // Automatically initialize default Checkbox/Select values if needed
    // But controlled inputs usually fine locally.

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-bold text-lg">Complete Registration</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
                        {fields.map((field) => (
                            <div key={field.id} className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    {field.label} {field.required && <span className="text-red-500">*</span>}
                                </label>

                                {field.type === 'text' && (
                                    <input
                                        type="text"
                                        required={field.required}
                                        className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        onChange={(e) => setAnswers({ ...answers, [field.id]: e.target.value })}
                                        placeholder={`Enter ${field.label.toLowerCase()}`}
                                    />
                                )}

                                {field.type === 'number' && (
                                    <input
                                        type="number"
                                        required={field.required}
                                        className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        onChange={(e) => setAnswers({ ...answers, [field.id]: e.target.value })}
                                        placeholder="0"
                                    />
                                )}

                                {field.type === 'select' && (
                                    <select
                                        required={field.required}
                                        className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
                                        onChange={(e) => setAnswers({ ...answers, [field.id]: e.target.value })}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>Select an option</option>
                                        {field.options?.map((opt, i) => (
                                            <option key={i} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                )}

                                {field.type === 'checkbox' && (
                                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                        <input
                                            type="checkbox"
                                            required={field.required}
                                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                            onChange={(e) => setAnswers({ ...answers, [field.id]: e.target.checked })}
                                        />
                                        <span className="text-sm text-gray-700">Yes, I agree / confirm</span>
                                    </label>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Confirm & Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
