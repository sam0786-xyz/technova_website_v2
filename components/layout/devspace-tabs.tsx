"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Users, Search, Code, BookOpen } from "lucide-react";

const tabs = [
    {
        name: "Community",
        href: "/community",
        icon: Users
    },
    {
        name: "Buddy Finder",
        href: "/buddy-finder",
        icon: Search
    },
    {
        name: "Showcase",
        href: "/showcase",
        icon: Code
    },
    {
        name: "Resources",
        href: "/resources",
        icon: BookOpen
    }
];

export function DevSpaceTabs() {
    const pathname = usePathname();

    // Only show tabs if we are on a DevSpace page
    const isDevSpacePage = tabs.some(tab => pathname.startsWith(tab.href));

    if (!isDevSpacePage) return null;

    return (
        <div className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-16 z-40">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-1 md:gap-8 overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => {
                        const isActive = pathname.startsWith(tab.href);
                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap",
                                    isActive
                                        ? "border-blue-500 text-blue-400"
                                        : "border-transparent text-gray-400 hover:text-white hover:border-white/20"
                                )}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.name}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
