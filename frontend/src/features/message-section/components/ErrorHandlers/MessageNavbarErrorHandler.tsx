import { RefreshCw } from "lucide-react"
import { FallbackProps } from "react-error-boundary"

import { Button } from "@/components/ui/button"

export function MessageNavbarErrorHandler({
  resetErrorBoundary,
}: FallbackProps) {
  return (
    <div className="w-full h-16 min-h-16 flex items-center justify-between px-4 bg-background/95 backdrop-blur-sm border-b border-border/40">
      <p className="text-sm text-muted-foreground">Failed to load user</p>
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
