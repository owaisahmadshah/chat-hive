import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ArrowDown from "./ArrowDown"
import { Message } from "@/types/message-interface"

function MessageActions({ selectedMessage }: { selectedMessage: Message }) {
  const handleSelectedMessageReply = () => {
    // TODO handle selected message delete
  }

  const handleSelectedMessageCopy = () => {
    // TODO handle selected message copy
  }

  const handleSelectedMessagePin = () => {
    // TODO handle selected message pin
  }

  const handleSelectedMessageDelete = () => {
    // TODO handle selected message delete
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span className=" opacity-0 hover:opacity-100 cursor-pointer">
          <ArrowDown />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleSelectedMessageReply}>Reply</DropdownMenuItem>
        <DropdownMenuItem onClick={handleSelectedMessageCopy}>Copy</DropdownMenuItem>
        <DropdownMenuItem onClick={handleSelectedMessagePin}>Pin</DropdownMenuItem>
        <DropdownMenuItem onClick={handleSelectedMessageDelete}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default MessageActions