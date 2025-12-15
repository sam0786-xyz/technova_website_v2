import { SubmitProjectForm } from "@/components/projects/SubmitProject";

export default function NewProjectPage() {
    return (
        <div className="container py-8">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold mb-2">Submit Your Project</h1>
                <p className="text-muted-foreground">
                    Share what you've built with the community.
                </p>
            </div>
            <SubmitProjectForm />
        </div>
    );
}
