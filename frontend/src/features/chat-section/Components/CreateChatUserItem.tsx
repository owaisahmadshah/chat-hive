import { setSelectedChat, setSelectedChatUser } from "@/store/slices/chats"
import { RootState } from "@/store/store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Chat } from "@/types/chat-interface"
import { ChatUser } from "shared"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useChat } from "../hooks/useChat"
import { MessageSquare, UserPlus, CheckCircle2, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const CreateChatUserItem = ({ user }: { user: ChatUser }) => {
  const [existedChat, setExistedChat] = useState<Chat | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const uid = useSelector((state: RootState) => state.user.userId)
  const chats = useSelector((state: RootState) => state.chats.chats)
  const dispatch = useDispatch()
  const { createNewChat } = useChat()

  const handleCreateChat = async (user: ChatUser) => {
    setIsCreating(true)
    await createNewChat(user)
    setIsCreating(false)
  }

  const handleAddConnection = async (user: ChatUser) => {}

  const handleOpenChat = (user: ChatUser) => {
    if (existedChat) {
      dispatch(setSelectedChat(existedChat))
      dispatch(setSelectedChatUser(user))
      setExistedChat(null)
    }
  }

  const checkIfChatExists = (userId: string) => {
    if (userId === uid) {
      return chats.some((chat) => chat.users.length === 1)
    }
    return chats.some((chat) => chat.users.some((u) => u._id === userId))
  }

  // const isFriend = (contactId: string): boolean => {
  //   return friends.some((friend) => friend.friend._id === contactId)
  // }

  const isYou = user._id === uid
  const chatExists = checkIfChatExists(user._id)
  // const isContact = isFriend(user._id)

  return (
    <div
      className="flex items-center justify-between gap-4 cursor-pointer"
      onClick={() => !isYou && chatExists && handleOpenChat(user)}
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
            {/* ---------------------------TODO---------------------------------- */}
            {/* {isContact && !isYou && ( */}
            {!isYou && (
              <Badge
                variant="outline"
                className="text-xs border-green-500/30 text-green-600 dark:text-green-400"
              >
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Contact
              </Badge>
            )}
          </div>
          {user.about && (
            <p className="text-xs text-muted-foreground truncate">
              {user.about}
            </p>
          )}
        </div>
      </div>

      {!isYou && (
        <div className="flex gap-2">
          {/* {!isContact && chatExists && ( */}
          {chatExists && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                handleAddConnection(user)
              }}
              className="hover:bg-primary/10 hover:border-primary/30"
            >
              <UserPlus className="w-4 h-4 mr-1" />
              Add
            </Button>
          )}
          {!chatExists && (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                handleCreateChat(user)
              }}
              disabled={isCreating}
              className="shadow-sm"
            >
              {isCreating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Chat
                </>
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default CreateChatUserItem
