import { Profile } from "@/types/custom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Github, Linkedin, Globe, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface BuddyProfile extends Profile {
    users: {
        name: string | null;
        image: string | null;
        email: string | null;
    }
}

export function BuddyCard({ buddy }: { buddy: BuddyProfile }) {
    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={buddy.users?.image || ""} />
                    <AvatarFallback>{buddy.users?.name?.[0] || "?"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                    <h3 className="text-lg font-semibold truncate">{buddy.users?.name || "Anonymous"}</h3>
                    {buddy.users?.email && (
                        <div className="text-sm text-muted-foreground flex items-center mb-1">
                            <Mail className="w-3 h-3 mr-1" />
                            <span className="truncate">{buddy.users.email}</span>
                        </div>
                    )}
                    <div className="flex gap-2 mt-1">
                        {buddy.github_url && (
                            <Link href={buddy.github_url} target="_blank" className="text-muted-foreground hover:text-primary">
                                <Github className="w-4 h-4" />
                            </Link>
                        )}
                        {buddy.linkedin_url && (
                            <Link href={buddy.linkedin_url} target="_blank" className="text-muted-foreground hover:text-primary">
                                <Linkedin className="w-4 h-4" />
                            </Link>
                        )}
                        {buddy.portfolio_url && (
                            <Link href={buddy.portfolio_url} target="_blank" className="text-muted-foreground hover:text-primary">
                                <Globe className="w-4 h-4" />
                            </Link>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {buddy.bio && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {buddy.bio}
                    </p>
                )}

                <div className="space-y-3">
                    {buddy.skills && buddy.skills.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Skills</p>
                            <div className="flex flex-wrap gap-1">
                                {buddy.skills.map(skill => (
                                    <Badge key={skill} variant="secondary" className="text-xs">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {buddy.interests && buddy.interests.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Interests</p>
                            <div className="flex flex-wrap gap-1">
                                {buddy.interests.map(interest => (
                                    <Badge key={interest} variant="outline" className="text-xs">
                                        {interest}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
