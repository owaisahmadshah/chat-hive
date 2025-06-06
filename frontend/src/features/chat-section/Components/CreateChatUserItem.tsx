import { setSelectedChat, setSelectedChatUser } from "@/store/slices/chats"
import { RootState } from "@/store/store"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Chat } from "@/types/chat-interface"
import { ChatUser } from "shared"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useChat } from "../hooks/useChat"
import useFriend from "../hooks/useFriend"

const CreateChatUserItem = ({ user }: { user: ChatUser }) => {
  // if chat exists we store the chat here and if user opens this chat we'll set this as selectedChat
  const [existedChat, setExistedChat] = useState<Chat | null>(null)

  const uid = useSelector((state: RootState) => state.user.userId)
  const chats = useSelector((state: RootState) => state.chats.chats)
  const friends = useSelector((state: RootState) => state.friend.friends)
  const dispatch = useDispatch()
  const { createNewChat } = useChat()
  const { createUser } = useFriend()

  const handleCreateChat = async (user: ChatUser) => {
    await createNewChat(user)
  }

  const handleAddFriend = async (user: ChatUser) => {
    await createUser(user._id)
  }

  const handleOpenChat = (user: ChatUser) => {
    dispatch(setSelectedChat(existedChat))
    dispatch(setSelectedChatUser(user))
    setExistedChat(null)
  }

  const checkIfChatExists = (userId: string) => {
    // If userId is same as signed user and number of users in chat is equal to one that means signed in user already has chat of him
    if (userId === uid) {
      return chats.some((chat) => chat.users.length === 1)
    }
    const isChatExist = chats.some((chat) =>
      chat.users.some((u) => u._id === userId)
    )
    if (isChatExist) {
      // TODO check why this re-renders infinite times
      // setExistedChat(chats.find(chat => chat.users.some(u => u._id === user._id)) || null)
    }
    return isChatExist
  }

  const isFriend = (contactId: string): boolean => {
    for (let i = 0; i < friends.length; i++) {
      if (friends[i].friend._id === contactId) {
        return true
      }
    }
    return false
  }

  return (
    <div
      className="w-full flex items-center gap-10"
      onClick={() => handleOpenChat(user)}
    >
      <div className="flex justify-center items-center gap-5">
        <Avatar className="cursor-pointer">
          <AvatarImage src={user.imageUrl} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <p className="text-sm">
          {`${user.username} ${user._id === uid ? " (You)" : ""}`}
        </p>
      </div>
      {!isFriend(user._id) && (
        <Button onClick={() => handleAddFriend(user)}>
          Add to contacts
        </Button>
      )}
      {!checkIfChatExists(user._id) && (
        <Button
          className="text-sm cursor-pointer"
          onClick={() => handleCreateChat(user)}
        >
          Start Chat
        </Button>
      )}
    </div>
  )
}

export default CreateChatUserItem
