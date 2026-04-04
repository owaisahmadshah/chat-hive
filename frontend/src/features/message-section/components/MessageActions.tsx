import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Copy, Trash2, Check } from "lucide-react"
import { Message } from "shared"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useDeleteMessage } from "../hooks/useDeleteMessage"

function MessageActions({ selectedMessage }: { selectedMessage: Message }) {
  const [copied, setCopied] = useState(false)

  // TODO: Implement message deletion error logic and update UI accordingly in useDeleteMessage hook on onSuccess
  const { mutateAsync: deleteMessage, isPending } = useDeleteMessage()

  const handleSelectedMessageCopy = () => {
    navigator.clipboard.writeText(selectedMessage.message)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSelectedMessageDelete = async (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    e.stopPropagation()
    await deleteMessage({ messageId: selectedMessage._id })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="h-7 w-7 rounded-full shadow-lg hover:bg-primary/10 transition-all cursor-pointer"
        >
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={handleSelectedMessageCopy}
          className="cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSelectedMessageDelete}
          className="cursor-pointer text-destructive focus:text-destructive"
          disabled={isPending}
        >
          {isPending ? (
            <span className="flex items-center">
              <Trash2 className="w-4 h-4 mr-2" />
              Deleting...
            </span>
          ) : (
            <>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default MessageActions
