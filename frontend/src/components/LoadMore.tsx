import { Loader2, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ILoadMoreProps {
  onLoad: () => void
  isPending: boolean
  hasNextPage: boolean
  label?: string
  className?: string
  direction?: "up" | "down"
}

export const LoadMore = ({
  onLoad,
  isPending,
  hasNextPage,
  label = "Load older messages",
  className,
  direction = "up",
}: ILoadMoreProps) => {
  if (!hasNextPage) return null

  return (
    <div className={cn("flex justify-center w-full py-4", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={onLoad}
        disabled={isPending}
        className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors gap-2 bg-muted/30 hover:bg-primary/5 rounded-full px-4"
      >
        {isPending ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <>
            {direction === "up" ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </>
        )}
        {isPending ? "Fetching..." : label}
      </Button>
    </div>
  )
}
