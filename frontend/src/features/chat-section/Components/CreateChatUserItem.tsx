import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { setSelectedChat, setSelectedChatUser } from "@/store/slices/chats"
import { RootState } from "@/store/store"

import { Chat, ChatUser } from "@/types/chat-interface"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"

const CreateChatUserItem = ({ user }: { user: ChatUser }) => {
  // if chat exists we store the chat here and if user opens this chat we'll set this as selectedChat
  const [existedChat, setExistedChat] = useState<Chat | null>(null)

  const chats = useSelector((state: RootState) => state.chats.chats)
  const dispatch = useDispatch()

  const handleCreateChat = (user: ChatUser) => {
    // TODO create new chat
  }

  const handleOpenChat = (user: ChatUser) => {
    dispatch(setSelectedChat(existedChat))
    dispatch(setSelectedChatUser(user))
    setExistedChat(null)
  }

  const checkIfChatExists = (userId: string) => {
    for (let i = 0; i < chats.length; i++) {
      for (let j = 0; j < chats[i].users.length; j++) {
        if (chats[i].users[j]._id === userId) {
          setExistedChat(chats[i])
          return true
        }
      }
    }
    return false
  }

  return (
    <>
      <Avatar className="cursor-pointer">
        <AvatarImage src={user.imageUrl} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <p className="text-sm">{`${user.email} ${user.email === user.email && " (You)"}`}</p>
      {
        checkIfChatExists(user._id) ?
          <Button
            className="text-sm cursor-pointer"
            onClick={() => handleOpenChat(user)}
          >Open Chat</Button>
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
