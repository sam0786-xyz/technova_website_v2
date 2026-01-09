import { Skeleton, SkeletonTable, SkeletonProfile } from '@/components/ui/skeleton'

export default function DashboardLoading() {
    return (
        <div className="min-h-screen bg-black p-6 md:p-8 space-y-8">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-80" />
                    <Skeleton className="h-5 w-48" />
                </div>
                <Skeleton className="h-10 w-36 rounded-full" />
            </div>

            {/* Rank Widget Skeleton */}
            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6">
                <div className="flex items-center gap-6">
                    <Skeleton className="h-20 w-20 rounded-2xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-10 w-16" />
                    </div>
                    <div className="ml-auto flex gap-4">
                        <div className="text-center space-y-1">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-8 w-12 mx-auto" />
                        </div>
                        <div className="text-center space-y-1">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-8 w-12 mx-auto" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Leaderboard Skeleton */}
            <SkeletonTable rows={10} />
        </div>
    )
}
