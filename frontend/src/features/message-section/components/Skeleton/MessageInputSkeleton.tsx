import { Skeleton } from "@/components/ui/skeleton"

export const MessageInputSkeleton = () => {
  return (
    <div className="shrink-0 bg-background/95 border-t border-border/50 p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
        <Skeleton className="flex-1 h-11 rounded-xl" />
        <Skeleton className="w-24 h-11 rounded-xl shrink-0" />
      </div>
    </div>
  )
}
