"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    const pathname = usePathname();

    const routes = [
        {
            href: "/community",
            label: "Community",
            active: pathname.startsWith("/community"),
        },
        {
            href: "/buddy-finder",
            label: "Buddy Finder",
            active: pathname.startsWith("/buddy-finder"),
        },
        {
            href: "/showcase",
            label: "Project Showcase",
            active: pathname.startsWith("/showcase"),
        },
        {
            href: "/resources",
            label: "Resources",
            active: pathname.startsWith("/resources"),
        },
    ];

    return (
        <nav
            className={cn("flex items-center space-x-4 lg:space-x-6", className)}
            {...props}
        >
            {routes.map((route) => (
                <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        route.active
                            ? "text-white"
                            : "text-muted-foreground"
                    )}
                >
                    {route.label}
                </Link>
            ))}
        </nav>
    );
}
