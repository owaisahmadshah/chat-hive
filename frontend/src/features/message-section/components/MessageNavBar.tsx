import { useSelector } from "react-redux"
import { useEffect, useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RootState } from "@/store/store"
import correctDate from "@/lib/correct-date"
import useUserOnlineStatus from "../hooks/useUserOnlineStatus"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import useFriend from "@/features/chat-section/hooks/useFriend"

const MessageNavBar = () => {
  const [isFriend, setIsFriend] = useState(false)

  const { selectedChatUser, selectedChat } = useSelector(
    (state: RootState) => state.chats
  )
  const { friends } = useSelector((state: RootState) => state.friend)

  const { createUser } = useFriend()

  useUserOnlineStatus()

  useEffect(() => {
    friends.forEach((friend) => {
      if (friend.friend?._id === selectedChatUser?._id) {
        setIsFriend(true)
      }
    })
  }, [friends])

  const addToFriends = async () => {
    if (!selectedChatUser?._id) {
      return
    }
    await createUser(selectedChatUser._id)
  }

  return (
    <Dialog>
      <ul className="w-[100%] h-[10vh] pt-2 pl-2 bg-background border-b border-r">
        <DialogTrigger className="flex gap-5 items-center">
          <li className="cursor-pointer">
            <Avatar>
              <AvatarImage
                src={
                  selectedChatUser?.showProfileImage == "public"
                    ? selectedChatUser?.imageUrl
                    : "./default-image.png"
                }
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </li>
          <li className="flex flex-col items-start">
            <strong className="text-lg cursor-pointer">
              {selectedChatUser?.username}
            </strong>
            <p className="text-xs text-muted-foreground">
              {!selectedChatUser?.showLastSeen
                ? ""
                : selectedChat?.typing && selectedChat?.typing.isTyping
                ? "typing..."
                : selectedChatUser?.isUserOnline
                ? "online"
                : selectedChatUser?.updatedAt &&
                  correctDate(selectedChatUser?.updatedAt)}
            </p>
          </li>
        </DialogTrigger>
        <DialogContent className="flex flex-col items-center">
          <img
            src={
              selectedChatUser?.showProfileImage
                ? selectedChatUser?.imageUrl
                : "./default-image.png"
            }
            alt=""
            height="150px"
            width="150px"
            className="rounded-full"
            loading="lazy"
          />
          <DialogTitle className="cursor-pointer hover:underline">
            {selectedChatUser?.username}
          </DialogTitle>
          <p className="text-muted-foreground">
            {!selectedChatUser?.showLastSeen
              ? ""
              : selectedChat?.typing?.isTyping
              ? "Typing..."
              : selectedChatUser?.isUserOnline
              ? "Online"
              : "Offline"}
          </p>
          <p>
            <strong>About:</strong>
            {selectedChatUser?.showAbout ? selectedChatUser.about : ""}
          </p>
          {!isFriend && (
            <Button
              variant={"ghost"}
              className="cursor-pointer"
              onClick={addToFriends}
            >
              Add to contacts
            </Button>
          )}
          <Button variant={"destructive"} className="cursor-pointer">
            Delete Chat
          </Button>
        </DialogContent>
      </ul>
    </Dialog>
  )
}

export default MessageNavBar
