import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Reply, Copy, Pin, Trash2, Check } from "lucide-react"
import { Message } from "shared"
import { useMessage } from "../hooks/useMessage"
import { Button } from "@/components/ui/button"
import { useState } from "react"

function MessageActions({ selectedMessage }: { selectedMessage: Message }) {
  const { deleteSelectedMessage } = useMessage()
  const [copied, setCopied] = useState(false)

  const handleSelectedMessageReply = () => {
    // TODO: handle selected message reply
  }

  const handleSelectedMessageCopy = () => {
    navigator.clipboard.writeText(selectedMessage.message)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSelectedMessagePin = () => {
    // TODO: handle selected message pin
  }

  const handleSelectedMessageDelete = async () => {
    await deleteSelectedMessage(selectedMessage._id)
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
          onClick={handleSelectedMessageReply}
          className="cursor-pointer"
        >
          <Reply className="w-4 h-4 mr-2" />
          Reply
        </DropdownMenuItem>
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
        <DropdownMenuItem
          onClick={handleSelectedMessagePin}
          className="cursor-pointer"
        >
          <Pin className="w-4 h-4 mr-2" />
          Pin
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSelectedMessageDelete}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default MessageActions
