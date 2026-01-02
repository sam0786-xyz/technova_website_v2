'use client'

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { updateProfile } from "@/lib/actions/profile"
import { User, Hash, GraduationCap, Phone, Sparkles, ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"

const COURSES = [
    { value: "CSE", label: "Computer Science & Engineering" },
    { value: "CSE-AIML", label: "CSE (AI & Machine Learning)" },
    { value: "CSE-DS", label: "CSE (Data Science)" },
    { value: "CSE-IOT", label: "CSE (Internet of Things)" },
    { value: "CSE-CS", label: "CSE (Cyber Security)" },
    { value: "CSE-ARVR", label: "CSE (Augmented & VR)" },
    { value: "IT", label: "Information Technology" },
    { value: "ECE", label: "Electronics & Communication" },
    { value: "EE", label: "Electrical Engineering" },
    { value: "ME", label: "Mechanical Engineering" },
    { value: "CE", label: "Civil Engineering" },
    { value: "BCA", label: "Bachelor of Computer Applications" },
    { value: "MCA", label: "Master of Computer Applications" },
    { value: "Other", label: "Other" },
]

const SECTIONS = Array.from({ length: 19 }, (_, i) => String.fromCharCode(65 + i))

const SKILL_SUGGESTIONS = [
    "Python", "JavaScript", "React", "Node.js", "Java", "C++", "Machine Learning",
    "Data Science", "AWS", "Docker", "UI/UX Design", "Figma", "Flutter", "Android"
]

interface ProfileEditFormProps {
    initialData: {
        system_id?: string
        year?: number
        course?: string
        section?: string
        mobile?: string
        skills?: string[]
    } | null
}

export function ProfileEditForm({ initialData }: ProfileEditFormProps) {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    // Controlled form state
    const [systemId, setSystemId] = useState(initialData?.system_id || '')
    const [year, setYear] = useState(initialData?.year?.toString() || '')
    const [course, setCourse] = useState(initialData?.course || '')
    const [section, setSection] = useState(initialData?.section || '')
    const [mobile, setMobile] = useState(initialData?.mobile || '')
    const [skills, setSkills] = useState<string[]>(initialData?.skills || [])
    const [skillInput, setSkillInput] = useState("")
    const [systemIdError, setSystemIdError] = useState("")

    const router = useRouter()

    function addSkill(skill: string) {
        const trimmed = skill.trim()
        if (trimmed && !skills.includes(trimmed) && skills.length < 10) {
            setSkills([...skills, trimmed])
            setSkillInput("")
        }
    }

    function removeSkill(skill: string) {
        setSkills(skills.filter(s => s !== skill))
    }

    function validateSystemId(value: string): boolean {
        if (value.length !== 10) {
            setSystemIdError("System ID must be exactly 10 digits")
            return false
        }
        if (!/^\d{10}$/.test(value)) {
            setSystemIdError("System ID must contain only digits")
            return false
        }
        setSystemIdError("")
        return true
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError("")
        setSuccess(false)

        if (systemId && !validateSystemId(systemId)) {
            return
        }

        const formData = new FormData()
        formData.set("system_id", systemId)
        formData.set("year", year)
        formData.set("course", course)
        formData.set("section", section)
        formData.set("mobile", mobile)
        formData.set("skills", skills.join(", "))

        startTransition(async () => {
            try {
                const result = await updateProfile(formData)
                if (result?.error) {
                    setError(result.error)
                } else {
                    setSuccess(true)
                    router.refresh()
                    setTimeout(() => setSuccess(false), 3000)
                }
            } catch {
                setError("Failed to save changes")
            }
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* System ID */}
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <Hash className="w-4 h-4 text-blue-500" />
                    System ID
                </label>
                <input
                    value={systemId}
                    onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '')
                        setSystemId(value)
                        if (value.length === 10) {
                            validateSystemId(value)
                        } else if (value.length > 0) {
                            setSystemIdError(`${10 - value.length} more digits needed`)
                        } else {
                            setSystemIdError("")
                        }
                    }}
                    maxLength={10}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-mono tracking-wider"
                    placeholder="e.g. 2023001234"
                />
                {systemIdError && (
                    <p className="text-xs text-red-400">{systemIdError}</p>
                )}
                <p className="text-xs text-gray-500">Must be exactly 10 digits (found on your ID card)</p>
            </div>

            {/* Year & Course */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                        <GraduationCap className="w-4 h-4 text-blue-500" />
                        Year
                    </label>
                    <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer"
                    >
                        <option value="" className="bg-zinc-900">Select Year</option>
                        <option value="1" className="bg-zinc-900">1st Year</option>
                        <option value="2" className="bg-zinc-900">2nd Year</option>
                        <option value="3" className="bg-zinc-900">3rd Year</option>
                        <option value="4" className="bg-zinc-900">4th Year</option>
                        <option value="5" className="bg-zinc-900">5th Year (Integrated)</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                        <GraduationCap className="w-4 h-4 text-purple-500" />
                        Course
                    </label>
                    <select
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer"
                    >
                        <option value="" className="bg-zinc-900">Select Course</option>
                        {COURSES.map(c => (
                            <option key={c.value} value={c.value} className="bg-zinc-900">
                                {c.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Section & Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                        <User className="w-4 h-4 text-blue-500" />
                        Section
                    </label>
                    <select
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer"
                    >
                        <option value="" className="bg-zinc-900">Select Section</option>
                        {SECTIONS.map(char => (
                            <option key={char} value={char} className="bg-zinc-900">{char}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                        <Phone className="w-4 h-4 text-green-500" />
                        Mobile Number
                    </label>
                    <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                        placeholder="+91 9876543210"
                    />
                </div>
            </div>

            {/* Skills */}
            <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    Skills & Interests
                </label>

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault()
                                addSkill(skillInput)
                            }
                        }}
                        placeholder="Type a skill and press Enter"
                        className="flex-1 bg-black/50 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                    />
                    <button
                        type="button"
                        onClick={() => addSkill(skillInput)}
                        className="px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400 hover:bg-blue-600/30 transition-colors"
                    >
                        Add
                    </button>
                </div>

                {skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {skills.map(skill => (
                            <span
                                key={skill}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 border border-blue-500/30 rounded-full text-sm text-blue-300"
                            >
                                {skill}
                                <button
                                    type="button"
                                    onClick={() => removeSkill(skill)}
                                    className="w-4 h-4 rounded-full bg-blue-500/30 hover:bg-red-500/50 flex items-center justify-center text-xs transition-colors"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                )}

                <div className="flex flex-wrap gap-2">
                    {SKILL_SUGGESTIONS.filter(s => !skills.includes(s)).slice(0, 6).map(skill => (
                        <button
                            key={skill}
                            type="button"
                            onClick={() => addSkill(skill)}
                            className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400 hover:bg-white/10 hover:text-white transition-all"
                        >
                            + {skill}
                        </button>
                    ))}
                </div>
                <p className="text-xs text-gray-500">These help you find teammates in Buddy Finder</p>
            </div>

            {/* Error/Success Messages */}
            {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    {error}
                </div>
            )}
            {success && (
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
                    Profile updated successfully!
                </div>
            )}

            {/* Actions */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <Link
                    href="/profile"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Profile
                </Link>

                <button
                    type="submit"
                    disabled={isPending || !!systemIdError}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Save Changes
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}
