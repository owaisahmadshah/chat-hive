import { useSelector } from "react-redux"
import { useState } from "react"

import useGetUserId from "@/hooks/useGetUser"
import ChatSection from "@/features/chat-section/ChatSection"
import MessageSection from "@/features/message-section/MessageSection"
import Loader from "@/components/Loader"
import { useSocketService } from "@/hooks/useSocketService"
import usePresenceStatus from "@/hooks/usePresenceStatus"
import { RootState } from "@/store/store"
import useGetUserChatsAndMessages from "@/features/chat-section/hooks/useGetUserChatsAndMessages"
import useGetFriends from "@/hooks/useGetFriends"

const HomePage = () => {
  const [isChatSelected, setIsChatSelected] = useState(false)

  // Initialize essential hooks
  useGetUserId()
  useSocketService()
  usePresenceStatus()
  useGetUserChatsAndMessages()
  useGetFriends()

  const { isLoading } = useSelector((state: RootState) => state.chats)

  return (
    <>
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/10">
          <Loader />
        </div>
      ) : (
        <main className="flex max-h-screen overflow-hidden bg-background">
          <ChatSection value={isChatSelected} setValue={setIsChatSelected} />
          <MessageSection value={isChatSelected} setValue={setIsChatSelected} />
        </main>
      )}
    </>
  )
}

export default HomePage
