"use client"

import { useState } from "react"
import { RegistrationField } from "@/components/admin/form-builder"
import { Loader2, X, AlertCircle, Mail, Phone } from "lucide-react"

interface RegistrationModalProps {
    isOpen: boolean
    onClose: () => void
    fields: RegistrationField[]
    onConfirm: (answers: Record<string, unknown>) => void
    loading: boolean
}

const inputClassName = "w-full rounded-lg border bg-white p-2.5 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100"

export function RegistrationModal({ isOpen, onClose, fields, onConfirm, loading }: RegistrationModalProps) {
    const [answers, setAnswers] = useState<Record<string, unknown>>({})
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [otherSelections, setOtherSelections] = useState<Record<string, boolean>>({})

    if (!isOpen) return null

    const isEmpty = (value: unknown) =>
        value === undefined || value === null || value === "" || value === false || (Array.isArray(value) && value.length === 0)

    const validateField = (field: RegistrationField, value: unknown): string | null => {
        if (field.type === "section") return null
        if (field.required && isEmpty(value)) return "This field is required"
        if (isEmpty(value)) return null

        const textValue = String(value)
        if (field.validation) {
            switch (field.validation.rule) {
                case "email":
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(textValue)) return "Please enter a valid email address"
                    break
                case "phone":
                    if (!/^\d{10}$/.test(textValue)) return "Please enter a valid 10-digit phone number"
                    break
                case "min_length":
                    if (textValue.length < (field.validation.value || 0)) return `Minimum ${field.validation.value} characters required`
                    break
                case "max_length":
                    if (textValue.length > (field.validation.value || Number.MAX_SAFE_INTEGER)) return `Maximum ${field.validation.value} characters allowed`
                    break
                case "min_digits":
                    if (textValue.replace(/[^0-9]/g, "").length < (field.validation.value || 0)) return `Must have at least ${field.validation.value} digits`
                    break
                case "max_digits":
                    if (textValue.replace(/[^0-9]/g, "").length > (field.validation.value || Number.MAX_SAFE_INTEGER)) return `Must have at most ${field.validation.value} digits`
                    break
                case "exact_digits":
                    if (textValue.replace(/[^0-9]/g, "").length !== field.validation.value) return `Must have exactly ${field.validation.value} digits`
                    break
            }
        }

        if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(textValue)) return "Please enter a valid email address"
        if (field.type === "phone" && !/^\d{10}$/.test(textValue)) return "Please enter a valid 10-digit phone number"
        if (field.minLength && textValue.length < field.minLength) return `Minimum ${field.minLength} characters required`
        if (field.maxLength && textValue.length > field.maxLength) return `Maximum ${field.maxLength} characters allowed`
        if (field.type === "number") {
            const numericValue = Number(value)
            if (field.minValue !== undefined && numericValue < field.minValue) return `Enter a value of at least ${field.minValue}`
            if (field.maxValue !== undefined && numericValue > field.maxValue) return `Enter a value of at most ${field.maxValue}`
        }
        return null
    }

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        const newErrors: Record<string, string> = {}
        fields.forEach((field) => {
            const error = validateField(field, answers[field.id])
            if (error) newErrors[field.id] = error
        })
        if (Object.keys(newErrors).length) {
            setErrors(newErrors)
            return
        }
        onConfirm(answers)
    }

    const handleChange = (fieldId: string, value: unknown) => {
        setAnswers((current) => ({ ...current, [fieldId]: value }))
        setErrors((current) => ({ ...current, [fieldId]: "" }))
    }

    const toggleCheckboxOption = (fieldId: string, option: string, checked: boolean) => {
        const selected = Array.isArray(answers[fieldId]) ? answers[fieldId] as string[] : []
        handleChange(fieldId, checked ? [...selected, option] : selected.filter((item) => item !== option))
    }

    const getInputType = (field: RegistrationField) => field.type === "phone" ? "tel" : field.type

    const getHint = (field: RegistrationField) => {
        if (!field.validation) return null
        const value = field.validation.value
        if (field.validation.rule === "min_length") return `At least ${value} characters`
        if (field.validation.rule === "max_length") return `Up to ${value} characters`
        if (field.validation.rule === "min_digits") return `At least ${value} digits`
        if (field.validation.rule === "max_digits") return `Up to ${value} digits`
        if (field.validation.rule === "exact_digits") return `Exactly ${value} digits`
        return null
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div role="dialog" aria-modal="true" aria-labelledby="registration-title" className="w-full max-w-md overflow-hidden rounded-2xl bg-white text-slate-900 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between border-b border-slate-200 p-5">
                    <div>
                        <h3 id="registration-title" className="text-lg font-bold text-slate-950">Complete registration</h3>
                        <p className="mt-0.5 text-sm text-slate-500">Please fill in the details below.</p>
                    </div>
                    <button type="button" onClick={onClose} disabled={loading} aria-label="Close registration form" className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="max-h-[60vh] space-y-5 overflow-y-auto px-1">
                        {fields.map((field) => {
                            if (field.type === "section") {
                                return <div key={field.id} className="border-t border-slate-200 pt-5 first:border-t-0 first:pt-0"><h4 className="font-semibold text-slate-950">{field.label}</h4>{field.description && <p className="mt-1 text-sm text-slate-500">{field.description}</p>}</div>
                            }
                            const fieldId = `registration-${field.id}`
                            const hasOptions = (field.options || []).filter(Boolean).length > 0
                            return (
                                <div key={field.id} className="space-y-2">
                                    <label htmlFor={fieldId} className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                                        {field.type === "email" && <Mail className="h-4 w-4 text-cyan-600" />}
                                        {field.type === "phone" && <Phone className="h-4 w-4 text-orange-500" />}
                                        {field.label} {field.required && <span className="text-red-600">*</span>}
                                    </label>
                                    {field.description && <p className="text-sm text-slate-500">{field.description}</p>}

                                    {field.type === "textarea" && <textarea id={fieldId} required={field.required} value={String(answers[field.id] || "")} onChange={(event) => handleChange(field.id, event.target.value)} minLength={field.minLength} maxLength={field.maxLength} placeholder={`Enter ${field.label.toLowerCase()}`} className={`${inputClassName} min-h-28 resize-y ${errors[field.id] ? "border-red-500 bg-red-50" : "border-slate-300"}`} />}
                                    {["text", "email", "phone", "url"].includes(field.type) && <input id={fieldId} type={getInputType(field)} required={field.required} value={String(answers[field.id] || "")} onChange={(event) => handleChange(field.id, event.target.value)} minLength={field.minLength} maxLength={field.type === "phone" ? 10 : field.maxLength} placeholder={field.type === "email" ? "email@example.com" : field.type === "phone" ? "10-digit phone number" : field.type === "url" ? "https://example.com" : `Enter ${field.label.toLowerCase()}`} className={`${inputClassName} ${errors[field.id] ? "border-red-500 bg-red-50" : "border-slate-300"}`} />}
                                    {field.type === "number" && <input id={fieldId} type="number" required={field.required} value={String(answers[field.id] || "")} onChange={(event) => handleChange(field.id, event.target.value)} min={field.minValue} max={field.maxValue} placeholder="Enter a number" className={`${inputClassName} ${errors[field.id] ? "border-red-500 bg-red-50" : "border-slate-300"}`} />}
                                    {field.type === "select" && <>
                                        <select id={fieldId} required={field.required} value={otherSelections[field.id] ? "__other__" : String(answers[field.id] || "")} onChange={(event) => { const isOther = event.target.value === "__other__"; setOtherSelections((current) => ({ ...current, [field.id]: isOther })); handleChange(field.id, isOther ? "" : event.target.value) }} className={`${inputClassName} ${errors[field.id] ? "border-red-500 bg-red-50" : "border-slate-300"}`}>
                                            <option value="" disabled>Select an option</option>
                                            {hasOptions ? field.options?.filter(Boolean).map((option) => <option key={option} value={option}>{option}</option>) : <option value="" disabled>No options were configured</option>}
                                            {field.allowOther && <option value="__other__">Other (please specify)</option>}
                                        </select>
                                        {otherSelections[field.id] && <input id={`${fieldId}-other`} required value={String(answers[field.id] || "")} onChange={(event) => handleChange(field.id, event.target.value)} placeholder="Enter your option" className={`${inputClassName} ${errors[field.id] ? "border-red-500 bg-red-50" : "border-slate-300"}`} />}
                                    </>}
                                    {field.type === "checkbox" && (hasOptions ? <div className="space-y-2 rounded-lg border border-slate-200 p-3">
                                        {field.options?.filter(Boolean).map((option) => <label key={option} className="flex cursor-pointer items-center gap-3 rounded-md px-1 py-1.5 text-sm text-slate-700 hover:bg-slate-50"><input type="checkbox" checked={Array.isArray(answers[field.id]) && (answers[field.id] as string[]).includes(option)} onChange={(event) => toggleCheckboxOption(field.id, option, event.target.checked)} className="h-4 w-4 rounded border-slate-300 accent-blue-600" />{option}</label>)}
                                    </div> : <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-300 p-3 text-sm text-slate-700 hover:bg-slate-50"><input id={fieldId} type="checkbox" checked={Boolean(answers[field.id])} onChange={(event) => handleChange(field.id, event.target.checked)} className="h-4 w-4 rounded border-slate-300 accent-blue-600" />Yes, I agree / confirm</label>)}

                                    {errors[field.id] && <p className="mt-1 flex items-center gap-1 text-xs text-red-600"><AlertCircle className="h-3 w-3" />{errors[field.id]}</p>}
                                    {!errors[field.id] && getHint(field) && <p className="text-xs text-slate-500">{getHint(field)}</p>}
                                </div>
                            )
                        })}
                    </div>
                    <button type="submit" disabled={loading} className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 py-3 font-bold text-white transition-colors hover:bg-slate-800 disabled:opacity-50">
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        Confirm & Register
                    </button>
                </form>
            </div>
        </div>
    )
}
