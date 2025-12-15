import { getResources } from "@/lib/actions/resources";
import { ResourceList } from "@/components/resources/ResourceList";
import { UploadResource } from "@/components/resources/UploadResource";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default async function ResourcesPage({ searchParams }: { searchParams: { subject?: string; semester?: string } }) {
    const subject = searchParams.subject;
    const semester = searchParams.semester || 'all';

    const resources = await getResources(semester, subject);

    return (
        <div className="container py-8 max-w-5xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Academic Resources</h1>
                    <p className="text-muted-foreground">
                        Access PYQs, notes, and study materials shared by seniors and peers.
                    </p>
                </div>
                <UploadResource />
            </div>

            <div className="bg-card p-4 rounded-lg border shadow-sm mb-8">
                <form className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-48">
                        <Select name="semester" defaultValue={semester}>
                            <SelectTrigger>
                                <SelectValue placeholder="Semester" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Semesters</SelectItem>
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
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            name="subject"
                            placeholder="Search for subjects..."
                            className="pl-9"
                            defaultValue={subject}
                        />
                    </div>
                    <Button type="submit">Filter</Button>
                </form>
            </div>

            <ResourceList resources={resources} />
        </div>
    );
}
