import { Navbar } from "@/components/layout/navbar"
import { auth } from "@/lib/auth"

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar user={session?.user} />
            <main className="flex-1">
                {children}
            </main>
        </div>
    )
}
