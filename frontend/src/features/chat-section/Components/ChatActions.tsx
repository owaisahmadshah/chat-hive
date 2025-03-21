import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Chat } from "@/types/chat-interface"
import ArrowDown from "../../../components/ArrowDown"
import { MouseEvent } from "react"
import { useChat } from "../hooks/useChat"

const ChatActions = ({ chat }: { chat: Chat }) => {
  const { deleteAChat } = useChat()

  const handleSelectedChatAddFavorite = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    // TODO
  }
  const handleSelectedChatPin = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    // TODO
  }
  const handleSelectedChatDelete = async (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    await deleteAChat(chat._id)
  }
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <span className=" opacity-0 hover:opacity-100 cursor-pointer">
            <ArrowDown />
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent >
          <DropdownMenuItem onClick={handleSelectedChatAddFavorite} className="cursor-pointer">Reply</DropdownMenuItem>
          <DropdownMenuItem onClick={handleSelectedChatPin} className="cursor-pointer">Pin</DropdownMenuItem>
          <DropdownMenuItem onClick={handleSelectedChatDelete} className="cursor-pointer">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default ChatActions
