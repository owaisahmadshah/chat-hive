import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Chat } from "@/types/chat-interface"
import { MouseEvent } from "react"
import { useChat } from "../hooks/useChat"
import { Star, Pin, Trash2, MoreVertical } from "lucide-react"

export default function ChatActions({ chat }: { chat: Chat }) {
  const { deleteAChat } = useChat()

  const handleFavorite = (e: MouseEvent) => {
    e.stopPropagation()
    // TODO
  }

  const handlePin = (e: MouseEvent) => {
    e.stopPropagation()
    // TODO
  }

  const handleDelete = async (e: MouseEvent) => {
    e.stopPropagation()
    await deleteAChat(chat._id)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          className="p-2 rounded-xl hover:bg-accent transition-all duration-200 group cursor-pointer"
        >
          <MoreVertical className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="w-48 rounded-2xl shadow-xl border bg-popover/95 backdrop-blur-md"
      >
        <DropdownMenuItem
          onClick={handleFavorite}
          className="flex items-center cursor-pointer gap-3 py-2.5 text-sm hover:bg-accent rounded-xl transition-all"
        >
          <Star className="w-4 h-4 text-yellow-500" />
          <span>Add to Favorites</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handlePin}
          className="flex items-center gap-3 cursor-pointer py-2.5 text-sm hover:bg-accent rounded-xl transition-all"
        >
          <Pin className="w-4 h-4 text-blue-500" />
          <span>Pin Chat</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleDelete}
          className="flex items-center gap-3 py-2.5 cursor-pointer text-sm text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
