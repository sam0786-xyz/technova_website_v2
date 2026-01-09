"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createResource } from "@/lib/actions/resources";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Uploading..." : "Upload Resource"}
        </Button>
    );
}

export function UploadResource() {
    const [open, setOpen] = useState(false);
    const [state, formAction] = useActionState(createResource, null);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Upload Resource
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Upload Resource</DialogTitle>
                    <DialogDescription>
                        Share academic resources with the community.
                    </DialogDescription>
                </DialogHeader>

                <form action={async (formData) => {
                    await formAction(formData);
                    // We can't easily check success here with formState only in render, 
                    // but we can close if no error or optimistically.
                    // For now, user will see alert if error, or list update if success.
                    // setOpen(false); // Only close on success would require useEffect on state
                }} className="space-y-4 py-4">

                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" placeholder="e.g. Data Structures Notes" required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                            <Select name="type" defaultValue="Notes">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Notes">Notes</SelectItem>
                                    <SelectItem value="PYQ">PYQ</SelectItem>
                                    <SelectItem value="Book">Book</SelectItem>
                                    <SelectItem value="Assignment">Assignment</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="semester">Semester</Label>
                            <Select name="semester">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Sem 1">Sem 1</SelectItem>
                                    <SelectItem value="Sem 2">Sem 2</SelectItem>
                                    <SelectItem value="Sem 3">Sem 3</SelectItem>
                                    <SelectItem value="Sem 4">Sem 4</SelectItem>
                                    <SelectItem value="Sem 5">Sem 5</SelectItem>
                                    <SelectItem value="Sem 6">Sem 6</SelectItem>
                                    <SelectItem value="Sem 7">Sem 7</SelectItem>
                                    <SelectItem value="Sem 8">Sem 8</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" name="subject" placeholder="e.g. Operating Systems" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="file_url">File URL (Drive/Dropbox/etc)</Label>
                        <Input id="file_url" name="file_url" placeholder="https://..." required type="url" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea id="description" name="description" placeholder="Additional details..." />
                    </div>

                    {state?.error && (
                        <Alert variant="destructive">
                            <AlertDescription>{state.error}</AlertDescription>
                        </Alert>
                    )}

                    {state?.success && (
                        <Alert className="text-green-600 border-green-200 bg-green-50">
                            <AlertDescription>Uploaded successfully! Pending approval.</AlertDescription>
                        </Alert>
                    )}

                    <SubmitButton />
                </form>
            </DialogContent>
        </Dialog>
    );
}
