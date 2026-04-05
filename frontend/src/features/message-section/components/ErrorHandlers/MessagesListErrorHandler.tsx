import { FallbackProps } from "react-error-boundary"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export function MessagesListErrorHandler({
  resetErrorBoundary,
}: FallbackProps) {
  return (
    <div className="min-h-0 h-full flex flex-col items-center justify-center gap-3">
      <p className="text-sm text-muted-foreground">Failed to load messages</p>
      <Button
        variant="ghost"
        size="sm"
        onClick={resetErrorBoundary}
        className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Retry
      </Button>
    </div>
  )
}
