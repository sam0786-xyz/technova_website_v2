"use client"

import { useState } from "react"
import { Plus, Trash2, GripVertical, X } from "lucide-react"

export type QuestionType = 'text' | 'number' | 'select' | 'checkbox'

export interface RegistrationField {
    id: string
    type: QuestionType
    label: string
    required: boolean
    options?: string[] // For select type
}

interface FormBuilderProps {
    fields: RegistrationField[]
    onChange: (fields: RegistrationField[]) => void
}

export function FormBuilder({ fields, onChange }: FormBuilderProps) {
    const addField = (type: QuestionType) => {
        const newField: RegistrationField = {
            id: crypto.randomUUID(),
            type,
            label: "",
            required: true,
            options: type === 'select' ? ["Option 1"] : undefined
        }
        onChange([...fields, newField])
    }

    const updateField = (id: string, updates: Partial<RegistrationField>) => {
        onChange(fields.map(f => f.id === id ? { ...f, ...updates } : f))
    }

    const removeField = (id: string) => {
        onChange(fields.filter(f => f.id !== id))
    }

    const addOption = (fieldId: string) => {
        const field = fields.find(f => f.id === fieldId)
        if (field && field.options) {
            updateField(fieldId, { options: [...field.options, `Option ${field.options.length + 1}`] })
        }
    }

    const updateOption = (fieldId: string, index: number, value: string) => {
        const field = fields.find(f => f.id === fieldId)
        if (field && field.options) {
            const newOptions = [...field.options]
            newOptions[index] = value
            updateField(fieldId, { options: newOptions })
        }
    }

    const removeOption = (fieldId: string, index: number) => {
        const field = fields.find(f => f.id === fieldId)
        if (field && field.options && field.options.length > 1) {
            const newOptions = field.options.filter((_, i) => i !== index)
            updateField(fieldId, { options: newOptions })
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
                <button type="button" onClick={() => addField('text')} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm flex items-center gap-1">+ Text</button>
                <button type="button" onClick={() => addField('number')} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm flex items-center gap-1">+ Number</button>
                <button type="button" onClick={() => addField('select')} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm flex items-center gap-1">+ Dropdown</button>
                <button type="button" onClick={() => addField('checkbox')} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm flex items-center gap-1">+ Checkbox</button>
            </div>

            {fields.length === 0 && (
                <div className="text-center p-6 border-2 border-dashed rounded-xl text-gray-400">
                    No custom questions yet. Add one above.
                </div>
            )}

            <div className="space-y-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="bg-gray-50 p-4 rounded-xl border relative group">
                        <button
                            type="button"
                            onClick={() => removeField(field.id)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="grid gap-4">
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Question Label</label>
                                    <input
                                        type="text"
                                        value={field.label}
                                        onChange={(e) => updateField(field.id, { label: e.target.value })}
                                        placeholder="e.g. T-Shirt Size"
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                                <div className="w-32">
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Type</label>
                                    <div className="p-2 bg-white border rounded-md capitalize text-gray-700 text-sm">
                                        {field.type}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={field.required}
                                        onChange={(e) => updateField(field.id, { required: e.target.checked })}
                                        className="rounded border-gray-300"
                                    />
                                    Required
                                </label>
                            </div>

                            {field.type === 'select' && (
                                <div className="bg-white p-3 rounded-md border">
                                    <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Options</label>
                                    <div className="space-y-2">
                                        {field.options?.map((option, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={option}
                                                    onChange={(e) => updateOption(field.id, idx, e.target.value)}
                                                    className="flex-1 p-1 border rounded text-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeOption(field.id, idx)}
                                                    className="text-gray-400 hover:text-red-500"
                                                    disabled={field.options!.length <= 1}
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => addOption(field.id)}
                                            className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1"
                                        >
                                            <Plus className="w-3 h-3" /> Add Option
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
