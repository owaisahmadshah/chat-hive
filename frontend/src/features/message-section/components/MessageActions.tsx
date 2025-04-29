import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ArrowDown from "../../../components/ArrowDown"
import { Message } from "shared"
import { useMessage } from "../hooks/useMessage"

function MessageActions({ selectedMessage }: { selectedMessage: Message }) {
  const { deleteSelectedMessage } = useMessage()

  const handleSelectedMessageReply = () => {
    // TODO handle selected message reply
  }

  const handleSelectedMessageCopy = () => {
    navigator.clipboard.writeText(selectedMessage.message)
  }

  const handleSelectedMessagePin = () => {
    // TODO handle selected message pin
  }

  const handleSelectedMessageDelete = async () => {
    await deleteSelectedMessage(selectedMessage._id)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span className="opacity-0 hover:opacity-100 cursor-pointer">
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