import { useSelector } from "react-redux"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RootState } from "@/store/store"

const MessageNavBar = () => {

  const { selectedChat, selectedChatUser } = useSelector((state: RootState) => state.chats)

  const handleClickOnSelectedChatProfile = () => {
    // TODO 
  }

  return (
    <ul className="w-[100%] h-[15vh] flex gap-5 items-center p-5 bg-background border-b border-r">
      <li className=" cursor-pointer" onClick={handleClickOnSelectedChatProfile}>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </li>
      <li className="font-bold text-lg cursor-pointer" onClick={handleClickOnSelectedChatProfile}>{selectedChatUser?.email}</li>
    </ul>
  )
}

export default MessageNavBar
