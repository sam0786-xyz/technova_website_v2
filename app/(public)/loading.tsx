import { Skeleton, SkeletonEventCard, SkeletonStats } from '@/components/ui/skeleton'

export default function PublicLoading() {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero Skeleton */}
            <section className="relative py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto space-y-6">
                        <Skeleton className="h-8 w-48 mx-auto rounded-full" />
                        <Skeleton className="h-14 w-2/3 mx-auto" />
                        <Skeleton className="h-6 w-1/2 mx-auto" />
                    </div>
                </div>
            </section>

            {/* Content Skeleton */}
            <section className="container mx-auto px-4 pb-24">
                <div className="flex items-center gap-3 mb-8">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <Skeleton className="h-8 w-48" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <SkeletonEventCard key={i} />
                    ))}
                </div>
            </section>
        </div>
    )
}
