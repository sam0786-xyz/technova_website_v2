'use client'

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Github, Linkedin, Globe, GraduationCap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface BuddyProfile {
    id: string;
    name: string | null;
    image: string | null;
    role?: string | null;
    course?: string | null;
    year?: number | null;
    skills: string[];
    github_url?: string;
    linkedin_url?: string;
    portfolio_url?: string;
    bio?: string;
    interests?: string[];
}

export function BuddyCard({ buddy }: { buddy: BuddyProfile }) {
    const displayName = buddy.name || "Anonymous";
    const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <Card className="overflow-hidden bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-purple-500/30 transition-all duration-500 hover:-translate-y-1 shadow-[0_8px_32px_rgba(0,0,0,0.3)] group">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Link href={`/user/${buddy.id}`} className="shrink-0">
                    <Avatar className="h-16 w-16 ring-2 ring-purple-500/20 group-hover:ring-purple-500/40 transition-all">
                        <AvatarImage src={buddy.image || ""} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white font-bold">
                            {initials || "?"}
                        </AvatarFallback>
                    </Avatar>
                </Link>
                <div className="flex-1 overflow-hidden min-w-0">
                    <Link href={`/user/${buddy.id}`} className="block group/name">
                        <h3 className="text-lg font-bold truncate text-white group-hover/name:text-purple-400 transition-colors">
                            {displayName}
                        </h3>
                    </Link>
                    {(buddy.course || buddy.year) && (
                        <div className="text-sm text-gray-400 flex items-center gap-1.5 mt-0.5">
                            <GraduationCap className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                            <span className="truncate">
                                {buddy.course}{buddy.year ? ` • Year ${buddy.year}` : ''}
                            </span>
                        </div>
                    )}
                    <div className="flex gap-2 mt-2">
                        {buddy.github_url && (
                            <Link href={buddy.github_url} target="_blank" className="text-gray-500 hover:text-white transition-colors">
                                <Github className="w-4 h-4" />
                            </Link>
                        )}
                        {buddy.linkedin_url && (
                            <Link href={buddy.linkedin_url} target="_blank" className="text-gray-500 hover:text-blue-400 transition-colors">
                                <Linkedin className="w-4 h-4" />
                            </Link>
                        )}
                        {buddy.portfolio_url && (
                            <Link href={buddy.portfolio_url} target="_blank" className="text-gray-500 hover:text-emerald-400 transition-colors">
                                <Globe className="w-4 h-4" />
                            </Link>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-2">
                {buddy.bio && (
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                        {buddy.bio}
                    </p>
                )}

                <div className="space-y-3">
                    {buddy.skills && buddy.skills.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold mb-2 text-gray-500 uppercase tracking-wider">Skills</p>
                            <div className="flex flex-wrap gap-1.5">
                                {buddy.skills.slice(0, 6).map(skill => (
                                    <Badge key={skill} variant="secondary" className="text-xs bg-purple-500/10 text-purple-300 border-purple-500/20 hover:bg-purple-500/20">
                                        {skill}
                                    </Badge>
                                ))}
                                {buddy.skills.length > 6 && (
                                    <Badge variant="secondary" className="text-xs bg-white/5 text-gray-400">
                                        +{buddy.skills.length - 6}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}

                    {buddy.interests && buddy.interests.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold mb-2 text-gray-500 uppercase tracking-wider">Interests</p>
                            <div className="flex flex-wrap gap-1.5">
                                {buddy.interests.slice(0, 4).map(interest => (
                                    <Badge key={interest} variant="outline" className="text-xs border-white/10 text-gray-400">
                                        {interest}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* View Profile Button */}
                <Link href={`/user/${buddy.id}`} className="block mt-4">
                    <Button variant="ghost" className="w-full justify-between text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 group/btn">
                        View Profile
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}
