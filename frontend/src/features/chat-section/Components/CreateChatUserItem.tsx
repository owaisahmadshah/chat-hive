import { setSelectedChat, setSelectedChatUser } from "@/store/slices/chats"
import { RootState } from "@/store/store"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Chat } from "@/types/chat-interface"
import { ChatUser } from "shared"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useChat } from "../hooks/useChat"

const CreateChatUserItem = ({ user }: { user: ChatUser }) => {
  // if chat exists we store the chat here and if user opens this chat we'll set this as selectedChat
  const [existedChat, setExistedChat] = useState<Chat | null>(null)

  const uid = useSelector((state: RootState) => state.user.userId)
  const chats = useSelector((state: RootState) => state.chats.chats)
  const dispatch = useDispatch()
  const { createNewChat } = useChat()

  const handleCreateChat = async (user: ChatUser) => {
    await createNewChat(user)
  }

  const handleOpenChat = (user: ChatUser) => {
    dispatch(setSelectedChat(existedChat))
    dispatch(setSelectedChatUser(user))
    setExistedChat(null)
  }

  const checkIfChatExists = (userId: string) => {
    // If userId is same as signed user and number of users in chat is equal to one that means signed in user already has chat of him
    if (userId === uid) {
      return chats.some(chat => chat.users.length === 1)
    }
    const isChatExist = chats.some(chat => chat.users.some(u => u._id === userId))
    if (isChatExist) {
      // TODO check why this re-renders infinite times
      // setExistedChat(chats.find(chat => chat.users.some(u => u._id === user._id)) || null)
    }
    return isChatExist
  }

  return (
    <>
      <Avatar className="cursor-pointer">
        <AvatarImage src={user.imageUrl} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <p className="text-sm">
        {`${user.email} ${user.email === uid ? " (You)" : ""}`}
      </p>
      {
        checkIfChatExists(user._id) ?
          <Button
            variant={"destructive"}
            className="text-sm"
            onClick={() => handleOpenChat(user)}
          >Chat Exists</Button>
          :
          <Button
            className="text-sm cursor-pointer"
            onClick={() => handleCreateChat(user)}
          >Start Chat</Button>
      }
    </>
  )
}

export default CreateChatUserItem
