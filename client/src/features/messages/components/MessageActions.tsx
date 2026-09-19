import { useState } from "react";
import { ChevronDown, Copy, Trash2, Check } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface IMessageActionsProps {
  messageText: string;
  deleteMessage: () => Promise<unknown>;
  isMe: boolean;
}

export function MessageActions({
  messageText,
  deleteMessage,
  isMe,
}: IMessageActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!messageText) return;
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-6 w-6 rounded-full transition-all duration-200 cursor-pointer",
            isMe
              ? "text-primary-foreground/50 hover:text-primary-foreground hover:bg-primary-foreground/10"
              : "text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted",
          )}
        >
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={isMe ? "end" : "start"}
        className="w-40 rounded-xl shadow-lg border-border/40 p-1 bg-background/95 backdrop-blur-md"
      >
        {messageText && (
          <>
            <DropdownMenuItem
              onClick={handleCopy}
              className="gap-2.5 cursor-pointer py-2 px-2.5 rounded-lg transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4 text-muted-foreground" />
              )}
              <span className="text-sm font-medium">
                {copied ? "Copied!" : "Copy text"}
              </span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1 bg-border/40" />
          </>
        )}

        <DropdownMenuItem
          onClick={deleteMessage}
          className="gap-2.5 cursor-pointer py-2 px-2.5 rounded-lg text-destructive/90 focus:text-destructive focus:bg-destructive/10 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span className="text-sm font-medium">Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
