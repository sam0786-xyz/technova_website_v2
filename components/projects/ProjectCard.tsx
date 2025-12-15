import { Project } from "@/types/custom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, Globe, ExternalLink, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ProjectCard({ project }: { project: Project }) {
    return (
        <Card className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-transform hover:-translate-y-1 duration-200">
            {project.image_url ? (
                <div className="relative h-48 w-full">
                    <Image
                        src={project.image_url}
                        alt={project.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
            ) : (
                <div className="h-48 w-full bg-muted flex items-center justify-center text-muted-foreground">
                    No Image
                </div>
            )}

            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl line-clamp-1">{project.title}</CardTitle>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                    <Avatar className="h-5 w-5">
                        <AvatarImage src={project.users?.image || ""} />
                        <AvatarFallback>{project.users?.name?.[0] || "?"}</AvatarFallback>
                    </Avatar>
                    <span>{project.users?.name || "Student"}</span>
                </div>
            </CardHeader>

            <CardContent className="flex-1">
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                    {project.description}
                </p>
                <div className="flex flex-wrap gap-1">
                    {project.tech_stack?.map(tech => (
                        <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                        </Badge>
                    ))}
                </div>
            </CardContent>

            <CardFooter className="pt-2 gap-2 border-t mt-auto">
                {project.project_url && (
                    <Button variant="ghost" size="sm" asChild className="p-0 h-8 px-2">
                        <Link href={project.project_url} target="_blank">
                            <Globe className="w-4 h-4 mr-1" /> Demo
                        </Link>
                    </Button>
                )}
                {project.repo_url && (
                    <Button variant="ghost" size="sm" asChild className="p-0 h-8 px-2">
                        <Link href={project.repo_url} target="_blank">
                            <Github className="w-4 h-4 mr-1" /> Code
                        </Link>
                    </Button>
                )}
                {project.video_url && (
                    <Button variant="ghost" size="sm" asChild className="p-0 h-8 px-2">
                        <Link href={project.video_url} target="_blank">
                            <Video className="w-4 h-4 mr-1" /> Video
                        </Link>
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
