import { Skeleton } from "@/components/ui/skeleton"

export const MessageNavbarSectionSekeleton = () => {
  return (
    <div className="w-full h-16 min-h-16 flex items-center gap-3 px-4 bg-background/95 backdrop-blur-sm border-b border-border/40">
      <Skeleton className="w-10 h-10 rounded-full shrink-0" />
      <div className="flex flex-col gap-1.5 flex-1">
        <Skeleton className="h-3.5 w-28 rounded-md" />
        <Skeleton className="h-3 w-16 rounded-md" />
      </div>
    </div>
  )
}
