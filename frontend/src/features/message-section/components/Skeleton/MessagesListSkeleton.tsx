// MessagesListSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@radix-ui/react-scroll-area"

const bubbles = [
  { side: "right", width: "w-48" },
  { side: "left", width: "w-36" },
  { side: "left", width: "w-56" },
  { side: "right", width: "w-32" },
  { side: "right", width: "w-64" },
  { side: "left", width: "w-44" },
  { side: "right", width: "w-40" },
  { side: "left", width: "w-52" },
] as const

export const MessagesListSkeleton = () => {
  return (
    <ScrollArea className="min-h-0 h-full bg-gradient-to-b from-background to-muted/5 md:px-6">
      <ul className="flex flex-col gap-2 p-4">
        {bubbles.map((bubble, i) => (
          <li
            key={i}
            className={cn(
              "w-fit",
              bubble.side === "right" ? "self-end ml-auto" : "self-start"
            )}
          >
            <Skeleton
              className={cn("h-9 rounded-2xl", bubble.width)}
              style={{ animationDelay: `${i * 80}ms` }}
            />
          </li>
        ))}
      </ul>
    </ScrollArea>
  )
}
