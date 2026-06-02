"use client"

import { useState } from "react"
import { Trash2, Loader2, ArrowRight, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { deleteForm } from "@/lib/actions/forms"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export function FormCardActions({ formId }: { formId: string }) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [open, setOpen] = useState(false)

    async function handleDelete() {
        setIsDeleting(true)
        try {
            await deleteForm(formId)
            toast.success("Form deleted successfully")
            setOpen(false)
        } catch (error: any) {
            toast.error(error.message || "Failed to delete form")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="p-4 bg-black/20 border-t border-white/5 flex gap-2 items-center">
            <Button asChild variant="ghost" className="flex-1 bg-white/5 hover:bg-white/10 hover:text-white transition-all rounded-xl h-10">
                <Link href={`/admin/forms/${formId}/edit`}>
                    <Settings className="mr-2 h-4 w-4" />
                    Builder
                </Link>
            </Button>
            <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] border-0 rounded-xl h-10">
                <Link href={`/admin/forms/${formId}/responses`}>
                    Results
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
            
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl shrink-0 transition-colors">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[400px] border-white/10 bg-[#0A0A0B]/95 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    <DialogHeader>
                        <DialogTitle className="text-xl text-red-500">Delete Form?</DialogTitle>
                        <DialogDescription className="text-gray-400 mt-3">
                            This action cannot be undone. This will permanently delete the form, all its fields, and all collected responses.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-6 gap-3">
                        <Button 
                            type="button"
                            variant="ghost" 
                            onClick={() => setOpen(false)}
                            className="bg-white/5 hover:bg-white/10 border-0 rounded-xl hover:text-white flex-1"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-xl border-0 shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] flex-1"
                        >
                            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
