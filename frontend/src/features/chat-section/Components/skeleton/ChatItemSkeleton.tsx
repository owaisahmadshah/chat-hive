import { Skeleton } from "@/components/ui/skeleton"

export const ChatItemSkeleton = () => {
  return (
    <div className="px-4 py-3 border-l-2 border-l-transparent">
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-full shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3 w-10" />
          </div>
          <Skeleton className="h-3 w-4/5" />
        </div>
      </div>
    </div>
  )
}
