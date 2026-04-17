import { ChevronDown, Copy, Trash2, Check } from "lucide-react"
import { useState } from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface IMessageActionsProps {
  messageText: string
  deleteMessage: () => Promise<unknown>
  isMe: boolean
}

function MessageActions({
  messageText,
  deleteMessage,
  isMe,
}: IMessageActionsProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-6 w-6 rounded-full transition-all duration-200",
            isMe
              ? "text-primary-foreground/50 hover:text-primary-foreground hover:bg-primary-foreground/10"
              : "text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted"
          )}
        >
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={isMe ? "end" : "start"}
        className="rounded-xl shadow-xl border-border/50"
      >
        <DropdownMenuItem
          onClick={handleCopy}
          className="gap-2 cursor-pointer py-2 px-3"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">
            {copied ? "Copied!" : "Copy Message"}
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={deleteMessage}
          className="gap-2 cursor-pointer py-2 px-3 text-destructive focus:text-destructive focus:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4" />
          <span className="text-sm font-medium">Delete Message</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default MessageActions
