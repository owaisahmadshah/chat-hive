import { MessageCircleMore, Loader2, ArrowRight } from "lucide-react"
import { useSelector } from "react-redux"
import { useSearchParams } from "react-router-dom"

import { RootState } from "@/store/store"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ChatUser } from "shared"

import { useCreateChat } from "../hooks/useCreateChat"
import { useChatReadQueries } from "../utils/chat-read-queries"

const CreateChatUserItem = ({
  user,
  onClose,
}: {
  user: ChatUser
  onClose: () => void
}) => {
  const uid = useSelector((state: RootState) => state.user.userId)
  const { hasChatByUserId } = useChatReadQueries()
  const { mutateAsync, isPending: isCreating } = useCreateChat()
  const [, setSearchParams] = useSearchParams()

  const isYou = user._id === uid
  const { exists: chatExists, chat } = hasChatByUserId({ userId: user._id })

  const handleAction = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isYou) return

    if (chatExists && chat) {
      setSearchParams({ chatId: chat._id, userId: user._id })
      onClose()
    } else {
      await mutateAsync({ user: user._id })
      onClose()
    }
  }

  return (
    <div
      onClick={handleAction}
      className={`group flex items-center justify-between p-3 rounded-xl transition-all duration-200 
        ${isYou ? "opacity-70 cursor-default" : "cursor-pointer hover:bg-primary/5 active:scale-[0.98] border border-transparent hover:border-primary/10"}
      `}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="relative">
          <Avatar className="w-12 h-12 ring-2 ring-offset-2 ring-transparent group-hover:ring-primary/20 transition-all">
            <AvatarImage src={user.imageUrl} className="object-cover" />
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold">
              {user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {/* Online status dot could go here */}
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-foreground truncate">
              {user.username}
            </span>
            {isYou && (
              <Badge
                variant="secondary"
                className="text-[10px] uppercase tracking-wider font-bold h-4"
              >
                You
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {chatExists ? "Already in contacts" : "Click to start chatting"}
          </p>
        </div>
      </div>

      {!isYou && (
        <div className="flex items-center justify-center">
          {isCreating ? (
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          ) : chatExists ? (
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          ) : (
            <div className="bg-primary/10 p-2 rounded-full text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <MessageCircleMore className="w-5 h-5" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CreateChatUserItem
