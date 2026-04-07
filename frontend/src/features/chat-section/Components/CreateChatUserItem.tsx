import { useSelector } from "react-redux"
import { MessageSquare, Loader2 } from "lucide-react"
import { useSearchParams } from "react-router-dom"

import { RootState } from "@/store/store"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
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

  const handleCreateChat = async (userId: string) => {
    await mutateAsync({ user: userId })
    onClose()
  }
  const isYou = user._id === uid

  const { exists: chatExists, chat } = hasChatByUserId({ userId: user._id })

  const handleOpenChat = () => {
    if (chatExists && chat) {
      setSearchParams({ chatId: chat._id, userId: user._id })
      onClose()
    }
  }

  return (
    <div
      className="flex items-center justify-between gap-4 cursor-pointer"
      onClick={() => !isYou && chatExists && handleOpenChat()}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar className="w-12 h-12 ring-2 ring-background shadow-md">
          <AvatarImage src={user.imageUrl} />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {user.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm truncate">{user.username}</p>
            {isYou && (
              <Badge variant="secondary" className="text-xs">
                You
              </Badge>
            )}
          </div>
        </div>
      </div>

      {!isYou && (
        <div className="flex gap-2">
          {!chatExists && (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                handleCreateChat(user._id)
              }}
              disabled={isCreating}
              className="shadow-sm"
            >
              {isCreating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <p className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Chat
                </p>
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default CreateChatUserItem
