import { useSelector } from "react-redux"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RootState } from "@/store/store"
import correctDate from "@/lib/correct-date"

const MessageNavBar = () => {

  const { selectedChatUser } = useSelector((state: RootState) => state.chats)

  const handleClickOnSelectedChatProfile = () => {
    // TODO 
  }

  return (
    <ul className="w-[100%] h-[15vh] flex gap-5 items-center p-5 bg-background border-b border-r">
      <li className=" cursor-pointer" onClick={handleClickOnSelectedChatProfile}>
        <Avatar>
          <AvatarImage src={selectedChatUser?.imageUrl} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </li>
      <li onClick={handleClickOnSelectedChatProfile}>
        <strong className="text-lg cursor-pointer">{selectedChatUser?.email}</strong>
        <p className="text-sm text-muted-foreground">
          {selectedChatUser?.updatedAt && correctDate(selectedChatUser?.updatedAt)}
        </p>
      </li>
    </ul>
  )
}

export default MessageNavBar
