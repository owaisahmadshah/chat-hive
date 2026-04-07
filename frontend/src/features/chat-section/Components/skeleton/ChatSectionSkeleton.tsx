import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { ChatItemSkeleton } from "./ChatItemSkeleton"

export const ChatSectionSkeleton = () => {
  return (
    <section
      className={cn(
        "flex flex-col overflow-hidden bg-background md:min-w-[420px] w-[420px] border-r border-border/40",
        "max-sm:w-full",
        "transition-all duration-300"
      )}
    >
      <div className="h-[15dvh] flex justify-between items-center p-5 bg-background border-r border-border/40">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="h-3.5 w-24" />
        </div>
        <Skeleton className="w-9 h-9 rounded-md" />
      </div>
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <main className="flex flex-col">
          {Array.from({ length: 10 }).map((_, i) => (
            <ChatItemSkeleton key={i} />
          ))}
        </main>
      </ScrollArea>
    </section>
  )
}
