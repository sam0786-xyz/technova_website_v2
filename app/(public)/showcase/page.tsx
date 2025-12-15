import { getProjects } from "@/lib/actions/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function ShowcasePage() {
    const projects = await getProjects();

    return (
        <div className="container py-12 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                <div className="text-center md:text-left">
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2">Student Showcase</h1>
                    <p className="text-lg text-muted-foreground">
                        Explore amazing projects built by the Technova community.
                    </p>
                </div>
                <Link href="/showcase/new">
                    <Button size="lg" className="shadow-lg hover:shadow-xl transition-all">
                        <Plus className="mr-2 h-5 w-5" /> Submit Project
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {projects.map((project: any) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>

            {projects.length === 0 && (
                <div className="text-center py-20 bg-muted/30 rounded-lg border border-dashed">
                    <h3 className="text-2xl font-bold mb-2">No projects yet</h3>
                    <p className="text-muted-foreground mb-6">Be the first to showcase your work to the world!</p>
                    <Link href="/showcase/new">
                        <Button>Submit Project</Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
